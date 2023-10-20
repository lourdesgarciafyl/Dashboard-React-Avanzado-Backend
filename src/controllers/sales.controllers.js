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
    const monthEndDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

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

// Yearly Sales

export const getYearlySales = async (req, res) => {
  try {
    const date = new Date();
    const yearStartDate = new Date(date.getFullYear(), 0, 1);
    const yearEndDate = new Date(date.getFullYear(), 11, 31);

    const yearStartDateString = yearStartDate.toISOString().split("T")[0];
    const yearEndDateString = yearEndDate.toISOString().split("T")[0];

    const sales = await Sale.find(
      { saleDate: { $gte: yearStartDateString, $lte: yearEndDateString } },
      "id saleDate totalPrice"
    );

    const yearlySales = await Sale.aggregate([
      {
        $match: {
          saleDate: {
            $gte: yearStartDateString,
            $lte: yearEndDateString,
          },
        },
      },
      {
        $project: {
          saleMonth: {
            $toInt: { $substr: ["$saleDate", 5, 2] }, // Obtén el mes de la cadena
          },
          totalSalesPrice: "$totalPrice",
          totalSalesQuantity: 1,
        },
      },
      {
        $group: {
          _id: {
            saleMonth: "$saleMonth",
          },
          totalSalesPrice: { $sum: "$totalSalesPrice" },
          totalSalesQuantity: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          saleMonth: {
            $switch: {
              branches: [
                {
                  case: { $eq: ["$_id.saleMonth", 1] },
                  then: { monthName: "Enero", monthNumber: 1 },
                },
                {
                  case: { $eq: ["$_id.saleMonth", 2] },
                  then: { monthName: "Febrero", monthNumber: 2 },
                },
                {
                  case: { $eq: ["$_id.saleMonth", 3] },
                  then: { monthName: "Marzo", monthNumber: 3 },
                },
                {
                  case: { $eq: ["$_id.saleMonth", 4] },
                  then: { monthName: "Abril", monthNumber: 4 },
                },
                {
                  case: { $eq: ["$_id.saleMonth", 5] },
                  then: { monthName: "Mayo", monthNumber: 5 },
                },
                {
                  case: { $eq: ["$_id.saleMonth", 6] },
                  then: { monthName: "Junio", monthNumber: 6 },
                },
                {
                  case: { $eq: ["$_id.saleMonth", 7] },
                  then: { monthName: "Julio", monthNumber: 7 },
                },
                {
                  case: { $eq: ["$_id.saleMonth", 8] },
                  then: { monthName: "Agosto", monthNumber: 8 },
                },
                {
                  case: { $eq: ["$_id.saleMonth", 9] },
                  then: { monthName: "Septiembre", monthNumber: 9 },
                },
                {
                  case: { $eq: ["$_id.saleMonth", 10] },
                  then: { monthName: "Octubre", monthNumber: 10 },
                },
                {
                  case: { $eq: ["$_id.saleMonth", 11] },
                  then: { monthName: "Noviembre", monthNumber: 11 },
                },
                {
                  case: { $eq: ["$_id.saleMonth", 12] },
                  then: { monthName: "Diciembre", monthNumber: 12 },
                },
              ],
              default: "Desconocido",
            },
          },
          totalSalesPrice: 1,
          totalSalesQuantity: 1,
        },
      },
      {
        $sort: { "saleMonth.monthNumber": 1 },
      },
    ]);

    const totalSales = {
      currentDate,
      yearlySales,
      totalYearSalesQuantity: sales.length,
      totalYearSalesPrice:
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
          msg: "Error al intentar listar las ventas del año.",
        },
      ],
    });
  }
};

export const getSalesByProduct = async (req, res) => {
  try {
    const mostSoldProducts = await Sale.aggregate([
      {
        $unwind: "$cartProducts",
      },
      {
        $group: {
          _id: "$cartProducts.productName",
          totalQuantity: {
            $sum: "$cartProducts.quantity",
          },
          totalPrice: {
            $sum: "$cartProducts.price",
          },
        },
      },
      {
        $sort: {
          totalQuantity: -1,
        },
      },
      {
        $project: {
          _id: 0,
          productName: "$_id",
          totalQuantity: 1,
          totalPrice: 1,
        },
      },
    ]);

    res.status(200).json(mostSoldProducts);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      errores: [
        {
          msg: "Error al intentar listar los productos más vendidos.",
        },
      ],
    });
  }
};

export const getSalesByCategory = async (req, res) => {
  try {
    const mostSoldProductsByCategory = await Sale.aggregate([
      {
        $unwind: "$cartProducts",
      },
      {
        $lookup: {
          from: "products",
          localField: "cartProducts._id",
          foreignField: "_id",
          as: "cartProducts.productInfo",
        },
      },
      {
        $unwind: "$cartProducts.productInfo",
      },
      {
        $group: {
          _id: "$cartProducts.productInfo.category",
          totalQuantity: { $sum: "$cartProducts.quantity" },
          totalPrice: { $sum: "$cartProducts.price" },
        },
      },
      {
        $sort: { totalQuantity: -1 },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalQuantity: 1,
          totalPrice: 1,
        },
      },
    ]);
    res.status(200).json(mostSoldProductsByCategory);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      errores: [
        {
          msg: "Error al intentar listar los productos más vendidos según categoría.",
        },
      ],
    });
  }
};
