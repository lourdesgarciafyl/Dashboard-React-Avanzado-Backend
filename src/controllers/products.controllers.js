import Product from "../models/product";
import Notifications from "../models/Notifications";
import { uploadImage, deleteImage } from "../helpers/cloudinary";
import fs from "fs-extra";

export const createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    //importo socketsio
    //const io = req.app.get('socketio');

    if (req.files !== null && req.files !== undefined) {
      const result = await uploadImage(req.files.image.tempFilePath);
      newProduct.image = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };

      await fs.unlink(req.files.image.tempFilePath);
    }

    await newProduct.save();
    //guardo en Mongo  y envio notificacion de producto creado
    let newNotification = new Notifications({});
    newNotification.title = newProduct.productName;
    newNotification.description = newProduct.price;
    newNotification.avatar = '/assets/images/avatars/add.png';
    newNotification.type = 'add';
    newNotification.createdAt = new Date();
    newNotification.isUnRead = true;
    await newNotification.save();
    
    io.emit("Notificacion-New", "Notificacion-New");

    res.status(201).json({
      msg: "El producto fue creado correctamente",
      product: newProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      errores: [
        {
          msg: "Error. No se pudo crear el producto",
        },
      ],
    });
  }
};

export const getListProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({
      errores: [
        {
          msg: "Error. No se pudo obtener la lista de productos",
        },
      ],
    });
  }
};

export const editProduct = async (req, res) => {
  try {
    //importo socketsio
    const io = req.app.get('socketio');
    await Product.findByIdAndUpdate(req.params.id, req.body);

    //guardo en Mongo  y envio notificacion de producto edit
    let newNotification = new Notifications({});
    newNotification.title = req.body.productName;
    newNotification.description = req.body.price;
    newNotification.avatar = '/assets/images/avatars/pen.png';
    newNotification.type = 'pen';
    newNotification.createdAt = new Date();
    newNotification.isUnRead = true;
    await newNotification.save();
    
    io.emit("Notificacion-New", "Notificacion-New")

    res.status(200).json({
      msg: "El producto fue editado correctamente.",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        errores: [
          {
            msg: "Este nombre de producto ya existe. Intente con otro.",
          },
        ],
      });
    }
    res.status(400).json({
      errores: [
        {
          msg: "Error, no se pudo editar el producto.",
        },
      ],
    });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({
      errores: [
        {
          msg: "Error, no se pudo obtener el producto.",
        },
      ],
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    //importo socketsio
    const io = req.app.get('socketio');
    const deleProduct = await Product.findById(req.params.id);

    //guardo en Mongo  y envio notificacion de producto delete
    let newNotification = new Notifications({});
    newNotification.title = deleProduct.productName;
    newNotification.description = deleProduct.price;
    newNotification.avatar = '/assets/images/avatars/delete.png';
    newNotification.type = 'delete';
    newNotification.createdAt = new Date();
    newNotification.isUnRead = true;
    await newNotification.save();
    
    io.emit("Notificacion-New", "Notificacion-New")

    const product = await Product.findByIdAndDelete(req.params.id);
    await deleteImage(product.image.public_id);
    res.status(200).json({
      msg: "El producto fue eliminado correctamente",
    });
  } catch (error) {
    res.status(400).json({
      errores: [
        {
          msg: "Error, el producto no se pudo borrar",
        },
      ],
    });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const product = await Product.find({
      category: req.params.category,
      status: "Activo",
    });
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({
      errores: [
        {
          msg: "Error al intentar obtener el/los producto/s por categoría y en estado activos",
        },
      ],
    });
  }
};

export const activateProduct = async (req, res) => {
  const idProduct = req.params.id;
  try {
    const product = await Product.findById(idProduct);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    if (product.status === "Activo") {
      return res.status(404).json({
        errores: [
          {
            msg: "El producto ya se encuentra activo",
          },
        ],
      });
    }
    product.status = "Activo";
    await product.save();
    res.status(200).json({
      msg: "Se activó el producto correctamente.",
    });
  } catch (error) {
    res.status(404).json({
      errores: [
        {
          msg: "Error, no se pudo activar el producto.",
        },
      ],
    });
  }
};

export const desactivateProduct = async (req, res) => {
  const idProduct = req.params.id;
  try {
    const product = await Product.findById(idProduct);
    if (!product) {
      return res.status(404).json({
        errores: [
          {
            msg: "Producto no encontrado",
          },
        ],
      });
    }
    if (product.status === "Inactivo") {
      return res.status(404).json({
        errores: [
          {
            msg: "El producto ya se encuentra inactivo.",
          },
        ],
      });
    }
    product.status = "Inactivo";
    await product.save();
    res.status(200).json({
      msg: "Se desactivó el producto correctamente.",
    });
  } catch (error) {
    res.status(404).json({
      errores: [
        {
          msg: "Error, no se pudo desactivar el producto.",
        },
      ],
    });
  }
};

export const getActiveProducts = async (req, res) => {
  try {
    const activeProducts = await Product.find({ status: "Activo" });
    res.status(200).json(activeProducts);
  } catch (error) {
    res.status(404).json({
      errores: [
        {
          msg: "Error. No se pudo obtener la lista de productos en estado Activo.",
        },
      ],
    });
  }
};

export const getStockProduct = async (req, res) => {
  const idProduct = req.params.id;
  try {
    const stockProduct = await Product.findById(idProduct);
    if (!stockProduct) {
      return res.status(404).json({
        errores: [
          {
            msg: "Producto no encontrado",
          },
        ],
      });
    }
    res
      .status(200)
      .json({ msg: `El stock del producto es:`, stock: stockProduct.stock });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      errores: [
        {
          msg: "Error. No se pudo obtener el stock del producto.",
        },
      ],
    });
  }
};
