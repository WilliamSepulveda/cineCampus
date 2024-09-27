const { MongoClient } = require('mongodb');

module.exports = class ConnectMongo {
    static instanceConnect;
    db;
    connection;
    #user; 
    #password; 

    constructor({ user, pwd } = { user: process.env.MONGO_USER, pwd: process.env.MONGO_PSW }) {
        if (ConnectMongo.instanceConnect) { 
            return ConnectMongo.instanceConnect;
        }
        this.#user = user; 
        this.#password = pwd;
        ConnectMongo.instanceConnect = this;
    }

    async connectOpen() {
        try {
            console.log('Intentando conectar a la base de datos...');
            this.connection = new MongoClient(
                `${process.env.MONGO_PROTOCOL}${this.#user}:${this.#password}@${process.env.MONGO_HOST_NAME}:${process.env.MONGO_PORT}/${process.env.MONGO_DB_NAME}`
            );
    
            await this.connection.connect();
            this.db = this.connection.db(process.env.MONGO_DB_NAME);
            console.log('Conexión exitosa a la base de datos.');
            return this.db;
        } catch (error) {
            console.error('Error conectando a la base de datos:', error.message);
            this.connection = undefined;
            ConnectMongo.instanceConnect = undefined;
            throw new Error(JSON.stringify({ status: 500, message: 'Error connecting to database.' }));
        }
    }

    get user() {
        return this.#user; 
    }

    set user(user) {
        this.#user = user; 
    }

    get password() {
        return this.#password;
    }

    set password(pwd) {
        this.#password = pwd; 
    }
};
