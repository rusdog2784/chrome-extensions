chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'download-text',
        title: "PageSummarizer: Download Text",
        contexts: ["selection"]
    });
});


chrome.contextMenus.onClicked.addListener((info, tab) => {
    if ('download-text' === info.menuItemId) {
        console.log(`[background.js > contextMenus.onClicked] Attempting to download the text: ${info.selectionText}`);
        chrome.tabs.sendMessage(tab.id, { action: "downloadSelectedText", data: { selectedText: info.selectionText } }, () => {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
            }
        });
    }
});


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "ping") {
        sendResponse({ message: "[ping] Hello from background" });
    }
});
