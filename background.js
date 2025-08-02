chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "purchaseAttempt") {
    const product = request.data;

    // OPTIONAL: Process more here, or directly call backend
    console.log("Purchase attempt detected:", product);

    // Convert price to number (remove ₹, commas)
    let rawPrice = product.price.replace(/[₹,]/g, '');
    let price = parseFloat(rawPrice);

    // Send data to Flask backend
    fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        time_on_page: 45,
        wishlist: 0,
        previous_purchase: 0,
        price: price
      })
    })
    .then(res => res.json())
    .then(result => {
      if (result.impulse === 1) {
        // Show alert or inject modal into tab
        chrome.scripting.executeScript({
          target: { tabId: sender.tab.id },
          func: () => alert("⚠️ Impulse Buy Detected! Invest Instead 💸")
        });
      }
    });
  }
});
