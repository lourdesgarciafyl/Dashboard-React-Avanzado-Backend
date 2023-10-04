import { Router } from "express";
import validateProduct from "../helpers/validateProduct";
import {createProduct, getListProducts, getActiveProducts, getProduct, deleteProduct, editProduct, getProductsByCategory, activateProduct, desactivateProduct, getStockProduct } from "../controllers/products.controllers";
import validateJWT from "../helpers/validateToken";


const router = Router();
router.route("/").post([validateJWT, validateProduct], createProduct).get(getListProducts)
router.route("/actives").get(getActiveProducts)
router.route("/:id").get(getProduct).delete(validateJWT, deleteProduct).put([validateJWT, validateProduct], editProduct)
router.route("/category/:category").get(getProductsByCategory)
router.route("/activate/:id").put(validateJWT, activateProduct)
router.route("/desactivate/:id").put(validateJWT, desactivateProduct)
router.route("/stock/:id").get(getStockProduct)

export default router;