const express = require('express');
const { getAsientos, updateAsiento } = require('../controller/asientosController'); 
const router = express.Router();

router.get('/', getAsientos);
console.log('Ruta /asientos fue alcanzada',getAsientos);


router.patch('/:codigo', updateAsiento);

module.exports = router;
