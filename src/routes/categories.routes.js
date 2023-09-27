import { Router } from 'express';
import { createCategory, getListActiveCategories, getListCategories, obtenerListaCategorias, obtenerListaCategoriasActivas } from '../controllers/categorias.controllers';
import validateCategory from '../helpers/validateCategory';
import validateJWT from '../helpers/validateToken';

const router = Router();
router.route('/').post([validateJWT,validateCategory],createCategory).get(getListCategories);
router.route('/actives').get(getListActiveCategories);

export default router;
