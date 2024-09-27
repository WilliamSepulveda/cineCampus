const { ObjectId } = require('mongodb');
const connectMongo = require('../../db/connect'); 

module.exports = class User {
    constructor() {
        this.db = null;
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
            const collection = this.db.collection('user');
            const result = await collection.find(query).toArray();
            if (!result.length) throw new Error('No documents found');
            return result;
        } catch (error) {
            throw new Error(`Error fetching documents: ${error.message}`);
        }
    }

    async insertCollection(data) {
        await this.connectDB();
        try {
            const collection = this.db.collection('user');
            const result = await collection.insertOne(data);
            if (!result.acknowledged) throw new Error('Failed to insert document');
            return { status: 200, message: 'Document inserted successfully', data: result };
        } catch (error) {
            throw new Error(JSON.stringify({ status: 500, message: 'Error inserting document', error: error.message }));
        }
    }

    async findOneUserByEmail(email) {
        await this.connectDB();
        try {
            const collection = this.db.collection('user');
            const user = await collection.findOne({ email });
            if (!user) return { status: 404, message: 'Email not registered' };
            return { status: 200, message: 'User found', data: user };
        } catch (error) {
            throw new Error(JSON.stringify({ status: 500, message: 'Error retrieving user by email', error: error.message }));
        }
    }

    async findExistUserName(userName) {
        await this.connectDB();
        try {
            const collection = this.db.collection('user');
            const user = await collection.findOne({ nick: userName });
            if (!user) return { status: 404, message: 'Username not registered' };
            return { status: 200, message: 'Username found', data: user };
        } catch (error) {
            throw new Error(JSON.stringify({ status: 500, message: 'Error finding username', error: error.message }));
        }
    }

    async findExistEmail(email) {
        await this.connectDB();
        try {
            const collection = this.db.collection('user');
            const user = await collection.findOne({ email });
            if (!user) return { status: 404, message: 'Email not registered' };
            return { status: 200, message: 'Email found', data: user };
        } catch (error) {
            throw new Error(JSON.stringify({ status: 500, message: 'Error finding email', error: error.message }));
        }
    }
    
    async createNewUser(nick, password, role= 'user standard') {
        await this.connectDB();
        try {
            if (!this.db) throw new Error('Database not initialized');

            const result = await this.db.collection('user').insertOne({
                nick,
                pwd: password,
                roles: 'User standard'
            });
            return { status: 200, message: 'User created successfully', data: result };
        } catch (error) {
            throw new Error(JSON.stringify({ status: 500, message: 'Error creating user in database', error: error.message }));
        }
    }

    async deleteByCollection(id) {
        await this.connectDB();
        try {
            const collection = this.db.collection('user');
            const result = await collection.deleteOne({ _id: new ObjectId(id) });
            if (!result.deletedCount) throw new Error('Failed to delete document');
            return { status: 200, message: 'Document deleted successfully' };
        } catch (error) {
            throw new Error(JSON.stringify({ status: 500, message: 'Error deleting document', error: error.message }));
        }
    }
}
