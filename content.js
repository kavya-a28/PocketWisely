// In content.js
console.log("AI Advisor content script loaded.");

// --- Step 1: Define Selectors for Buttons AND Product Data ---
// NOTE: These selectors are EXAMPLES for Amazon and will need to be updated
// if the websites change their layout. You must inspect each site.

const selectors = {
  amazon: {
    productName: '#productTitle',
    productPrice: '.a-price-whole',
    productImage: '#landingImage',
    addToCartButton: '#add-to-cart-button',
    buyNowButton: '#buy-now-button'
  },
  flipkart: {
    // You would add Flipkart's selectors here after inspecting the site
    productName: '.B_NuCI',
    productPrice: '._30jeq3._16Jk6d',
    productImage: '._396cs4._2amPTt._3qGmMb',
    addToCartButton: 'button._2KpZ6l._2U9uOA._3v1-ww'
  }
  // Add other sites like Myntra here
};

// Combine all button selectors into one string for the event listener
const allButtonSelectors = [
  selectors.amazon.addToCartButton,
  selectors.amazon.buyNowButton,
  selectors.flipkart.addToCartButton
].join(',');


// --- Step 2: Create a Function to Scrape Data ---
function scrapeProductData() {
  const data = {};
  const site = window.location.hostname; // e.g., "www.amazon.in"

  let nameEl, priceEl, imageEl;

  if (site.includes('amazon')) {
    nameEl = document.querySelector(selectors.amazon.productName);
    priceEl = document.querySelector(selectors.amazon.productPrice);
    imageEl = document.querySelector(selectors.amazon.productImage);
  } else if (site.includes('flipkart')) {
    nameEl = document.querySelector(selectors.flipkart.productName);
    priceEl = document.querySelector(selectors.flipkart.productPrice);
    imageEl = document.querySelector(selectors.flipkart.productImage);
  }

  // Extract the text/URL from the elements. Use '?.' for safety in case an element isn't found.
  data.name = nameEl?.innerText.trim();
  data.price = priceEl?.innerText.trim();
  data.imageUrl = imageEl?.src;

  // Return null if we couldn't find the essential data
  if (!data.name || !data.price) {
    return null;
  }

  return data;
}


// --- Step 3: Update the Event Listener ---
document.body.addEventListener('click', function(event) {
  const clickedElement = event.target.closest(allButtonSelectors);

  if (clickedElement) {
    console.log('Purchase-related button clicked!');

    // Scrape the data from the page
    const productData = scrapeProductData();

    if (productData) {
      console.log('Scraped Product Data:', productData);
      // Send a message to our background script WITH the product data
      chrome.runtime.sendMessage({
        action: "purchaseAttempt",
        data: productData
      });
    } else {
      console.log("Could not find product details on the page.");
    }
  }
}, true); // Use capture phase to ensure our script runs first