import { json } from "express";
import Product from "../models/product";

export const createProduct = async (req, res) => {
    try{
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json({
            mensaje: "El producto fue creado correctamente"
        })
    }catch(error){
        res.status(404).json({
            mensaje: "Error. No se pudo crear el producto"
        })
    }
}

export const getListProducts = async (req, res) =>{
    try{
        const products = await Product.find();
        res.status(200).json(products);
    } catch(error){
        res.status(404).json({
            mensaje: "Error. No se pudo obtener la lista de productos"
        })
    }
}

export const editProduct = async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({
      mensaje: 'El producto fue editado correctamente.',
    });
  } catch (error) {
    if(error.code === 11000){
      return res.status(404).json({
        mensaje: 'Este nombre de producto ya existe. Intente con otro.',
      });
    }
    res.status(404).json({
      mensaje: 'Error, no se pudo editar el producto.',
    });
  }
};

export const getProduct = async (req, res) =>{
  try{
     const product = await Product.findById(req.params.id);
     res.status(200).json(product);
  }catch(error){
      res.status(404).json({
          mensaje: "Error, no se pudo obtener el producto."
      })
  }
}

export const deleteProduct = async (req, res) =>{
  try{
     await Product.findByIdAndDelete(req.params.id);
     res.status(200).json({
      mensaje: "El producto fue eliminado correctamente"
     })
  }catch(error){
      res.status(404).json({
          mensaje: "Error, el producto no se pudo borrar"
      })
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const product = await Product.find({category: req.params.category, status: "Activo"});
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({
      mensaje: 'Error al intentar obtener el/los producto/s por categoría y en estado activos',
    });
  }
};

export const activateProduct = async (req, res) => {
  const idProduct = req.params.id;
  try {
    const product = await Product.findById(idProduct);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    if (product.status === 'Activo') {
      return res
        .status(404)
        .json({ error: 'El producto ya se encuentra activo' });
    }
    product.status = 'Activo';
    await product.save();
    res.status(200).json({
      mensaje: 'Se activó el producto correctamente.',
    });
  } catch (error) {
    res.status(404).json({
      mensaje: 'Error, no se pudo activar el producto.',
    });
  }
};

export const desactivateProduct = async (req, res) => {
  const idProduct = req.params.id;
  try {
    const product = await Product.findById(idProduct);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    if (product.status === 'Inactivo') {
      return res
        .status(404)
        .json({ error: 'El producto ya se encuentra inactivo.' });
    }
    product.status = 'Inactivo';
    await product.save();
    res.status(200).json({
      mensaje: 'Se desactivó el producto correctamente.',
    });
  } catch (error) {
    res.status(404).json({
      mensaje: 'Error, no se pudo desactivar el producto.',
    });
  }
};

export const getActiveProducts = async (req, res) => {
  try {
    const activeProducts = await Product.find({ status: 'Activo' });
    res.status(200).json(activeProducts);
  } catch (error) {
    res.status(404).json({
      mensaje:
        'Error. No se pudo obtener la lista de productos en estado Activo.',
    });
  }
};
