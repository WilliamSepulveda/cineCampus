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

# Descuentos y Tarjetas VIP

## API para Aplicar Descuentos


### Descripcion
El método BuyBoletasDescuento es un método asincrónico que gestiona la compra de una boleta aplicando un descuento si corresponde. La función realiza las siguientes acciones:

    Abrir la conexión a la base de datos: Usa el método open para asegurarse de que la conexión a la base de datos está establecida.

    Acceder a las colecciones: Obtiene referencias a las colecciones Boletas y Movimientos en la base de datos.

    Buscar la boleta: Utiliza findOne para buscar la boleta en la colección Boletas por su _id. Si la boleta no está disponible (es decir, no está en estado 'Disponible'), lanza un error.

    Determinar el descuento: Asume que el usuario es VIP (esto se debería obtener de manera dinámica en un caso real). Calcula el precio final aplicando un descuento basado en el tipo de usuario.

    Actualizar el estado de la boleta: Cambia el estado de la boleta a 'no Disponible' en la colección Boletas.

    Registrar el movimiento: Crea un documento de movimiento en la colección Movimientos con información sobre la compra, incluyendo el precio final.

    Devolver resultados: Devuelve un objeto que contiene la boleta actualizada y el movimiento registrado si la actualización y la inserción son exitosas.

    Manejo de errores: Captura y muestra errores que puedan ocurrir durante el proceso de compra.

    Cerrar la conexión: Finalmente, cierra la conexión a la base de datos en el bloque finally, asegurando que la conexión se cierre sin importar si la operación fue exitosa o si ocurrió un error.
### Ejemplo de uso 
```javascript
const idBoleta = "66d07cde3170ffb8c89f4bd9"; 
const tipoMovimiento = {
    id: 2,
    nombre: "compra"
};
const newBoletas = new Boletas();
newBoletas.BuyBoletasDescuento(idBoleta, tipoMovimiento)
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
Compra de Boleta: Permite comprar una boleta si está disponible, actualizando su estado y registrando la compra.
Aplicación de Descuento: Aplica un descuento al precio de la boleta si el usuario es VIP.
Registro de Movimiento: Inserta un registro de la transacción en la colección Movimientos para fines de seguimiento o contabilidad.

### Párametros 
idBoleta:

    Tipo: string
    Descripción: El identificador único de la boleta que se desea comprar. Se usa para buscar la boleta en la base de datos.

tipoMovimiento:

    Tipo: string
    Descripción: El tipo de movimiento que se registra en la colección Movimientos. Puede ser, por ejemplo, 'compra' o 'vent

## API para Verificar Tarjeta VIP

### Descripcion

### Ejemplo de uso 
```javascript
const idBoleta = "66d07cde3170ffb8c89f4bd9";
const usuarioId = "66d078803170ffb8c89f4bc4"; 
const tipoMovimiento = {
    id: 2,
    nombre: "compra"
};

const newBoletas = new Boletas();

newBoletas.verificacionUsuario(idBoleta, usuarioId, tipoMovimiento)
    .then(res => {
        console.log("Operación completada.");
        console.log("Detalles de la boleta:", res.boleta);
        console.log("Tipo de movimiento:", res.movimiento);
    })
    .catch(err => {
        console.error("Error en la operación:", err);
    });
