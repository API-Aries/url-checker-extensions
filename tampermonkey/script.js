// ==UserScript==
// @name         URL Safety Checker - API - Aries
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Check if a URL is safe using API Aries
// @icon         https://dashboard.api-aries.online/logo/logo.png
// @author       API Aries - Team
// @license      MIT
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      api.api-aries.online
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/502108/URL%20Safety%20Checker%20-%20API%20-%20Aries.user.js
// @updateURL https://update.greasyfork.org/scripts/502108/URL%20Safety%20Checker%20-%20API%20-%20Aries.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // User's API token - MUST be set by the user
    const apiToken = ''; // <-- Place your API Aries token here - https://dashboard.api-aries.online

    const lang = navigator.language || navigator.userLanguage;
    const isSpanish = lang.startsWith('es');

    const messages = {
        apiTokenRequired: isSpanish ? "Se requiere un token API para que este script funcione. Puede obtener un token gratuito visitando https://dashboard.api-aries.online/. Edite el script y coloque su token en el área designada." : "API token is required for this script to function. You can obtain a free token by visiting https://dashboard.api-aries.online/. Please edit the script and place your token in the designated area.",
        checking: isSpanish ? "Verificando la seguridad de la pagina..." : "Checking URL's safety...",
        safe: isSpanish ? "Esta pagina es segura." : "This URL is safe.",
        iplogger: isSpanish ? "Esta pagina está identificada como una pagina de collectar su IP." : "This URL is identified as an iplogger.",
        phishing: isSpanish ? "Esta pagina está identificada como una pagina de collectar su informacion." : "This URL is identified as a phishing URL.",
        errorChecking: isSpanish ? "Error al verificar la seguridad de la pagina." : "Error checking URL safety.",
        apiUsageTitle: isSpanish ? "Uso de la API" : "API Usage",
        requestCount: isSpanish ? "Cantidad de Solicitudes echas hoy:" : "Request Count:",
        lastRequestDate: isSpanish ? "Fecha de la Última Solicitud:" : "Last Request Date:",
        requestsLeft: isSpanish ? "Solicitudes Restantes para Hoy:" : "Requests Left for Today:",
        fetchingUsage: isSpanish ? "Obteniendo datos de uso..." : "Fetching usage data...",
        close: isSpanish ? "Cerrar" : "Close",
        error: isSpanish ? "Error: " : "Error: ",
        poweredBy: isSpanish ? "Servicios por" : "Powered by",
        seeMore: isSpanish ? "Ver más iniciando sesión en nuestro panel de control. (no esta in español.)" : "See more by logging into our dashboard.",
    };

    if (!apiToken) {
        alert(messages.apiTokenRequired);
        return;
    }

    $('body').append(`
        <div id="urlSafetyPopup" style="position: fixed; top: 20px; right: 20px; width: 300px; padding: 15px; background-color: #fff; border: 1px solid #ccc; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); z-index: 10000; display: none; font-family: Arial, sans-serif;">
         <button id="closeUrlSafety" style="position: absolute; top: 5px; right: 5px; padding: 0; border: none; background: none; font-size: 20px; line-height: 20px; cursor: pointer; color: #e74c3c;">&times;</button>
            <img src="https://dashboard.api-aries.online/logo/logo.png" alt="Icon" style="width: 50px; height: 50px; display: block; margin: 0 auto;">
            <div id="urlSafetySpinner" style="border: 4px solid rgba(0, 0, 0, 0.1); border-top: 4px solid #3498db; border-radius: 50%; width: 24px; height: 24px; animation: spin 1s linear infinite; margin: 10px auto;"></div>
            <p id="urlSafetyMessage" style="text-align: center; margin-top: 10px;">${messages.checking}</p>
            <p style="text-align: center; font-size: 10px; color: #999; margin-top: 10px;">${messages.poweredBy} <a href="https://api-aries.online" target="_blank" style="color: #3498db; text-decoration: none;">API Aries</a></p>
        </div>
        <div id="apiUsagePopup" style="position: fixed; top: 60px; right: 20px; width: 300px; padding: 15px; background-color: #fff; border: 1px solid #ccc; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); z-index: 10001; display: none; font-family: Arial, sans-serif;">
            <button id="closeApiUsage" style="position: absolute; top: 5px; right: 5px; padding: 0; border: none; background: none; font-size: 20px; line-height: 20px; cursor: pointer; color: #aaa;">&times;</button>
            <h3 style="text-align: center;">${messages.apiUsageTitle}</h3>
            <p id="apiUsageMessage" style="text-align: center; margin-top: 10px;">${messages.fetchingUsage}</p>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `);


    function checkURLSafety(url) {
        $('#urlSafetyPopup').fadeIn();
        $('#urlSafetySpinner').show();
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://api.api-aries.online/v1/checkers/safe-url/?url=${encodeURIComponent(url)}`,
            headers: {
                'APITOKEN': apiToken
            },
            onload: function(response) {
                let result = JSON.parse(response.responseText);
                if (result.error_code) {
                    displayError(result);
                } else {
                    displayResult(result);
                }
            },
            onerror: function() {
                $('#urlSafetyMessage').text(messages.errorChecking);
                $('#urlSafetyPopup').css('background-color', '#f2dede');
                setTimeout(() => { $('#urlSafetyPopup').fadeOut(); }, 5000); // Hide after 5 seconds
            }
        });
    }


    function displayResult(result) {
        let message;
        if (result.safe) {
            message = messages.safe;
            $('#urlSafetyPopup').css('background-color', '#dff0d8'); // Green background for safe URL
        } else if (result.message.includes("iplogger")) {
            message = messages.iplogger;
            $('#urlSafetyPopup').css('background-color', '#f2dede'); // Red background for unsafe URL
        } else if (result.message.includes("phishing")) {
            message = messages.phishing;
            $('#urlSafetyPopup').css('background-color', '#f2dede'); // Red background for unsafe URL
        } else {
            message = result.message;
            $('#urlSafetyPopup').css('background-color', '#f2dede'); // Red background for unsafe URL
        }
        $('#urlSafetyMessage').text(message);
        $('#urlSafetySpinner').hide();
        setTimeout(() => { $('#urlSafetyPopup').fadeOut(); }, 5000); // Hide after 5 seconds
    }


    function displayError(error) {
        let message = `${messages.error}${error.error} - ${error.message}`;
        $('#urlSafetyMessage').text(message);
        $('#urlSafetyPopup').css('background-color', '#f2dede');
        $('#urlSafetySpinner').hide();
        setTimeout(() => { $('#urlSafetyPopup').fadeOut(); }, 5000); // Hide after 5 seconds
    }


    function fetchApiUsage() {
        $('#apiUsagePopup').fadeIn();
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://api.api-aries.online/system-api/dashboard/usage/?api_token=${apiToken}`,
            onload: function(response) {
                let usage = JSON.parse(response.responseText);
                $('#apiUsageMessage').html(`
                    <strong>${messages.requestCount}</strong> ${usage.request_count}<br>
                    <strong>${messages.lastRequestDate}</strong> ${usage.last_request_date}<br>
                    <strong>${messages.requestsLeft}</strong> ${usage.request_left_for_today.toLocaleString()}
                    <button><a href="https://dashboard.api-aries.online/">${messages.seeMore}</a></button>
                `);
            },
            onerror: function() {
                $('#apiUsageMessage').text(messages.errorChecking);
            }
        });
    }


    GM_registerMenuCommand(isSpanish ? 'Mostrar uso de la API' : 'Show API Usage', fetchApiUsage);


    $(document).on('click', '#closeApiUsage', function() {
        $('#apiUsagePopup').fadeOut();
    });


    $(document).on('click', '#closeUrlSafety', function() {
        $('#urlSafetyPopup').fadeOut();
    });


    window.onload = function() {
        let currentURL = window.location.href;
        checkURLSafety(currentURL);
    };
})();
