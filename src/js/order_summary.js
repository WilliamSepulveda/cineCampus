document.getElementById('toggle-payment-options').addEventListener('click', function () {
    const paymentOptions = document.getElementById('payment-options');
    if (paymentOptions.classList.contains('hidden')) {
        paymentOptions.classList.remove('hidden');
    } else {
        paymentOptions.classList.add('hidden');
    }
});

// esta validacion es para que sea funcional el tiempo de caducidad 
document.addEventListener('DOMContentLoaded', function () {
    let timeLeft = 120;
    const timerDisplay = document.querySelector('.timer');

    const countdown = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(countdown);
            alert('Time expired! Please restart your order.');
            window.location = '../views/choose_seat.html'
        } else {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            timeLeft--;
        }
    }, 1000);
});
