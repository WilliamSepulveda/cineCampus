const { ObjectId } = require('mongodb');
const connect = require('../../db/connect'); 

module.exports = class Boletas extends connect {
    collectionBoletas;
    collectionMovimientos;
    collectionAsientos;

    constructor() {
        super();
        this.collectionBoletas = 'Boleta';
        this.collectionMovimientos = 'movimientos'; 
        this.collectionUsuarios = 'cliente';
        this.collectionAsientos = 'asiento';
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
    /**
     * Aplica un descuento al precio original si el usuario es VIP.
     * @param {number} precioOriginal - El precio original de la boleta.
     * @param {Object} usuario - El objeto que representa al usuario.
     * @returns {number} - El precio con descuento si el usuario es VIP, o el precio original si no lo es.
     */
    aplicarDescuento(precioOriginal, usuario) {
        const descuentoVIP = 0.20;
        if (usuario.tipos_de_categoria.includes('VIP')) {
            return precioOriginal * (1 - descuentoVIP);
        }
        return precioOriginal;
    }
    /**
     * Compra una boleta con descuento si el usuario es VIP y actualiza el estado de la boleta.
     * @param {string} idBoleta - El ID de la boleta a comprar.
     * @param {Object} tipoMovimiento - El objeto que representa el tipo de movimiento.
     * @returns {Promise<Object>} - Un objeto con la boleta actualizada y el movimiento realizado.
     */
    async BuyBoletasDescuento(idBoleta, tipoMovimiento) {
        try {
            await this.open(); 
            const collectionBoletas = this.db.collection(this.collectionBoletas);
            const collectionMovimientos = this.db.collection(this.collectionMovimientos);

            const dbBoleta = await collectionBoletas.findOne({ _id: new ObjectId(idBoleta) });

            if (!dbBoleta || !dbBoleta.estado.includes('Disponible')) {
                throw new Error('Boleta no disponible');
            }

            const usuario = {
                tipos_de_categoria: ['VIP'] // Aquí deberías obtener el usuario real
            };

            const precioOriginal = dbBoleta.precio || 100;

            const precioFinal = this.aplicarDescuento(precioOriginal, usuario);

            const resultadoBoleta = await collectionBoletas.updateOne(
                { _id: new ObjectId(idBoleta) },
                { $set: { estado: ["no Disponible"] } }
            );

            if (resultadoBoleta.modifiedCount > 0) {
                const boletaActualizada = await collectionBoletas.findOne({ _id: new ObjectId(idBoleta) });
    
                const movimiento = {
                    codigo_cliente: 124, 
                    id_funcion: new ObjectId(idBoleta), 
                    tipo_movimiento: tipoMovimiento,
                    precio_final: precioFinal
                };

                await collectionMovimientos.insertOne(movimiento);

                console.log('Boleta encontrada:', boletaActualizada);
                console.log('Compra realizada exitosamente. Precio final:', precioFinal);

                return {
                    boleta: boletaActualizada,
                    movimiento: movimiento
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
// // verificar boleta de usuario

    /**
     * Verifica si el usuario tiene una tarjeta VIP válida.
     * 
     * @param {string} usuarioId - El ID del usuario para verificar la validez de la tarjeta VIP.
     * @returns {Promise<boolean>} - Devuelve `true` si el usuario tiene una tarjeta VIP, `false` en caso contrario.
     * @throws {Error} - Lanza un error si ocurre un problema al consultar la base de datos.
     */
    async verificarTarjetaVIP(usuarioId) {
        try {
            const collectionUsuarios = this.db.collection(this.collectionUsuarios);
            const usuario = await collectionUsuarios.findOne({ _id: new ObjectId(usuarioId) });

            if (usuario && usuario.tipos_de_categoria.includes('VIP')) {
                // Aquí podrías añadir más lógica para verificar la validez de la tarjeta VIP si es necesario
                return true;
            }
            return false;
        } catch (err) {
            console.log('Error al verificar la tarjeta VIP', err);
            throw err;
        }
    }
    /**
     * Aplica un descuento al precio original si el usuario tiene una tarjeta VIP válida.
     * 
     * @param {number} precioOriginal - El precio original de la boleta.
     * @param {boolean} tarjetaVIPValida - Indica si la tarjeta VIP del usuario es válida.
     * @returns {number} - El precio con descuento si la tarjeta VIP es válida, o el precio original si no lo es.
     */
    aplicarDescuento(precioOriginal, tarjetaVIPValida) {
        const descuentoVIP = 0.20;
        if (tarjetaVIPValida) {
            return precioOriginal * (1 - descuentoVIP);
        }
        return precioOriginal;
    }
    /**
     * Compra una boleta aplicando un descuento si la tarjeta VIP del usuario es válida.
     * 
     * @param {string} idBoleta - El ID de la boleta a comprar.
     * @param {string} usuarioId - El ID del usuario que realiza la compra.
     * @param {Object} tipoMovimiento - El objeto que representa el tipo de movimiento.
     * @returns {Promise<Object>} - Un objeto con la boleta actualizada y el movimiento realizado.
     * @throws {Error} - Lanza un error si la boleta no está disponible o si ocurre un problema al realizar la compra.
     */
    async verificacionUsuario(idBoleta, usuarioId, tipoMovimiento) {
        try {
            await this.open();
            const collectionBoletas = this.db.collection(this.collectionBoletas);
            const collectionMovimientos = this.db.collection(this.collectionMovimientos);

            const dbBoleta = await collectionBoletas.findOne({ _id: new ObjectId(idBoleta) });

            if (!dbBoleta || !dbBoleta.estado.includes('Disponible')) {
                throw new Error('Boleta no disponible');
            }

            const tarjetaVIPValida = await this.verificarTarjetaVIP(usuarioId);
            const precioOriginal = dbBoleta.precio || 100;
            const precioFinal = this.aplicarDescuento(precioOriginal, tarjetaVIPValida);

            const resultadoBoleta = await collectionBoletas.updateOne(
                { _id: new ObjectId(idBoleta) },
                { $set: { estado: ["no Disponible"] } }
            );

            if (resultadoBoleta.modifiedCount > 0) {
                const boletaActualizada = await collectionBoletas.findOne({ _id: new ObjectId(idBoleta) });

                const movimiento = {
                    codigo_cliente: usuarioId, 
                    id_funcion: new ObjectId(idBoleta),
                    tipo_movimiento: tipoMovimiento,
                    precio_final: precioFinal
                };

                await collectionMovimientos.insertOne(movimiento);

                console.log('Boleta encontrada:', boletaActualizada);
                console.log('Compra realizada exitosamente. Precio final:', precioFinal);

                return {
                    boleta: boletaActualizada,
                    movimiento: movimiento
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
    /**
     * Realiza la compra de una boleta y procesa el pago en línea.
     * 
     * @param {string} idBoleta - El ID de la boleta a comprar.
     * @param {Object} tipoMovimiento - El tipo de movimiento que describe la transacción.
     * @param {number} tipoMovimiento.id - El ID del tipo de movimiento.
     * @param {string} tipoMovimiento.nombre - El nombre del tipo de movimiento.
     * @returns {Promise<Object>} Un objeto que contiene detalles de la boleta actualizada, el tipo de movimiento, y los detalles del pago.
     * @throws {Error} Si la boleta no está disponible, el pago falla, o hay un problema al actualizar la boleta.
     */
    async BuyBoletas(idBoleta, tipoMovimiento) {
    try {
        await this.open(); 
        const collectionBoletas = this.db.collection(this.collectionBoletas);
        const collectionMovimientos = this.db.collection(this.collectionMovimientos);
        const collectionAsientos = this.db.collection(this.collectionAsientos);

        const dbBoleta = await collectionBoletas.findOne({ _id: new ObjectId(idBoleta) });

        if (!dbBoleta || !dbBoleta.estado.includes('Disponible')) {
            throw new Error('Boleta no disponible');
        }

        const pagoExitoso = await this.procesarPago(dbBoleta.precio);

        if (!pagoExitoso) {
            throw new Error('El pago no se pudo procesar');
        }

        const resultadoBoleta = await collectionBoletas.updateOne(
            { _id: new ObjectId(idBoleta) },
            { $set: { estado: ["no Disponible"] } }
        );

        if (resultadoBoleta.modifiedCount > 0) {
            const boletaActualizada = await collectionBoletas.findOne({ _id: new ObjectId(idBoleta) });

            if (dbBoleta.id_asiento) {
                const resultadoAsiento = await collectionAsientos.updateOne(
                    { id: dbBoleta.id_asiento }, 
                    { $set: { estado: "no Disponible" } }
                );

                if (resultadoAsiento.matchedCount === 0) {
                    throw new Error('Asiento no encontrado');
                }
            }

            const movimiento = {
                codigo_cliente: 124, 
                id_funcion: new ObjectId(idBoleta),
                tipo_movimiento: tipoMovimiento
            };

            await collectionMovimientos.insertOne(movimiento);

            console.log('Boleta encontrada:', boletaActualizada);
            console.log('Compra realizada exitosamente.');

            const detallesPago = {
                idTransaccion: "TX123456789",
                estadoPago: "completado",
                metodoPago: "tarjeta",
                monto: dbBoleta.precio,
                fechaPago: new Date().toISOString()
            };

            return {
                boleta: boletaActualizada,
                movimiento: tipoMovimiento,
                pago: detallesPago
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
    /**
     * Simula el procesamiento de un pago en línea.
     * 
     * @param {number} monto - El monto a pagar.
     * @returns {Promise<boolean>} Una promesa que se resuelve en true si el pago fue exitoso.
     */
    async procesarPago(monto) {
        return new Promise((resolve) => setTimeout(() => resolve(true), 1000));
}
};    