const { ObjectId } = require('mongodb');
const connect = require("../../db/connect");

class Usuario extends connect {
    constructor() {
        super();
        this.collectionUsuario = null;
    }

    async initialize() {
        await this.open(); 
        this.collectionUsuario = this.db.collection('cliente'); 
    }

    async crearUsuario(val, rol) {
        try {
            // Crea el nuevo usuario en la base de datos
            const res = await this.db.command({
                createUser: val.nick,
                pwd: val.pass,
                roles: [rol]
            });

            // Crea el objeto del nuevo usuario
            const newUser = {
                _id: new ObjectId(),
                nick: val.nick,
                role: rol,
            };

            await this.collectionUsuario.insertOne(newUser);

            return newUser; 
        } catch (error) {
            console.error("Error al crear el usuario:", error);
            throw error;
        }
    }
}

module.exports = Usuario;





