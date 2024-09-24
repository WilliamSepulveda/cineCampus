const dots = document.querySelectorAll('.dot');
const movieContainer = document.querySelector('.now-playing .movie-carousel');
const movieItems = document.querySelectorAll('.now-playing .movie-item');

let currentIndex = 0;
const moviesPerBlock = 1; 

function showMovieBlock(index) {
    const itemWidth = movieItems[0].offsetWidth; 
    const offset = itemWidth * moviesPerBlock * index;  
    movieContainer.scrollTo({
        left: offset,
        behavior: 'smooth' 
    });

    dots.forEach((dot, i) => {
        if (i === index) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });

    currentIndex = index;
}


showMovieBlock(currentIndex);


dots.forEach(dot => {
    dot.addEventListener('click', () => {
        const index = parseInt(dot.getAttribute('data-index'));
        showMovieBlock(index);
    });
});
