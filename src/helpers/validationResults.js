import { validationResult } from "express-validator";

const validationResults = (req, res, next)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
    return res.status(400).json({
    errores: errors.array()
    });
    };
    next()
}

export default validationResults;