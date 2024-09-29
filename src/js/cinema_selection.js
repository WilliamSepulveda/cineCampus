document.addEventListener("DOMContentLoaded", function() {
    const movieId = new URLSearchParams(window.location.search).get('id'); 
    console.log('ID de película:', movieId); 

    if (movieId) {
        fetch(`/movies/${movieId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(movie => {
                console.log('Datos de la película:', movie); 
                
                document.querySelector('.movie__image img').src = movie.posterUrl ? `/storage/img/${movie.posterUrl}` : ''; 
                document.querySelector('#main__section__title h1').innerText = movie.titulo || 'Título no disponible';
                document.querySelector('#main__section__title span').innerText = movie.genero || 'Género no disponible';
                document.querySelector('#main__section__title p').innerText = movie.sinopsis || 'Sinopsis no disponible';

                const actorsContainer = document.querySelector('.actors');
                actorsContainer.innerHTML = ''; 

                if (Array.isArray(movie.cast)) {
                    movie.cast.forEach(actor => {
                        const actorItem = document.createElement('div');
                        actorItem.classList.add('information_Actors');
                        actorItem.innerHTML = `
                            <img src="../storage/img/${actor.image}" alt="${actor.name}"> 
                            <div class="text-container">
                                <p>${actor.name || 'Nombre no disponible'}</p>
                                <span>${actor.character || 'Personaje no disponible'}</span>
                            </div>
                        `;
                        actorsContainer.appendChild(actorItem);
                    });
                } else {
                    console.warn('No hay actores disponibles para esta película.');
                }
            })
            .catch(error => console.error('Error:', error));
    } else {
        console.error('No se proporcionó un ID de película válido.');
    }
});
