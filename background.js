// background.js

console.log("PocketWisely background service worker started.");

// Listen for a message from listener.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Check if the message is the one we expect
    if (request.action === "purchaseAttempt") {
        console.log("Purchase attempt message received from tab:", sender.tab.id);

        // When we get the message, inject the prompt.js script into that tab
        chrome.scripting.executeScript({
            target: { tabId: sender.tab.id },
            files: ['prompt.js'] // Correct filename here
        });
    }
});