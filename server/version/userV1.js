const controllerProduct = require('../controller/userController.js')
const express = require('express'); 
const product = express();

product.post("/", express.json(), controllerProduct.createUser);
product.get("/", controllerProduct.login);
product.delete("/:id", controllerProduct.remove);
product.put("/:id", express.json(),controllerProduct.edit);


module.exports = product; 