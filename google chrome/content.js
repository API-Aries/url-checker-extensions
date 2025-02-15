// Function to create and show a message
function showMessage(message, color) {
    const div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.top = '10px';
    div.style.right = '10px';
    div.style.padding = '15px';
    div.style.backgroundColor = color;
    div.style.color = 'white';
    div.style.zIndex = 10000;
    div.style.fontSize = '16px';
    div.style.borderRadius = '5px';
    div.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    div.textContent = message;
  
    // Add the "Powered by API Aries" link
    const poweredByDiv = document.createElement('div');
    poweredByDiv.style.fontSize = '12px';
    poweredByDiv.style.marginTop = '10px';
    poweredByDiv.style.textAlign = 'center';
    const poweredByLink = document.createElement('a');
    poweredByLink.href = 'https://api-aries.com';
    poweredByLink.style.color = 'white';
    poweredByLink.style.textDecoration = 'none';
    poweredByLink.textContent = 'Powered by API Aries';
    poweredByDiv.appendChild(poweredByLink);
    div.appendChild(poweredByDiv);
  
    document.body.appendChild(div);
  
    return div;
  }
  
  // Show the "Checking URL..." message
  const checkingDiv = showMessage('Checking URL...', 'blue');
  
  // Send the URL to the background script for checking
  chrome.runtime.sendMessage({ url: window.location.href });
  
  chrome.runtime.onMessage.addListener((message) => {
    // Remove the "Checking URL..." message
    document.body.removeChild(checkingDiv);
  
    // Show the result message
    const resultColor = message.safe ? 'green' : 'red';
    const resultDiv = showMessage(message.message, resultColor);
  
    // Remove the result message after some time
    setTimeout(() => {
      document.body.removeChild(resultDiv);
    }, message.safe ? 5000 : 10000);
  });
  
