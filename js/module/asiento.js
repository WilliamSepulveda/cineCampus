const { ObjectId } = require('mongodb');
const connect = require('../../db/connect');

module.exports = class Asientos extends connect {
    collectionBoletas;
    collectionMovimientos;
    collectionAsientos;
    collectionFunciones;
    collectionLugares;

    constructor() {
        super();
        this.collectionBoletas = 'Boleta';
        this.collectionMovimientos = 'movimiento';
        this.collectionAsientos = 'asiento';
        this.collectionFunciones = 'funcion';
        this.collectionLugares = 'lugar';
    }

    async consultarDisponibilidad(idFuncion, idLugar) {
        try {
            await this.open(); 
            const db = this.db;

            const funcion = await db.collection(this.collectionFunciones).findOne({ _id: new ObjectId(idFuncion) });
            if (!funcion) throw new Error('Función no encontrada');

            
            const asientos = await db.collection(this.collectionAsientos).find({ id_lugar: idLugar }).toArray();

            const boletas = await db.collection(this.collectionBoletas).find({ id_movimiento: new ObjectId(idFuncion) }).toArray();

            const asientosDisponibles = asientos.map(asiento => {
                const boleta = boletas.find(b => b.id_asiento === asiento.id);
                return {
                    ...asiento,
                    estado: boleta ? 'No Disponible' : 'Disponible'
                };
            });

            return {
                funcion,
                asientos: asientosDisponibles
            };
        } catch (err) {
            console.error('Error al consultar disponibilidad:', err);
            throw err;
        } finally {
            await this.conection.close(); 
        }
    }
};
