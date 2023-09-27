import { Router } from "express";
import {validateLogin, validateRegister, validateUser} from "../helpers/validateUser";
import {changePassword, createUser, deleteUser, editUser, getListUsers, getUser, loginUser, registerClient, revalidateToken} from "../controllers/users.controllers";
import validateJWT from "../helpers/validateToken";

const router = Router();
router.route("/").get(validateJWT, getListUsers)
router.route("/registerclient").post(validateRegister, registerClient)
router.route("/login").post(validateLogin,loginUser)
router.route("/revalidatetoken").get(validateJWT, revalidateToken)
router.route("/new").post([validateJWT, validateUser], createUser)
router.route("/:id").delete(validateJWT, deleteUser).put(validateJWT, editUser).get(validateJWT, getUser)
router.route("/newpassword/:id").put(validateJWT, changePassword)

export default router;