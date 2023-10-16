import validationResults from "./validationResults";
import { check } from "express-validator";

const validateSale = [
    check("user")
    .notEmpty()
    .withMessage("El usuario es un dato obligatorio"),
    check("saleDate")
    .notEmpty()
    .withMessage("La fecha es un dato obligatorio."),
    check("cartProducts")
    .notEmpty()
    .withMessage("Debe ingresar productos al pedido.")
    .isArray(),
    check('cartProducts.*.productName')
    .notEmpty()
    .withMessage("El nombre del producto es obligatorio")
    .isString()
    .isLength({min: 3, max:50})
    .withMessage("El nombre del producto debe contener entre 3 y 50 caracteres"),
    check('cartProducts.*.price')
    .notEmpty()
    .withMessage("El preico del producto es obligatorio")
    .isNumeric()
    .withMessage("Debe ingresar un valor numerico")
    .custom((value) =>{
        if(value >= 0 && value <= 100000){
            return true;
        }else{
            throw new Error("El precio debe entre $0 y $100000")
        }
    }),
    check('cartProducts.*.quantity')
    .isInt({ min: 1 })
    .withMessage('El campo "cantidad" debe ser un número entero positivo'),
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
