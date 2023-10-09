import { Router } from "express";
import {validateLogin, validateRegister, validateUser} from "../helpers/validateUser";
import {activateUser, addProductToCart, changePassword, createUser, deleteUser, desactivateUser, editUser, getListUsers, getUser, loginUser, registerClient, revalidateToken} from "../controllers/users.controllers";
import validateJWT from "../helpers/validateToken";

const router = Router();
router.route("/").get(validateJWT, getListUsers)
router.route("/registerclient").post(validateRegister, registerClient)
router.route("/login").post(validateLogin,loginUser)
router.route("/revalidatetoken").get(validateJWT, revalidateToken)
router.route("/new").post([validateJWT, validateUser], createUser)
router.route("/:id").delete(validateJWT, deleteUser).put(validateJWT, editUser).get(validateJWT, getUser)
router.route("/activate/:id").put(validateJWT, activateUser)
router.route("/desactivate/:id").put(validateJWT, desactivateUser)
router.route("/newpassword/:id").put(validateJWT, changePassword)
router.route("/cart/add").put(validateJWT, addProductToCart)

export default router;