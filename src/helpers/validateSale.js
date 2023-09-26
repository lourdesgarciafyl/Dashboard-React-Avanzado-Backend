import validationResults from "./validationResults";
import { check } from "express-validator";

const validateSale = [
    check("user")
    .notEmpty()
    .withMessage("El usuario es un dato obligatorio"),
    check("saleDate")
    .notEmpty()
    .withMessage("La fecha es un dato obligatorio."),
    check("products")
    .notEmpty()
    .withMessage("Debe ingresar productos al pedido.")
    .isArray(),
    check("status")
    .notEmpty()
    .withMessage("El estado es un dato obligatorio")
    .isIn(["Cancelada","Realizada"])
    .withMessage("Debe elegir una opción válida"),
    check("totalPrice")
    .notEmpty()
    .withMessage("El precio total es un dato obligatorio")
    .isNumeric()
    .custom((value) => {
        if(value >= 0 && value <= 5000000){
            return true;
        } else {
            throw new Error("El precio debe entre $0 y $5000000")
        }
    }),
   
    (req, res, next) => {validationResults(req, res, next)}
]

export default validateSale;
