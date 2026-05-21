import { Router, type IRouter } from "express";
import healthRouter from "./health";
import categoriesRouter from "./categories";
import projectsRouter from "./projects";
import imagesRouter from "./images";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(categoriesRouter);
router.use(projectsRouter);
router.use(imagesRouter);
router.use(adminRouter);

export default router;
