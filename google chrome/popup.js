document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const url = tabs[0].url;
    const statusDiv = document.getElementById('status');

    // Show the "Checking URL..." message
    statusDiv.textContent = 'Checking URL...';
    statusDiv.style.backgroundColor = '#17a2b8'; 
    statusDiv.style.color = 'white';

    fetch(`https://api.api-aries.com/v1/checkers/safe-url/?url=${encodeURIComponent(url)}`, {
      method: 'GET',
      headers: {
        'APITOKEN': '111-111-111-111' // get api token from https://panel.api-aries.online/
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.safe) {
        statusDiv.textContent = 'This URL is safe.';
        statusDiv.style.backgroundColor = 'green';
      } else {
        statusDiv.textContent = data.message;
        statusDiv.style.backgroundColor = 'red';
      }
    })
    .catch(error => {
      console.error('Error:', error);
      statusDiv.textContent = 'Error checking URL.';
      statusDiv.style.backgroundColor = 'orange';
    });
  });
});
