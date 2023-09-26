import { Router } from "express";
import validateProduct from "../helpers/validateProduct";
import {activarProducto, consultaProductosPorCategoria, crearProducto, desactivarProducto, editarProducto, obtenerListaProductos, obtenerProducto, borrarProducto, obtenerProductosActivos, createProduct, getListProducts, getActiveProducts, getProduct, deleteProduct, editProduct, consultProductsByCategory, getProductsByCategory, activateProduct, desactivateProduct } from "../controllers/productos.controllers";
import validateJWT from "../helpers/validateToken";


const router = Router();
router.route("/").post([validateJWT, validateProduct], createProduct).get(getListProducts)
router.route("/actives").get(getActiveProducts)
router.route("/:id").get(getProduct).delete(validateJWT, deleteProduct).put([validateJWT, validateProduct], editProduct)
router.route("/category/:category").get(getProductsByCategory)
router.route("/activate/:id").put(validateJWT, activateProduct)
router.route("/desactivate/:id").put(validateJWT, desactivateProduct)

export default router;