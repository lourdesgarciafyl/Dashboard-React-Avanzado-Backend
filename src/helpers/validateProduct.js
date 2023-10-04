import validationResults from "./validationResults";
import { check } from "express-validator";

const validateProduct = [
    check(`productName`)
    .notEmpty()
    .withMessage("El nombre del producto es obligatorio")
    .isString()
    .isLength({min: 3, max:50})
    .withMessage("El nombre del producto debe contener entre 3 y 50 caracteres"),
    check(`price`)
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
    // check(`image`)
    // .notEmpty()
    // .withMessage("La imagen es un dato obligatorio")
    // .matches(/^(http(s?):)([/|.|\w|\s|-])*\.(?:png|jpe?g|gif|svg)$/)
    // .withMessage("Debe ingresar un link terminado en jpg, jpeg, gif o png"),
    check(`detail`)
    .notEmpty()
    .withMessage("El detalle del producto es obligatorio")
    .isString()
    .isLength({min: 5, max:500})
    .withMessage("El detalle del producto debe contener entre 5 y 500 caracteres"),
    check(`status`)
    .notEmpty()
    .withMessage("El estado es un dato obligatorio")
    .isIn(["Activo","Inactivo"])
    .withMessage("Debe elegir una opción válida"),
    check(`category`)
    .notEmpty()
    .withMessage("La categoría es un dato obligatorio")
    .isIn(["Remera", "Buzo", "Campera", "Shorts", "Zapatillas", "Jogging", "Tops", "Otro"])
    .withMessage("Debe elegir una opción válida"),

    (req, res, next) => {validationResults(req, res, next)}
]

export default validateProduct;