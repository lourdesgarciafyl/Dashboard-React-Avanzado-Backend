import validationResults from "./validationResults";
import { check } from "express-validator";

const validateCategory = [
    check(`categoryName`)
    .notEmpty()
    .withMessage("El nombre de la categoria es obligatoria")
    .isString()
    .isLength({min:2, max:20})
    .withMessage("El nombre de la categoría debe contener entre 2 y 20 caracteres"),
    check(`status`)
    .notEmpty()
    .withMessage("El estado es un dato obligatorio")
    .isIn(["Activo","Inactivo"])
    .withMessage("Debe elegir una opción válida"),

    (req, res, next) => {validationResults(req, res, next)}
]

export default validateCategory; 