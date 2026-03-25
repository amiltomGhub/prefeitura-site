import { Router, type IRouter } from "express";
import healthRouter from "./health";
import tenantRouter from "./tenant";
import noticiasRouter from "./noticias";
import servicosRouter from "./servicos";
import secretariasRouter from "./secretarias";
import transparenciaRouter from "./transparencia";
import licitacoesRouter from "./licitacoes";
import legislacaoRouter from "./legislacao";
import agendaRouter from "./agenda";
import galeriaRouter from "./galeria";
import concursosRouter from "./concursos";
import buscaRouter from "./busca";
import sicRouter from "./sic";

const router: IRouter = Router();

router.use(healthRouter);
router.use(tenantRouter);
router.use(noticiasRouter);
router.use(servicosRouter);
router.use(secretariasRouter);
router.use(transparenciaRouter);
router.use(licitacoesRouter);
router.use(legislacaoRouter);
router.use(agendaRouter);
router.use(galeriaRouter);
router.use(concursosRouter);
router.use(buscaRouter);
router.use(sicRouter);

export default router;
