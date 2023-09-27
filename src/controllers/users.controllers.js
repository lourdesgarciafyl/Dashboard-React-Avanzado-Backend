//import envioEmail from '../helpers/envioEmailRegistrarse';
import generarJWT from '../helpers/tokenLogin';
import User from '../models/user';
import bcrypt from 'bcrypt';

export const createUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(req.files);
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        mensaje: 'ya existe un usuario con el correo enviado',
      });
    }
    user = new User(req.body);
    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(password, salt);

    await user.save();
    res.status(201).json({
      mensaje: 'usuario creado',
      firstname: user.firstname,
      uid: user._id,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: 'El usuario no se creó',
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    const { firstname, role } = user;
    if (!user) {
      return res.status(400).json({
        mensaje: 'Email o password no válido - email',
      });
    }
    if (user.status !== 'Activo') {
      return res.status(400).json({
        mensaje: 'El usuario no se encuentra activo - estado',
      });
    }

    const passwordValid = bcrypt.compareSync(password, user.password);
    if (!passwordValid) {
      return res.status(400).json({
        mensaje: 'Email o password no válido - password',
      });
    }
    const token = await generarJWT({ firstname, role });

    res.status(200).json({
      mensaje: 'El usuario es correcto',
      firstname: user.firstname,
      _id: user._id,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(404).json({
      mensaje: 'Usuario o Password incorrecto',
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        mensaje: 'El usuario no fue encontrado.',
      });
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      mensaje: 'Usuario eliminado exitosamente.',
    });
  } catch (error) {
    res.status(400).json({
      mensaje: 'No se pudo eliminar el usuario.',
    });
  }
};

export const editUser = async (req, res) => {
  try {
    const { email, firstname, lastname, status, role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        mensaje: 'El usuario no fue encontrado.',
      });
    }
    user.email = email;
    user.firstname = firstname;
    user.lastname = lastname;
    user.status = status;
    user.role = role;
    await user.save();
    res.status(200).json({
      mensaje: 'Usuario actualizado exitosamente.',
    });
  } catch (error) {
    res.status(400).json({
      mensaje: 'No se pudo actualizar el usuario correctamente.',
    });
  }
};

export const getListUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({
      mensaje: 'Error. No se pudo obtener la lista de usuarios',
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({
      mensaje: 'Error. No se pudo obtener el usuario',
    });
  }
};

export const registerClient = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        mensaje: 'El email ya se encuentra registrado.',
      });
    }
    user = new User(req.body);
    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(password, salt);
    user.firstname = firstname;
    user.lastname = lastname;
    user.role = 'Cliente';
    user.status = 'Activo';
    await user.save();
    res.status(201).json({
      mensaje: 'Usuario registrado',
      firstname,
      role: user.role,
      uid: user._id,
    });
    // envioEmail(usuario.nombreUsuario, usuario.email);
  } catch (error) {
    res.status(400).json({
      mensaje: 'El usuario no pudo ser registrado.',
    });
  }
};

export const changePassword = async (req, res) => {
  const idUsuario = req.params.id;
  const { password } = req.body;
  try {
    const user = await User.findById(idUsuario);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    if (password) {
      const salt = bcrypt.genSaltSync(10);
      user.password = bcrypt.hashSync(password, salt);
    }
    await user.save();
    res.status(200).json({
      mensaje: 'La contraseña se cambió correctamente.',
    });
  } catch (error) {
    res.status(400).json({
      mensaje: 'La contraseña no se pudo cambiar.',
    });
  }
};

export const revalidateToken = async (req, response) => {
  const { firstname, role } = req.body;
  const token = await generarJWT({ firstname, role });

  response.status(200).json({
    status: 'success',
    msg: 'Token generado correctamente!',
    res: {
      firstname,
      role,
      token,
    },
  });
};
