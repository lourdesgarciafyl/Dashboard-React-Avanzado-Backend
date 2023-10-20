import { Router } from "express";
import validateSale from "../helpers/validateSale";
import {
  cancelSale,
  createSale,
  deleteSale,
  getDailySales,
  getListSales,
  getMonthlySales,
  getSale,
  getSalesByCategory,
  getSalesByProduct,
  getWeeklySales,
  getYearlySales,
} from "../controllers/sales.controllers";
import validateJWT from "../helpers/validateToken";

const router = Router();
router.route("/").post(validateSale, createSale).get(validateJWT, getListSales);
router.route("/:id").get(validateJWT, getSale).delete(validateJWT, deleteSale);
router.route("/cancelsale/:id").put(validateJWT, cancelSale);
router.route("/filter/dailySales").get(validateJWT, getDailySales);
router.route("/filter/weeklySales").get(validateJWT, getWeeklySales);
router.route("/filter/monthlySales").get(validateJWT, getMonthlySales);
router.route("/filter/yearlySales").get(validateJWT, getYearlySales);
router.route("/filter/byProduct").get(validateJWT, getSalesByProduct);
router.route("/filter/byCategory").get(validateJWT, getSalesByCategory);

export default router;
