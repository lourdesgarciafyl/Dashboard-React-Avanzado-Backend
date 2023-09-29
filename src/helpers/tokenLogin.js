import jwt from 'jsonwebtoken';

const generarJWT = (user) => {
  return new Promise((resolve, reject) => {
    const payload = { user };
    jwt.sign(
      payload,
      process.env.SECRET_JWT,
      {
        expiresIn: '4h',
      },
      (err, token) => {
        if (err) {
          reject('No se pudo generar el token');
        }
        resolve(token);
      }
    );
  });
};

export default generarJWT;