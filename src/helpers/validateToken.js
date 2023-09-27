import jwt from "jsonwebtoken";

const validateJWT = (req, res, next) => {
  const token = req.header("x-token");
  if (!token) {
    return res.status(401).json({
      errores: [{
        msg: 'No hay token en la peticion'
      }]
    });
  }
  try {
    const payload = jwt.verify(token, process.env.SECRET_JWT);
    req.usuario = payload.usuario;
  } catch (error) {
    return res.status(401).json({
      errores: [{
        msg: 'El token no es valido'
      }]
    });
  }
  next();
};

export default validateJWT;
