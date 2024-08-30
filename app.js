const Pelicula = require ("./js/module/pelicula");
const { ObjectId } = require('mongodb')

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


let obj = new Pelicula();
obj.getSpecificMovies("66d0777d3170ffb8c89f4bb4")
    .then(res=>{
        console.log(res);
    })
    .catch(err=>{
        console.log(err);
    })