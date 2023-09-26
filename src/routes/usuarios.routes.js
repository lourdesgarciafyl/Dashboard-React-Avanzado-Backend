import { Router } from "express";
import {validarLogin, validarRegistro, validarUsuario} from "../helpers/validarUsuario";
import {borrarUsuario, cambiarPassword, crearUsuario, editarUsuario, loginUsuario, obtenerListaUsuarios, obtenerUsuario, registroCliente, revalidarToken} from "../controllers/usuarios.controllers";
import validateJWT from "../helpers/validateToken";

const router = Router();
router.route("/").get(validateJWT, obtenerListaUsuarios)
router.route("/registrocliente").post(validarRegistro, registroCliente)
router.route("/login").post(validarLogin,loginUsuario)
router.route("/revalidartoken").get(validateJWT, revalidarToken)
router.route("/nuevo").post([validateJWT, validarUsuario], crearUsuario)
router.route("/:id").delete(validateJWT, borrarUsuario).put(validateJWT, editarUsuario).get(validateJWT, obtenerUsuario)
router.route("/nuevopassword/:id").put(validateJWT, cambiarPassword)

export default router;