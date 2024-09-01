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
    /**
     * Reserva un asiento para una función específica y actualiza su estado a "Reservado".
     * 
     * @param {string} idFuncion - El ID de la función para la cual se desea reservar el asiento.
     * @param {number} idLugar - El ID del lugar donde se encuentra el asiento.
     * @param {string} idAsiento - El ID del asiento que se desea reservar.
     * @param {string} usuarioId - El ID del usuario que realiza la reserva.
     * 
     * @returns {Promise<Object>} - Un objeto con un mensaje de éxito y el ID de la boleta insertada.
     * 
     * @throws {Error} - Lanza errores si la función o el asiento no se encuentran, si el asiento ya está reservado,
     *                   o si ocurre un problema durante la inserción o actualización en la base de datos.
    */
    async ReservaAsientos(idFuncion, idLugar, idAsiento, usuarioId) {
        try {
            await this.open();
            const db = this.db;
    
            const funcion = await db.collection(this.collectionFunciones).findOne({ _id: new ObjectId(idFuncion) });
            if (!funcion) throw new Error('Función no encontrada');
    
            const asiento = await db.collection(this.collectionAsientos).findOne({ _id: new ObjectId(idAsiento), id_lugar: idLugar });
            if (!asiento) throw new Error('Asiento no encontrado en el lugar especificado');
    
            const boletaExistente = await db.collection(this.collectionBoletas).findOne({ id_movimiento: new ObjectId(idFuncion), id_asiento: new ObjectId(idAsiento) });
            if (boletaExistente) throw new Error('Asiento ya reservado');
    
            const nuevaBoleta = {
                id_movimiento: new ObjectId(idFuncion),
                id_asiento: new ObjectId(idAsiento),
                usuario_id: new ObjectId(usuarioId),
                fecha_reserva: new Date(),
                asiento_codigo: asiento.codigo.asiento,
                asiento_zona: asiento.codigo.zona,
                tipo_de_fila: asiento.tipo_de_fila.nombre,
                incremento: asiento.tipo_de_fila.incremento
            };
    
            const result = await db.collection(this.collectionBoletas).insertOne(nuevaBoleta);
    
            // Actualizar el estado del asiento a 'Reservado'
            await db.collection(this.collectionAsientos).updateOne(
                { _id: new ObjectId(idAsiento) },
                { $set: { estado: 'Reservado' } }
            );
    
            return {
                mensaje: 'Reserva exitosa',
                boleta: result.insertedId
            };
        } catch (err) {
            console.error('Error al reservar asiento:', err);
            throw err;
        } finally {
            await this.conection.close();
        }
    }
    /**
     * Cancela una reserva de asiento para una función específica.
     * 
     * @param {string} idFuncion - El ID de la función para la cual se realizó la reserva.
     * @param {string} idAsiento - El ID del asiento cuya reserva se desea cancelar.
     * @param {string} usuarioId - El ID del usuario que realizó la reserva.
     * 
     * @returns {Promise<Object>} - Un objeto con un mensaje de éxito y el ID de la boleta cancelada.
     * 
     * @throws {Error} - Lanza un error si la función, el asiento, o la reserva no se encuentran.
     */
    async CancelarReserva(idFuncion, idAsiento, usuarioId) {
        try {
            await this.open();
            const db = this.db;

            
            const boleta = await db.collection(this.collectionBoletas).findOne({ 
                id_movimiento: new ObjectId(idFuncion),
                id_asiento: new ObjectId(idAsiento),
                usuario_id: new ObjectId(usuarioId)
            });
            if (!boleta) throw new Error('Reserva no encontrada');

            const result = await db.collection(this.collectionBoletas).deleteOne({
                _id: boleta._id
            });
            if (result.deletedCount === 0) throw new Error('No se pudo cancelar la reserva');

            await db.collection(this.collectionAsientos).updateOne(
                { _id: new ObjectId(idAsiento) },
                { $set: { estado: 'Disponible' } }
            );

            return {
                mensaje: 'Reserva cancelada exitosamente',
                boleta: boleta._id
            };
        } catch (err) {
            console.error('Error al cancelar la reserva:', err);
            throw err;
        } finally {
            await this.conection.close();
        }
    }
};
