import { Router } from "express";
import validarPedido from "../helpers/validarPedido";
import { borrarPedido, crearPedido, entregarPedido, obtenerListaPedidos, obtenerPedido, pedidoEnProceso } from "../controllers/pedidos.controllers";
import validateJWT from "../helpers/validateToken";

const router = Router();
router.route("/").post(validarPedido, crearPedido).get(validateJWT,obtenerListaPedidos)
router.route("/:id").get(validateJWT,obtenerPedido).delete(validateJWT,borrarPedido)
router.route("/enproceso/:id").put(validateJWT,pedidoEnProceso)
router.route("/entregado/:id").put(validateJWT,entregarPedido)

export default router