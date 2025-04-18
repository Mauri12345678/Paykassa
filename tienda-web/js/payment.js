function validatePaymentInfo(paymentInfo) {
    if (!paymentInfo.cardNumber || !paymentInfo.expiryDate || !paymentInfo.cvc) {
        alert("Please fill in all payment fields.");
        return false;
    }
    // Add more validation logic as needed
    return true;
}

function processPayment(paymentInfo) {
    if (!validatePaymentInfo(paymentInfo)) {
        return;
    }

    // Simulate payment processing
    console.log("Processing payment for card number:", paymentInfo.cardNumber);
    // Here you would typically call a payment gateway API

    alert("Payment processed successfully!");
}

// Example usage
document.getElementById("paymentForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const paymentInfo = {
        cardNumber: document.getElementById("cardNumber").value,
        expiryDate: document.getElementById("expiryDate").value,
        cvc: document.getElementById("cvc").value
    };
    processPayment(paymentInfo);
});