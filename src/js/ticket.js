// Función para obtener una cookie por su nombre
function getCookie(name) {
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}

// Función para cargar datos de las cookies y el localStorage
function loadTicketData() {
    // Obtener el poster desde la cookie
    const posterUrl = decodeURIComponent(getCookie('selectedMoviePoster'));
    if (posterUrl && posterUrl !== 'null') {
        console.log('Poster URL:', posterUrl);
        document.getElementById('poster-image').src = `/storage/img/${posterUrl}`; // Construir ruta completa
    } else {
        console.log('Using default image');
        document.getElementById('poster-image').src = "../storage/img/default.jpg";
    }

    // Otros datos del ticket
    const movieTitle = getCookie('selectedMovieTitle');
    if (movieTitle) {
        document.getElementById('movie-title').textContent = movieTitle;
    }

    const selectedDate = localStorage.getItem('selectedDate');
    const selectedTime = localStorage.getItem('selectedTime');
    const selectedSeat = localStorage.getItem('selectedSeats');
    const totalCost = localStorage.getItem('totalCost');
    const orderId = localStorage.getItem('orderNumber');

    if (selectedDate) {
        document.getElementById('ticket-date').textContent = selectedDate;
    }
    if (selectedTime) {
        document.getElementById('ticket-time').textContent = selectedTime;
    }
    if (selectedSeat) {
        document.getElementById('ticket-seat').textContent = JSON.parse(selectedSeat).join(', ');
    }
    if (totalCost) {
        document.getElementById('ticket-cost').textContent = `$${totalCost}`;
    }
    if (orderId) {
        document.getElementById('order-id').textContent = orderId;
        generarTicket(orderId); 
    }
}


// Función para generar el código de barras
function generarTicket(orderId) {
    JsBarcode("#barcode", orderId, {
        format: "CODE128",
        lineColor: "#000",
        width: 2,
        height: 50,
        displayValue: false
    });
}

// Ejecutar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    loadTicketData();
});
