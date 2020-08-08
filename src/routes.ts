import express from "express";
import classController from "./controller/classController";
import ConnectionsController from "./controller/ConnectionsController";

const classControllers = new classController();
const ConnectionsControllers = new ConnectionsController();

const routes = express.Router();

//Classes
routes.get("/classes", classControllers.index);
routes.post("/classes", classControllers.create);

//Connections
routes.get("/connections", ConnectionsControllers.index);
routes.post("/connections", ConnectionsControllers.create);


export default routes;