const { ObjectId } = require('mongodb');
const connect = require("../../db/connect");

/**
 * Clase Usuario que extiende de la clase Connect para gestionar operaciones relacionadas con usuarios.
 */
class Usuario extends connect {
    /**
     * Constructor de la clase Usuario.
     * Inicializa la referencia a la colección de usuarios como `null`.
     */
    constructor() {
        super();
        this.collectionUsuario = null;
    }

    /**
     * Inicializa la conexión a la base de datos y establece la colección `cliente`.
     * 
     * @async
     * @returns {Promise<void>} Retorna una promesa que se resuelve cuando la conexión se ha establecido y la colección se ha configurado.
     */
    async initialize() {
        await this.open(); // Establece la conexión con la base de datos
        this.collectionUsuario = this.db.collection('cliente'); // Configura la colección de usuarios
    }

    /**
     * Crea un nuevo usuario en la base de datos MongoDB y lo inserta en la colección `cliente`.
     * 
     * @async
     * @param {Object} val - Objeto que contiene los datos del usuario, incluyendo `nick` y `pass`.
     * @param {string} rol - Rol que se asignará al usuario, por ejemplo, 'usuarioEstandar'.
     * @returns {Promise<Object>} Retorna una promesa que se resuelve con el objeto del nuevo usuario creado.
     * @throws Lanza un error si la creación del usuario falla.
     */
    async crearUsuario(val, rol) {
        try {
            // Crea el nuevo usuario en la base de datos a nivel de MongoDB
            const res = await this.db.command({
                createUser: val.nick,
                pwd: val.pass,
                roles: [rol]
            });

            // Crea el objeto del nuevo usuario para la colección `cliente`
            const newUser = {
                _id: new ObjectId(),
                nick: val.nick,
                role: rol,
            };

            // Inserta el nuevo usuario en la colección `cliente`
            await this.collectionUsuario.insertOne(newUser);

            return newUser; // Retorna el nuevo usuario creado
        } catch (error) {
            console.error("Error al crear el usuario:", error);
            throw error;
        }
    }
}

module.exports = Usuario;

