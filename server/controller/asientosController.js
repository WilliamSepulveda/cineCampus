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

    try {
        const result = await db.collection('asiento').updateOne(
            { 'codigo.asiento': codigo },
            { $set: { estado: estado } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).send('Asiento no encontrado');
        }

        res.send({ message: 'Estado de asiento actualizado exitosamente' });
    } catch (error) {
        res.status(500).send(`Error al actualizar el estado: ${error.message}`);
    }
}
