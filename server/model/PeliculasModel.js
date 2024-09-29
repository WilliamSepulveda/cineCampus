const { ObjectId } = require('mongodb');
const connectMongo = require('../../db/connect');

module.exports = class Movie {
    constructor() {
        this.db = null;
    }

    async connectDB() {
        if (!this.db) {
            const connectMongoInstance = new connectMongo();
            this.db = await connectMongoInstance.connectOpen();
        }
    }

    async insertCollection(data) {
        await this.connectDB();
        try {
            const collection = this.db.collection('Pelicula');
            const result = await collection.insertOne(data);
            if (!result.acknowledged) throw new Error('Failed to insert document');
            return { status: 200, message: 'Document inserted successfully', data: result };
        } catch (error) {
            throw new Error(JSON.stringify({ status: 500, message: 'Error inserting document', error: error.message }));
        }
    }

    async findAllCollection(query) {
        await this.connectDB();
        try {
            const collection = this.db.collection('Pelicula');
            const result = await collection.find(query).toArray();
            if (!result.length) throw new Error('No documents found');
            return result;
        } catch (error) {
            throw new Error(`Error fetching documents: ${error.message}`);
        }
    }

    async findById(id) {
        await this.connectDB();
        try {
            const collection = this.db.collection('Pelicula');
            const result = await collection.findOne({ _id: new ObjectId(id) }); 
            return result;
        } catch (error) {
            throw new Error(`Error al buscar documento: ${error.message}`);
        }
    }
};
