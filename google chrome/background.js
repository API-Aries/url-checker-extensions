chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.url) {
    fetch(`https://api.api-aries.com/v1/checkers/safe-url/?url=${encodeURIComponent(request.url)}`, {
      method: 'GET',
      headers: {
        'APITOKEN': '111-111-111-111' // get api token from https://panel.api-aries.online/
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.safe !== undefined && data.message) {
        chrome.tabs.sendMessage(sender.tab.id, data);
      } else {
        chrome.tabs.sendMessage(sender.tab.id, { safe: false, message: 'Invalid response from API.' });
      }
    })
    .catch(error => {
      console.error('Error:', error);
      chrome.tabs.sendMessage(sender.tab.id, { safe: false, message: 'Error checking URL.' });
    });
  }
});
