import Product from '../models/product';

export const updateStockProduct = async (operation, product) => {
  try {
    const productSearched = await Product.findById(product._id);

    if (!productSearched) {
      return res.status(404).json({
        errores: [
          {
            msg: 'Producto no encontrado.',
          },
        ],
      });
    }

    switch (operation) {
      case 'add':
        productSearched.quality += product.quality;
      case 'sub':
        productSearched.quality -= product.quality;
      default:
        productSearched.quality = product.quality;
    }

    return productSearched;
  } catch (error) {
    console.log(error);
    res.status(400).json({
      errores: [
        {
          msg: 'No se pudo actualizar el stock del producto',
        },
      ],
    });
  }
};
