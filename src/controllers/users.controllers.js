//import envioEmail from '../helpers/envioEmailRegistrarse';
import { deleteImage, uploadImage } from '../helpers/cloudinary';
import fs from 'fs-extra';
import generarJWT from '../helpers/tokenLogin';
import User from '../models/user';
import bcrypt from 'bcrypt';
import Product from '../models/product';

export const createUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        msg: 'ya existe un usuario con el correo enviado',
      });
    }
    user = new User(req.body);

    if (req.files !== null && req.files !== undefined) {
      const result = await uploadImage(req.files.image.tempFilePath);
      user.avatar = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };

      await fs.unlink(req.files.image.tempFilePath);
    }
    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(password, salt);

    await user.save();
    res.status(201).json({
      msg: 'usuario creado',
      firstname: user.firstname,
      uid: user._id,
    });
  } catch (error) {
    res.status(400).json({
      errores: [
        {
          msg: 'El usuario no se creó',
        },
      ],
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    console.log('user', user);
    const { _id, firstname, lastname, role } = user;
    if (!user) {
      return res.status(400).json({
        errores: [
          {
            msg: 'Email o password no válido - email',
          },
        ],
      });
    }
    if (user.status !== 'Activo') {
      return res.status(400).json({
        errores: [
          {
            msg: 'El usuario no se encuentra activo - estado',
          },
        ],
      });
    }

    const passwordValid = bcrypt.compareSync(password, user.password);
    if (!passwordValid) {
      return res.status(400).json({
        errores: [
          {
            msg: 'Email o password no válido - password',
          },
        ],
      });
    }
    const token = await generarJWT({ _id, firstname, lastname, role });

    res.status(200).json({
      //msg: 'El usuario es correcto',
      firstname: user.firstname,
      lastname: user.lastname,
      id: user._id,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(400).json({
      errores: [
        {
          msg: 'Usuario o Password incorrecto',
        },
      ],
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json({
        errores: [
          {
            msg: 'El usuario no fue encontrado.',
          },
        ],
      });
    }
    await User.findByIdAndDelete(req.params.id);
    await deleteImage(user.avatar.public_id);
    res.status(200).json({
      msg: 'Usuario eliminado exitosamente.',
    });
  } catch (error) {
    res.status(400).json({
      errores: [
        {
          msg: 'No se pudo eliminar el usuario.',
        },
      ],
    });
  }
};

export const editUser = async (req, res) => {
  try {
    const { email, firstname, lastname, status, role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json({
        errores: [
          {
            msg: 'El usuario no fue encontrado.',
          },
        ],
      });
    }
    user.email = email;
    user.firstname = firstname;
    user.lastname = lastname;
    user.status = status;
    user.role = role;
    await user.save();
    res.status(200).json({
      msg: 'Usuario actualizado exitosamente.',
    });
  } catch (error) {
    res.status(400).json({
      errores: [
        {
          msg: 'No se pudo actualizar el usuario correctamente.',
        },
      ],
    });
  }
};

export const getListUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({
      errores: [
        {
          msg: 'Error. No se pudo obtener la lista de usuarios',
        },
      ],
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({
      errores: [
        {
          msg: 'Error. No se pudo obtener el usuario',
        },
      ],
    });
  }
};

export const registerClient = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        errores: [
          {
            msg: 'El email ya se encuentra registrado.',
          },
        ],
      });
    }
    user = new User(req.body);
    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(password, salt);
    user.firstname = firstname;
    user.lastname = lastname;
    user.role = 'Cliente';
    user.status = 'Activo';
    user.avatar.public_id = null;
    user.avatar.secure_url = null;
    await user.save();
    res.status(201).json({
      msg: 'Usuario registrado',
      firstname,
      role: user.role,
      uid: user._id,
    });
    // envioEmail(usuario.nombreUsuario, usuario.email);
  } catch (error) {
    res.status(400).json({
      errores: [
        {
          msg: 'El usuario no pudo ser registrado',
        },
      ],
    });
  }
};

export const changePassword = async (req, res) => {
  const idUser = req.params.id;
  const { password } = req.body;
  try {
    const user = await User.findById(idUser);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    if (password) {
      const salt = bcrypt.genSaltSync(10);
      user.password = bcrypt.hashSync(password, salt);
    }
    await user.save();
    res.status(200).json({
      msg: 'La contraseña se cambió correctamente.',
    });
  } catch (error) {
    res.status(400).json({
      errores: [
        {
          msg: 'La contraseña no se pudo cambiar.',
        },
      ],
    });
  }
};

export const revalidateToken = async (req, response) => {
  const { _id, firstname, lastname, role } = req.user;

  const token = await generarJWT({ _id, firstname, lastname, role });

  response.status(200).json({
    status: 'success',
    msg: 'Token generado correctamente!',
    res: {
      id: _id,
      firstname,
      lastname,
      role,
      token,
    },
  });
};

export const addProductToCart = async (req, res) => {
  try {
    const { idUser, newProduct } = req.body;
    const user = await User.findById(idUser);
    if (!user) {
      return res.status(400).json({
        errores: [
          {
            msg: 'Usuario no encontrado.',
          },
        ],
      });
    }
    const stockProduct = await Product.findById(newProduct._id);
    if (!stockProduct || stockProduct.stock < newProduct.quantity) {
      return res.status(404).json({
        errores: [
          {
            msg: 'Stock insuficiente',
          },
        ],
      });
    }
    const currentCart = user.cart || [];
    const existingProduct = currentCart.some(
      (product) => product._id === newProduct._id
    );
    if (!!existingProduct) {
      const changedCart = currentCart.map((prod) => {
        if (prod._id === newProduct._id) {
          return {
            _id: newProduct._id,
            productName: newProduct.productName,
            quantity: newProduct.quantity,
            price: newProduct.price,
          };
        }
        //Si el ID no coincide, devuelve el producto sin cambios
        return prod;
      });
      user.cart = changedCart;
    } else {
      currentCart.push(newProduct);
      user.cart = currentCart;
    }
    await user.save();
    res.status(200).json({
      msg: 'Producto agregado correctamente al carrito.',
    });
  } catch (error) {
    res.status(400).json({
      errores: [
        {
          msg: 'Error al agregar al carrito el producto.',
        },
      ],
    });
  }
};
