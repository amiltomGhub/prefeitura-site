import { Router, type IRouter } from "express";
import contrachequeRouter from "./contracheques";
import feriasRouter from "./ferias";
import requerimentosRouter from "./requerimentos";
import perfilRouter from "./perfil";

const router: IRouter = Router();

router.use(contrachequeRouter);
router.use(feriasRouter);
router.use(requerimentosRouter);
router.use(perfilRouter);

export default router;
