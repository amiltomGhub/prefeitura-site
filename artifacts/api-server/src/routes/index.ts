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

// CMS routes
import cmsNoticiasRouter from "./cms/noticias";
import cmsBannersRouter from "./cms/banners";
import cmsPaginasRouter from "./cms/paginas";
import cmsDocumentosRouter from "./cms/documentos";
import cmsMenusRouter from "./cms/menus";
import cmsSiteConfigRouter from "./cms/site-config";
import cmsLicitacoesRouter from "./cms/licitacoes";
import cmsGaleriaRouter from "./cms/galeria";
import cmsAgendaRouter from "./cms/agenda";
import cmsLegislacaoRouter from "./cms/legislacao";

const router: IRouter = Router();

// ─── Public API ───────────────────────────────────────────────────────────────
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

// ─── CMS API (/cms/*) ─────────────────────────────────────────────────────────
router.use(cmsNoticiasRouter);
router.use(cmsBannersRouter);
router.use(cmsPaginasRouter);
router.use(cmsDocumentosRouter);
router.use(cmsMenusRouter);
router.use(cmsSiteConfigRouter);
router.use(cmsLicitacoesRouter);
router.use(cmsGaleriaRouter);
router.use(cmsAgendaRouter);
router.use(cmsLegislacaoRouter);

export default router;
