import Category from '../models/category';

export const createCategory = async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.status(201).json({
      msg: 'La categoria fue creada correctamente',
    });
  } catch (error) {
    res.status(404).json({
      errores: [{
        msg: 'Error. No se pudo crear la categoria'
      }]
    });
  }
};

export const getListCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(404).json({
      errores: [{
        msg: 'Error. No se pudo obtener la lista de categorias'
      }]
    });
  }
};

export const getListActiveCategories = async (req, res) => {
  try {
    const activeCategories = await Category.find({ status: 'Activo' });
    res.status(200).json(activeCategories);
  } catch (error) {
    res.status(404).json({
      errores: [{
        msg: 'Error. No se pudo obtener la lista de categorias en estado Activo.'
      }]
    });
  }
};
