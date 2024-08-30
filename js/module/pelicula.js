const {ObjectId} = require ('mongodb');
const connect = require("../../db/connect");

module.exports = class pelicula extends connect {
    collectionPelicula;

    constructor() {
        super();
        this.collectionPelicula = 'Pelicula';
    }
    /**
     * Consulta todas las películas disponibles en el catálogo.
     * 
     * @param {Object} projection - Un objeto que especifica los campos que se deben incluir o excluir en la proyección.
     *                              Ejemplo: { titulo: 1, genero: 1, duracion: 1, horarios: 1 } para incluir solo estos campos.
     *                              Si se deja vacío, se devolverán todos los campos.
     * 
     * @returns {Promise<Array>} - Una promesa que resuelve con un array de documentos que representan las películas en el catálogo.
     *                             Cada documento incluirá los campos especificados en la proyección.
     * 
     * @throws {Error} - Si hay algún error durante la consulta o al cerrar la conexión con la base de datos.
    */
    async getAllPelicula(projection) {
        await this.open();   
        this.collectionPelicula = this.db.collection('Pelicula');        
        let res = await this.collectionPelicula.find({}).project(projection).toArray();
        await this.conection.close();  
        return res;
    }
}