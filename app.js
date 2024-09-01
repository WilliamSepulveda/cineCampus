const Pelicula = require ("./js/module/pelicula");
const asiento = require("./js/module/asiento");
const { ObjectId } = require('mongodb')
const Boletas = require('./js/module/boleta');
const Asientos = require("./js/module/asiento");

// // ejemplo listar todas la peliculas 
// let obj = new Pelicula();
// obj.getAllPelicula()
//     .then(res => {
//         console.log(res);
//     })
//     .catch(err => {
//         console.log(err);
//     });

// // listar las peliculas por id
// let obj = new Pelicula();
// obj.getSpecificMovies("66d0777d3170ffb8c89f4bb4")
//     .then(res=>{
//         console.log(res);
//     })
//     .catch(err=>{
//         console.log(err);
//     })

// // compra de boleta 
// const idBoleta = "66d07cde3170ffb8c89f4bd9"; 
// const tipoMovimiento = {
//     id: 2,
//     nombre: "compra"
// };

// const newBoletas = new Boletas();

// newBoletas.BuyBoletas(idBoleta, tipoMovimiento)
//     .then(res => {
//         console.log("Operación completada.");
//         console.log("Detalles de la boleta:", res.boleta);
//         console.log("Tipo de movimiento:", res.movimiento);
//     })
//     .catch(err => {
//         console.error("Error en la operación:", err);
//     });

// // consulta de disponibilidad de asientos
// const asientos = new Asientos();
// const idFuncion = '646a0c4f1b0f3b5d16c58222';
// const idLugar = 101;

// asientos.consultarDisponibilidad(idFuncion, idLugar)
//     .then(res => {
//         console.log('Disponibilidad de asientos:', res);
//     })
//     .catch(err => {
//         console.error('Error al consultar disponibilidad:', err);
//     });

// // reservar  asientos
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