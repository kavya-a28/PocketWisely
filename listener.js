// listener.js

console.log("🟢 PocketWisely click listener is active.");

// Selectors for all possible "Add to Cart" or "Buy Now" buttons
const purchaseButtonSelectors = [
    // Selectors for the main product detail page
    '#add-to-cart-button',
    '#buy-now-button',

    // ✨ UPDATED: This selector is now UNIVERSAL.
    // By removing 'input', it now finds ANY element (input, button, etc.)
    // whose name attribute starts with "submit.addToCart".
    '[name^="submit.addToCart"]'

].join(', '); // Creates a single selector string for all buttons

document.body.addEventListener('click', function(event) {
    const clickedButton = event.target.closest(purchaseButtonSelectors);

    if (clickedButton) {
        console.log('🛒 Purchase button clicked! Intercepting...');
        // IMMEDIATELY stop the website from doing anything else
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        // Tell the background script that a purchase was attempted
        chrome.runtime.sendMessage({ action: "purchaseAttempt" });
    }
}, true); // Use "capturing" to make sure our listener runs first