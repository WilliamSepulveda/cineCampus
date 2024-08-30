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
    /**
     * Consulta una película específica en la colección `Pelicula` de la base de datos.
     * 
     * @param {string} id - El identificador único de la película que se desea consultar. Debe ser un `ObjectId` en formato de cadena.
     * @param {Object} projection - Un objeto que especifica los campos que se deben incluir o excluir en el resultado de la consulta.
     *                              Utiliza la sintaxis de proyección de MongoDB, donde `1` incluye el campo y `0` lo excluye.
     *                              Ejemplo: `{ titulo: 1, genero: 1, duracion: 1, horarios: 1 }`
     * 
     * @returns {Promise<Array>} - Una promesa que se resuelve con un array que contiene el documento correspondiente a la película con el `id` especificado.
     *                             Los documentos incluirán solo los campos definidos en la proyección. Si no se encuentra ninguna película con el `id` dado, se devolverá un array vacío.
     * 
     * @throws {Error} - Si hay algún error durante la apertura de la conexión, la consulta o el cierre de la conexión con la base de datos.
    */
    async getSpecificMovies(id, projection){
        await this.open();  
        const filter = {_id: new ObjectId(id)}; 
        this.collectionPelicula = this.db.collection('Pelicula');        
        let res = await this.collectionPelicula.find(filter).project(projection).toArray();
        await this.conection.close();  
        return res;
    }
}