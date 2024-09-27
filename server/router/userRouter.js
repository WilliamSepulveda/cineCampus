const express = require('express');
const userController = require('../controller/userController');
const userV1 = require('../version/userV1'); 


const router = express.Router();

router.get('/', userController.login);
router.use('/v1', userV1);



module.exports = router;