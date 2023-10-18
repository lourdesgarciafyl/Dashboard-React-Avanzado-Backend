import Product from "../models/product";
import Sale from "../models/sale";
import User from "../models/user";

export const createSale = async (req, res) => {
  try {
    const { user, cartProducts } = req.body;
    const userSearched = await User.findById(user);
    if (!userSearched) {
      return res.status(404).json({
        errores: [
          {
            msg: "Usuario no encontrado.",
          },
        ],
      });
    }
    // caso de que el array products venga vacío
    if (cartProducts.length === 0) {
      return res.status(400).json({
        errores: [
          {
            msg: "No hay productos en el carrito.",
          },
        ],
      });
    }

    //Verificar el stock de cada producto y realizar la venta.
    const promisesStock = cartProducts.map(async (item) => {
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
        msg: "La venta fue creada correctamente.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      errores: [
        {
          msg: "Error. No se pudo realizar la venta.",
        },
      ],
    });
  }
};

export const getListSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate({
        path: "cartProducts._id",
        select: "-__v",
      })
      .populate({
        path: "user",
        select: "-_id -password -status -rol -__v",
      });
    res.status(200).json(sales);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      errores: [
        {
          msg: "Error al intentar listar las ventas.",
        },
      ],
    });
  }
};

export const getSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate({
        path: "cartProducts.product",
        select: "-_id -__v",
      })
      .populate({
        path: "user",
        select: "-_id -password -status -rol -__v",
      });
    res.status(200).json(sale);
  } catch (error) {
    res.status(400).json({
      errores: [
        {
          msg: "Error, no se pudo obtener el pedido.",
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
      return res.status(404).json({ error: "Venta no encontrada" });
    }
    if (sale.status === "Cancelada") {
      return res.status(404).json({ error: "La venta ya se canceló." });
    }

    //Verificar el stock de cada producto y realizar la venta.
    const promisesStock = sale.cartProducts.map(async (item) => {
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
      sale.status = "Cancelada";
      await sale.save();
      res.status(200).json({
        msg: "La venta se canceló.",
      });
    }
  } catch (error) {
    res.status(400).json({
      errores: [
        {
          msg: "Error, no se pudo cancelar la venta.",
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
            msg: "La venta no fue encontrada.",
          },
        ],
      });
    }
    await Sale.findByIdAndDelete(req.params.id);
    res.status(200).json({
      msg: "Venta eliminada exitosamente.",
    });
  } catch (error) {
    return res.status(400).json({
      errores: [
        {
          msg: "No se pudo eliminar la venta.",
        },
      ],
    });
  }
};

export const getSalesByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const sales = await Sale.find({ saleDate: date }, "id saleDate totalPrice");
    const totalSales = {
      searchedDate: date,
      totalSalesQuantity: sales.length,
      totalSalesPrice: sales
        .map((sale) => sale.totalPrice)
        .reduce((a, b) => a + b),
    };
    res.status(200).json(totalSales);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      errores: [
        {
          msg: "Error al intentar listar las ventas por día.",
        },
      ],
    });
  }
};

// Format date

const date = new Date();
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, "0");
const day = String(date.getDate()).padStart(2, "0");
const currentDate = `${year}-${month}-${day}`;

// Daily sales

export const getDailySales = async (req, res) => {
  try {
    const sales = await Sale.find(
      { saleDate: currentDate },
      "id saleDate totalPrice"
    );
    const totalSales = {
      currentDate,
      totalDailySalesQuantity: sales.length,
      totalDailySalesPrice:
        sales.length > 0
          ? sales.map((sale) => sale.totalPrice).reduce((a, b) => a + b)
          : 0,
    };
    res.status(200).json(totalSales);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      errores: [
        {
          msg: "Error al intentar listar las ventas del día.",
        },
      ],
    });
  }
};

// Weekly Sales

export const getWeeklySales = async (req, res) => {
  try {
    const weekStartDate = new Date(currentDate);
    weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay());
    weekStartDate.setHours(0, 0, 0, 0);

    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekStartDate.getDate() + 6);
    weekEndDate.setHours(23, 59, 59, 999);

    const weekStartDateString = weekStartDate.toISOString().split("T")[0];
    const weekEndDateString = weekEndDate.toISOString().split("T")[0];

    const sales = await Sale.find(
      { saleDate: { $gte: weekStartDateString, $lte: weekEndDateString } },
      "id saleDate totalPrice"
    );

    const dailySales = await Sale.aggregate([
      {
        $match: {
          saleDate: {
            $gte: weekStartDateString,
            $lte: weekEndDateString,
          },
        },
      },
      {
        $group: {
          _id: "$saleDate",
          totalSalesPrice: { $sum: "$totalPrice" },
          totalSalesQuantity: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          saleDate: "$_id",
          totalSalesPrice: 1,
          totalSalesQuantity: 1,
        },
      },
      {
        $sort: { saleDate: 1 },
      },
    ]);

    const totalSales = {
      currentDate,
      dailySales,
      weekStartDate: weekStartDateString,
      weekEndDate: weekEndDateString,
      totalWeeklySalesQuantity: sales.length,
      totalWeeklySalesPrice:
        sales.length > 0
          ? sales.map((sale) => sale.totalPrice).reduce((a, b) => a + b)
          : 0,
    };

    res.status(200).json(totalSales);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      errores: [
        {
          msg: "Error al intentar listar las ventas de la semana.",
        },
      ],
    });
  }
};

// Monthly Sales

export const getMonthlySales = async (req, res) => {
  try {
    const date = new Date();
    const monthStartDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEndDate = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const monthStartDateString = monthStartDate.toISOString().split("T")[0];
    const monthEndDateString = monthEndDate.toISOString().split("T")[0];

    const sales = await Sale.find(
      { saleDate: { $gte: monthStartDateString, $lte: monthEndDateString } },
      "id saleDate totalPrice"
    );

    const monthlySales = await Sale.aggregate([
      {
        $match: {
          saleDate: {
            $gte: monthStartDateString,
            $lte: monthEndDateString,
          },
        },
      },
      {
        $group: {
          _id: "$saleDate",
          totalSalesPrice: { $sum: "$totalPrice" },
          totalSalesQuantity: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          saleDate: "$_id",
          totalSalesPrice: 1,
          totalSalesQuantity: 1,
        },
      },
      {
        $sort: { saleDate: 1 },
      },
    ]);

    const totalSales = {
      currentDate,
      monthlySales,
      monthStartDate: monthStartDateString,
      monthEndDate: monthEndDateString,
      totalMonthlySalesQuantity: sales.length,
      totalMonthlySalesPrice:
        sales.length > 0
          ? sales.map((sale) => sale.totalPrice).reduce((a, b) => a + b)
          : 0,
    };

    res.status(200).json(totalSales);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      errores: [
        {
          msg: "Error al intentar listar las ventas del mes.",
        },
      ],
    });
  }
};
