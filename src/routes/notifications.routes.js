import { Router } from 'express';
import { crearNotification, notificationList } from '../controllers/notification.Controller';
import validateNotification from '../helpers/validateNotification';
import validateJWT from '../helpers/validateToken';

const router = Router();
router.route('/notification').post([validateJWT,validateNotification],crearNotification);
router.route('/list').get(notificationList);

export default router;