import express from "express";
import {acceptConnection,getConnectionRequests,getConnectionStatus,getUsersConnections,rejectConnection,sendConnection,} from "../controllers/connection.controllers.js";
import isAuth from "../middlewares/isAuth.js";

let connectionRouter = express.Router();

connectionRouter.post("/send/:id", isAuth, sendConnection);
connectionRouter.put("/accept/:connectionId", isAuth, acceptConnection);
connectionRouter.put("/reject/:connectionId", isAuth, rejectConnection);
connectionRouter.get("/status/:id", isAuth, getConnectionStatus);
connectionRouter.delete("/remove/:connectionId",isAuth,rejectConnection);
connectionRouter.get("/requests",isAuth,getConnectionRequests);
connectionRouter.get("/",isAuth,getUsersConnections);


export default connectionRouter;