```
### Descripción del Código

El método verificacionUsuario se encarga de realizar la compra de una boleta, verificando si el usuario tiene una tarjeta VIP válida para aplicar un descuento. El método sigue los siguientes pasos:

    Abrir la conexión a la base de datos: Usa el método open para asegurarse de que la conexión a la base de datos está establecida.

    Buscar la boleta: Busca la boleta en la colección Boletas utilizando el ID proporcionado. Si la boleta no está disponible (es decir, no está en estado 'Disponible'), lanza un error.

    Verificar tarjeta VIP: Llama a verificarTarjetaVIP para determinar si el usuario tiene una tarjeta VIP válida.

    Calcular el precio final: Usa el método aplicarDescuento para calcular el precio final de la boleta después de aplicar un descuento si el usuario tiene una tarjeta VIP válida.

    Actualizar el estado de la boleta: Cambia el estado de la boleta a 'no Disponible' en la colección Boletas.

    Registrar el movimiento: Crea un documento de movimiento en la colección Movimientos con la información de la compra, incluyendo el precio final.

    Devolver resultados: Devuelve un objeto que contiene la boleta actualizada y el movimiento registrado si la actualización y la inserción son exitosas.

    Manejo de errores: Captura y muestra errores que puedan ocurrir durante el proceso de compra.

    Cerrar la conexión: Finalmente, cierra la conexión a la base de datos en el bloque finally, asegurando que la conexión se cierre sin importar si la operación fue exitosa o si ocurrió un error.

## Funcionalidad

    Compra de Boleta: Permite comprar una boleta si está disponible, actualizando su estado y registrando la compra.

    Verificación de Tarjeta VIP: Verifica si el usuario tiene una tarjeta VIP válida para aplicar un descuento en la boleta.

    Aplicación de Descuento: Calcula el precio final de la boleta después de aplicar un descuento basado en la validez de la tarjeta VIP.
    
    Registro de Movimiento: Inserta un registro de la transacción en la colección Movimientos para fines de seguimiento o contabilidad.

### Parámetros

    idBoleta:
        Tipo: string
        Descripción: El identificador único de la boleta que se desea comprar. Se usa para buscar la boleta en la base de datos.

    usuarioId:
        Tipo: string
        Descripción: El identificador único del usuario que está realizando la compra. Se usa para verificar la validez de la tarjeta VIP del usuario.

    tipoMovimiento:
        Tipo: string
        Descripción: El tipo de movimiento que se registra en la colección Movimientos. Puede ser, por ejemplo, 'compra' o 'venta'.

### Métodos Auxiliares verificarTarjetaVIP

    Descripción: Verifica si un usuario tiene una tarjeta VIP válida.
    Parámetros:

        usuarioId: Identificador del usuario cuyo estado de tarjeta VIP se desea verificar.

    Retorno: Devuelve true si el usuario tiene una tarjeta VIP, de lo contrario false.

    Manejo de Errores: Captura errores que puedan ocurrir durante la consulta.

### aplicarDescuento

    Descripción: Calcula el precio con descuento si la tarjeta VIP del usuario es válida.
    Parámetros:

        precioOriginal: El precio original de la boleta.
        tarjetaVIPValida: Booleano que indica si la tarjeta VIP del usuario es válida.

    Retorno: El precio con descuento si la tarjeta VIP es válida, o el precio original si no lo es.

    Lógica: Aplica un descuento del 20% si la tarjeta VIP es válida.

### Detalles Adicionales

    precioOriginal: El precio de la boleta antes de aplicar cualquier descuento. Se asume un valor predeterminado de 100 si no se encuentra un precio específico en la boleta.

    precioFinal: El precio final de la boleta después de aplicar el descuento basado en la validez de la tarjeta VIP.



# Compras en Línea

## API para Procesar Pagos

### Descripcion
La función BuyBoletas realiza el proceso de compra de una boleta, que incluye la verificación de disponibilidad, el procesamiento del pago, la actualización del estado de la boleta y el asiento, y el registro de un movimiento en la base de datos. Además, maneja el cierre de la conexión con la base de datos y captura errores que puedan ocurrir durante el proceso.

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
        console.log("Detalles del pago:", res.pago);
    })
    .catch(err => {
        console.error("Error en la operación:", err);
    });
```
### Funcionalidad
Abrir Conexión: La función comienza abriendo una conexión con la base de datos.

Colecciones: Se obtienen referencias a las colecciones Boletas, Movimientos, y Asientos de la base de datos.

Verificar Disponibilidad de la Boleta: Se busca la boleta por su idBoleta. Si la boleta no está disponible o no existe, se lanza un error.

Procesar Pago: Se llama al método procesarPago para procesar el pago de la boleta. Si el pago falla, se lanza un error.

Actualizar Estado de la Boleta: Si el pago es exitoso, se actualiza el estado de la boleta a "no Disponible".

Actualizar Estado del Asiento (si aplica): Si la boleta tiene un id_asiento, se actualiza el estado del asiento correspondiente a "no Disponible". Si no se encuentra el asiento, se lanza un error.

Registrar Movimiento: Se inserta un nuevo registro en la colección de movimientos con la información relevante de la transacción.

Detalles del Pago: Se crea un objeto con detalles del pago que incluye el ID de transacción, el estado del pago, el método de pago, el monto y la fecha.

Devolver Resultado: Se devuelven los detalles de la boleta actualizada, el tipo de movimiento y los detalles del pago.

Manejo de Errores y Cierre de Conexión: En caso de error, se captura y se lanza nuevamente. Finalmente, se cierra la conexión con la base de datos.

### Párametros 

idBoleta: Identificador único de la boleta que se desea comprar. Se usa para buscar la boleta en la colección Boletas.

