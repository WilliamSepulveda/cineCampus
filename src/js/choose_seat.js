document.addEventListener("DOMContentLoaded", function() {
    let totalPrice = 0;
    let seatPrice = 0; 

    const priceElement = document.querySelector('.price span'); 
    const days = document.querySelectorAll('.day'); 
    const times = document.querySelectorAll('.time'); 
    const seats = document.querySelectorAll('.seat.available'); 
    const selectedSeats = new Set(); 

    
    function updateTotalPrice() {
        totalPrice = selectedSeats.size * seatPrice; 
        priceElement.textContent = `$${totalPrice.toFixed(2)}`; 
    }

    
    days.forEach(day => {
        day.addEventListener('click', function() {
            days.forEach(d => d.classList.remove('selected')); 
            day.classList.add('selected'); 
        });
    });

    
    times.forEach(time => {
        time.addEventListener('click', function() {
            times.forEach(t => t.classList.remove('selected'));
            time.classList.add('selected'); 

            
            seatPrice = parseFloat(time.querySelector('span').textContent.replace('$', '')); 
            updateTotalPrice(); 
        });
    });

    // Selección y deselección de asientos
    seats.forEach(seat => {
        seat.addEventListener('click', function() {
            if (seat.classList.contains('selected')) {
                seat.classList.remove('selected'); 
                selectedSeats.delete(seat); 
            } else {
                seat.classList.add('selected'); 
                selectedSeats.add(seat); 
            }
            updateTotalPrice(); 
        });
    });
});
