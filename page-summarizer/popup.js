const button = document.getElementById('main-button');
button.addEventListener('click', async () => {
  console.log(`Button clicked!`);

  setTimeout(function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "downloadAllText"}, () => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        }
      });
    });
  }, 500);
});


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === "ping") {
      sendResponse({ message: "[ping] Hello from popup" });
    }
    else if (request.action === "updatePopupContent") {
      document.getElementById("content").innerText = request.data.text;
      sendResponse({ status: "[updatePopupContent] SUCCESS" });
    }
  }
);