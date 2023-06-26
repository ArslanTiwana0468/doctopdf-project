import Express from "express";
import convertionRoutes from "./convertion.ts/convertionRoutes";
const route = Express.Router();

route.use("/", convertionRoutes);

export default route;
