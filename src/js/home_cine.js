function loadMovies() {
    fetch('/movies')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Películas recibidas:', data);

        const nowPlayingCarousel = document.querySelector('.now-playing .movie-carousel'); 
        const comingSoonCarousel = document.querySelector('.coming-soon .movie-carousel');

        nowPlayingCarousel.innerHTML = '';
        comingSoonCarousel.innerHTML = '';

        // Filtrar las películas según el estado
        const nowPlayingMovies = data.filter(movie => movie.estado === 'en estreno');
        const comingSoonMovies = data.filter(movie => movie.estado === 'pronto lanzamiento');

        // Añadir películas de "en estreno" al carrusel
        nowPlayingMovies.forEach(movie => {
            const posterUrl = movie.posterUrl ? `/storage/img/${movie.posterUrl}` : '/storage/img/alien.jpg'; 
            
            const movieItem = document.createElement('div');
            movieItem.classList.add('movie-item');
            movieItem.innerHTML = `
                <a href="/cinema_selection?id=${movie._id.$oid}">
                    <img src="${posterUrl}" alt="${movie.titulo}">
                </a>
                <p class="movie-title">${movie.titulo}</p>
                <p class="movie-genre">${movie.genero}</p>
            `;

            nowPlayingCarousel.appendChild(movieItem);
        });

        // Añadir películas de "próximamente" al carrusel
        comingSoonMovies.forEach(movie => {
            const posterUrl = movie.posterUrl ? `/storage/img/${movie.posterUrl}` : '/storage/img/alien.jpg'; 
            
            const movieItem = document.createElement('div');
            movieItem.classList.add('movie-item');
            movieItem.innerHTML = `
                <a href="/cinema_selection?id=${movie._id.$oid}">
                    <img src="${posterUrl}" alt="${movie.titulo}">
                </a>
                <p class="movie-title">${movie.titulo}</p>
                <p class="movie-genre">${movie.genero}</p>
            `;

            comingSoonCarousel.appendChild(movieItem);
        });
        console.log(`Películas en estreno: ${nowPlayingCarousel.children.length}`);
        console.log(`Películas próximamente: ${comingSoonCarousel.children.length}`);
    })
    .catch(error => console.error('Error:', error));
}

window.onload = loadMovies;
