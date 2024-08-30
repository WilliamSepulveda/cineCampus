# Requisitos Funcionales

# seleccion de peliculas 

## mostrar todas las peliculas disponibles en cátalogo 

### Descripción 
getAllPelicula es una función asíncrona que permite consultar todas las películas disponibles en la colección Pelicula dentro de una base de datos MongoDB. Esta función es parte de una clase que extiende de una clase de conexión a la base de datos.

### Ejemplo de uso 
```javascript
let obj = new Pelicula();
obj.getAllPelicula()
    .then(res => {
        console.log(res);
    })
    .catch(err => {
        console.log(err);
    });
```
### Funcionalidad 
La función se conecta a la base de datos, consulta todos los documentos de la colección Pelicula y devuelve un array con los resultados. Los resultados incluyen únicamente los campos especificados por el parámetro projection. Después de realizar la consulta, la conexión a la base de datos se cierra para liberar recursos.

### Párametros 
projection: Es un objeto que define los campos que deben ser incluidos o excluidos en los resultados de la consulta. Si no se especifica, se devolverán todos los campos por defecto.

    * Tipo: Object

    * Ejemplo: `{ titulo: 1, genero: 1, duracion: 1, horarios: 1 }`

    * Descripción: Este objeto utiliza una sintaxis de proyección de MongoDB, donde 1 indica que el campo debe ser incluido, y 0 indica que el campo debe ser excluido.

## mostrar las peliculas disponibles en cátalogo por id 

### Descripción
getSpecificMovies es una función asíncrona que consulta documentos específicos en la colección Pelicula de una base de datos MongoDB. Permite recuperar una película específica basada en su identificador (id) y proyectar solo los campos deseados en el resultado.

### Ejemplo de uso 
```javascript
let obj = new Pelicula();
obj.getSpecificMovies("66d0777d3170ffb8c89f4bb4")
    .then(res=>{
        console.log(res);
    })
    .catch(err=>{
        console.log(err);
    })
```
### Funcionalidad 
La función se conecta a la base de datos, busca un documento en la colección Pelicula que coincida con el identificador proporcionado, y devuelve el documento con los campos especificados en la proyección. Después de realizar la consulta, la conexión a la base de datos se cierra.

### Párametros 
id:

    Tipo: string

    Descripción: Identificador único de la película que se desea consultar. Debe ser un ObjectId en formato de cadena.
    
    Ejemplo: "64eea9aebc8c2212d4e68b7f"

projection:

    Tipo: Object

    Descripción: Objeto que especifica los campos que deben ser incluidos o excluidos en el resultado de la consulta. La proyección se realiza utilizando la sintaxis de proyección de MongoDB.

    Ejemplo: { titulo: 1, genero: 1, duracion: 1, horarios: 1 }
    Nota: Si se especifica { titulo: 1 }, solo el campo titulo será incluido en el resultado.