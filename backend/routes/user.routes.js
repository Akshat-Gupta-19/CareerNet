import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { getCurrentUser, getProfile, updateProfile } from '../controllers/user.controllers.js';
import upload from '../middlewares/multer.js'

let userRouter = express.Router();

userRouter.get("/currentUser",isAuth,getCurrentUser);
userRouter.put("/updateProfile",isAuth,upload.fields([
    {name : "profileImage",maxCount:1},
    {name : "coverImage",maxCount:1}
]),updateProfile);
userRouter.get("/profile/:username",isAuth,getProfile);
export default userRouter;