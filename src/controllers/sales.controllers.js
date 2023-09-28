import Product from '../models/product';
import Sale from '../models/sale';
import User from '../models/user';

export const createSale = async (req, res) => {
  try {
    const { user, products } = req.body;
    const userSearched = await User.findById(user);
    if (!userSearched) {
      return res.status(404).json({
        errores: [
          {
            msg: 'Usuario no encontrado.',
          },
        ],
      });
    }

    // if (userSearched.cart.length === 0) {
    //   return res.status(400).json({
    //     errores: [
    //       {
    //         msg: 'No hay productos en el carrito.',
    //       },
    //     ],
    //   });
    // }

    //Verificar el stock de cada producto y realizar la venta.
    const promisesStock = products.map(async (item) => {
      const { _id, quantity } = item;

      //Realizar una consulta para obtener el stock actual del producto.
      const product = await Product.findById(_id);

      //Calcula el nuevo Stock después de la venta
      const nuevoStock = product.stock - quantity;
      product.stock = nuevoStock;
      //Se guarda el producto con el stock actualizado
      await product.save();
    });

    const productsAddStock = Promise.all(promisesStock);
    //Espera que todas las promesas se resuelvan y envía la respuesta
    if (productsAddStock) {
      const newSale = new Sale(req.body);
      await newSale.save();
      userSearched.cart = [];
      await userSearched.save();
      res.status(201).json({
        msg: 'La venta fue creada correctamente.',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      errores: [
        {
          msg: 'Error. No se pudo realizar la venta.',
        },
      ],
    });
  }
};

export const getListSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate({
        path: 'products.product',
        select: '-_id -__v',
      })
      .populate({
        path: 'user',
        select: '-_id -password -status -rol -__v',
      });
    res.status(200).json(sales);
  } catch (error) {
    res.status(400).json({
      errores: [
        {
          msg: 'Error al intentar listar las ventas.',
        },
      ],
    });
  }
};

export const getSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate({
        path: 'products.product',
        select: '-_id -__v',
      })
      .populate({
        path: 'user',
        select: '-_id -password -status -rol -__v',
      });
    res.status(200).json(sale);
  } catch (error) {
    res.status(400).json({
      errores: [
        {
          msg: 'Error, no se pudo obtener el pedido.',
        },
      ],
    });
  }
};

export const cancelSale = async (req, res) => {
  const idSale = req.params.id;
  try {
    const sale = await Sale.findById(idSale);
    if (!sale) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }
    if (sale.status === 'Cancelada') {
      return res.status(404).json({ error: 'La venta ya se canceló.' });
    }

    //Verificar el stock de cada producto y realizar la venta.
    const promisesStock = sale.products.map(async (item) => {
      const { _id, quantity } = item;

      //Realizar una consulta para obtener el stock actual del producto.
      const product = await Product.findById(_id);

      //Calcula el nuevo Stock después de la venta
      const nuevoStock = product.stock + quantity;
      product.stock = nuevoStock;
      //Se guarda el producto con el stock actualizado
      await product.save();
    });

    const productsAddStock = Promise.all(promisesStock);
    //Espera que todas las promesas se resuelvan y envía la respuesta
    if (productsAddStock) {
      sale.status = 'Cancelada';
      await sale.save();
      res.status(200).json({
        msg: 'La venta se canceló.',
      });
    }
  } catch (error) {
    res.status(400).json({
      errores: [
        {
          msg: 'Error, no se pudo cancelar la venta.',
        },
      ],
    });
  }
};

export const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({
        errores: [
          {
            msg: 'La venta no fue encontrada.',
          },
        ],
      });
    }
    await Sale.findByIdAndDelete(req.params.id);
    res.status(200).json({
      msg: 'Venta eliminada exitosamente.',
    });
  } catch (error) {
    return res.status(400).json({
      errores: [
        {
          msg: 'No se pudo eliminar la venta.',
        },
      ],
    });
  }
};
