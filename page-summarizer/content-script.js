console.log("Hello from content-script.js");


function downloadFile(filename, content) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}


function extractElementsAsMarkdown() {
    const elements = document.querySelectorAll('p, h1, h2, h3, h4, code');
    let markdown = '';

    elements.forEach((element) => {
        const tagName = element.tagName.toLowerCase();
        const elementClass = element.getAttribute('class');

        let prefix = '';
        let suffix = '\n\n';
        let text = element.textContent.trim();

        switch (tagName) {
            case 'h1':
                prefix = '# ';
                break;
            case 'h2':
                prefix = '## ';
                break;
            case 'h3':
                prefix = '### ';
                break;
            case 'h4':
                prefix = '#### ';
                break;
            case 'code':
                let language = '';
                if (elementClass && elementClass.toLowerCase().includes("language-")) {
                    language = elementClass.replace("language-", "");
                }
                prefix = `\n\`\`\`${language}\n`;
                suffix = '\n```\n\n';
                break;
            default:
                prefix = '';
                break;
        }

        markdown += `${prefix}${text}${suffix}`;
    });

    return markdown;
}


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        let filename = null;
        let text = null;
        if (request.action === "ping") {
            sendResponse({ message: "[ping] Hello from content-script" });
        }
        if (request.action === "downloadAllText") {
            filename = 'all-text.md';
            text = extractElementsAsMarkdown();
        } else if (request.action === "downloadSelectedText") {
            filename = 'selected-text.txt';
            text = request.data.selectedText;
        }
        chrome.runtime.sendMessage({ action: "updatePopupContent", data: { text: text } }, () => {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
            }
        });
        downloadFile(filename, text);
        sendResponse({ message: "[content-script.js > runtime.onMessage] Hello from content-script" });
    }
);