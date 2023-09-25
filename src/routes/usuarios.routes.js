import { Router } from "express";
import {validarLogin, validarRegistro, validarUsuario} from "../helpers/validarUsuario";
import {borrarUsuario, cambiarPassword, crearUsuario, editarUsuario, loginUsuario, obtenerListaUsuarios, obtenerUsuario, registroCliente, revalidarToken} from "../controllers/usuarios.controllers";
import validarJWT from "../helpers/tokenVerificacion";

const router = Router();
router.route("/").get(validarJWT, obtenerListaUsuarios)
router.route("/registrocliente").post(validarRegistro, registroCliente)
router.route("/login").post(validarLogin,loginUsuario)
router.route("/revalidartoken").get(validarJWT, revalidarToken)
router.route("/nuevo").post([validarJWT, validarUsuario], crearUsuario)
router.route("/:id").delete(validarJWT, borrarUsuario).put(validarJWT, editarUsuario).get(validarJWT, obtenerUsuario)
router.route("/nuevopassword/:id").put(validarJWT, cambiarPassword)

export default router;