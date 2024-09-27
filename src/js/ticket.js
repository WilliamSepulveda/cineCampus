export function generarTicket(orderId) {
    JsBarcode("#barcode", orderId, {
        format: "CODE128",
        lineColor: "#000",
        width: 2,
        height: 50,
        displayValue: false
    });
}
document.addEventListener('DOMContentLoaded', () => {
    
    var orderId = document.getElementById('order-id').innerText;

    generarTicket(orderId);
});