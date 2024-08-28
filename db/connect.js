const { MongoClient } = require('mongodb')
module.exports = class connect {
    conection;
    db;
    static instanceConnect
    constructor(){
        if(connect.instanceConnect) return connect.instanceConnect
        connect.instanceConnect = this
        return connect.instanceConnect;
    }
    async open(){
        const uri = `${process.env.MONGO_PROTOCOL}${process.env.MONGO_USER}:${process.env.MONGO_PSW}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`;
        console.log(uri)     
        try {
            this.conection = new MongoClient(uri);
            await this.conection.connect();
            this.db = this.conection.db(process.env.MONGO_NAME)
        } catch (error){
            this.conection = {status: 400, message: "Error en la URI o en la conexion"}
        }
    }
}
