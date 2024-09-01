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

# compra de boletos 

## comprar boleta para una pelicula 

### Descripcion
El método BuyBoletas permite realizar la compra de una boleta para una película específica. Verifica la disponibilidad de la boleta, actualiza su estado a "no Disponible" si está disponible, y registra el tipo de movimiento en una colección separada. Si la compra se realiza exitosamente, devuelve los detalles actualizados de la boleta junto con la información del tipo de movimiento registrado.

### Ejemplo de uso
```javascript
const idBoleta = "66d07cde3170ffb8c89f4bd9"; 
const tipoMovimiento = {
    id: 2,
    nombre: "compra"
};

const newBoletas = new Boletas();

newBoletas.BuyBoletas(idBoleta, tipoMovimiento)
    .then(res => {
        console.log("Operación completada.");
        console.log("Detalles de la boleta:", res.boleta);
        console.log("Tipo de movimiento:", res.movimiento);
    })
    .catch(err => {
        console.error("Error en la operación:", err);
    });
```
### Funcionalidad
Verificación de Disponibilidad: El método primero busca la boleta en la colección de Boleta para verificar si está disponible.
Actualización del Estado: Si la boleta está disponible, su estado se actualiza a "no Disponible".
Registro de Movimiento: Registra el tipo de movimiento en la colección de movimientos.
Devolución de Resultados: Devuelve los detalles de la boleta actualizada y la información del tipo de movimiento, en caso de éxito.

### Párametros 
idBoleta (string): El identificador único de la boleta que se desea comprar. Debe ser un valor de tipo ObjectId en formato de cadena.

tipoMovimiento (Object): El tipo de movimiento a registrar. Debe ser un objeto con las siguientes propiedades:

    id (number): Identificador del tipo de movimiento.
    nombre (string): Nombre del tipo de movimiento, como "compra".

## Verificar Disponibilidad de Asientos

### Descripcion
El método consultarDisponibilidad consulta la disponibilidad de asientos para una proyección específica en una base de datos MongoDB. Realiza las siguientes operaciones:

    Conexión a la Base de Datos: Abre una conexión a la base de datos usando el método open de la clase base connect.
    Consulta de la Proyección: Busca la proyección (función) en la colección funcion usando el identificador proporcionado.
    Obtención de Asientos: Recupera todos los asientos asociados al idLugar en la colección asiento.
    Obtención de Boletas: Obtiene todas las boletas asociadas a la proyección en la colección Boleta.
    Marcado de Disponibilidad: Compara los asientos con las boletas para determinar si cada asiento está "Disponible" o "No Disponible".
    Devolución de Resultados: Devuelve un objeto con la información de la proyección y la lista de asientos con su estado de disponibilidad.

### Ejemplo de uso
```javascript
const asientos = new Asientos();
const idFuncion = '646a0c4f1b0f3b5d16c58222';
const idLugar = 101;

asientos.consultarDisponibilidad(idFuncion, idLugar)
    .then(res => {
        console.log('Disponibilidad de asientos:', res);
    })
    .catch(err => {
        console.error('Error al consultar disponibilidad:', err);
    });
```
### Funcionalidad
Verificación de Proyección: Verifica que la proyección especificada exista en la base de datos. Si no se encuentra, lanza un error.
Consulta de Asientos: Recupera todos los asientos en la sala asociada al idLugar dado.
Consulta de Boletas: Obtiene las boletas que corresponden a la proyección específica.
Cálculo de Disponibilidad: Marca cada asiento como "Disponible" o "No Disponible" basado en si existe una boleta correspondiente.
Retorno de Datos: Devuelve un objeto con la información de la proyección y los asientos con su estado de disponibilidad.

### Párametros 
idFuncion (string): Identificador único de la proyección para la cual se desea consultar la disponibilidad de asientos. Debe ser una cadena que representa un ObjectId en MongoDB.
idLugar (ObjectId): Identificador único del lugar (sala) donde se encuentra la proyección. Debe ser un ObjectId que representa el lugar en la base de datos.



# Asignación de Asientos

## API para Reservar Asientos

## Descripcion

