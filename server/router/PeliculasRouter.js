const express = require('express');
const movieController = require('../controller/PeliculasController');

const router = express.Router();

router.post('/', movieController.createMovie); 
router.get('/', movieController.getMovies); 

module.exports = router;