tipoMovimiento: Tipo de movimiento que se registrará en la colección Movimientos. Puede representar el tipo de transacción realizada, como una compra.


## API para Confirmación de Compra

## Ejecute este comando para instalar nodemailer que facilita el envío de correos electrónicos a los usuarios.
```javascript
npm install nodemailer
```
### Descripción 
Este código define dos métodos asíncronos en una clase. Uno es procesarPago, que simula el procesamiento de un pago, y el otro es BuyBoletasConfirmacionUsuario, que maneja el proceso de compra de una boleta y registra la confirmación de la compra en la base de datos.

procesarPago(monto):
    Simula el procesamiento de un pago en línea.
    Utiliza una promesa que se resuelve después de un segundo, simulando un proceso de pago exitoso.

BuyBoletasConfirmacionUsuario(idBoleta, tipoMovimiento, usuarioId):
    Maneja la compra de una boleta, actualiza el estado de la boleta y el asiento, y registra la confirmación de la compra en la base de datos.
    Incluye la verificación de disponibilidad de la boleta, el procesamiento del pago, la actualización del estado de la boleta y el asiento, y la inserción de registros en las colecciones correspondientes.



### Ejemplo de uso 
```javascript
const idBoleta = "66d07cde3170ffb8c89f4bd9";
const usuarioId = "66d078803170ffb8c89f4bc0";
const tipoMovimiento = {
    id: 2,
    nombre: "compra"
};
// Crear una instancia de la clase Boletas
const boletas = new Boletas();
boletas.BuyBoletasConfirmacionUsuario(idBoleta, tipoMovimiento, usuarioId)
    .then(res => {
        console.log("Operación completada.");
        console.log("Detalles de la boleta:", res.boleta);
        console.log("Tipo de movimiento:", res.movimiento);
        console.log("Detalles del pago:", res.pago);
        console.log("Datos de usuario", res.usuario);

        // Confirmación enviada al usuario
        console.log("Confirmación de compra enviada al usuario.");
    })
    .catch(err => {
        console.error("Error en la operación:", err);
    });
```
### Funcionalidad
procesarPago:

Simula el procesamiento del pago y siempre retorna true después de un segundo.

BuyBoletasConfirmacionUsuario:

Abrir conexión: Abre la conexión con la base de datos.

Obtener Colecciones: Obtiene referencias a las colecciones Boletas, Movimientos, Asientos, Confirmaciones, y Usuarios.

Buscar Boleta: Busca la boleta en la colección Boletas.

Verificar Disponibilidad: Verifica si la boleta está disponible.

Procesar Pago: Llama a procesarPago para procesar el pago de la boleta.

Actualizar Estado de la Boleta: Actualiza el estado de la boleta a "no Disponible".

Actualizar Estado del Asiento: Si la boleta tiene un id_asiento, actualiza el estado del asiento a "no Disponible".

Registrar Movimiento: Inserta un registro de movimiento en la colección Movimientos.

Obtener Datos del Usuario: Obtiene los datos del usuario que realiza la compra.

Registrar Confirmación: Inserta un registro de confirmación en la colección Confirmaciones.

Devolver Resultado: Devuelve un objeto con los detalles de la boleta, el tipo de movimiento, los detalles del pago y los datos del usuario.

Manejo de Errores: Captura y lanza errores si ocurren durante el proceso.

Cerrar Conexión: Asegura que la conexión a la base de datos se cierre al final del proceso
### Párametros 
procesarPago(monto):

monto: El monto del pago que se está procesando. Este parámetro se utiliza para simular el procesamiento del pago.

BuyBoletasConfirmacionUsuario(idBoleta, tipoMovimiento, usuarioId):

idBoleta: El identificador de la boleta que se desea comprar. Utilizado para buscar la boleta en la colección.

tipoMovimiento: El tipo de movimiento que se registrará en la colección de movimientos. Representa el tipo de transacción realizada.

usuarioId: El identificador del usuario que realiza la compra. Se utiliza para registrar el movimiento y obtener los datos del usuario en la colección Usuarios.

### Resultado esperado 

```javascript
Datos de usuario {
  _id: new ObjectId('66d078803170ffb8c89f4bc0'),
  nombre: 'Juan',
  apellido: 'Pérez',
  nick: 'juanito',
  email: 'juan.perez@example.com',
  telefono: [ '1234567890', '0987654321' ],
  tipos_de_categoria: [ 'Regular' ]
}
Confirmación de compra enviada al usuario.
```

