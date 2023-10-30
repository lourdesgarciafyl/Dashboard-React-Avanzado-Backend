import validationResults from "./validationResults";
import { check } from "express-validator";

const validateNotification = [
    check(`title`)
    .notEmpty()
    .withMessage("El titulo es obligatorio")
    .isString()
    .isLength({min:2, max:20})
    .withMessage("El titulo de la Notificacion debe contener entre 2 y 20 caracteres"),
    check(`description`)
    .notEmpty()
    .withMessage("La Descripcion es obligatorio")
    .isString()
    .isLength({min:2, max:20})
    .withMessage("La Descripcion de la Notificacion debe contener entre 2 y 20 caracteres"),
    check(`isUnRead`)
    .notEmpty()
    .withMessage("El estado de la Notificacion es obligatorio"),

    (req, res, next) => {validationResults(req, res, next)}
]

export default validateNotification; 
