document.addEventListener("DOMContentLoaded", function() {
    const cinemas = document.querySelectorAll('.cinema');
    
    cinemas.forEach(cinema => {
        cinema.addEventListener('click', function() {
            // Elimina la clase 'selected' de cualquier cine seleccionado previamente
            cinemas.forEach(c => c.classList.remove('selected'));
            
            // Añade la clase 'selected' al cine que fue clicado
            cinema.classList.add('selected');
        });
    });
});

