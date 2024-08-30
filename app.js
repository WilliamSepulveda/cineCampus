const Pelicula = require ("./js/module/pelicula");
const { ObjectId } = require('mongodb')
const Boletas = require('./js/module/boleta');

/**
 * ejemplo de uso para listar todas las peliculas
 */
// let obj = new Pelicula();
// obj.getAllPelicula()
//     .then(res => {
//         console.log(res);
//     })
//     .catch(err => {
//         console.log(err);
//     });


// let obj = new Pelicula();
// obj.getSpecificMovies("66d0777d3170ffb8c89f4bb4")
//     .then(res=>{
//         console.log(res);
//     })
//     .catch(err=>{
//         console.log(err);
//     })


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
