const Movie = require('../model/PeliculasModel');

const movie = new Movie();

exports.createMovie = async (req, res) => {
    try {
        const { titulo, genero, duracion, sinopsis, estado } = req.body;

        const resMovie = await movie.insertCollection({ titulo, genero, duracion, sinopsis, estado });
        if (resMovie.status === 200) {
            return res.status(201).json({ status: 201, message: 'Película creada exitosamente.' });
        } else {
            return res.status(500).json({ status: 500, message: 'Error al crear la película.' });
        }
    } catch (error) {
        console.error('Error al crear la película:', error.message);
        res.status(500).json({ status: 500, message: 'Error interno del servidor.' });
    }
};

exports.getMovies = async (req, res) => {
    try {
        const result = await movie.findAllCollection({});
        res.status(200).json(result);
    } catch (error) {
        console.error('Error al obtener películas:', error.message);
        res.status(500).json({ message: 'Error al obtener películas' });
    }
};
