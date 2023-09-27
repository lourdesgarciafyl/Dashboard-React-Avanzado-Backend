import validationResults from './validationResults';
import { check } from 'express-validator';

export const validateUser = [
  check(`firstname`)
    .notEmpty()
    .withMessage('El nombre del usuario es obligatorio')
    .isString()
    .isLength({ min: 3, max: 30 })
    .withMessage('El nombre del usuario debe contener entre 3 y 30 caracteres'),

  check(`lastname`)
    .notEmpty()
    .withMessage('El Apellido  del usuario es obligatorio')
    .isString()
    .isLength({ min: 3, max: 40 })
    .withMessage(
      'El apellido del usuario debe contener entre 5 y 40 caracteres'
    ),

  check(`email`)
    .notEmpty()
    .withMessage('El e-mail es un dato obligatorio')
    .matches(/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/)
    .withMessage('El e-mail debe cumplir con el formato juan@correo.com')
    .isLength({ min: 5, max: 60 })
    .withMessage('El e-mail debe contener entre 5 y 60 caracteres'),

  check(`password`)
    .notEmpty()
    .withMessage('El password es obligatorio')
    .isString()
    .matches(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,}$/)
    .withMessage(
      'La contraseña debe tener como mìnimo 8 caracteres , al menos un número, una minúscula, una mayúscula y no contener caracteres especiales.'
    )
    .isLength({ min: 8 })
    .withMessage('El password debe contener 8 o màs caracteres'),

  check(`status`)
    .notEmpty()
    .withMessage('El estado es un dato obligatorio')
    .isIn(['Activo', 'Inactivo'])
    .withMessage('Debe elegir una opción válida'),

  check(`role`)
    .notEmpty()
    .withMessage('El rol del usuario es un dato obligatorio')
    .isIn(['Administrador', 'Cliente'])
    .withMessage('Debe elegir una opción válida'),

  (req, res, next) => {
    validationResults(req, res, next);
  },
];

export const validateLogin = [
  check('email', 'El email es obligatorio').isEmail(),
  check('password')
    .notEmpty()
    .withMessage('El password es obligatorio.')
    .matches(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/)
    .withMessage(
      'La contraseña debe tener entre 8 y 16 caracteres, al menos un número, una minúscula, una mayúscula y no contener caracteres especiales. - password'
    ),
  (req, res, next) => {
    validationResults(req, res, next);
  },
];

export const validateRegister = [
  check(`firstname`)
    .notEmpty()
    .withMessage('El nombre del usuario es obligatorio')
    .isString()
    .isLength({ min: 3, max: 30 })
    .withMessage('El nombre del usuario debe contener entre 3 y 30 caracteres'),

  check(`lastname`)
    .notEmpty()
    .withMessage('El Apellido  del usuario es obligatorio')
    .isString()
    .isLength({ min: 3, max: 40 })
    .withMessage(
      'El apellido del usuario debe contener entre 5 y 40 caracteres'
    ),

  check(`email`)
    .notEmpty()
    .withMessage('El e-mail es un dato obligatorio')
    .matches(/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/)
    .withMessage('El e-mail debe cumplir con el formato juan@correo.com')
    .isLength({ min: 5, max: 60 })
    .withMessage('El e-mail debe contener entre 5 y 60 caracteres'),

  check(`password`)
    .notEmpty()
    .withMessage('El password es obligatorio')
    .isString()
    .matches(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,}$/)
    .withMessage(
      'La contraseña debe tener como mìnimo 8 caracteres , al menos un número, una minúscula, una mayúscula y no contener caracteres especiales.'
    )
    .isLength({ min: 8 })
    .withMessage('El password debe contener 8 o màs caracteres'),

  (req, res, next) => {
    validationResults(req, res, next);
  },
];
