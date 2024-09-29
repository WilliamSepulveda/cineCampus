# CineCampusLands

## Descripción
*CineCampusLands* es una plataforma web para la gestión de reservas y compra de boletos de cine. Los usuarios pueden explorar las películas en estreno y próximas a estrenarse, seleccionar asientos, elegir fechas y horas, y comprar sus boletos de manera sencilla.

Este proyecto ha migrado recientemente de un frontend que utilizaba archivos estáticos a uno dinámico, conectando los datos directamente desde la base de datos.

## Cambios Recientes
En esta actualización, se ha realizado la transición del uso de archivos estáticos para el frontend a un sistema en el que los datos se obtienen directamente desde la base de datos MongoDB. Esto incluye:
- Carga dinámica de películas desde la base de datos.
- División de las películas en categorías: **En Estreno** y **Próximamente**.
- Implementación de la selección de asientos desde los datos de la base de datos.
- Asignación de precios y fechas por defecto en la selección de asientos.
- Actualización de los carruseles para mostrar datos dinámicos.
- Detalle de las películas mostrado en la página de selección de cine.

## Estructura del Proyecto
El proyecto se basa en Node.js, Express y MongoDB para la gestión del backend y los datos.

### Directorios Clave:
- **`/server/model`**: Contiene los modelos de MongoDB, como los de usuarios, películas y asientos.
- **`/server/router`**: Define las rutas para las operaciones del servidor.
- **`/server/controller`**: Lógica que gestiona las interacciones entre las rutas y los modelos.
- **`/src/storage`**: Contiene los recursos estáticos como CSS e imágenes.

### HTML Templates:
El proyecto utiliza plantillas HTML para la interfaz de usuario, incluyendo:
- `home_cine.html`: Página principal con el listado de películas.
- `cinema_selection.html`: Detalle de la película seleccionada y opciones de compra.
- `choose_seat.html`: Selección de asientos basada en los datos de la base de datos.
- `oder_summary.html`: Resumen de la orden antes de proceder al pago.
- `ticket.html`: Visualización del boleto generado.

## Configuración del Proyecto

### Requisitos Previos
- Node.js y npm instalados.
- MongoDB instalado y en funcionamiento.

### Instalación
1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/cinecampuslands.git

## Instala las dependencias:
    npm install

## Para ejecutar el proyecto localmente:

```node.js
npm run start
```

Luego accede a http://localhost:5500 en tu navegador.

# Funcionalidades

- Exploración de películas: Los usuarios pueden ver las películas actuales y próximas desde el home.

- Selección de Cine y Asientos: Permite seleccionar el cine, la fecha, la hora y los asientos disponibles.
- Resumen de Compra: Muestra el resumen de la compra antes de proceder con el pago.
- Generación de Boletos: Una vez realizada la compra, se genera un boleto con los detalles

# Tecnologías Utilizadas

- Node.js con Express para el backend.

- MongoDB para la gestión de datos.

- HTML5, CSS3 y JavaScript para el frontend.

- Mongoose para la interacción con MongoDB.

# Autor

- ### William Jair Sepulveda Carrillo - El Men