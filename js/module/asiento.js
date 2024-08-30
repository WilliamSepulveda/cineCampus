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
    /**
     * Consulta la disponibilidad de asientos en una sala para una proyección específica.
     * 
     * Este método realiza lo siguiente:
     * 1. Verifica si la proyección (función) existe en la base de datos.
     * 2. Obtiene todos los asientos disponibles en la sala asociada a la proyección.
     * 3. Obtiene todas las boletas asociadas a la proyección para identificar los asientos ocupados.
     * 4. Marca cada asiento como "Disponible" o "No Disponible" en función de si está asociado a una boleta.
     * 
     * @param {string} idFuncion - El identificador único de la proyección para la cual se desea consultar la disponibilidad de asientos. Debe ser un string representando un ObjectId en MongoDB.
     * @param {ObjectId} idLugar - El identificador único del lugar donde se encuentra la sala. Debe ser un ObjectId que representa el lugar en la base de datos.
     * @returns {Promise<Object>} Una promesa que se resuelve con un objeto que contiene:
     *   - `funcion`: Información de la proyección, incluyendo `id_pelicula`, `id_lugar`, `fecha_hora_inicio`, y `fecha_hora_fin`.
     *   - `asientos`: Una lista de asientos disponibles en la sala para la proyección dada, con cada asiento marcado como "Disponible" o "No Disponible".
     * @throws {Error} Lanza un error si ocurre un problema durante la consulta o si la proyección no se encuentra.
    */
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
