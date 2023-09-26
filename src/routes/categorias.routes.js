import { Router } from 'express';
import { crearCategoria, obtenerListaCategorias, obtenerListaCategoriasActivas } from '../controllers/categorias.controllers';
import validarCategoria from '../helpers/validarCategoria';
import validateJWT from '../helpers/validateToken';

const router = Router();
router.route('/').post([validateJWT,validarCategoria],crearCategoria).get(obtenerListaCategorias);
router.route('/activas').get(obtenerListaCategoriasActivas);

export default router;
