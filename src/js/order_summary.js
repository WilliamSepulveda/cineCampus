document.addEventListener('DOMContentLoaded', function () {
    // Función para obtener el valor de una cookie por su nombre
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    // Obtener los datos de la película de las cookies
    const movieId = getCookie('movieId');
    const movieTitle = decodeURIComponent(getCookie('movieTitle'));
    const movieGenre = decodeURIComponent(getCookie('movieGenre'));
    const moviePoster = decodeURIComponent(getCookie('moviePoster'));

    console.log('ID de película:', movieId);

    // Si no hay un ID de película, se muestra un mensaje de error
    if (!movieId) {
        console.error('No se proporcionó un ID de película válido.', movieId);
    } else {
        // Actualiza los elementos de la página con los datos de la película desde las cookies
        document.getElementById('movie-poster').src = moviePoster ? `/storage/img/${moviePoster}` : '../storage/img/default-poster.jpg';
        document.getElementById('movie-title').innerText = movieTitle || 'Título no disponible';
        document.getElementById('movie-genre').innerText = movieGenre || 'Género no disponible';
        document.getElementById('movie-date').innerText = `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`;
    }

    // Código de temporizador para la caducidad
    let timeLeft = 120;
    const timerDisplay = document.querySelector('.timer');

    const countdown = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(countdown);
            alert('¡El tiempo ha expirado! Por favor, reinicia tu pedido.');
            window.location = '../views/choose_seat.html';
        } else {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            timeLeft--;
        }
    }, 1000);

    // Toggle para opciones de pago
    document.getElementById('toggle-payment-options').addEventListener('click', function () {
        const paymentOptions = document.getElementById('payment-options');
        paymentOptions.classList.toggle('hidden');
    });
});


document.addEventListener('DOMContentLoaded', function () {
    // Obtener datos de localStorage
    const orderNumber = localStorage.getItem('orderNumber');
    const selectedSeats = JSON.parse(localStorage.getItem('selectedSeats')) || [];
    const seatCost = parseFloat(localStorage.getItem('seatCost')) || 0;
    const serviceFee = parseFloat(localStorage.getItem('serviceFee')) || 0;

    console.log('Order Number:', orderNumber);
    console.log('Selected Seats:', selectedSeats);
    console.log('Seat Cost:', seatCost);
    console.log('Service Fee:', serviceFee);

    // Mostrar el número de orden
    const orderInfoSection = document.querySelector('.order-info p strong');
    orderInfoSection.innerText = `ORDER NUMBER: ${orderNumber || 'N/A'}`; // Muestra 'N/A' si es null

    // Mostrar detalles de los tickets
    const ticketDetails = document.querySelector('.ticket-details');
    ticketDetails.innerHTML = ''; // Limpiar contenido existente

    // Detalles de cada ticket
    selectedSeats.forEach(seat => {
        const detailItem = document.createElement('div');
        detailItem.classList.add('detail-item');
        detailItem.innerHTML = `<span>1 TICKET</span><span>${seat}</span>`;
        ticketDetails.appendChild(detailItem);
    });

    // Calcular y mostrar el costo total de los asientos
    const totalCost = (selectedSeats.length * seatCost) + serviceFee; // Total considerando el costo del servicio
    ticketDetails.innerHTML += `<div class="detail-item">
                                    <span>REGULAR SEAT</span>
                                    <span>$${(seatCost).toFixed(2)} x ${selectedSeats.length}</span>
                                </div>`;
    ticketDetails.innerHTML += `<div class="detail-item">
                                    <span>SERVICE FEE</span>
                                    <span>$${serviceFee.toFixed(2)} x 1</span>
                                </div>`;
    ticketDetails.innerHTML += `<div class="detail-item">
                                    <span><strong>TOTAL</strong></span>
                                    <span><strong>$${totalCost.toFixed(2)}</strong></span>
                                </div>`;
});

