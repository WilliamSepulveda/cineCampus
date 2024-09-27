const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const User = require('../model/userModel.js');

const user = new User();

exports.createUser = async (req, res) => {
    try {
        
        let { codigo = 123456, nombre = 'william', apellido = 'sepulveda', nick, email, telefono = 311144688, password, rol = 'user standard' } = req.body;
  
        
        if (password) {
            password = await bcrypt.hash(password, 12);
        } else {
            password = null;
        }
  
        
        let userExist = await user.findExistUserName(nick);
        if (userExist.status === 200) {
            return res.status(400).json({ status: 400, message: 'El nombre de usuario ya está en uso.' });
        }
  
        
        let emailExist = await user.findExistEmail(email);
        if (emailExist.status === 200) {
            return res.status(400).json({ status: 400, message: 'El correo electrónico ya está registrado.' });
        }
  
        let resUser = await user.insertCollection({ codigo, nombre, apellido, nick, email, telefono, password, rol });
        if (resUser.status === 200) {
            return res.status(201).json({ status: 201, message: 'Usuario creado exitosamente.' });
        } else {
            return res.status(500).json({ status: 500, message: 'Error al crear el usuario.' });
        }
    } catch (error) {
        console.error('Error al crear el usuario:', error.message);
        let err = error.message ? JSON.parse(error.message) : { status: 500, message: 'Error interno del servidor.' };
        res.status(err.status || 500).json(err);
    }
};
  

exports.search = async (req, res) => {
  const { id } = req.query;  
  try {
    if (id) {
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const userId = new ObjectId(id);
      const result = await user.findAllCollection({ _id: userId });
      
      if (result.length === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      return res.status(200).json(result[0]);
    } else {
      const result = await user.findAllCollection({});
      return res.status(200).json(result);
    }
  } catch (error) {
    console.error('Error en la búsqueda de usuario:', error);
    return res.status(500).json({ message: 'Error al buscar el usuario', error: error.message });
  }
};

exports.save = async (req, res) => {
  try {
    const data = await user.insertCollection(req.body);
    res.status(201).json({ status: 201, data });       
  } catch (error) {
    console.error('Error al guardar el usuario:', error);
    let err = JSON.parse(error.message);
    return res.status(err.status || 500).json(err);
  }
};

exports.edit = async (req, res) => {
  const { id } = req.params; 
  try {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const updatedData = req.body;
    const result = await user.updateCollection(id, updatedData); 

    if (result.status === 200) {
      return res.status(200).json({ message: 'Usuario actualizado correctamente', data: result.data });
    } else {
      return res.status(result.status).json(result);
    }
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    return res.status(500).json({ message: 'Error al actualizar el usuario', error: error.message });
  }
};


exports.remove = async (req, res) => {
  const { id } = req.params; 
  try {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const result = await user.deleteByCollection(id);
    return res.status(result.status).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    return res.status(500).json({ message: 'Error al eliminar el usuario', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    let { email, password } = req.query;
    console.log('Datos recibidos:', { email, password });
    
    if (!email || !password) {
      return res.status(400).json({ status: 400, message: 'Faltan credenciales.' });
    }

    let resFindUser = await user.findOneUserByEmail(email);

    if (resFindUser.status === 404) {
      return res.status(resFindUser.status).json(resFindUser);
    }

    if (!resFindUser.data || !resFindUser.data.password) {
      return res.status(500).json({ status: 500, message: 'Error al recuperar la contraseña del usuario.' });
    }

    let resEmailAndPassword = await bcrypt.compare(password, resFindUser.data.password);
    if (!resEmailAndPassword) {
      return res.status(406).json({ status: 406, message: 'Contraseña inválida' });
    }
    resFindUser.data.password = resFindUser.data.password.replace(/[^\w\s]|_/g, '');
    delete resFindUser.data.password;

    res.cookie("token", JSON.stringify(resFindUser), { maxAge: 1800000 });

    res.status(200).json({
      status: 200,
      message: 'Inicio de sesión exitoso',
      redirectUrl: '/home_cine'
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error.message);
    res.status(500).json({ status: 500, message: 'Error interno del servidor.' });
  }
};
exports.findCookies = async (req, res) => {
  console.log(req.cookies.token); 
  res.json({ message: 'Cookie encontrada', token: req.cookies.token });
};