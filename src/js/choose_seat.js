document.addEventListener("DOMContentLoaded", function() {
    let totalPrice = 0;
    let seatPrice = 0; // Inicializa el precio del asiento aquí
    const priceElement = document.querySelector('.price span'); 
    const selectedSeats = new Set(); 

    // Función para actualizar el precio total
    function updateTotalPrice() {
        totalPrice = selectedSeats.size * seatPrice; 
        priceElement.textContent = `$${totalPrice.toFixed(2)}`; 
    }

    // Seleccionar un día
    const days = document.querySelectorAll('.day');
    days.forEach(day => {
        day.addEventListener('click', function() {
            days.forEach(d => d.classList.remove('selected'));
            this.classList.add('selected');
            // Opcional: podrías hacer algo aquí para cambiar la disponibilidad de los asientos según el día
        });
    });

    // Seleccionar una hora
    const times = document.querySelectorAll('.time');
    times.forEach(time => {
        time.addEventListener('click', function() {
            times.forEach(t => t.classList.remove('selected'));
            this.classList.add('selected');
            seatPrice = parseFloat(this.dataset.precio); // Obtiene el precio del botón seleccionado
            updateTotalPrice(); // Actualiza el precio total al seleccionar el horario
        });
    });

    // Obtener asientos desde el backend
    fetch('/asientos')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos recibidos:', data); // Log para verificar los datos

            if (!Array.isArray(data)) {
                console.error('La respuesta no es un array:', data);
                return; // Salir de la función si no es un array
            }

            const seatsSection = document.querySelector('.seats-section');

            // Crear elementos de asiento en el DOM
            data.forEach(asiento => {
                const seatDiv = document.createElement('div');
                const estado = asiento.estado.toLowerCase(); 

                seatDiv.className = `seat ${estado === 'disponible' ? 'available' : estado === 'reservado' ? 'reserved' : ''}`;
                seatDiv.dataset.asiento = asiento.codigo.asiento; 
                seatsSection.appendChild(seatDiv);
            });

            // Adjuntar eventos a los asientos disponibles
            attachSeatEventListeners();
        })
        .catch(error => console.error('Error al cargar los asientos:', error));

    // Función para adjuntar eventos a los asientos
    function attachSeatEventListeners() {
        const seats = document.querySelectorAll('.seat.available'); 

        seats.forEach(seat => {
            seat.addEventListener('click', function () {
                const seatDiv = this;
                const selectedSeatCode = seatDiv.dataset.asiento;

                // Cambiar estado visual del asiento al hacer clic
                if (seatDiv.classList.contains('selected')) {
                    seatDiv.classList.remove('selected');
                    selectedSeats.delete(selectedSeatCode);
                } else {
                    seatDiv.classList.add('selected');
                    selectedSeats.add(selectedSeatCode);
                }
                updateTotalPrice();
            });
        });
    }

    // Manejar el botón de compra
    const buyTicketButton = document.getElementById('buy-ticket'); // Asegúrate de que este ID es correcto
    if (buyTicketButton) {
        buyTicketButton.addEventListener('click', function() {
            if (selectedSeats.size === 0) {
                alert("Por favor, selecciona al menos un asiento."); // Verifica que haya asientos seleccionados
                return;
            }

            const promises = Array.from(selectedSeats).map(seatCode => {
                return updateSeatStatus(seatCode, 'Reservado'); 
            });

            Promise.all(promises)
                .then(() => {
                    console.log("Asientos reservados exitosamente");
                    selectedSeats.clear(); 
                    updateTotalPrice(); 
                })
                .catch(error => console.error('Error al reservar asientos:', error));
        });
    } else {
        console.error('El botón de compra no se encontró en el DOM');
    }

    // Función para actualizar el estado del asiento en el backend
    function updateSeatStatus(seatCode, estado) {
        return fetch(`/asientos/${seatCode}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ estado }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al actualizar el estado: ${response.status}`);
            }
            return response.json();
        })
        .then(data => console.log(data.message))
        .catch(error => console.error('Error al actualizar el estado del asiento:', error));
    }
});
