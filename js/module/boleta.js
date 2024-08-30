const { ObjectId } = require('mongodb');
const connect = require('../../db/connect'); 

module.exports = class Boletas extends connect {
    collectionBoletas;
    collectionMovimientos;

    constructor() {
        super();
        this.collectionBoletas = 'Boleta';
        this.collectionMovimientos = 'movimientos'; 
    }

    /**
     * Permite la compra de una boleta para una película específica en una fecha y hora determinada,
     * si la boleta está disponible, y registra el tipo de movimiento en la colección de movimientos.
     *
     * @param {string} idBoleta - El identificador único de la boleta que se desea comprar.
     * @param {Object} tipoMovimiento - El tipo de movimiento a registrar. Debe contener `id` y `nombre`.
     * @returns {Promise<Object>} Una promesa que se resuelve con los detalles de la boleta actualizada y el tipo de movimiento.
     * @throws {Error} Lanza un error si la boleta no está disponible o si ocurre un problema durante el proceso de compra.
    */
    async BuyBoletas(idBoleta, tipoMovimiento) {
        try {
            await this.open(); 
            const collectionBoletas = this.db.collection(this.collectionBoletas);
            const collectionMovimientos = this.db.collection(this.collectionMovimientos);

            const dbBoleta = await collectionBoletas.findOne({ _id: new ObjectId(idBoleta) });

            if (!dbBoleta || !dbBoleta.estado.includes('Disponible')) {
                throw new Error('Boleta no disponible');
            }

            const resultadoBoleta = await collectionBoletas.updateOne(
                { _id: new ObjectId(idBoleta) },
                { $set: { estado: ["no Disponible"] } }
            );

            if (resultadoBoleta.modifiedCount > 0) {
                const boletaActualizada = await collectionBoletas.findOne({ _id: new ObjectId(idBoleta) });
    
                const movimiento = {
                    codigo_cliente: 124, 
                    id_funcion: new ObjectId(idBoleta), 
                    tipo_movimiento: tipoMovimiento 
                };

                await collectionMovimientos.insertOne(movimiento);

                console.log('Boleta encontrada:', boletaActualizada);
                console.log('Compra realizada exitosamente.');

                return {
                    boleta: boletaActualizada,
                    movimiento: tipoMovimiento
                };
            } else {
                throw new Error('Hubo un problema al realizar la compra');
            }
        } catch (err) {
            console.log('Error al finalizar la compra', err);
            throw err; 
        } finally {
            await this.conection.close(); 
        }
    }
}
