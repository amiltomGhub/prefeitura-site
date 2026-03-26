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

// CMS routes (legacy /cms/*)
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

// Site public routes (/site/*)
import siteConfigRouter from "./site/config";
import siteBannersRouter from "./site/banners";
import siteNewsRouter from "./site/news";
import siteAgendaRouter from "./site/agenda";
import siteGalleryRouter from "./site/gallery";
import siteLegislationRouter from "./site/legislation";
import siteBidsRouter from "./site/bids";
import siteTransparencyRouter from "./site/transparency";
import siteSecretariasRouter from "./site/secretarias-pub";
import siteSearchRouter from "./site/search";
import sitePagesRouter from "./site/pages";

// Site admin routes (/site-admin/*)
import siteAdminNewsRouter from "./site-admin/news";
import siteAdminBannersRouter from "./site-admin/banners";
import siteAdminTransparencyRouter from "./site-admin/transparency";
import siteAdminBidsRouter from "./site-admin/bids";
import siteAdminAgendaRouter from "./site-admin/agenda";
import siteAdminConfigRouter from "./site-admin/config";

// Portal do Servidor (/servidor/*)
import servidorRouter from "./servidor/index";

// Painel RH (/rh/*)
import rhRouter from "./rh/index";

const router: IRouter = Router();

// ─── Health ───────────────────────────────────────────────────────────────────
router.use(healthRouter);

// ─── Public API (legacy) ──────────────────────────────────────────────────────
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

// ─── CMS API (/cms/*) — painel administrativo legado ─────────────────────────
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

// ─── Site Public API (/site/*) — rotas públicas do portal ────────────────────
router.use(siteConfigRouter);
router.use(siteBannersRouter);
router.use(siteNewsRouter);
router.use(siteAgendaRouter);
router.use(siteGalleryRouter);
router.use(siteLegislationRouter);
router.use(siteBidsRouter);
router.use(siteTransparencyRouter);
router.use(siteSecretariasRouter);
router.use(siteSearchRouter);
router.use(sitePagesRouter);

// ─── Site Admin API (/site-admin/*) — painel administrativo do site ───────────
router.use(siteAdminNewsRouter);
router.use(siteAdminBannersRouter);
router.use(siteAdminTransparencyRouter);
router.use(siteAdminBidsRouter);
router.use(siteAdminAgendaRouter);
router.use(siteAdminConfigRouter);

// ─── Portal do Servidor (/servidor/*) ────────────────────────────────────────
router.use(servidorRouter);

// ─── Painel RH (/rh/*) ───────────────────────────────────────────────────────
router.use(rhRouter);

export default router;
