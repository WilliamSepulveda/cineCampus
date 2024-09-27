document.addEventListener("DOMContentLoaded", function() {
    const movieId = new URLSearchParams(window.location.search).get('id'); 
    console.log('ID de película:', movieId); 

    if (movieId) {
        fetch(`/movies/${movieId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta de red ' + response.statusText);
                }
                return response.json();
            })
            .then(movie => {
                console.log('Datos de la película:', movie); 
                
                // Guardar información de la película en cookies
                document.cookie = `movieId=${movie._id}; path=/`;
                document.cookie = `movieTitle=${encodeURIComponent(movie.titulo)}; path=/`;
                document.cookie = `movieGenre=${encodeURIComponent(movie.genero)}; path=/`;
                document.cookie = `moviePoster=${encodeURIComponent(movie.posterUrl)}; path=/`;
                document.cookie = `movieSynopsis=${encodeURIComponent(movie.sinopsis)}; path=/`;
                document.cookie = `selectedMoviePoster=${encodeURIComponent(movie.posterUrl)}; path=/`;
                console.log('Cookies disponibles:', document.cookie);


                // Rellenar la información de la película en el DOM
                const posterImage = document.querySelector('.movie__image img');
                const titleElement = document.querySelector('#main__section__title h1');
                const genreElement = document.querySelector('#main__section__title span');
                const synopsisElement = document.querySelector('#main__section__title p');
                
                if (posterImage && movie.posterUrl) {
                    posterImage.src = `/storage/img/${movie.posterUrl}`;
                } else {
                    console.warn('No se encontró un póster para esta película.');
                }

                titleElement.innerText = movie.titulo || 'Título no disponible';
                genreElement.innerText = movie.genero || 'Género no disponible';
                synopsisElement.innerText = movie.sinopsis || 'Sinopsis no disponible';

                // Rellenar los actores
                const actorsContainer = document.querySelector('.actors');
                actorsContainer.innerHTML = ''; 

                if (Array.isArray(movie.cast) && movie.cast.length > 0) {
                    movie.cast.forEach(actor => {
                        const actorItem = document.createElement('div');
                        actorItem.classList.add('information_Actors');
                        actorItem.innerHTML = `
                            <img src="../storage/img/${actor.image || 'default-actor.jpg'}" alt="${actor.name || 'Actor no disponible'}"> 
                            <div class="text-container">
                                <p>${actor.name || 'Nombre no disponible'}</p>
                                <span>${actor.character || 'Personaje no disponible'}</span>
                            </div>
                        `;
                        actorsContainer.appendChild(actorItem);
                    });
                } else {
                    console.warn('No hay actores disponibles para esta película.');
                    actorsContainer.innerHTML = '<p>No hay actores disponibles.</p>';
                }
            })
            .catch(error => console.error('Error:', error));
    } else {
        console.error('No se proporcionó un ID de película válido.');
    }
});