La función ReservaAsientos se encarga de realizar la reserva de un asiento para una función específica en una base de datos MongoDB. La función realiza las siguientes operaciones:

    1.Conexión a la Base de Datos: Abre una conexión a la base de datos.

    2.Validación de la Función: Busca la función correspondiente en la colección de funciones. 
    Si no se encuentra, lanza un error.

    3.Validación del Asiento: Busca el asiento en la colección de asientos para el lugar especificado. Si no se encuentra, lanza un error.

    4.Verificación de Reserva Existente: Comprueba si el asiento ya está reservado para la función especificada. Si ya está reservado, lanza un error.

    5.Creación de Nueva Boleta: Crea un documento de boleta con la información de la reserva y lo inserta en la colección de boletas.

    6.Actualización del Estado del Asiento: Cambia el estado del asiento a "Reservado" en la colección de asientos.

    7.Retorno de Resultado: Devuelve un mensaje de éxito junto con el ID de la boleta insertada.

    8.Manejo de Errores: Captura y muestra cualquier error que ocurra durante el proceso.

    9.Cierre de Conexión: Cierra la conexión a la base de datos.

### este es la consulta para que pueda verficar mas rápido la nueva boleta 
```javascript
db.Boleta.find({ _id: ObjectId("66d4ce37067e7dde801d032d") }, {})
```
### esta es la consulta para verficar el estado del asiento mas rapodamente por el id 
```javascript	
db.asiento.find({_id:ObjectId("66d079643170ffb8c89f4bd0")},{})
```
### Ejemplo de uso 
```javascript
const asientos = new Asientos();
const idFuncion = '646a0c4f1b0f3b5d16c58222';
const idLugar = 102;
const idAsiento = '66d079643170ffb8c89f4bd0';
const usuarioId = '66d078803170ffb8c89f4bc1';

asientos.ReservaAsientos(idFuncion, idLugar, idAsiento, usuarioId)
    .then(res => {
        console.log(res.mensaje, 'ID de la boleta:', res.boleta);
    })
    .catch(err => {
        console.error('Error al reservar asiento:', err);
    });
```

### Funcionalidad
La función ReservaAsientos permite a los usuarios reservar un asiento para una función específica. Asegura que el asiento no esté ya reservado y actualiza el estado del asiento y la base de datos con la nueva reserva. Proporciona retroalimentación sobre el éxito de la operación y maneja errores adecuadamente.

### Párametros 
idFuncion:

    Tipo: string
    Descripción: El ID de la función para la cual se desea reservar el asiento. Se utiliza para identificar la función en la colección de funciones.

idLugar:

    Tipo: number
    Descripción: El ID del lugar donde se encuentra el asiento. Se utiliza para identificar la ubicación del asiento en la colección de asientos.

idAsiento:

    Tipo: string
    Descripción: El ID del asiento que se desea reservar. Se utiliza para identificar el asiento en la colección de asientos.

usuarioId:

    Tipo: string
    Descripción: El ID del usuario que realiza la reserva. Se utiliza para asociar la reserva con un usuario específico en la colección de boletas.

## API para Cancelar Reserva de Asientos

### Descripcion
La función CancelarReserva se encarga de cancelar una reserva de asiento en una función específica. La función realiza las siguientes operaciones:

    1. Conexión a la Base de Datos: Abre una conexión a la base de datos.
    Verificación de Reserva Existente: Busca la reserva en la colección de boletas. Si no se encuentra, lanza un error.
    2. Eliminación de la Reserva: Elimina el documento de boleta de la colección de boletas.
    3. Actualización del Estado del Asiento: Cambia el estado del asiento a "Disponible" en la colección de asientos.
    4. Retorno de Resultado: Devuelve un mensaje de éxito junto con el ID de la boleta cancelada.
    5. Manejo de Errores: Captura y muestra cualquier error que ocurra durante el proceso.
    6. Cierre de Conexión: Cierra la conexión a la base de datos.
### Ejemplo de uso 
```javascript	
const asientos = new Asientos();
const idFuncion = '646a0c4f1b0f3b5d16c58222';
const idLugar = 102;
const idAsiento = '66d079643170ffb8c89f4bd0';
const usuarioId = '66d078803170ffb8c89f4bc1';

asientos.CancelarReserva(idFuncion, idAsiento, usuarioId)
    .then(res => {
        console.log(res.mensaje, 'ID de la boleta cancelada:', res.boleta);
    })
    .catch(err => {
        console.error('Error al cancelar la reserva:', err);
    });

```

### Funcionalidad
La función CancelarReserva permite a los usuarios cancelar una reserva de asiento existente para una función específica. Asegura que la reserva se elimine correctamente y que el asiento se marque como disponible nuevamente. Proporciona retroalimentación sobre el éxito de la operación y maneja errores adecuadamente.

### Párametros 
idFuncion:

    Tipo: string
    Descripción: El ID de la función para la cual se realizó la reserva.

idAsiento:

    Tipo: string
    Descripción: El ID del asiento cuya reserva se desea cancelar.

usuarioId:

    Tipo: string
    Descripción: El ID del usuario que realizó la reserva.