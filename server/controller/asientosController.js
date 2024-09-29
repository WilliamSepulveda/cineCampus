const { ObjectId } = require('mongodb');
const Asiento = require('../model/asientosModel');

exports.getAsientos = async (req, res) => {
    try {
        const asiento = new Asiento(); 
        const asientos = await asiento.findAllCollection({}); 
        res.json(asientos);
    } catch (error) {
        console.error('Error al obtener los asientos:', error);
        res.status(500).json({ message: 'Error al obtener los asientos' });
    }
};

exports.updateAsiento = async (req, res) => {
    const { codigo } = req.params; 
    const { estado } = req.body; 

    const asiento = new Asiento();

    try {
        const result = await asiento.updateAsiento(codigo, estado);
        res.send(result); 
    } catch (error) {
        res.status(500).send(`Error al actualizar el estado: ${error.message}`); 
    }
};
