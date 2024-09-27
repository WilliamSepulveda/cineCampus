const { ObjectId } = require('mongodb');
const connectMongo = require('../../db/connect');

module.exports = class Asiento {
    constructor() {
        this.db = null; // Inicializa la conexión de la base de datos
    }

    async connectDB() {
        if (!this.db) {
            const connectMongoInstance = new connectMongo();
            this.db = await connectMongoInstance.connectOpen();
        }
    }

    async findAllCollection(query) {
        await this.connectDB();
        try {
            const collection = this.db.collection('asiento');
            const result = await collection.find(query).toArray(); 
            if (!result.length) throw new Error('No documents found');
            return result;
        } catch (error) {
            throw new Error(`Error fetching documents: ${error.message}`);
        }
    }

    async updateAsiento(codigo, estado) {
        await this.connectDB();
        try {
            const collection = this.db.collection('asiento');
            const result = await collection.updateOne(
                { 'codigo.asiento': codigo }, 
                { $set: { estado: estado } }
            );

            if (result.matchedCount === 0) {
                throw new Error('Asiento no encontrado');
            }

            return { message: 'Estado de asiento actualizado exitosamente' };
        } catch (error) {
            throw new Error(`Error updating document: ${error.message}`);
        }
    }
};
