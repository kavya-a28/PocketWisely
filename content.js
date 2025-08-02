// content.js
function sendImpulseCheck(price) {
    fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            time_on_page: 45,  // default for now
            wishlist: 0,
            previous_purchase: 0,
            price: price
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.impulse === 1) {
            alert("⚠ Impulse Buy Detected! 💸\nWhy not invest instead?");
        }
    });
}

// AMAZON Example
document.addEventListener("click", function(e) {
    const clicked = e.target;

    // Example button selectors (customize as needed)
    if (clicked.innerText === "Add to Cart" || clicked.innerText === "Buy Now") {
        // Get price
        let priceElement = document.querySelector("#priceblock_ourprice, #priceblock_dealprice");
        if (priceElement) {
            let rawPrice = priceElement.innerText.replace(/[₹,]/g, "");
            let price = parseFloat(rawPrice);

            // Send to backend
            sendImpulseCheck(price);
        }
    }
});