import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { clearAllNotification, deleteNotification, getNotification } from '../controllers/notification.controllers.js';

const notificationRouter = express.Router();

notificationRouter.get("/get",isAuth,getNotification);
notificationRouter.delete("/delete/:id",isAuth,deleteNotification);
notificationRouter.delete("/clearAll",isAuth,clearAllNotification);

export default notificationRouter;