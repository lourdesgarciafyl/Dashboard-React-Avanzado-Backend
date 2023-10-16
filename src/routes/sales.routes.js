import { Router } from "express";
import validateSale from "../helpers/validateSale";
import {
  cancelSale,
  createSale,
  deleteSale,
  getListSales,
  getSale,
  getSalesPerDay,
} from "../controllers/sales.controllers";
import validateJWT from "../helpers/validateToken";

const router = Router();
router.route("/").post(validateSale, createSale).get(validateJWT, getListSales);
router.route("/:id").get(validateJWT, getSale).delete(validateJWT, deleteSale);
router.route("/cancelsale/:id").put(validateJWT, cancelSale);
router.route("/filteredSales/:day").get(getSalesPerDay);

export default router;
