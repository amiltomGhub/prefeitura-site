--
-- PostgreSQL database dump
--

\restrict Olh3xDZCrC2eLftxI2gSdptPxlinWWcnSsF0ViaOhWbyMi0GhidanqRK2cPPVWj

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: agenda; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.agenda (
    id text NOT NULL,
    tenant_id text NOT NULL,
    titulo text NOT NULL,
    descricao text,
    data_inicio timestamp without time zone NOT NULL,
    data_fim timestamp without time zone,
    local text,
    categoria text,
    publico_alvo text,
    gratuito boolean DEFAULT true NOT NULL,
    link_inscricao text,
    ativo boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    tipo text DEFAULT 'evento'::text NOT NULL,
    endereco text,
    is_online boolean DEFAULT false NOT NULL,
    online_url text,
    dia_inteiro boolean DEFAULT false NOT NULL,
    secretaria_id text,
    is_publico boolean DEFAULT true NOT NULL,
    anexo_url text,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.agenda OWNER TO postgres;

--
-- Name: banners; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.banners (
    id text NOT NULL,
    tenant_id text NOT NULL,
    titulo text NOT NULL,
    subtitulo text,
    image_desktop_url text NOT NULL,
    image_mobile_url text,
    image_alt text NOT NULL,
    cta_label text,
    cta_url text,
    cta_abre_nova_aba boolean DEFAULT false NOT NULL,
    overlay_color text,
    overlay_opacity real DEFAULT 0.4 NOT NULL,
    is_ativo boolean DEFAULT true NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    inicia_em timestamp without time zone,
    expira_em timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.banners OWNER TO postgres;

--
-- Name: bid_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bid_events (
    id text NOT NULL,
    licitacao_id text NOT NULL,
    titulo text NOT NULL,
    descricao text,
    file_url text,
    ocorrido_em timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.bid_events OWNER TO postgres;

--
-- Name: concursos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.concursos (
    id text NOT NULL,
    tenant_id text NOT NULL,
    titulo text NOT NULL,
    descricao text,
    tipo text DEFAULT 'concurso-publico'::text NOT NULL,
    situacao text DEFAULT 'previsto'::text NOT NULL,
    numero_vagas integer,
    data_publicacao date NOT NULL,
    data_inscricao_inicio date,
    data_inscricao_fim date,
    link_edital text,
    link_inscricao text,
    organizadora text,
    remuneracao real,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.concursos OWNER TO postgres;

--
-- Name: contracts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contracts (
    id text NOT NULL,
    tenant_id text NOT NULL,
    licitacao_id text,
    numero text NOT NULL,
    objeto text NOT NULL,
    contratado text NOT NULL,
    cnpj_contratado text NOT NULL,
    valor real NOT NULL,
    data_inicio date NOT NULL,
    data_fim date NOT NULL,
    file_url text,
    ativo boolean DEFAULT true NOT NULL,
    fiscal_nome text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.contracts OWNER TO postgres;

--
-- Name: despesas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.despesas (
    id text NOT NULL,
    tenant_id text NOT NULL,
    data date NOT NULL,
    descricao text NOT NULL,
    secretaria text NOT NULL,
    categoria text NOT NULL,
    valor real NOT NULL,
    beneficiario text,
    empenho text,
    modalidade text,
    ano integer NOT NULL,
    mes integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.despesas OWNER TO postgres;

--
-- Name: galeria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.galeria (
    id text NOT NULL,
    tenant_id text NOT NULL,
    titulo text NOT NULL,
    descricao text,
    tipo text DEFAULT 'foto'::text NOT NULL,
    thumbnail text,
    url_video text,
    fotos jsonb DEFAULT '[]'::jsonb NOT NULL,
    data_publicacao timestamp without time zone DEFAULT now() NOT NULL,
    categoria text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.galeria OWNER TO postgres;

--
-- Name: gallery_albums; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gallery_albums (
    id text NOT NULL,
    tenant_id text NOT NULL,
    titulo text NOT NULL,
    descricao text,
    cover_url text,
    is_publico boolean DEFAULT true NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.gallery_albums OWNER TO postgres;

--
-- Name: gallery_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gallery_items (
    id text NOT NULL,
    album_id text NOT NULL,
    tipo text DEFAULT 'image'::text NOT NULL,
    url text NOT NULL,
    thumb_url text,
    alt_text text NOT NULL,
    legenda text,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.gallery_items OWNER TO postgres;

--
-- Name: gestores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gestores (
    id text NOT NULL,
    tenant_id text NOT NULL,
    nome text NOT NULL,
    cargo text NOT NULL,
    partido text,
    mandato text,
    foto text,
    bio text,
    email text,
    redes_sociais jsonb,
    ativo boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.gestores OWNER TO postgres;

--
-- Name: legislacao; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.legislacao (
    id text NOT NULL,
    tenant_id text NOT NULL,
    numero text NOT NULL,
    tipo text NOT NULL,
    ementa text NOT NULL,
    slug text NOT NULL,
    data_publicacao date NOT NULL,
    ano integer NOT NULL,
    conteudo text,
    arquivo_pdf text,
    tags text[] DEFAULT '{}'::text[] NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    nome_arquivo text,
    status text DEFAULT 'publicado'::text NOT NULL,
    visualizacoes integer DEFAULT 0 NOT NULL,
    downloads integer DEFAULT 0 NOT NULL,
    assinado_em date,
    revogado_em date,
    revogado_por_id text
);


ALTER TABLE public.legislacao OWNER TO postgres;

--
-- Name: licitacoes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.licitacoes (
    id text NOT NULL,
    tenant_id text NOT NULL,
    numero text NOT NULL,
    objeto text NOT NULL,
    modalidade text NOT NULL,
    situacao text DEFAULT 'aberta'::text NOT NULL,
    data_abertura timestamp without time zone,
    data_encerramento timestamp without time zone,
    valor_estimado real,
    valor_homologado real,
    secretaria text,
    edital text,
    ata text,
    descricao text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    secretaria_id text,
    edital_url text,
    result_url text,
    vencedor text,
    vencedor_cnpj text,
    pncp_id text,
    download_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.licitacoes OWNER TO postgres;

--
-- Name: menu_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.menu_items (
    id text NOT NULL,
    tenant_id text NOT NULL,
    menu_slot text NOT NULL,
    label text NOT NULL,
    url text,
    tipo text DEFAULT 'pagina'::text NOT NULL,
    abre_nova_aba boolean DEFAULT false NOT NULL,
    icone text,
    parent_id text,
    sort_order integer DEFAULT 0 NOT NULL,
    is_ativo boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.menu_items OWNER TO postgres;

--
-- Name: municipio_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.municipio_info (
    id text NOT NULL,
    tenant_id text NOT NULL,
    nome text NOT NULL,
    estado text NOT NULL,
    regiao text NOT NULL,
    populacao integer DEFAULT 0 NOT NULL,
    area real DEFAULT 0 NOT NULL,
    altitude real,
    idh real,
    pib real,
    historia text,
    simbolos jsonb,
    localizacao jsonb,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.municipio_info OWNER TO postgres;

--
-- Name: news_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.news_categories (
    id text NOT NULL,
    tenant_id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    color text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.news_categories OWNER TO postgres;

--
-- Name: news_versions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.news_versions (
    id text NOT NULL,
    noticia_id text NOT NULL,
    conteudo text NOT NULL,
    saved_by text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.news_versions OWNER TO postgres;

--
-- Name: noticias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.noticias (
    id text NOT NULL,
    tenant_id text NOT NULL,
    titulo text NOT NULL,
    slug text NOT NULL,
    resumo text NOT NULL,
    conteudo text NOT NULL,
    imagem_capa text,
    categoria text NOT NULL,
    autor text,
    data_publicacao timestamp without time zone DEFAULT now() NOT NULL,
    destaque boolean DEFAULT false NOT NULL,
    tags text[] DEFAULT '{}'::text[] NOT NULL,
    visualizacoes integer DEFAULT 0 NOT NULL,
    publicado boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    imagem_capa_alt text,
    categoria_id text,
    secretaria_id text,
    status text DEFAULT 'rascunho'::text NOT NULL,
    meta_title text,
    meta_description text,
    og_image_url text,
    agendado_em timestamp without time zone,
    deletado_em timestamp without time zone
);


ALTER TABLE public.noticias OWNER TO postgres;

--
-- Name: orcamentos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orcamentos (
    id text NOT NULL,
    tenant_id text NOT NULL,
    ano integer NOT NULL,
    receita_prevista real DEFAULT 0 NOT NULL,
    receita_realizada real DEFAULT 0 NOT NULL,
    despesa_prevista real DEFAULT 0 NOT NULL,
    despesa_realizada real DEFAULT 0 NOT NULL,
    saldo_atual real DEFAULT 0 NOT NULL,
    categorias text DEFAULT '[]'::text NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.orcamentos OWNER TO postgres;

--
-- Name: page_blocks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.page_blocks (
    id text NOT NULL,
    page_id text NOT NULL,
    tipo text NOT NULL,
    conteudo jsonb DEFAULT '{}'::jsonb NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.page_blocks OWNER TO postgres;

--
-- Name: pages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pages (
    id text NOT NULL,
    tenant_id text NOT NULL,
    titulo text NOT NULL,
    slug text NOT NULL,
    status text DEFAULT 'rascunho'::text NOT NULL,
    is_protegida boolean DEFAULT false NOT NULL,
    meta_title text,
    meta_description text,
    autor text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.pages OWNER TO postgres;

--
-- Name: receitas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.receitas (
    id text NOT NULL,
    tenant_id text NOT NULL,
    data date NOT NULL,
    descricao text NOT NULL,
    fonte text NOT NULL,
    categoria text NOT NULL,
    valor real NOT NULL,
    ano integer NOT NULL,
    mes integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.receitas OWNER TO postgres;

--
-- Name: secretarias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.secretarias (
    id text NOT NULL,
    tenant_id text NOT NULL,
    nome text NOT NULL,
    slug text NOT NULL,
    sigla text NOT NULL,
    descricao text NOT NULL,
    secretario text,
    foto_secretario text,
    telefone text,
    email text,
    endereco text,
    horario text,
    competencias text[] DEFAULT '{}'::text[] NOT NULL,
    ativa boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.secretarias OWNER TO postgres;

--
-- Name: servicos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.servicos (
    id text NOT NULL,
    tenant_id text NOT NULL,
    titulo text NOT NULL,
    slug text NOT NULL,
    descricao text NOT NULL,
    categoria text NOT NULL,
    orgao text,
    link_externo text,
    requisitos text[] DEFAULT '{}'::text[] NOT NULL,
    documentos text[] DEFAULT '{}'::text[] NOT NULL,
    prazo_atendimento text,
    gratuito boolean DEFAULT true NOT NULL,
    online boolean DEFAULT false NOT NULL,
    icone text,
    ativo boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.servicos OWNER TO postgres;

--
-- Name: servidores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.servidores (
    id text NOT NULL,
    tenant_id text NOT NULL,
    nome text NOT NULL,
    cargo text NOT NULL,
    secretaria text NOT NULL,
    vinculo text NOT NULL,
    remuneracao real,
    admissao date,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.servidores OWNER TO postgres;

--
-- Name: site_config; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.site_config (
    id text NOT NULL,
    tenant_id text NOT NULL,
    hero_type text DEFAULT 'carousel'::text NOT NULL,
    hero_video_url text,
    hero_sections jsonb DEFAULT '[]'::jsonb NOT NULL,
    site_title text,
    site_description text,
    google_analytics_id text,
    google_tag_manager_id text,
    social_facebook text,
    social_instagram text,
    social_youtube text,
    social_twitter text,
    social_linkedin text,
    floating_widget_enabled boolean DEFAULT true NOT NULL,
    floating_widget_position text DEFAULT 'right'::text NOT NULL,
    vlibras_enabled boolean DEFAULT true NOT NULL,
    rodape_texto text,
    sic_prazo_resposta integer DEFAULT 20 NOT NULL,
    sic_email text,
    modo_manutencao boolean DEFAULT false NOT NULL,
    modo_manutencao_msg text,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.site_config OWNER TO postgres;

--
-- Name: tenants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tenants (
    id text NOT NULL,
    nome text NOT NULL,
    slug text NOT NULL,
    brasao text,
    cor_primaria text DEFAULT '#1351B4'::text NOT NULL,
    cor_secundaria text DEFAULT '#168821'::text NOT NULL,
    cor_terciaria text DEFAULT '#FFCD07'::text NOT NULL,
    estado text NOT NULL,
    populacao integer DEFAULT 0 NOT NULL,
    area real DEFAULT 0 NOT NULL,
    fundacao text DEFAULT ''::text NOT NULL,
    lema text,
    site_url text DEFAULT ''::text NOT NULL,
    modulos_ativos text[] DEFAULT '{site,ouvidoria}'::text[] NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.tenants OWNER TO postgres;

--
-- Name: transparency_docs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transparency_docs (
    id text NOT NULL,
    tenant_id text NOT NULL,
    categoria text NOT NULL,
    subcategoria text,
    titulo text NOT NULL,
    descricao text,
    ano_referencia integer NOT NULL,
    periodo_referencia text,
    file_url text NOT NULL,
    nome_arquivo text NOT NULL,
    tamanho_bytes integer DEFAULT 0 NOT NULL,
    downloads integer DEFAULT 0 NOT NULL,
    publicado_por text NOT NULL,
    publicado_em timestamp without time zone NOT NULL,
    expira_em timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.transparency_docs OWNER TO postgres;

--
-- Data for Name: agenda; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.agenda (id, tenant_id, titulo, descricao, data_inicio, data_fim, local, categoria, publico_alvo, gratuito, link_inscricao, ativo, created_at, tipo, endereco, is_online, online_url, dia_inteiro, secretaria_id, is_publico, anexo_url, updated_at) FROM stdin;
477e2470-a504-410c-9fd4-e96ab5075231	tenant-parauapebas-001	Audiência Pública — Prestação de Contas 1º Quadrimestre	Evento oficial da Prefeitura Municipal de Parauapebas. Participação aberta ao público.	2025-04-10 00:00:00	2025-04-11 00:00:00	Câmara Municipal	audiencia-publica	População em geral	t	\N	t	2026-03-25 20:34:26.297355	evento	\N	f	\N	f	\N	t	\N	2026-03-26 00:04:19.491723
6b3ffd55-4772-469f-b3d7-7aeeab6c7410	tenant-parauapebas-001	Fórum Municipal de Saúde — Atenção Básica em Debate	Evento oficial da Prefeitura Municipal de Parauapebas. Participação aberta ao público.	2025-05-15 00:00:00	2025-05-16 00:00:00	Teatro Municipal	saude	População em geral	t	\N	t	2026-03-25 20:34:26.300105	evento	\N	f	\N	f	\N	t	\N	2026-03-26 00:04:19.491723
58b32a99-4143-4002-b6c2-38fc94826e93	tenant-parauapebas-001	Semana de Orientação do IPTU 2025	Evento oficial da Prefeitura Municipal de Parauapebas. Participação aberta ao público.	2025-06-20 00:00:00	2025-06-21 00:00:00	Prefeitura Municipal	tributos	População em geral	t	\N	t	2026-03-25 20:34:26.302208	evento	\N	f	\N	f	\N	t	\N	2026-03-26 00:04:19.491723
aeb7cb96-91f1-478f-aaa3-2cead969f12a	tenant-parauapebas-001	Festa Junina Municipal — Quadrilha das Secretarias	Evento oficial da Prefeitura Municipal de Parauapebas. Participação aberta ao público.	2025-07-25 00:00:00	2025-07-26 00:00:00	Praça Central	cultura	População em geral	t	\N	t	2026-03-25 20:34:26.304382	evento	\N	f	\N	f	\N	t	\N	2026-03-26 00:04:19.491723
fa860b66-8c2e-40e9-b4c3-4b2e663a4621	tenant-parauapebas-001	Audiência Pública — Prestação de Contas 1º Quadrimestre	Evento oficial da Prefeitura Municipal de Parauapebas. Participação aberta ao público.	2025-04-10 00:00:00	2025-04-11 00:00:00	Câmara Municipal	audiencia-publica	População em geral	t	\N	t	2026-03-26 00:09:54.108472	evento	\N	f	\N	f	\N	t	\N	2026-03-26 00:09:54.108472
d7ba7a8a-85d3-47e8-a10b-093065d181b3	tenant-parauapebas-001	Fórum Municipal de Saúde — Atenção Básica em Debate	Evento oficial da Prefeitura Municipal de Parauapebas. Participação aberta ao público.	2025-05-15 00:00:00	2025-05-16 00:00:00	Teatro Municipal	saude	População em geral	t	\N	t	2026-03-26 00:09:54.11134	evento	\N	f	\N	f	\N	t	\N	2026-03-26 00:09:54.11134
59cdfea7-3aeb-4f9e-ac59-ca5fc62fb697	tenant-parauapebas-001	Semana de Orientação do IPTU 2025	Evento oficial da Prefeitura Municipal de Parauapebas. Participação aberta ao público.	2025-06-20 00:00:00	2025-06-21 00:00:00	Prefeitura Municipal	tributos	População em geral	t	\N	t	2026-03-26 00:09:54.113791	evento	\N	f	\N	f	\N	t	\N	2026-03-26 00:09:54.113791
879d06a4-d1a0-4a03-90d6-5ebfe2eefbec	tenant-parauapebas-001	Festa Junina Municipal — Quadrilha das Secretarias	Evento oficial da Prefeitura Municipal de Parauapebas. Participação aberta ao público.	2025-07-25 00:00:00	2025-07-26 00:00:00	Praça Central	cultura	População em geral	t	\N	t	2026-03-26 00:09:54.116415	evento	\N	f	\N	f	\N	t	\N	2026-03-26 00:09:54.116415
\.


--
-- Data for Name: banners; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.banners (id, tenant_id, titulo, subtitulo, image_desktop_url, image_mobile_url, image_alt, cta_label, cta_url, cta_abre_nova_aba, overlay_color, overlay_opacity, is_ativo, sort_order, inicia_em, expira_em, created_at, updated_at) FROM stdin;
61dc621a-a6e4-43b3-8108-96a32c1dcefd	tenant-parauapebas-001	Semana de Prevenção ao Câncer de Mama	Outubro Rosa — Cuide-se!	https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=1920&h=600&fit=crop	https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=768&h=400&fit=crop	Banner Outubro Rosa — prevenção ao câncer de mama	Saiba mais	/saude/outubro-rosa	f	\N	0.4	t	0	2026-10-01 00:00:00	2026-10-31 00:00:00	2026-03-26 00:09:54.136838	2026-03-26 00:09:54.136838
e689bf80-f91a-4daf-9df4-bfaefe1f12df	tenant-parauapebas-001	Concurso Público Municipal 2026	Inscrições abertas! 450 vagas.	https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920&h=600&fit=crop	https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=768&h=400&fit=crop	Banner Concurso Público 2026	Inscreva-se	/concursos/2026	f	\N	0.4	t	1	\N	\N	2026-03-26 00:09:54.139294	2026-03-26 00:09:54.139294
c3109d56-b55f-4998-9226-42db68b350ac	tenant-parauapebas-001	Nova UBS Rio Verde inaugurada	Mais saúde para todos os moradores	https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&h=600&fit=crop	https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=768&h=400&fit=crop	Banner UBS Rio Verde	Ver notícia	/noticias/ubs-rio-verde	f	\N	0.4	f	2	\N	\N	2026-03-26 00:09:54.14134	2026-03-26 00:09:54.14134
4e17cb38-8b79-4af3-98f7-2f51db98c9ae	tenant-parauapebas-001	Semana do Meio Ambiente 2026	Parauapebas sustentável	https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=600&fit=crop	https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=768&h=400&fit=crop	Banner Semana do Meio Ambiente	Programação	/eventos/meio-ambiente-2026	f	\N	0.4	t	3	2026-06-01 00:00:00	2026-06-07 00:00:00	2026-03-26 00:09:54.143778	2026-03-26 00:09:54.143778
\.


--
-- Data for Name: bid_events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bid_events (id, licitacao_id, titulo, descricao, file_url, ocorrido_em, created_at) FROM stdin;
\.


--
-- Data for Name: concursos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.concursos (id, tenant_id, titulo, descricao, tipo, situacao, numero_vagas, data_publicacao, data_inscricao_inicio, data_inscricao_fim, link_edital, link_inscricao, organizadora, remuneracao, created_at, updated_at) FROM stdin;
25fd8f07-2e75-4695-8c7c-d2b0c2fc456b	tenant-parauapebas-001	Concurso Público nº 001/2025 — Área de Saúde e Educação	Concurso para provimento de 150 cargos efetivos nas áreas de saúde e educação.	concurso-publico	aberto	150	2025-03-01	2025-03-10	2025-04-30	/transparencia/concursos/edital-001-2025.pdf	https://concursos.parauapebas.pa.gov.br	Instituto de Concursos do Pará - ICPA	3500	2026-03-25 20:34:26.306781	2026-03-25 20:34:26.306781
e10de86e-b9c9-4363-926e-04a4b2ce7b53	tenant-parauapebas-001	Processo Seletivo nº 002/2025 — Assistentes Sociais	Processo seletivo para contratação temporária de assistentes sociais.	processo-seletivo	encerrado	10	2024-12-01	2024-12-10	2025-01-15	\N	\N	\N	2800	2026-03-25 20:34:26.306781	2026-03-25 20:34:26.306781
aabf8f06-993e-453a-aea6-558b41723e66	tenant-parauapebas-001	Concurso Público nº 001/2025 — Área de Saúde e Educação	Concurso para provimento de 150 cargos efetivos nas áreas de saúde e educação.	concurso-publico	aberto	150	2025-03-01	2025-03-10	2025-04-30	/transparencia/concursos/edital-001-2025.pdf	https://concursos.parauapebas.pa.gov.br	Instituto de Concursos do Pará - ICPA	3500	2026-03-26 00:09:54.119118	2026-03-26 00:09:54.119118
e7decfc3-a75d-4071-8e20-cbd9176472fe	tenant-parauapebas-001	Processo Seletivo nº 002/2025 — Assistentes Sociais	Processo seletivo para contratação temporária de assistentes sociais.	processo-seletivo	encerrado	10	2024-12-01	2024-12-10	2025-01-15	\N	\N	\N	2800	2026-03-26 00:09:54.119118	2026-03-26 00:09:54.119118
\.


--
-- Data for Name: contracts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contracts (id, tenant_id, licitacao_id, numero, objeto, contratado, cnpj_contratado, valor, data_inicio, data_fim, file_url, ativo, fiscal_nome, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: despesas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.despesas (id, tenant_id, data, descricao, secretaria, categoria, valor, beneficiario, empenho, modalidade, ano, mes, created_at) FROM stdin;
a8dfd3eb-1fcb-4783-861f-f2aecb3f95d3	tenant-parauapebas-001	2025-01-15	Pagamento de Pessoal - SEMSUR	SEMSUR	Pessoal	229747.27	Fornecedor Genérico LTDA	EMP-2025-01000	Pregão Eletrônico	2025	1	2026-03-25 20:34:26.142447
220183ff-adff-4ba5-96a2-d92791d7234c	tenant-parauapebas-001	2025-02-15	Pagamento de Custeio - SEMED	SEMED	Custeio	540363.94	\N	EMP-2025-01001	Dispensa	2025	2	2026-03-25 20:34:26.144872
1ad67056-8631-4af9-9db1-eee33c99718f	tenant-parauapebas-001	2025-03-15	Pagamento de Investimentos - SEMID	SEMID	Investimentos	77485.59	\N	EMP-2025-01002	Pregão Eletrônico	2025	3	2026-03-25 20:34:26.14725
258e5680-1cb4-4ea5-928d-955f210ca9ed	tenant-parauapebas-001	2025-04-15	Pagamento de Transferências - SEMAF	SEMAF	Transferências	258662.84	Fornecedor Genérico LTDA	EMP-2025-01003	Dispensa	2025	4	2026-03-25 20:34:26.149272
5a9561d7-568b-4f48-b2df-802bebfed87a	tenant-parauapebas-001	2025-05-15	Pagamento de Pessoal - SEMAST	SEMAST	Pessoal	491823.22	\N	EMP-2025-01004	Pregão Eletrônico	2025	5	2026-03-25 20:34:26.152311
113939e0-cbc9-4b6c-9449-d60a8fc7c38d	tenant-parauapebas-001	2025-06-15	Pagamento de Custeio - SEMSUR	SEMSUR	Custeio	519594.22	\N	EMP-2025-01005	Dispensa	2025	6	2026-03-25 20:34:26.155218
4eb5f9f9-6f60-4877-8cb3-6cc86d029f41	tenant-parauapebas-001	2025-07-15	Pagamento de Investimentos - SEMED	SEMED	Investimentos	234247.03	Fornecedor Genérico LTDA	EMP-2025-01006	Pregão Eletrônico	2025	7	2026-03-25 20:34:26.157683
9324c35b-6a04-4af5-8e3e-8abcfdc2bef8	tenant-parauapebas-001	2025-08-15	Pagamento de Transferências - SEMID	SEMID	Transferências	78929.09	\N	EMP-2025-01007	Dispensa	2025	8	2026-03-25 20:34:26.160003
e81d020c-fe89-41f9-8830-62d917f06e18	tenant-parauapebas-001	2025-09-15	Pagamento de Pessoal - SEMAF	SEMAF	Pessoal	503454.4	\N	EMP-2025-01008	Pregão Eletrônico	2025	9	2026-03-25 20:34:26.163854
2dd6f5f5-2f2c-4077-b061-4cdae0776611	tenant-parauapebas-001	2025-10-15	Pagamento de Custeio - SEMAST	SEMAST	Custeio	531564.4	Fornecedor Genérico LTDA	EMP-2025-01009	Dispensa	2025	10	2026-03-25 20:34:26.166357
0d1a2a26-2e3f-49cb-b5a5-cc4082805a5d	tenant-parauapebas-001	2025-11-15	Pagamento de Investimentos - SEMSUR	SEMSUR	Investimentos	405260.06	\N	EMP-2025-01010	Pregão Eletrônico	2025	11	2026-03-25 20:34:26.168872
61f05617-0402-443f-99a0-79a0281db929	tenant-parauapebas-001	2025-12-15	Pagamento de Transferências - SEMED	SEMED	Transferências	388311.3	\N	EMP-2025-01011	Dispensa	2025	12	2026-03-25 20:34:26.17146
d8bd4b7e-21a9-4bde-a067-daa9a854b84c	tenant-parauapebas-001	2025-01-15	Pagamento de Pessoal - SEMID	SEMID	Pessoal	288681.7	Fornecedor Genérico LTDA	EMP-2025-01012	Pregão Eletrônico	2025	1	2026-03-25 20:34:26.174061
19674974-c900-4f5a-bff7-ffbfe72d83ec	tenant-parauapebas-001	2025-02-15	Pagamento de Custeio - SEMAF	SEMAF	Custeio	72989.8	\N	EMP-2025-01013	Dispensa	2025	2	2026-03-25 20:34:26.176246
ab4db114-b01e-4c5d-93ba-6579ba1a385c	tenant-parauapebas-001	2025-03-15	Pagamento de Investimentos - SEMAST	SEMAST	Investimentos	532742.7	\N	EMP-2025-01014	Pregão Eletrônico	2025	3	2026-03-25 20:34:26.179574
efcad37b-dded-40d2-a178-d619c5d7002d	tenant-parauapebas-001	2025-04-15	Pagamento de Transferências - SEMSUR	SEMSUR	Transferências	184928.75	Fornecedor Genérico LTDA	EMP-2025-01015	Dispensa	2025	4	2026-03-25 20:34:26.18198
41b2c386-9806-4d93-b847-c31ff8ca4efc	tenant-parauapebas-001	2025-05-15	Pagamento de Pessoal - SEMED	SEMED	Pessoal	327173	\N	EMP-2025-01016	Pregão Eletrônico	2025	5	2026-03-25 20:34:26.185431
9292d7d4-052c-4d3a-be31-4c48ed5e9525	tenant-parauapebas-001	2025-06-15	Pagamento de Custeio - SEMID	SEMID	Custeio	509231.03	\N	EMP-2025-01017	Dispensa	2025	6	2026-03-25 20:34:26.187972
ece9644e-3c47-4dfd-bf28-446609971a18	tenant-parauapebas-001	2025-07-15	Pagamento de Investimentos - SEMAF	SEMAF	Investimentos	224532.38	Fornecedor Genérico LTDA	EMP-2025-01018	Pregão Eletrônico	2025	7	2026-03-25 20:34:26.190129
43771110-0a9d-462e-8046-e79b5fab646f	tenant-parauapebas-001	2025-08-15	Pagamento de Transferências - SEMAST	SEMAST	Transferências	437939.2	\N	EMP-2025-01019	Dispensa	2025	8	2026-03-25 20:34:26.192207
7062551b-a613-4db6-80c6-7f0b4dcee0eb	tenant-parauapebas-001	2025-01-15	Pagamento de Pessoal - SEMSUR	SEMSUR	Pessoal	222030.19	Fornecedor Genérico LTDA	EMP-2025-01000	Pregão Eletrônico	2025	1	2026-03-26 00:09:53.953488
7acd9c82-4ec5-4d1e-ae23-17d244a03e77	tenant-parauapebas-001	2025-02-15	Pagamento de Custeio - SEMED	SEMED	Custeio	387777.28	\N	EMP-2025-01001	Dispensa	2025	2	2026-03-26 00:09:53.956102
c114e7c4-583e-40a1-a9f9-c202fda2b66a	tenant-parauapebas-001	2025-03-15	Pagamento de Investimentos - SEMID	SEMID	Investimentos	496117.75	\N	EMP-2025-01002	Pregão Eletrônico	2025	3	2026-03-26 00:09:53.95899
4f37e2b5-8cd2-4cfd-b8fb-3c30212776cb	tenant-parauapebas-001	2025-04-15	Pagamento de Transferências - SEMAF	SEMAF	Transferências	279694.62	Fornecedor Genérico LTDA	EMP-2025-01003	Dispensa	2025	4	2026-03-26 00:09:53.964796
5c32dad5-3c23-4997-bd46-94b68e611749	tenant-parauapebas-001	2025-05-15	Pagamento de Pessoal - SEMAST	SEMAST	Pessoal	510521.3	\N	EMP-2025-01004	Pregão Eletrônico	2025	5	2026-03-26 00:09:53.967873
034bd16f-f0d6-4835-9e3b-5cc3d66a1987	tenant-parauapebas-001	2025-06-15	Pagamento de Custeio - SEMSUR	SEMSUR	Custeio	361496.9	\N	EMP-2025-01005	Dispensa	2025	6	2026-03-26 00:09:53.971097
0b4d6527-3ea6-4813-877d-a3adca4990d1	tenant-parauapebas-001	2025-07-15	Pagamento de Investimentos - SEMED	SEMED	Investimentos	473839.12	Fornecedor Genérico LTDA	EMP-2025-01006	Pregão Eletrônico	2025	7	2026-03-26 00:09:53.973991
41ea9395-537f-4997-8a81-5b589f1193fb	tenant-parauapebas-001	2025-08-15	Pagamento de Transferências - SEMID	SEMID	Transferências	266969.56	\N	EMP-2025-01007	Dispensa	2025	8	2026-03-26 00:09:53.976565
532d6b51-73ca-47e0-8d98-2f3732875e70	tenant-parauapebas-001	2025-09-15	Pagamento de Pessoal - SEMAF	SEMAF	Pessoal	178382.31	\N	EMP-2025-01008	Pregão Eletrônico	2025	9	2026-03-26 00:09:53.979336
14145d18-2806-40fb-959d-491f6aeb753e	tenant-parauapebas-001	2025-10-15	Pagamento de Custeio - SEMAST	SEMAST	Custeio	529197.5	Fornecedor Genérico LTDA	EMP-2025-01009	Dispensa	2025	10	2026-03-26 00:09:53.981411
58e50209-e2bb-4ac8-a86f-fefc4ae97ae0	tenant-parauapebas-001	2025-11-15	Pagamento de Investimentos - SEMSUR	SEMSUR	Investimentos	302495.6	\N	EMP-2025-01010	Pregão Eletrônico	2025	11	2026-03-26 00:09:53.983733
2e375089-340d-4d48-b662-f4bee3e648dc	tenant-parauapebas-001	2025-12-15	Pagamento de Transferências - SEMED	SEMED	Transferências	447040.06	\N	EMP-2025-01011	Dispensa	2025	12	2026-03-26 00:09:53.98649
c8f1bdf8-9841-4104-8165-318bcb8b1ea0	tenant-parauapebas-001	2025-01-15	Pagamento de Pessoal - SEMID	SEMID	Pessoal	262735.12	Fornecedor Genérico LTDA	EMP-2025-01012	Pregão Eletrônico	2025	1	2026-03-26 00:09:53.988634
9725d39b-1e97-4907-8688-5183b61a5904	tenant-parauapebas-001	2025-02-15	Pagamento de Custeio - SEMAF	SEMAF	Custeio	280030.4	\N	EMP-2025-01013	Dispensa	2025	2	2026-03-26 00:09:53.991938
ac82e2e2-0bb1-48e9-832d-b02915ae9a3c	tenant-parauapebas-001	2025-03-15	Pagamento de Investimentos - SEMAST	SEMAST	Investimentos	467583.22	\N	EMP-2025-01014	Pregão Eletrônico	2025	3	2026-03-26 00:09:53.99408
4c75a0fd-817e-4d3a-bc7e-b65257d26778	tenant-parauapebas-001	2025-04-15	Pagamento de Transferências - SEMSUR	SEMSUR	Transferências	412365.62	Fornecedor Genérico LTDA	EMP-2025-01015	Dispensa	2025	4	2026-03-26 00:09:53.996677
0adf451e-b88a-4582-a248-2c1b3d0121d8	tenant-parauapebas-001	2025-05-15	Pagamento de Pessoal - SEMED	SEMED	Pessoal	115725.94	\N	EMP-2025-01016	Pregão Eletrônico	2025	5	2026-03-26 00:09:53.999602
76b05a71-dc0c-479a-8e0d-d52e0f6fafae	tenant-parauapebas-001	2025-06-15	Pagamento de Custeio - SEMID	SEMID	Custeio	66892.76	\N	EMP-2025-01017	Dispensa	2025	6	2026-03-26 00:09:54.00232
3a3e8ca0-2b88-4fab-8309-7108eca6ca25	tenant-parauapebas-001	2025-07-15	Pagamento de Investimentos - SEMAF	SEMAF	Investimentos	181920.06	Fornecedor Genérico LTDA	EMP-2025-01018	Pregão Eletrônico	2025	7	2026-03-26 00:09:54.004932
bdbe7c77-53c7-4f3c-ba86-9d20c44b74db	tenant-parauapebas-001	2025-08-15	Pagamento de Transferências - SEMAST	SEMAST	Transferências	266677.38	\N	EMP-2025-01019	Dispensa	2025	8	2026-03-26 00:09:54.007629
\.


--
-- Data for Name: galeria; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.galeria (id, tenant_id, titulo, descricao, tipo, thumbnail, url_video, fotos, data_publicacao, categoria, created_at) FROM stdin;
\.


--
-- Data for Name: gallery_albums; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gallery_albums (id, tenant_id, titulo, descricao, cover_url, is_publico, sort_order, created_at, updated_at) FROM stdin;
7c9fd05b-00d7-4c40-9d38-d3131da8198a	tenant-parauapebas-001	Inauguração UBS Rio Verde	Fotos da inauguração da nova Unidade Básica de Saúde do bairro Rio Verde.	https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop	t	0	2026-03-26 00:09:54.179319	2026-03-26 00:09:54.179319
0904a7ae-4db7-44fa-ad18-b8756d42f9c1	tenant-parauapebas-001	Obras de Pavimentação 2026	Registro fotográfico das obras de pavimentação no centro da cidade.	https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop	t	1	2026-03-26 00:09:54.179319	2026-03-26 00:09:54.179319
\.


--
-- Data for Name: gallery_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gallery_items (id, album_id, tipo, url, thumb_url, alt_text, legenda, sort_order, created_at) FROM stdin;
5c4fac2e-c889-4040-a177-ac6821ff84b3	7c9fd05b-00d7-4c40-9d38-d3131da8198a	image	https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800	https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=300	Fachada da UBS Rio Verde	\N	0	2026-03-26 00:09:54.18243
2fd214c1-8872-4b13-8d2a-102d5f928678	7c9fd05b-00d7-4c40-9d38-d3131da8198a	image	https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800	https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300	Interior da unidade de saúde	\N	1	2026-03-26 00:09:54.18243
84fc2d09-e119-4e91-94c1-bf85fe4dd3bf	0904a7ae-4db7-44fa-ad18-b8756d42f9c1	image	https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800	https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300	Obras de pavimentação na Avenida Central	\N	0	2026-03-26 00:09:54.18243
\.


--
-- Data for Name: gestores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gestores (id, tenant_id, nome, cargo, partido, mandato, foto, bio, email, redes_sociais, ativo, created_at) FROM stdin;
e6685c22-9350-4094-b1f5-05efa5ff143c	tenant-parauapebas-001	Dr. Darci Lermen	Prefeito	Solidariedade	2021-2024	/images/prefeito.png	Médico e gestor público com mais de 20 anos de experiência. Comprometido com o desenvolvimento sustentável de Parauapebas e a melhoria da qualidade de vida dos cidadãos.	prefeito@parauapebas.pa.gov.br	{"facebook": "https://facebook.com/prefeituraparauapebas", "instagram": "https://instagram.com/prefeituraparauapebas"}	t	2026-03-25 20:34:26.07029
7b11faed-4d9c-4b8c-a7d2-538672e8e2fc	tenant-parauapebas-001	Ana Paula Rodrigues	Vice-Prefeito	Solidariedade	2021-2024	\N	Administradora pública com vasta experiência em gestão municipal.	vice@parauapebas.pa.gov.br	\N	t	2026-03-25 20:34:26.07029
a453ce48-6b84-41e3-aa69-8f7f68b188f4	tenant-parauapebas-001	Dr. Darci Lermen	Prefeito	Solidariedade	2021-2024	/images/prefeito.png	Médico e gestor público com mais de 20 anos de experiência. Comprometido com o desenvolvimento sustentável de Parauapebas e a melhoria da qualidade de vida dos cidadãos.	prefeito@parauapebas.pa.gov.br	{"facebook": "https://facebook.com/prefeituraparauapebas", "instagram": "https://instagram.com/prefeituraparauapebas"}	t	2026-03-26 00:09:53.885656
33ce5d0f-ceae-43f2-a6df-2a0eab21460a	tenant-parauapebas-001	Ana Paula Rodrigues	Vice-Prefeito	Solidariedade	2021-2024	\N	Administradora pública com vasta experiência em gestão municipal.	vice@parauapebas.pa.gov.br	\N	t	2026-03-26 00:09:53.885656
\.


--
-- Data for Name: legislacao; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.legislacao (id, tenant_id, numero, tipo, ementa, slug, data_publicacao, ano, conteudo, arquivo_pdf, tags, created_at, updated_at, nome_arquivo, status, visualizacoes, downloads, assinado_em, revogado_em, revogado_por_id) FROM stdin;
8fdfcc70-6706-4e35-81b4-80b385ff2c11	tenant-parauapebas-001	1000	lei	Dispõe sobre o Plano Plurianual do Município para o quadriênio 2022-2025	lei-1000-2024	2024-01-01	2024	<p>Dispõe sobre o Plano Plurianual do Município para o quadriênio 2022-2025</p><p>O Prefeito Municipal de Parauapebas, no uso das atribuições que lhe são conferidas pela Lei Orgânica Municipal, faz saber que a Câmara Municipal aprovou e ele sanciona a seguinte Lei:</p><p>Art. 1º - Dispõe sobre o Plano Plurianual do Município para o quadriênio 2022-2025.</p><p>Art. 2º - Esta lei entra em vigor na data de sua publicação.</p>	\N	{lei,"legislação municipal",2024}	2026-03-25 20:34:26.279683	2026-03-25 20:34:26.279683	\N	publicado	0	0	\N	\N	\N
3ab49778-f1ac-4e2d-b44e-198bb6a8d6c7	tenant-parauapebas-001	1100	decreto	Institui o Código Tributário Municipal e dá outras providências	decreto-1100-2023	2023-02-01	2023	<p>Institui o Código Tributário Municipal e dá outras providências</p><p>O Prefeito Municipal de Parauapebas, no uso das atribuições que lhe são conferidas pela Lei Orgânica Municipal, faz saber que a Câmara Municipal aprovou e ele sanciona a seguinte Lei:</p><p>Art. 1º - Institui o Código Tributário Municipal e dá outras providências.</p><p>Art. 2º - Esta lei entra em vigor na data de sua publicação.</p>	\N	{decreto,"legislação municipal",2023}	2026-03-25 20:34:26.282486	2026-03-25 20:34:26.282486	\N	publicado	0	0	\N	\N	\N
dc22c6f7-42dd-4974-bda9-36bd99287fb5	tenant-parauapebas-001	1200	portaria	Cria o Fundo Municipal de Saúde e regulamenta seu funcionamento	portaria-1200-2022	2022-03-01	2022	<p>Cria o Fundo Municipal de Saúde e regulamenta seu funcionamento</p><p>O Prefeito Municipal de Parauapebas, no uso das atribuições que lhe são conferidas pela Lei Orgânica Municipal, faz saber que a Câmara Municipal aprovou e ele sanciona a seguinte Lei:</p><p>Art. 1º - Cria o Fundo Municipal de Saúde e regulamenta seu funcionamento.</p><p>Art. 2º - Esta lei entra em vigor na data de sua publicação.</p>	\N	{portaria,"legislação municipal",2022}	2026-03-25 20:34:26.28497	2026-03-25 20:34:26.28497	\N	publicado	0	0	\N	\N	\N
b61a509b-51ea-4e10-a919-3b449621717b	tenant-parauapebas-001	1300	lei	Dispõe sobre o estatuto dos servidores públicos municipais	lei-1300-2024	2024-04-01	2024	<p>Dispõe sobre o estatuto dos servidores públicos municipais</p><p>O Prefeito Municipal de Parauapebas, no uso das atribuições que lhe são conferidas pela Lei Orgânica Municipal, faz saber que a Câmara Municipal aprovou e ele sanciona a seguinte Lei:</p><p>Art. 1º - Dispõe sobre o estatuto dos servidores públicos municipais.</p><p>Art. 2º - Esta lei entra em vigor na data de sua publicação.</p>	\N	{lei,"legislação municipal",2024}	2026-03-25 20:34:26.288507	2026-03-25 20:34:26.288507	\N	publicado	0	0	\N	\N	\N
c78eb2c3-bf71-4bee-ab7e-9617818b05be	tenant-parauapebas-001	1400	decreto	Institui a Política Municipal de Meio Ambiente	decreto-1400-2023	2023-05-01	2023	<p>Institui a Política Municipal de Meio Ambiente</p><p>O Prefeito Municipal de Parauapebas, no uso das atribuições que lhe são conferidas pela Lei Orgânica Municipal, faz saber que a Câmara Municipal aprovou e ele sanciona a seguinte Lei:</p><p>Art. 1º - Institui a Política Municipal de Meio Ambiente.</p><p>Art. 2º - Esta lei entra em vigor na data de sua publicação.</p>	\N	{decreto,"legislação municipal",2023}	2026-03-25 20:34:26.291873	2026-03-25 20:34:26.291873	\N	publicado	0	0	\N	\N	\N
8012a267-90ce-47fc-a573-b01e14d3d9af	tenant-parauapebas-001	1500	portaria	Aprova o Plano Diretor de Desenvolvimento Urbano do Município	portaria-1500-2022	2022-06-01	2022	<p>Aprova o Plano Diretor de Desenvolvimento Urbano do Município</p><p>O Prefeito Municipal de Parauapebas, no uso das atribuições que lhe são conferidas pela Lei Orgânica Municipal, faz saber que a Câmara Municipal aprovou e ele sanciona a seguinte Lei:</p><p>Art. 1º - Aprova o Plano Diretor de Desenvolvimento Urbano do Município.</p><p>Art. 2º - Esta lei entra em vigor na data de sua publicação.</p>	\N	{portaria,"legislação municipal",2022}	2026-03-25 20:34:26.295001	2026-03-25 20:34:26.295001	\N	publicado	0	0	\N	\N	\N
5e3ebaa7-8ed5-4d4b-bc67-5786376fdede	tenant-parauapebas-001	1000	lei	Dispõe sobre o Plano Plurianual do Município para o quadriênio 2022-2025	lei-1000-2024	2024-01-01	2024	<p>Dispõe sobre o Plano Plurianual do Município para o quadriênio 2022-2025</p><p>O Prefeito Municipal de Parauapebas, no uso das atribuições que lhe são conferidas pela Lei Orgânica Municipal, faz saber que a Câmara Municipal aprovou e ele sanciona a seguinte Lei:</p><p>Art. 1º - Dispõe sobre o Plano Plurianual do Município para o quadriênio 2022-2025.</p><p>Art. 2º - Esta lei entra em vigor na data de sua publicação.</p>	\N	{lei,"legislação municipal",2024}	2026-03-26 00:09:54.091333	2026-03-26 00:09:54.091333	\N	publicado	0	0	\N	\N	\N
0f1c2778-4956-4b99-a950-1e940e980eca	tenant-parauapebas-001	1100	decreto	Institui o Código Tributário Municipal e dá outras providências	decreto-1100-2023	2023-02-01	2023	<p>Institui o Código Tributário Municipal e dá outras providências</p><p>O Prefeito Municipal de Parauapebas, no uso das atribuições que lhe são conferidas pela Lei Orgânica Municipal, faz saber que a Câmara Municipal aprovou e ele sanciona a seguinte Lei:</p><p>Art. 1º - Institui o Código Tributário Municipal e dá outras providências.</p><p>Art. 2º - Esta lei entra em vigor na data de sua publicação.</p>	\N	{decreto,"legislação municipal",2023}	2026-03-26 00:09:54.09564	2026-03-26 00:09:54.09564	\N	publicado	0	0	\N	\N	\N
c161c6a0-997d-4ac2-80b9-044d2648156c	tenant-parauapebas-001	1200	portaria	Cria o Fundo Municipal de Saúde e regulamenta seu funcionamento	portaria-1200-2022	2022-03-01	2022	<p>Cria o Fundo Municipal de Saúde e regulamenta seu funcionamento</p><p>O Prefeito Municipal de Parauapebas, no uso das atribuições que lhe são conferidas pela Lei Orgânica Municipal, faz saber que a Câmara Municipal aprovou e ele sanciona a seguinte Lei:</p><p>Art. 1º - Cria o Fundo Municipal de Saúde e regulamenta seu funcionamento.</p><p>Art. 2º - Esta lei entra em vigor na data de sua publicação.</p>	\N	{portaria,"legislação municipal",2022}	2026-03-26 00:09:54.098482	2026-03-26 00:09:54.098482	\N	publicado	0	0	\N	\N	\N
6b29ac4d-165d-4624-8adb-c58e7e7d5fc9	tenant-parauapebas-001	1300	lei	Dispõe sobre o estatuto dos servidores públicos municipais	lei-1300-2024	2024-04-01	2024	<p>Dispõe sobre o estatuto dos servidores públicos municipais</p><p>O Prefeito Municipal de Parauapebas, no uso das atribuições que lhe são conferidas pela Lei Orgânica Municipal, faz saber que a Câmara Municipal aprovou e ele sanciona a seguinte Lei:</p><p>Art. 1º - Dispõe sobre o estatuto dos servidores públicos municipais.</p><p>Art. 2º - Esta lei entra em vigor na data de sua publicação.</p>	\N	{lei,"legislação municipal",2024}	2026-03-26 00:09:54.100659	2026-03-26 00:09:54.100659	\N	publicado	0	0	\N	\N	\N
3842d386-e148-45de-b32d-19425aa7aac4	tenant-parauapebas-001	1400	decreto	Institui a Política Municipal de Meio Ambiente	decreto-1400-2023	2023-05-01	2023	<p>Institui a Política Municipal de Meio Ambiente</p><p>O Prefeito Municipal de Parauapebas, no uso das atribuições que lhe são conferidas pela Lei Orgânica Municipal, faz saber que a Câmara Municipal aprovou e ele sanciona a seguinte Lei:</p><p>Art. 1º - Institui a Política Municipal de Meio Ambiente.</p><p>Art. 2º - Esta lei entra em vigor na data de sua publicação.</p>	\N	{decreto,"legislação municipal",2023}	2026-03-26 00:09:54.102849	2026-03-26 00:09:54.102849	\N	publicado	0	0	\N	\N	\N
75b0081a-8748-45b0-8e46-903e4bbb7ac4	tenant-parauapebas-001	1500	portaria	Aprova o Plano Diretor de Desenvolvimento Urbano do Município	portaria-1500-2022	2022-06-01	2022	<p>Aprova o Plano Diretor de Desenvolvimento Urbano do Município</p><p>O Prefeito Municipal de Parauapebas, no uso das atribuições que lhe são conferidas pela Lei Orgânica Municipal, faz saber que a Câmara Municipal aprovou e ele sanciona a seguinte Lei:</p><p>Art. 1º - Aprova o Plano Diretor de Desenvolvimento Urbano do Município.</p><p>Art. 2º - Esta lei entra em vigor na data de sua publicação.</p>	\N	{portaria,"legislação municipal",2022}	2026-03-26 00:09:54.106002	2026-03-26 00:09:54.106002	\N	publicado	0	0	\N	\N	\N
\.


--
-- Data for Name: licitacoes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.licitacoes (id, tenant_id, numero, objeto, modalidade, situacao, data_abertura, data_encerramento, valor_estimado, valor_homologado, secretaria, edital, ata, descricao, created_at, updated_at, secretaria_id, edital_url, result_url, vencedor, vencedor_cnpj, pncp_id, download_count) FROM stdin;
14c9b0f8-8677-440c-985d-946d8516f150	tenant-parauapebas-001	001/2025	Aquisição de medicamentos para a Rede Municipal de Saúde	Pregão Eletrônico	aberto	2025-01-15 00:00:00	\N	1.4108311e+06	\N	SEMSUR	\N	\N	Processo licitatório para Aquisição de medicamentos para a Rede Municipal de Saúde. Edital disponível no Portal da Transparência.	2026-03-25 20:34:26.263139	2026-03-25 20:34:26.263139	\N	\N	\N	\N	\N	\N	0
6f87a8a3-9377-4189-a0d1-3995d7590a9c	tenant-parauapebas-001	002/2025	Contratação de serviços de manutenção de vias públicas	Tomada de Preços	em-andamento	2025-02-15 00:00:00	\N	1.3269831e+06	\N	SEMED	\N	\N	Processo licitatório para Contratação de serviços de manutenção de vias públicas. Edital disponível no Portal da Transparência.	2026-03-25 20:34:26.266109	2026-03-25 20:34:26.266109	\N	\N	\N	\N	\N	\N	0
be511954-0a55-4ec0-935e-c8df68bc1e53	tenant-parauapebas-001	003/2025	Fornecimento de material de construção para obras	Concorrência Pública	encerrado	2025-03-15 00:00:00	2025-04-15 00:00:00	1.0929205e+06	\N	SEMID	\N	\N	Processo licitatório para Fornecimento de material de construção para obras. Edital disponível no Portal da Transparência.	2026-03-25 20:34:26.268312	2026-03-25 20:34:26.268312	\N	\N	\N	\N	\N	\N	0
4e37a543-0007-4675-b949-6a8867dbf025	tenant-parauapebas-001	004/2025	Contratação de empresa de TI para sistemas de gestão	Dispensa de Licitação	homologado	2025-04-15 00:00:00	2025-05-15 00:00:00	1.1968224e+06	1.5806178e+06	SEMAF	\N	\N	Processo licitatório para Contratação de empresa de TI para sistemas de gestão. Edital disponível no Portal da Transparência.	2026-03-25 20:34:26.270752	2026-03-25 20:34:26.270752	\N	\N	\N	\N	\N	\N	0
55b2e1fe-7dec-4225-9222-823a52f4d8e5	tenant-parauapebas-001	005/2025	Aquisição de equipamentos escolares e didáticos	Pregão Eletrônico	aberto	2025-05-15 00:00:00	2025-06-15 00:00:00	1.5857066e+06	1.273668e+06	SEMAST	\N	\N	Processo licitatório para Aquisição de equipamentos escolares e didáticos. Edital disponível no Portal da Transparência.	2026-03-25 20:34:26.274228	2026-03-25 20:34:26.274228	\N	\N	\N	\N	\N	\N	0
bd4b545f-16ee-41c9-afce-7beaaa75d156	tenant-parauapebas-001	006/2025	Serviços de coleta e tratamento de resíduos sólidos	Tomada de Preços	em-andamento	2025-06-15 00:00:00	2025-07-15 00:00:00	1.3501022e+06	890320.06	SEMSUR	\N	\N	Processo licitatório para Serviços de coleta e tratamento de resíduos sólidos. Edital disponível no Portal da Transparência.	2026-03-25 20:34:26.27703	2026-03-25 20:34:26.27703	\N	\N	\N	\N	\N	\N	0
0d22a8a0-e4f3-40ee-83be-367e2f88ba6a	tenant-parauapebas-001	001/2025	Aquisição de medicamentos para a Rede Municipal de Saúde	Pregão Eletrônico	aberto	2025-01-15 00:00:00	\N	2.0043606e+06	\N	SEMSUR	\N	\N	Processo licitatório para Aquisição de medicamentos para a Rede Municipal de Saúde. Edital disponível no Portal da Transparência.	2026-03-26 00:09:54.077735	2026-03-26 00:09:54.077735	\N	\N	\N	\N	\N	\N	0
0b672e44-2837-4026-bb85-5e5f8ead3362	tenant-parauapebas-001	002/2025	Contratação de serviços de manutenção de vias públicas	Tomada de Preços	em-andamento	2025-02-15 00:00:00	\N	1.6997059e+06	\N	SEMED	\N	\N	Processo licitatório para Contratação de serviços de manutenção de vias públicas. Edital disponível no Portal da Transparência.	2026-03-26 00:09:54.080008	2026-03-26 00:09:54.080008	\N	\N	\N	\N	\N	\N	0
1a051254-54b8-44bc-a985-766c7ced5da9	tenant-parauapebas-001	003/2025	Fornecimento de material de construção para obras	Concorrência Pública	encerrado	2025-03-15 00:00:00	2025-04-15 00:00:00	736769.9	\N	SEMID	\N	\N	Processo licitatório para Fornecimento de material de construção para obras. Edital disponível no Portal da Transparência.	2026-03-26 00:09:54.082064	2026-03-26 00:09:54.082064	\N	\N	\N	\N	\N	\N	0
2a029ed5-eeb8-422e-b266-dbda74e03e39	tenant-parauapebas-001	004/2025	Contratação de empresa de TI para sistemas de gestão	Dispensa de Licitação	homologado	2025-04-15 00:00:00	2025-05-15 00:00:00	894458.1	1.5244431e+06	SEMAF	\N	\N	Processo licitatório para Contratação de empresa de TI para sistemas de gestão. Edital disponível no Portal da Transparência.	2026-03-26 00:09:54.0846	2026-03-26 00:09:54.0846	\N	\N	\N	\N	\N	\N	0
b4644c03-dd8f-4c89-b63e-4fe665742958	tenant-parauapebas-001	005/2025	Aquisição de equipamentos escolares e didáticos	Pregão Eletrônico	aberto	2025-05-15 00:00:00	2025-06-15 00:00:00	814837.1	1.53539e+06	SEMAST	\N	\N	Processo licitatório para Aquisição de equipamentos escolares e didáticos. Edital disponível no Portal da Transparência.	2026-03-26 00:09:54.087152	2026-03-26 00:09:54.087152	\N	\N	\N	\N	\N	\N	0
d9ae922b-49eb-477f-a951-83fbedf00761	tenant-parauapebas-001	006/2025	Serviços de coleta e tratamento de resíduos sólidos	Tomada de Preços	em-andamento	2025-06-15 00:00:00	2025-07-15 00:00:00	166313.89	1.01222344e+06	SEMSUR	\N	\N	Processo licitatório para Serviços de coleta e tratamento de resíduos sólidos. Edital disponível no Portal da Transparência.	2026-03-26 00:09:54.089241	2026-03-26 00:09:54.089241	\N	\N	\N	\N	\N	\N	0
\.


--
-- Data for Name: menu_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.menu_items (id, tenant_id, menu_slot, label, url, tipo, abre_nova_aba, icone, parent_id, sort_order, is_ativo, created_at, updated_at) FROM stdin;
4b2d37c8-32d0-4da4-9828-a530b19e1fff	tenant-parauapebas-001	header	Início	/	pagina	f	\N	\N	0	t	2026-03-26 00:09:54.162399	2026-03-26 00:09:54.162399
abdd6ab3-0f54-4269-a63d-1cfee014a0d4	tenant-parauapebas-001	header	O Município	/municipio	pagina	f	\N	\N	1	t	2026-03-26 00:09:54.164669	2026-03-26 00:09:54.164669
b9a7851d-3e55-4ff6-a958-3be2f633ff6c	tenant-parauapebas-001	header	Governo	\N	dropdown	f	\N	\N	2	t	2026-03-26 00:09:54.167068	2026-03-26 00:09:54.167068
33a3ab7f-1ad5-4734-91b1-af788d3be8aa	tenant-parauapebas-001	header	Notícias	/noticias	pagina	f	\N	\N	3	t	2026-03-26 00:09:54.16964	2026-03-26 00:09:54.16964
91a7caa5-8779-4d50-bcb4-890e4d14e262	tenant-parauapebas-001	header	Transparência	/transparencia	dropdown	f	\N	\N	4	t	2026-03-26 00:09:54.171728	2026-03-26 00:09:54.171728
35a1163a-32cc-4db3-a4ad-fd6551d312d9	tenant-parauapebas-001	header	Serviços	/servicos	pagina	f	\N	\N	5	t	2026-03-26 00:09:54.173789	2026-03-26 00:09:54.173789
2d73bda0-afb4-4a6b-b922-5d957581c4c7	tenant-parauapebas-001	header	Contato	/contato	pagina	f	\N	\N	6	t	2026-03-26 00:09:54.176165	2026-03-26 00:09:54.176165
\.


--
-- Data for Name: municipio_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.municipio_info (id, tenant_id, nome, estado, regiao, populacao, area, altitude, idh, pib, historia, simbolos, localizacao, updated_at) FROM stdin;
0ff6268f-6316-4814-9b97-8e6c0f21ea11	tenant-parauapebas-001	Parauapebas	Pará	Norte	230000	6960.7	200	0.715	1.85e+10	Parauapebas foi criada em 1988, emancipada de Marabá. Está localizada no sudeste do Pará e é conhecida pela mineração de ferro da Serra dos Carajás, operada pela Vale S.A. A cidade se tornou um dos maiores municípios em arrecadação do Pará, com investimentos em infraestrutura, saúde e educação.	{"hino": null, "brasao": "/images/brasao.png", "bandeira": "/images/bandeira.png"}	{"mapa": null, "latitude": -6.0688, "longitude": -49.8759}	2026-03-25 20:34:26.066882
f605436a-c44b-4d9b-9131-f657403a9601	tenant-parauapebas-001	Parauapebas	Pará	Norte	230000	6960.7	200	0.715	1.85e+10	Parauapebas foi criada em 1988, emancipada de Marabá. Está localizada no sudeste do Pará e é conhecida pela mineração de ferro da Serra dos Carajás, operada pela Vale S.A. A cidade se tornou um dos maiores municípios em arrecadação do Pará, com investimentos em infraestrutura, saúde e educação.	{"hino": null, "brasao": "/images/brasao.png", "bandeira": "/images/bandeira.png"}	{"mapa": null, "latitude": -6.0688, "longitude": -49.8759}	2026-03-26 00:09:53.862761
\.


--
-- Data for Name: news_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.news_categories (id, tenant_id, name, slug, color, created_at) FROM stdin;
d663ada5-b6b1-4fd2-a7a6-b30751b5e527	tenant-parauapebas-001	Saúde	saude	#168821	2026-03-26 00:09:54.121556
e49e017b-3f38-4712-9dad-bc1922ae880c	tenant-parauapebas-001	Educação	educacao	#1351B4	2026-03-26 00:09:54.123895
800a2e38-1774-40ac-889d-e531de46bdab	tenant-parauapebas-001	Obras	obras	#FFCD07	2026-03-26 00:09:54.126535
96b0f5bd-f9b0-42a7-9041-7a0f09c14db9	tenant-parauapebas-001	Meio Ambiente	meio-ambiente	#2E7D32	2026-03-26 00:09:54.128622
ae0bf58a-6481-4bd6-b65e-cb7f41ee255a	tenant-parauapebas-001	Concursos	concursos	#7B1FA2	2026-03-26 00:09:54.131242
bae95e63-f950-43f5-ae08-9f92c2ce537b	tenant-parauapebas-001	Social	social	#E64A19	2026-03-26 00:09:54.133382
\.


--
-- Data for Name: news_versions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.news_versions (id, noticia_id, conteudo, saved_by, created_at) FROM stdin;
\.


--
-- Data for Name: noticias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.noticias (id, tenant_id, titulo, slug, resumo, conteudo, imagem_capa, categoria, autor, data_publicacao, destaque, tags, visualizacoes, publicado, created_at, updated_at, imagem_capa_alt, categoria_id, secretaria_id, status, meta_title, meta_description, og_image_url, agendado_em, deletado_em) FROM stdin;
43889f6f-73b8-4e17-bf7c-b5e1dacda1fd	tenant-parauapebas-001	Prefeitura entrega novo centro de saúde no bairro Rio Verde	prefeitura-entrega-novo-centro-de-saude-no-bairro-rio-verde	Nova unidade de saúde vai atender mais de 15 mil moradores com consultas, exames e medicamentos gratuitos.	<p>Nova unidade de saúde vai atender mais de 15 mil moradores com consultas, exames e medicamentos gratuitos.</p><p>A Prefeitura Municipal de Parauapebas, por meio da secretaria competente, informa que as ações estão em pleno andamento. O prefeito destacou a importância do investimento para a melhoria da qualidade de vida dos cidadãos.</p><p>Mais informações podem ser obtidas diretamente nas secretarias municipais ou pelo site oficial da prefeitura.</p>	\N	saude	Assessoria de Comunicação	2026-02-24 02:25:39.048	t	{saude,prefeitura,parauapebas}	0	t	2026-03-25 20:34:26.102117	2026-03-25 20:34:26.102117	\N	\N	\N	rascunho	\N	\N	\N	\N	\N
c55e3334-5273-4bb2-ab08-8157bdf5dd5b	tenant-parauapebas-001	Obras de pavimentação avançam em 12 ruas do centro da cidade	obras-de-pavimentacao-avancam-em-12-ruas-do-centro-da-cidade	Investimento de R$ 4,2 milhões melhora mobilidade urbana e qualidade de vida dos moradores.	<p>Investimento de R$ 4,2 milhões melhora mobilidade urbana e qualidade de vida dos moradores.</p><p>A Prefeitura Municipal de Parauapebas, por meio da secretaria competente, informa que as ações estão em pleno andamento. O prefeito destacou a importância do investimento para a melhoria da qualidade de vida dos cidadãos.</p><p>Mais informações podem ser obtidas diretamente nas secretarias municipais ou pelo site oficial da prefeitura.</p>	\N	obras	Assessoria de Comunicação	2026-03-14 01:32:22.143	t	{obras,prefeitura,parauapebas}	0	t	2026-03-25 20:34:26.105206	2026-03-25 20:34:26.105206	\N	\N	\N	rascunho	\N	\N	\N	\N	\N
b9f5d194-7bb3-4a97-9ec9-5f0cc854a7a6	tenant-parauapebas-001	Inscrições abertas para cursos profissionalizantes gratuitos	inscricoes-abertas-para-cursos-profissionalizantes-gratuitos	SEMDE oferece 400 vagas em cursos de informática, gastronomia e construção civil para jovens e adultos.	<p>SEMDE oferece 400 vagas em cursos de informática, gastronomia e construção civil para jovens e adultos.</p><p>A Prefeitura Municipal de Parauapebas, por meio da secretaria competente, informa que as ações estão em pleno andamento. O prefeito destacou a importância do investimento para a melhoria da qualidade de vida dos cidadãos.</p><p>Mais informações podem ser obtidas diretamente nas secretarias municipais ou pelo site oficial da prefeitura.</p>	\N	educacao	Assessoria de Comunicação	2026-03-25 15:22:42.111	t	{educacao,prefeitura,parauapebas}	0	t	2026-03-25 20:34:26.10767	2026-03-25 20:34:26.10767	\N	\N	\N	rascunho	\N	\N	\N	\N	\N
e7624e63-c4fc-46ad-a78a-a0f225f07b22	tenant-parauapebas-001	Parauapebas recebe certificação de cidade sustentável do IBGE	parauapebas-recebe-certificacao-de-cidade-sustentavel-do-ibge	Município é reconhecido por práticas de gestão ambiental e redução de resíduos sólidos.	<p>Município é reconhecido por práticas de gestão ambiental e redução de resíduos sólidos.</p><p>A Prefeitura Municipal de Parauapebas, por meio da secretaria competente, informa que as ações estão em pleno andamento. O prefeito destacou a importância do investimento para a melhoria da qualidade de vida dos cidadãos.</p><p>Mais informações podem ser obtidas diretamente nas secretarias municipais ou pelo site oficial da prefeitura.</p>	\N	meio-ambiente	Assessoria de Comunicação	2026-02-24 13:28:50.556	f	{meio-ambiente,prefeitura,parauapebas}	0	t	2026-03-25 20:34:26.110532	2026-03-25 20:34:26.110532	\N	\N	\N	rascunho	\N	\N	\N	\N	\N
b0574fff-5c29-45b2-a17a-1a93c3c97d2b	tenant-parauapebas-001	Programa Bolsa Família beneficia mais de 8 mil famílias em Parauapebas	programa-bolsa-familia-beneficia-mais-de-8-mil-familias-em-parauapebas	Repasses mensais garantem renda mínima e acesso a serviços de saúde e educação para famílias vulneráveis.	<p>Repasses mensais garantem renda mínima e acesso a serviços de saúde e educação para famílias vulneráveis.</p><p>A Prefeitura Municipal de Parauapebas, por meio da secretaria competente, informa que as ações estão em pleno andamento. O prefeito destacou a importância do investimento para a melhoria da qualidade de vida dos cidadãos.</p><p>Mais informações podem ser obtidas diretamente nas secretarias municipais ou pelo site oficial da prefeitura.</p>	\N	social	Assessoria de Comunicação	2026-02-25 15:07:48.525	f	{social,prefeitura,parauapebas}	0	t	2026-03-25 20:34:26.113623	2026-03-25 20:34:26.113623	\N	\N	\N	rascunho	\N	\N	\N	\N	\N
2f013ad9-da21-4ea9-8fbe-86180d61becd	tenant-parauapebas-001	Concurso público para 150 vagas tem edital publicado no Diário Oficial	concurso-publico-para-150-vagas-tem-edital-publicado-no-diario-oficial	Vagas para diversas áreas com salários de R$ 1.800 a R$ 8.500. Inscrições até 30 de abril.	<p>Vagas para diversas áreas com salários de R$ 1.800 a R$ 8.500. Inscrições até 30 de abril.</p><p>A Prefeitura Municipal de Parauapebas, por meio da secretaria competente, informa que as ações estão em pleno andamento. O prefeito destacou a importância do investimento para a melhoria da qualidade de vida dos cidadãos.</p><p>Mais informações podem ser obtidas diretamente nas secretarias municipais ou pelo site oficial da prefeitura.</p>	\N	concursos	Assessoria de Comunicação	2026-03-25 13:43:53.071	f	{concursos,prefeitura,parauapebas}	0	t	2026-03-25 20:34:26.115821	2026-03-25 20:34:26.115821	\N	\N	\N	rascunho	\N	\N	\N	\N	\N
6f1366ac-4243-438a-ab24-41e9204418fa	tenant-parauapebas-001	Prefeitura entrega novo centro de saúde no bairro Rio Verde	prefeitura-entrega-novo-centro-de-saude-no-bairro-rio-verde	Nova unidade de saúde vai atender mais de 15 mil moradores com consultas, exames e medicamentos gratuitos.	<p>Nova unidade de saúde vai atender mais de 15 mil moradores com consultas, exames e medicamentos gratuitos.</p><p>A Prefeitura Municipal de Parauapebas, por meio da secretaria competente, informa que as ações estão em pleno andamento. O prefeito destacou a importância do investimento para a melhoria da qualidade de vida dos cidadãos.</p><p>Mais informações podem ser obtidas diretamente nas secretarias municipais ou pelo site oficial da prefeitura.</p>	\N	saude	Assessoria de Comunicação	2026-02-28 19:33:10.544	t	{saude,prefeitura,parauapebas}	0	t	2026-03-26 00:09:53.909702	2026-03-26 00:09:53.909702	\N	\N	\N	rascunho	\N	\N	\N	\N	\N
556a5981-1c2f-4c3d-98ec-cc9ef30cc953	tenant-parauapebas-001	Obras de pavimentação avançam em 12 ruas do centro da cidade	obras-de-pavimentacao-avancam-em-12-ruas-do-centro-da-cidade	Investimento de R$ 4,2 milhões melhora mobilidade urbana e qualidade de vida dos moradores.	<p>Investimento de R$ 4,2 milhões melhora mobilidade urbana e qualidade de vida dos moradores.</p><p>A Prefeitura Municipal de Parauapebas, por meio da secretaria competente, informa que as ações estão em pleno andamento. O prefeito destacou a importância do investimento para a melhoria da qualidade de vida dos cidadãos.</p><p>Mais informações podem ser obtidas diretamente nas secretarias municipais ou pelo site oficial da prefeitura.</p>	\N	obras	Assessoria de Comunicação	2026-03-07 07:00:27.817	t	{obras,prefeitura,parauapebas}	0	t	2026-03-26 00:09:53.912611	2026-03-26 00:09:53.912611	\N	\N	\N	rascunho	\N	\N	\N	\N	\N
a23abeaf-77ca-4f21-86d9-c576798473ec	tenant-parauapebas-001	Inscrições abertas para cursos profissionalizantes gratuitos	inscricoes-abertas-para-cursos-profissionalizantes-gratuitos	SEMDE oferece 400 vagas em cursos de informática, gastronomia e construção civil para jovens e adultos.	<p>SEMDE oferece 400 vagas em cursos de informática, gastronomia e construção civil para jovens e adultos.</p><p>A Prefeitura Municipal de Parauapebas, por meio da secretaria competente, informa que as ações estão em pleno andamento. O prefeito destacou a importância do investimento para a melhoria da qualidade de vida dos cidadãos.</p><p>Mais informações podem ser obtidas diretamente nas secretarias municipais ou pelo site oficial da prefeitura.</p>	\N	educacao	Assessoria de Comunicação	2026-03-04 12:38:00.304	t	{educacao,prefeitura,parauapebas}	0	t	2026-03-26 00:09:53.915094	2026-03-26 00:09:53.915094	\N	\N	\N	rascunho	\N	\N	\N	\N	\N
6dc699d0-d1a9-4dc6-a658-dc9ebc81c963	tenant-parauapebas-001	Parauapebas recebe certificação de cidade sustentável do IBGE	parauapebas-recebe-certificacao-de-cidade-sustentavel-do-ibge	Município é reconhecido por práticas de gestão ambiental e redução de resíduos sólidos.	<p>Município é reconhecido por práticas de gestão ambiental e redução de resíduos sólidos.</p><p>A Prefeitura Municipal de Parauapebas, por meio da secretaria competente, informa que as ações estão em pleno andamento. O prefeito destacou a importância do investimento para a melhoria da qualidade de vida dos cidadãos.</p><p>Mais informações podem ser obtidas diretamente nas secretarias municipais ou pelo site oficial da prefeitura.</p>	\N	meio-ambiente	Assessoria de Comunicação	2026-03-25 09:56:32.906	f	{meio-ambiente,prefeitura,parauapebas}	0	t	2026-03-26 00:09:53.921012	2026-03-26 00:09:53.921012	\N	\N	\N	rascunho	\N	\N	\N	\N	\N
16bcf546-5d87-4caf-82f4-2bd4abf6edc0	tenant-parauapebas-001	Programa Bolsa Família beneficia mais de 8 mil famílias em Parauapebas	programa-bolsa-familia-beneficia-mais-de-8-mil-familias-em-parauapebas	Repasses mensais garantem renda mínima e acesso a serviços de saúde e educação para famílias vulneráveis.	<p>Repasses mensais garantem renda mínima e acesso a serviços de saúde e educação para famílias vulneráveis.</p><p>A Prefeitura Municipal de Parauapebas, por meio da secretaria competente, informa que as ações estão em pleno andamento. O prefeito destacou a importância do investimento para a melhoria da qualidade de vida dos cidadãos.</p><p>Mais informações podem ser obtidas diretamente nas secretarias municipais ou pelo site oficial da prefeitura.</p>	\N	social	Assessoria de Comunicação	2026-03-06 09:20:48.874	f	{social,prefeitura,parauapebas}	0	t	2026-03-26 00:09:53.923866	2026-03-26 00:09:53.923866	\N	\N	\N	rascunho	\N	\N	\N	\N	\N
ac306e76-2f7c-48c0-aa4f-e9d57ebb24c5	tenant-parauapebas-001	Concurso público para 150 vagas tem edital publicado no Diário Oficial	concurso-publico-para-150-vagas-tem-edital-publicado-no-diario-oficial	Vagas para diversas áreas com salários de R$ 1.800 a R$ 8.500. Inscrições até 30 de abril.	<p>Vagas para diversas áreas com salários de R$ 1.800 a R$ 8.500. Inscrições até 30 de abril.</p><p>A Prefeitura Municipal de Parauapebas, por meio da secretaria competente, informa que as ações estão em pleno andamento. O prefeito destacou a importância do investimento para a melhoria da qualidade de vida dos cidadãos.</p><p>Mais informações podem ser obtidas diretamente nas secretarias municipais ou pelo site oficial da prefeitura.</p>	\N	concursos	Assessoria de Comunicação	2026-03-09 09:23:19.386	f	{concursos,prefeitura,parauapebas}	0	t	2026-03-26 00:09:53.926523	2026-03-26 00:09:53.926523	\N	\N	\N	rascunho	\N	\N	\N	\N	\N
\.


--
-- Data for Name: orcamentos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orcamentos (id, tenant_id, ano, receita_prevista, receita_realizada, despesa_prevista, despesa_realizada, saldo_atual, categorias, updated_at) FROM stdin;
323d19ef-a5de-4a84-ad59-c3968e405d2c	tenant-parauapebas-001	2025	1.85e+09	1.4230001e+09	1.82e+09	1.38e+09	4.3e+07	[{"nome":"Educação","valor":480000000,"percentual":34.8},{"nome":"Saúde","valor":370000000,"percentual":26.8},{"nome":"Infraestrutura","valor":220000000,"percentual":15.9},{"nome":"Assistência Social","valor":150000000,"percentual":10.9},{"nome":"Administração","valor":100000000,"percentual":7.2},{"nome":"Outros","valor":60000000,"percentual":4.4}]	2026-03-25 20:34:26.139295
02774c51-db52-4691-b95b-cd80f6d9ca7e	tenant-parauapebas-001	2025	1.85e+09	1.4230001e+09	1.82e+09	1.38e+09	4.3e+07	[{"nome":"Educação","valor":480000000,"percentual":34.8},{"nome":"Saúde","valor":370000000,"percentual":26.8},{"nome":"Infraestrutura","valor":220000000,"percentual":15.9},{"nome":"Assistência Social","valor":150000000,"percentual":10.9},{"nome":"Administração","valor":100000000,"percentual":7.2},{"nome":"Outros","valor":60000000,"percentual":4.4}]	2026-03-26 00:09:53.950664
\.


--
-- Data for Name: page_blocks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.page_blocks (id, page_id, tipo, conteudo, sort_order, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: pages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pages (id, tenant_id, titulo, slug, status, is_protegida, meta_title, meta_description, autor, created_at, updated_at) FROM stdin;
a7ff0bcc-d689-443e-a90f-d28c360da016	tenant-parauapebas-001	Política de Acessibilidade	acessibilidade	publicado	t	\N	\N	Admin	2026-03-26 00:09:54.146268	2026-03-26 00:09:54.146268
c772d173-93b7-4839-bbbf-b06d30034a42	tenant-parauapebas-001	Mapa do Site	mapa-do-site	publicado	t	\N	\N	Admin	2026-03-26 00:09:54.149943	2026-03-26 00:09:54.149943
85ed191f-bdc7-433d-8102-e83d2db7e51a	tenant-parauapebas-001	Política de Privacidade	politica-de-privacidade	publicado	t	\N	\N	Admin	2026-03-26 00:09:54.152264	2026-03-26 00:09:54.152264
aa7f23cd-00a0-470e-83a1-3111fd9e9a08	tenant-parauapebas-001	O Município	municipio	publicado	f	\N	\N	Admin	2026-03-26 00:09:54.154994	2026-03-26 00:09:54.154994
ad0aa826-feeb-4814-8f40-c620f43aa62e	tenant-parauapebas-001	O Prefeito	governo/prefeito	publicado	f	\N	\N	Admin	2026-03-26 00:09:54.157935	2026-03-26 00:09:54.157935
e37ff398-28d3-4fcd-aaab-656798bb50de	tenant-parauapebas-001	Histórico da Cidade	municipio/historico	publicado	f	\N	\N	Admin	2026-03-26 00:09:54.160179	2026-03-26 00:09:54.160179
\.


--
-- Data for Name: receitas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.receitas (id, tenant_id, data, descricao, fonte, categoria, valor, ano, mes, created_at) FROM stdin;
0fcfeb66-5b80-4daa-962f-0c84dbabe9f9	tenant-parauapebas-001	2025-01-10	CFEM - Compensação Financeira pela Exploração Mineral - 1/2025	CFEM/DNPM	Transferências Correntes	9.907009e+07	2025	1	2026-03-25 20:34:26.194733
c27c1e1c-9b77-4ab5-87c7-51014903af55	tenant-parauapebas-001	2025-02-10	CFEM - Compensação Financeira pela Exploração Mineral - 2/2025	CFEM/DNPM	Transferências Correntes	8.1732456e+07	2025	2	2026-03-25 20:34:26.197162
0c9afd72-7731-44cf-a9fe-5c9e11497f51	tenant-parauapebas-001	2025-03-10	CFEM - Compensação Financeira pela Exploração Mineral - 3/2025	CFEM/DNPM	Transferências Correntes	8.280077e+07	2025	3	2026-03-25 20:34:26.199702
799c0a25-08df-4dc7-bd52-1266e33b7642	tenant-parauapebas-001	2025-04-10	CFEM - Compensação Financeira pela Exploração Mineral - 4/2025	CFEM/DNPM	Transferências Correntes	9.595836e+07	2025	4	2026-03-25 20:34:26.201871
ec53b56c-da37-47fa-a48e-517c2db51218	tenant-parauapebas-001	2025-05-10	CFEM - Compensação Financeira pela Exploração Mineral - 5/2025	CFEM/DNPM	Transferências Correntes	8.482807e+07	2025	5	2026-03-25 20:34:26.204731
feb5969b-7f2d-4e8e-8c36-a3b0eb935af8	tenant-parauapebas-001	2025-06-10	CFEM - Compensação Financeira pela Exploração Mineral - 6/2025	CFEM/DNPM	Transferências Correntes	8.5830264e+07	2025	6	2026-03-25 20:34:26.206865
b441ef04-fa08-4e41-a657-e7060f1b8c84	tenant-parauapebas-001	2025-07-10	CFEM - Compensação Financeira pela Exploração Mineral - 7/2025	CFEM/DNPM	Transferências Correntes	8.3881096e+07	2025	7	2026-03-25 20:34:26.209522
7b9e7be1-02ef-4422-b47c-2d2488272c98	tenant-parauapebas-001	2025-08-10	CFEM - Compensação Financeira pela Exploração Mineral - 8/2025	CFEM/DNPM	Transferências Correntes	8.310083e+07	2025	8	2026-03-25 20:34:26.211828
76f63925-9758-4e28-b0cb-c120312da14a	tenant-parauapebas-001	2025-09-10	CFEM - Compensação Financeira pela Exploração Mineral - 9/2025	CFEM/DNPM	Transferências Correntes	8.843588e+07	2025	9	2026-03-25 20:34:26.215032
b4952565-568b-467a-80d3-df66186e4c04	tenant-parauapebas-001	2025-10-10	CFEM - Compensação Financeira pela Exploração Mineral - 10/2025	CFEM/DNPM	Transferências Correntes	9.386859e+07	2025	10	2026-03-25 20:34:26.21794
8c74eb30-e0c6-42b0-9904-a1a4d7a2be30	tenant-parauapebas-001	2025-11-10	CFEM - Compensação Financeira pela Exploração Mineral - 11/2025	CFEM/DNPM	Transferências Correntes	9.813688e+07	2025	11	2026-03-25 20:34:26.220408
c7e6b4b1-5548-464f-a142-4491d4fbe4ec	tenant-parauapebas-001	2025-12-10	CFEM - Compensação Financeira pela Exploração Mineral - 12/2025	CFEM/DNPM	Transferências Correntes	8.723461e+07	2025	12	2026-03-25 20:34:26.223075
1adef705-5008-4aa2-a65c-db382e6e2231	tenant-parauapebas-001	2025-01-10	CFEM - Compensação Financeira pela Exploração Mineral - 1/2025	CFEM/DNPM	Transferências Correntes	9.3278944e+07	2025	1	2026-03-26 00:09:54.009923
15547b14-ad31-491d-8ea6-2d40b915e5df	tenant-parauapebas-001	2025-02-10	CFEM - Compensação Financeira pela Exploração Mineral - 2/2025	CFEM/DNPM	Transferências Correntes	9.451411e+07	2025	2	2026-03-26 00:09:54.012284
54495be7-a958-46c1-a0df-adcf5038555d	tenant-parauapebas-001	2025-03-10	CFEM - Compensação Financeira pela Exploração Mineral - 3/2025	CFEM/DNPM	Transferências Correntes	8.5788496e+07	2025	3	2026-03-26 00:09:54.015287
0a2d8d9d-eebc-402c-8ad1-8223dee06769	tenant-parauapebas-001	2025-04-10	CFEM - Compensação Financeira pela Exploração Mineral - 4/2025	CFEM/DNPM	Transferências Correntes	9.988091e+07	2025	4	2026-03-26 00:09:54.017363
70e6b55c-82e2-4849-a235-51983118082d	tenant-parauapebas-001	2025-05-10	CFEM - Compensação Financeira pela Exploração Mineral - 5/2025	CFEM/DNPM	Transferências Correntes	9.970445e+07	2025	5	2026-03-26 00:09:54.019579
976888bd-b271-4da9-8f36-853f913aad0b	tenant-parauapebas-001	2025-06-10	CFEM - Compensação Financeira pela Exploração Mineral - 6/2025	CFEM/DNPM	Transferências Correntes	9.6615416e+07	2025	6	2026-03-26 00:09:54.022026
d992f964-e53b-49fa-ac7c-0af599a6200f	tenant-parauapebas-001	2025-07-10	CFEM - Compensação Financeira pela Exploração Mineral - 7/2025	CFEM/DNPM	Transferências Correntes	8.6255256e+07	2025	7	2026-03-26 00:09:54.024777
143155d4-5393-4239-b277-463416ca57cc	tenant-parauapebas-001	2025-08-10	CFEM - Compensação Financeira pela Exploração Mineral - 8/2025	CFEM/DNPM	Transferências Correntes	9.240192e+07	2025	8	2026-03-26 00:09:54.027008
c1c3be3d-f469-4f1f-9bd2-4fd994a330c8	tenant-parauapebas-001	2025-09-10	CFEM - Compensação Financeira pela Exploração Mineral - 9/2025	CFEM/DNPM	Transferências Correntes	8.685905e+07	2025	9	2026-03-26 00:09:54.029337
ba46f927-5e91-40e3-9068-1e06efba03d6	tenant-parauapebas-001	2025-10-10	CFEM - Compensação Financeira pela Exploração Mineral - 10/2025	CFEM/DNPM	Transferências Correntes	8.374348e+07	2025	10	2026-03-26 00:09:54.031542
2c0a97e5-b4bc-4ee9-b5e8-d0fa37ede6c2	tenant-parauapebas-001	2025-11-10	CFEM - Compensação Financeira pela Exploração Mineral - 11/2025	CFEM/DNPM	Transferências Correntes	9.910975e+07	2025	11	2026-03-26 00:09:54.034137
6b81f711-bea9-4860-8a89-a0ab057e482a	tenant-parauapebas-001	2025-12-10	CFEM - Compensação Financeira pela Exploração Mineral - 12/2025	CFEM/DNPM	Transferências Correntes	9.770187e+07	2025	12	2026-03-26 00:09:54.037415
\.


--
-- Data for Name: secretarias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.secretarias (id, tenant_id, nome, slug, sigla, descricao, secretario, foto_secretario, telefone, email, endereco, horario, competencias, ativa, created_at, updated_at) FROM stdin;
392e905f-77fb-4437-a371-3f648109869e	tenant-parauapebas-001	Secretaria Municipal de Saúde	secretaria-municipal-de-saude	SEMSUR	Responsável pela saúde pública municipal.	Dr. Carlos Mendes	\N	(94) 3346-7002	semsur@parauapebas.pa.gov.br	Av. Presidente Médici, 1246 - Centro, Parauapebas - PA	Segunda a Sexta: 08:00 às 14:00	{"Atenção Básica","Vigilância Sanitária","Saúde Mental"}	t	2026-03-25 20:34:26.080104	2026-03-25 20:34:26.080104
538269f5-ef61-499b-8b07-58c8823bb81f	tenant-parauapebas-001	Secretaria Municipal de Educação	secretaria-municipal-de-educacao	SEMED	Gestão da rede pública de ensino.	Maria Aparecida Lima	\N	(94) 3346-8341	semed@parauapebas.pa.gov.br	Av. Presidente Médici, 1246 - Centro, Parauapebas - PA	Segunda a Sexta: 08:00 às 14:00	{"Ensino Fundamental","Educação Infantil",EJA}	t	2026-03-25 20:34:26.083917	2026-03-25 20:34:26.083917
5a4af5ac-4be0-47fe-a499-6422c9168a3d	tenant-parauapebas-001	Secretaria Municipal de Infraestrutura	secretaria-municipal-de-infraestrutura	SEMID	Obras e serviços urbanos.	Eng. João Santos	\N	(94) 3346-4781	semid@parauapebas.pa.gov.br	Av. Presidente Médici, 1246 - Centro, Parauapebas - PA	Segunda a Sexta: 08:00 às 14:00	{"Obras Públicas",Pavimentação,"Iluminação Pública"}	t	2026-03-25 20:34:26.086816	2026-03-25 20:34:26.086816
45d4c23c-ae5a-4750-a86d-369a6cd75bd6	tenant-parauapebas-001	Secretaria Municipal de Finanças	secretaria-municipal-de-financas	SEMAF	Gestão das finanças municipais.	Cláudio Ferreira	\N	(94) 3346-7904	semaf@parauapebas.pa.gov.br	Av. Presidente Médici, 1246 - Centro, Parauapebas - PA	Segunda a Sexta: 08:00 às 14:00	{"Orçamento Municipal",Contabilidade,Receita}	t	2026-03-25 20:34:26.089986	2026-03-25 20:34:26.089986
a190b630-db3b-4b59-834c-6263c8c388ed	tenant-parauapebas-001	Secretaria Municipal de Assistência Social	secretaria-municipal-de-assistencia-social	SEMAST	Políticas de assistência social.	Maria José Costa	\N	(94) 3346-9019	semast@parauapebas.pa.gov.br	Av. Presidente Médici, 1246 - Centro, Parauapebas - PA	Segunda a Sexta: 08:00 às 14:00	{CRAS,CREAS,"Programas Sociais"}	t	2026-03-25 20:34:26.093536	2026-03-25 20:34:26.093536
8634f3bc-e7b0-4e74-88f0-354e6b187669	tenant-parauapebas-001	Secretaria Municipal de Meio Ambiente	secretaria-municipal-de-meio-ambiente	SEMMA	Gestão ambiental do município.	Dr. Paulo Amazônia	\N	(94) 3346-7698	semma@parauapebas.pa.gov.br	Av. Presidente Médici, 1246 - Centro, Parauapebas - PA	Segunda a Sexta: 08:00 às 14:00	{"Licenciamento Ambiental","Áreas Verdes",Saneamento}	t	2026-03-25 20:34:26.09752	2026-03-25 20:34:26.09752
85a25756-e6e6-43c6-b440-f2c641f6a3ee	tenant-parauapebas-001	Secretaria Municipal de Saúde	secretaria-municipal-de-saude	SEMSUR	Responsável pela saúde pública municipal.	Dr. Carlos Mendes	\N	(94) 3346-1811	semsur@parauapebas.pa.gov.br	Av. Presidente Médici, 1246 - Centro, Parauapebas - PA	Segunda a Sexta: 08:00 às 14:00	{"Atenção Básica","Vigilância Sanitária","Saúde Mental"}	t	2026-03-26 00:09:53.888955	2026-03-26 00:09:53.888955
14c00334-0482-4003-b6db-5502f626ba10	tenant-parauapebas-001	Secretaria Municipal de Educação	secretaria-municipal-de-educacao	SEMED	Gestão da rede pública de ensino.	Maria Aparecida Lima	\N	(94) 3346-3032	semed@parauapebas.pa.gov.br	Av. Presidente Médici, 1246 - Centro, Parauapebas - PA	Segunda a Sexta: 08:00 às 14:00	{"Ensino Fundamental","Educação Infantil",EJA}	t	2026-03-26 00:09:53.893979	2026-03-26 00:09:53.893979
38b014d4-2a62-46a6-908d-0d7a04e78ce7	tenant-parauapebas-001	Secretaria Municipal de Infraestrutura	secretaria-municipal-de-infraestrutura	SEMID	Obras e serviços urbanos.	Eng. João Santos	\N	(94) 3346-8999	semid@parauapebas.pa.gov.br	Av. Presidente Médici, 1246 - Centro, Parauapebas - PA	Segunda a Sexta: 08:00 às 14:00	{"Obras Públicas",Pavimentação,"Iluminação Pública"}	t	2026-03-26 00:09:53.897087	2026-03-26 00:09:53.897087
36d3c2b7-8e3c-4ee6-af0f-39e1236a4499	tenant-parauapebas-001	Secretaria Municipal de Finanças	secretaria-municipal-de-financas	SEMAF	Gestão das finanças municipais.	Cláudio Ferreira	\N	(94) 3346-3275	semaf@parauapebas.pa.gov.br	Av. Presidente Médici, 1246 - Centro, Parauapebas - PA	Segunda a Sexta: 08:00 às 14:00	{"Orçamento Municipal",Contabilidade,Receita}	t	2026-03-26 00:09:53.899456	2026-03-26 00:09:53.899456
07a64966-f452-466f-91cd-5a0597727339	tenant-parauapebas-001	Secretaria Municipal de Assistência Social	secretaria-municipal-de-assistencia-social	SEMAST	Políticas de assistência social.	Maria José Costa	\N	(94) 3346-3487	semast@parauapebas.pa.gov.br	Av. Presidente Médici, 1246 - Centro, Parauapebas - PA	Segunda a Sexta: 08:00 às 14:00	{CRAS,CREAS,"Programas Sociais"}	t	2026-03-26 00:09:53.901964	2026-03-26 00:09:53.901964
0625496b-c98e-454c-a9b1-498aa2687dfc	tenant-parauapebas-001	Secretaria Municipal de Meio Ambiente	secretaria-municipal-de-meio-ambiente	SEMMA	Gestão ambiental do município.	Dr. Paulo Amazônia	\N	(94) 3346-5031	semma@parauapebas.pa.gov.br	Av. Presidente Médici, 1246 - Centro, Parauapebas - PA	Segunda a Sexta: 08:00 às 14:00	{"Licenciamento Ambiental","Áreas Verdes",Saneamento}	t	2026-03-26 00:09:53.904901	2026-03-26 00:09:53.904901
\.


--
-- Data for Name: servicos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.servicos (id, tenant_id, titulo, slug, descricao, categoria, orgao, link_externo, requisitos, documentos, prazo_atendimento, gratuito, online, icone, ativo, created_at, updated_at) FROM stdin;
79497c2c-c7d1-41c9-88f3-f2064e423127	tenant-parauapebas-001	Certidão de IPTU	certidao-de-iptu	Emissão de certidão de débitos do IPTU para o imóvel.	tributos	\N	\N	{"Documento de identidade",CPF,"Comprovante de residência"}	{"RG ou CNH",CPF}	3 a 5 dias úteis	t	t	FileText	t	2026-03-25 20:34:26.118239	2026-03-25 20:34:26.118239
af5910d8-4e3a-48a6-ac7b-5538fd3280e6	tenant-parauapebas-001	Alvará de Funcionamento	alvara-de-funcionamento	Solicitação de alvará para abertura e funcionamento de estabelecimentos comerciais.	licencas	\N	\N	{"Documento de identidade",CPF,"Comprovante de residência"}	{"RG ou CNH",CPF}	3 a 5 dias úteis	f	f	Building	t	2026-03-25 20:34:26.121105	2026-03-25 20:34:26.121105
e5304f85-e381-43da-baad-03674f73d2c6	tenant-parauapebas-001	Atendimento na UBS	atendimento-na-ubs	Agendamento de consultas médicas nas Unidades Básicas de Saúde.	saude	\N	\N	{"Documento de identidade",CPF,"Comprovante de residência"}	{"RG ou CNH",CPF}	3 a 5 dias úteis	t	t	Heart	t	2026-03-25 20:34:26.123333	2026-03-25 20:34:26.123333
18da8878-af38-4183-b26e-3abce6b3c0e4	tenant-parauapebas-001	Matrícula Escolar	matricula-escolar	Solicitação de matrícula para alunos da rede pública municipal de ensino.	educacao	\N	\N	{"Documento de identidade",CPF,"Comprovante de residência"}	{"RG ou CNH",CPF}	3 a 5 dias úteis	t	t	BookOpen	t	2026-03-25 20:34:26.125647	2026-03-25 20:34:26.125647
aac72b73-089c-4973-b2be-7681aa9f2a81	tenant-parauapebas-001	Nota Fiscal Eletrônica	nota-fiscal-eletronica	Emissão de NFS-e para prestadores de serviço.	tributos	\N	\N	{"Documento de identidade",CPF,"Comprovante de residência"}	{"RG ou CNH",CPF}	3 a 5 dias úteis	t	t	Receipt	t	2026-03-25 20:34:26.128604	2026-03-25 20:34:26.128604
7eefc314-876e-4990-b23a-f8b6fefb1f9e	tenant-parauapebas-001	Habite-se	habite-se	Solicitação de habite-se para construções e reformas.	obras	\N	\N	{"Documento de identidade",CPF,"Comprovante de residência"}	{"RG ou CNH",CPF}	3 a 5 dias úteis	f	f	Home	t	2026-03-25 20:34:26.131388	2026-03-25 20:34:26.131388
d227eb76-2cb2-4b62-9752-ec4617f718f9	tenant-parauapebas-001	Ouvidoria Municipal	ouvidoria-municipal	Registre reclamações, denúncias, sugestões e elogios sobre serviços municipais.	cidadania	\N	\N	{"Documento de identidade",CPF,"Comprovante de residência"}	{"RG ou CNH",CPF}	3 a 5 dias úteis	t	t	MessageSquare	t	2026-03-25 20:34:26.134118	2026-03-25 20:34:26.134118
533ed8c3-5db2-40e7-8daa-b2d241444f04	tenant-parauapebas-001	BPC — Benefício de Prestação Continuada	bpc--beneficio-de-prestacao-continuada	Orientação e encaminhamento para o benefício federal BPC/LOAS.	social	\N	\N	{"Documento de identidade",CPF,"Comprovante de residência"}	{"RG ou CNH",CPF}	3 a 5 dias úteis	t	f	Users	t	2026-03-25 20:34:26.137187	2026-03-25 20:34:26.137187
3b9a9379-675e-4393-9bb8-fd00f55475e8	tenant-parauapebas-001	Certidão de IPTU	certidao-de-iptu	Emissão de certidão de débitos do IPTU para o imóvel.	tributos	\N	\N	{"Documento de identidade",CPF,"Comprovante de residência"}	{"RG ou CNH",CPF}	3 a 5 dias úteis	t	t	FileText	t	2026-03-26 00:09:53.929377	2026-03-26 00:09:53.929377
4af13d86-21e7-4a9e-bfde-fe476b6df98e	tenant-parauapebas-001	Alvará de Funcionamento	alvara-de-funcionamento	Solicitação de alvará para abertura e funcionamento de estabelecimentos comerciais.	licencas	\N	\N	{"Documento de identidade",CPF,"Comprovante de residência"}	{"RG ou CNH",CPF}	3 a 5 dias úteis	f	f	Building	t	2026-03-26 00:09:53.931619	2026-03-26 00:09:53.931619
582a35d0-af41-46ad-9fc2-3984ff9d559f	tenant-parauapebas-001	Atendimento na UBS	atendimento-na-ubs	Agendamento de consultas médicas nas Unidades Básicas de Saúde.	saude	\N	\N	{"Documento de identidade",CPF,"Comprovante de residência"}	{"RG ou CNH",CPF}	3 a 5 dias úteis	t	t	Heart	t	2026-03-26 00:09:53.934179	2026-03-26 00:09:53.934179
012d328b-e9b4-43c6-910b-65d6ced486c9	tenant-parauapebas-001	Matrícula Escolar	matricula-escolar	Solicitação de matrícula para alunos da rede pública municipal de ensino.	educacao	\N	\N	{"Documento de identidade",CPF,"Comprovante de residência"}	{"RG ou CNH",CPF}	3 a 5 dias úteis	t	t	BookOpen	t	2026-03-26 00:09:53.936313	2026-03-26 00:09:53.936313
96e6450f-51a4-46cd-89ea-a50eda32a1dd	tenant-parauapebas-001	Nota Fiscal Eletrônica	nota-fiscal-eletronica	Emissão de NFS-e para prestadores de serviço.	tributos	\N	\N	{"Documento de identidade",CPF,"Comprovante de residência"}	{"RG ou CNH",CPF}	3 a 5 dias úteis	t	t	Receipt	t	2026-03-26 00:09:53.939492	2026-03-26 00:09:53.939492
5b650e98-120e-4521-bd03-f1fd305d8f67	tenant-parauapebas-001	Habite-se	habite-se	Solicitação de habite-se para construções e reformas.	obras	\N	\N	{"Documento de identidade",CPF,"Comprovante de residência"}	{"RG ou CNH",CPF}	3 a 5 dias úteis	f	f	Home	t	2026-03-26 00:09:53.942798	2026-03-26 00:09:53.942798
0f2e3168-f25a-4c98-9d03-7db0410cf6de	tenant-parauapebas-001	Ouvidoria Municipal	ouvidoria-municipal	Registre reclamações, denúncias, sugestões e elogios sobre serviços municipais.	cidadania	\N	\N	{"Documento de identidade",CPF,"Comprovante de residência"}	{"RG ou CNH",CPF}	3 a 5 dias úteis	t	t	MessageSquare	t	2026-03-26 00:09:53.944977	2026-03-26 00:09:53.944977
bb447ee1-acbb-457b-88d7-5724490dd6f5	tenant-parauapebas-001	BPC — Benefício de Prestação Continuada	bpc--beneficio-de-prestacao-continuada	Orientação e encaminhamento para o benefício federal BPC/LOAS.	social	\N	\N	{"Documento de identidade",CPF,"Comprovante de residência"}	{"RG ou CNH",CPF}	3 a 5 dias úteis	t	f	Users	t	2026-03-26 00:09:53.947969	2026-03-26 00:09:53.947969
\.


--
-- Data for Name: servidores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.servidores (id, tenant_id, nome, cargo, secretaria, vinculo, remuneracao, admissao, created_at) FROM stdin;
e1b08c4e-c1c7-485b-a96a-d2edac454444	tenant-parauapebas-001	Servidor A. Silva	Agente Comunitário de Saúde	SEMSUR	Contratado	10228.2	2015-03-01	2026-03-25 20:34:26.226157
848c7d34-b8d8-4d82-8efc-ec048eac5bc1	tenant-parauapebas-001	Servidor B. Silva	Professor	SEMED	Efetivo	9666.85	2015-03-01	2026-03-25 20:34:26.228837
0302fd7e-14b8-45a6-99a1-230e0dbc596c	tenant-parauapebas-001	Servidor C. Silva	Engenheiro	SEMID	Efetivo	2726.59	2015-03-01	2026-03-25 20:34:26.231541
96839aae-17b7-4ba6-a19b-c192eb9a2591	tenant-parauapebas-001	Servidor D. Silva	Assistente Social	SEMAF	Contratado	3267.73	2015-03-01	2026-03-25 20:34:26.233885
f3c966ec-86c8-4863-89e4-84f86c6b19db	tenant-parauapebas-001	Servidor E. Silva	Médico	SEMAST	Efetivo	10008.39	2015-03-01	2026-03-25 20:34:26.23667
6e929aaf-058f-4cfd-83a1-7753e2353d65	tenant-parauapebas-001	Servidor F. Silva	Auditor Fiscal	SEMSUR	Efetivo	10796.1	2015-03-01	2026-03-25 20:34:26.238934
19acacf6-6df0-461f-8e18-ec13f93ad0fb	tenant-parauapebas-001	Servidor G. Silva	Agente Comunitário de Saúde	SEMED	Contratado	7100.53	2015-03-01	2026-03-25 20:34:26.241081
b0e0536e-7fc5-4d9c-9113-1dc123137652	tenant-parauapebas-001	Servidor H. Silva	Professor	SEMID	Efetivo	7141	2015-03-01	2026-03-25 20:34:26.243301
b0de0716-45cc-4db4-97f4-213032f0d77d	tenant-parauapebas-001	Servidor I. Silva	Engenheiro	SEMAF	Efetivo	2033.6	2015-03-01	2026-03-25 20:34:26.246534
15a94e67-d264-42fd-85b6-b3ce01042f24	tenant-parauapebas-001	Servidor J. Silva	Assistente Social	SEMAST	Contratado	7607.64	2015-03-01	2026-03-25 20:34:26.248852
08f8c6fc-fb05-45e6-9eb8-254abae84d58	tenant-parauapebas-001	Servidor K. Silva	Médico	SEMSUR	Efetivo	7982.44	2015-03-01	2026-03-25 20:34:26.251074
2bd7f6c8-4a0f-4f11-bfc9-c5d5df59852c	tenant-parauapebas-001	Servidor L. Silva	Auditor Fiscal	SEMED	Efetivo	10447.99	2015-03-01	2026-03-25 20:34:26.253657
2f4e0f2d-b47c-4228-8e96-d2d8884cd51c	tenant-parauapebas-001	Servidor M. Silva	Agente Comunitário de Saúde	SEMID	Contratado	4074.37	2015-03-01	2026-03-25 20:34:26.25639
82b7dc65-df1d-4faf-9477-e1051fb7b125	tenant-parauapebas-001	Servidor N. Silva	Professor	SEMAF	Efetivo	7103.8	2015-03-01	2026-03-25 20:34:26.258441
c57af7b4-b5bb-40a7-a307-e2418677e937	tenant-parauapebas-001	Servidor O. Silva	Engenheiro	SEMAST	Efetivo	3853.85	2015-03-01	2026-03-25 20:34:26.260584
324d50ff-5cd3-42ed-ba0f-37aba5fb122e	tenant-parauapebas-001	Servidor A. Silva	Agente Comunitário de Saúde	SEMSUR	Contratado	10856.71	2015-03-01	2026-03-26 00:09:54.039836
a1c641f5-7af0-4332-b991-8f550ae83a9f	tenant-parauapebas-001	Servidor B. Silva	Professor	SEMED	Efetivo	6055.98	2015-03-01	2026-03-26 00:09:54.042614
67ae626d-2481-48c1-acb4-5641d4cfa860	tenant-parauapebas-001	Servidor C. Silva	Engenheiro	SEMID	Efetivo	3509.32	2015-03-01	2026-03-26 00:09:54.044969
7e155357-2f07-4022-b5f3-8654289eb18e	tenant-parauapebas-001	Servidor D. Silva	Assistente Social	SEMAF	Contratado	4673.24	2015-03-01	2026-03-26 00:09:54.047688
01459a81-7453-4c1c-bb37-293d9ea4d6e6	tenant-parauapebas-001	Servidor E. Silva	Médico	SEMAST	Efetivo	2937.52	2015-03-01	2026-03-26 00:09:54.049672
6ff81358-d249-4012-bbc5-00bc172288a1	tenant-parauapebas-001	Servidor F. Silva	Auditor Fiscal	SEMSUR	Efetivo	3700.91	2015-03-01	2026-03-26 00:09:54.052178
718c6128-24a5-44a2-99d5-44e995e43400	tenant-parauapebas-001	Servidor G. Silva	Agente Comunitário de Saúde	SEMED	Contratado	4662.61	2015-03-01	2026-03-26 00:09:54.055193
d7af9525-77cc-4546-b39c-70f224ba66b1	tenant-parauapebas-001	Servidor H. Silva	Professor	SEMID	Efetivo	4070.78	2015-03-01	2026-03-26 00:09:54.058023
4d3511ef-9ca5-43e8-93bc-b7b9151760ea	tenant-parauapebas-001	Servidor I. Silva	Engenheiro	SEMAF	Efetivo	8098.42	2015-03-01	2026-03-26 00:09:54.060721
64aacf3c-faea-4767-8eac-8657f68aafbc	tenant-parauapebas-001	Servidor J. Silva	Assistente Social	SEMAST	Contratado	10453.05	2015-03-01	2026-03-26 00:09:54.062818
c512a15f-0d66-4b2e-93f3-be0297ae8faf	tenant-parauapebas-001	Servidor K. Silva	Médico	SEMSUR	Efetivo	7340.78	2015-03-01	2026-03-26 00:09:54.06562
3b26336f-c4c2-404a-9a25-d830c783e163	tenant-parauapebas-001	Servidor L. Silva	Auditor Fiscal	SEMED	Efetivo	5431.18	2015-03-01	2026-03-26 00:09:54.06816
6d8851ea-f62d-4bfd-8bd8-aad7e6cd1381	tenant-parauapebas-001	Servidor M. Silva	Agente Comunitário de Saúde	SEMID	Contratado	11773.82	2015-03-01	2026-03-26 00:09:54.071183
8bab9e65-992f-4572-af33-f2f071ecb2f7	tenant-parauapebas-001	Servidor N. Silva	Professor	SEMAF	Efetivo	5647.76	2015-03-01	2026-03-26 00:09:54.073209
5b11b7e6-3cf1-499f-95bc-86e49aa7bf9f	tenant-parauapebas-001	Servidor O. Silva	Engenheiro	SEMAST	Efetivo	9684.06	2015-03-01	2026-03-26 00:09:54.075645
\.


--
-- Data for Name: site_config; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.site_config (id, tenant_id, hero_type, hero_video_url, hero_sections, site_title, site_description, google_analytics_id, google_tag_manager_id, social_facebook, social_instagram, social_youtube, social_twitter, social_linkedin, floating_widget_enabled, floating_widget_position, vlibras_enabled, rodape_texto, sic_prazo_resposta, sic_email, modo_manutencao, modo_manutencao_msg, updated_at) FROM stdin;
73ba9806-d234-47ec-8b5b-d40fda7ab5ae	tenant-parauapebas-001	carousel	\N	[]	Prefeitura Municipal de Parauapebas	Portal oficial da Prefeitura Municipal de Parauapebas — Pará	\N	\N	https://facebook.com/prefeituraparauapebas	https://instagram.com/prefeituraparauapebas	https://youtube.com/@prefeituraparauapebas	\N	\N	t	right	t	Prefeitura Municipal de Parauapebas — CNPJ: 34.070.421/0001-60 — Av. Presidente Médici, 1246 - Centro — (94) 3346-0000	20	sic@parauapebas.pa.gov.br	f	\N	2026-03-26 00:10:29.792
\.


--
-- Data for Name: tenants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tenants (id, nome, slug, brasao, cor_primaria, cor_secundaria, cor_terciaria, estado, populacao, area, fundacao, lema, site_url, modulos_ativos, created_at, updated_at) FROM stdin;
tenant-parauapebas-001	Prefeitura Municipal de Parauapebas	parauapebas	/images/brasao.png	#1351B4	#168821	#FFCD07	Pará	230000	6960.7	1988-01-01	Trabalhar para o povo, crescer com o cidadão	https://www.parauapebas.pa.gov.br	{site,ouvidoria,transparencia}	2026-03-25 20:34:26.029261	2026-03-25 20:34:26.029261
\.


--
-- Data for Name: transparency_docs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transparency_docs (id, tenant_id, categoria, subcategoria, titulo, descricao, ano_referencia, periodo_referencia, file_url, nome_arquivo, tamanho_bytes, downloads, publicado_por, publicado_em, expira_em, created_at) FROM stdin;
590624a7-14d2-45ef-88e5-bc7c1fdf23f0	tenant-parauapebas-001	orcamento	\N	LOA 2026 — Lei Orçamentária Anual	\N	2026	Exercício 2026	/documentos/LOA-2026.pdf	LOA-2026.pdf	2048000	0	Admin Municipal	2026-03-26 00:09:54.184	\N	2026-03-26 00:09:54.185115
cbc49976-29a9-44f9-bb75-d7ee2e9c918c	tenant-parauapebas-001	despesas	\N	Folha de Pagamento — Março/2026	\N	2026	Março/2026	/documentos/Folha-Marco-2026.pdf	Folha-Marco-2026.pdf	512000	0	Admin Municipal	2026-03-26 00:09:54.187	\N	2026-03-26 00:09:54.187966
d4f248ff-bd47-4114-88fe-3fe5345137e7	tenant-parauapebas-001	contratos	\N	Contratos Vigentes — 1º Trimestre 2026	\N	2026	1º Trimestre	/documentos/Contratos-Q1-2026.pdf	Contratos-Q1-2026.pdf	1024000	0	Admin Municipal	2026-03-26 00:09:54.189	\N	2026-03-26 00:09:54.190062
\.


--
-- Name: agenda agenda_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agenda
    ADD CONSTRAINT agenda_pkey PRIMARY KEY (id);


--
-- Name: banners banners_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.banners
    ADD CONSTRAINT banners_pkey PRIMARY KEY (id);


--
-- Name: bid_events bid_events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bid_events
    ADD CONSTRAINT bid_events_pkey PRIMARY KEY (id);


--
-- Name: concursos concursos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.concursos
    ADD CONSTRAINT concursos_pkey PRIMARY KEY (id);


--
-- Name: contracts contracts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_pkey PRIMARY KEY (id);


--
-- Name: despesas despesas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.despesas
    ADD CONSTRAINT despesas_pkey PRIMARY KEY (id);


--
-- Name: galeria galeria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.galeria
    ADD CONSTRAINT galeria_pkey PRIMARY KEY (id);


--
-- Name: gallery_albums gallery_albums_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gallery_albums
    ADD CONSTRAINT gallery_albums_pkey PRIMARY KEY (id);


--
-- Name: gallery_items gallery_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gallery_items
    ADD CONSTRAINT gallery_items_pkey PRIMARY KEY (id);


--
-- Name: gestores gestores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gestores
    ADD CONSTRAINT gestores_pkey PRIMARY KEY (id);


--
-- Name: legislacao legislacao_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.legislacao
    ADD CONSTRAINT legislacao_pkey PRIMARY KEY (id);


--
-- Name: licitacoes licitacoes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.licitacoes
    ADD CONSTRAINT licitacoes_pkey PRIMARY KEY (id);


--
-- Name: menu_items menu_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT menu_items_pkey PRIMARY KEY (id);


--
-- Name: municipio_info municipio_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.municipio_info
    ADD CONSTRAINT municipio_info_pkey PRIMARY KEY (id);


--
-- Name: news_categories news_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news_categories
    ADD CONSTRAINT news_categories_pkey PRIMARY KEY (id);


--
-- Name: news_versions news_versions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news_versions
    ADD CONSTRAINT news_versions_pkey PRIMARY KEY (id);


--
-- Name: noticias noticias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.noticias
    ADD CONSTRAINT noticias_pkey PRIMARY KEY (id);


--
-- Name: orcamentos orcamentos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orcamentos
    ADD CONSTRAINT orcamentos_pkey PRIMARY KEY (id);


--
-- Name: page_blocks page_blocks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.page_blocks
    ADD CONSTRAINT page_blocks_pkey PRIMARY KEY (id);


--
-- Name: pages pages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_pkey PRIMARY KEY (id);


--
-- Name: receitas receitas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receitas
    ADD CONSTRAINT receitas_pkey PRIMARY KEY (id);


--
-- Name: secretarias secretarias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.secretarias
    ADD CONSTRAINT secretarias_pkey PRIMARY KEY (id);


--
-- Name: servicos servicos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicos
    ADD CONSTRAINT servicos_pkey PRIMARY KEY (id);


--
-- Name: servidores servidores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servidores
    ADD CONSTRAINT servidores_pkey PRIMARY KEY (id);


--
-- Name: site_config site_config_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.site_config
    ADD CONSTRAINT site_config_pkey PRIMARY KEY (id);


--
-- Name: site_config site_config_tenant_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.site_config
    ADD CONSTRAINT site_config_tenant_id_unique UNIQUE (tenant_id);


--
-- Name: tenants tenants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_pkey PRIMARY KEY (id);


--
-- Name: tenants tenants_slug_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_slug_unique UNIQUE (slug);


--
-- Name: transparency_docs transparency_docs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transparency_docs
    ADD CONSTRAINT transparency_docs_pkey PRIMARY KEY (id);


--
-- Name: idx_legislacao_fts; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_legislacao_fts ON public.legislacao USING gin (to_tsvector('portuguese'::regconfig, ((numero || ' '::text) || ementa)));


--
-- Name: idx_licitacoes_fts; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_licitacoes_fts ON public.licitacoes USING gin (to_tsvector('portuguese'::regconfig, ((numero || ' '::text) || objeto)));


--
-- Name: idx_noticias_fts; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_noticias_fts ON public.noticias USING gin (to_tsvector('portuguese'::regconfig, ((((titulo || ' '::text) || COALESCE(resumo, ''::text)) || ' '::text) || COALESCE(conteudo, ''::text))));


--
-- Name: idx_pages_fts; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pages_fts ON public.pages USING gin (to_tsvector('portuguese'::regconfig, ((titulo || ' '::text) || COALESCE(meta_description, ''::text))));


--
-- Name: agenda agenda_secretaria_id_secretarias_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agenda
    ADD CONSTRAINT agenda_secretaria_id_secretarias_id_fk FOREIGN KEY (secretaria_id) REFERENCES public.secretarias(id);


--
-- Name: agenda agenda_tenant_id_tenants_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agenda
    ADD CONSTRAINT agenda_tenant_id_tenants_id_fk FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: banners banners_tenant_id_tenants_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.banners
    ADD CONSTRAINT banners_tenant_id_tenants_id_fk FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: bid_events bid_events_licitacao_id_licitacoes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bid_events
    ADD CONSTRAINT bid_events_licitacao_id_licitacoes_id_fk FOREIGN KEY (licitacao_id) REFERENCES public.licitacoes(id) ON DELETE CASCADE;


--
-- Name: concursos concursos_tenant_id_tenants_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.concursos
    ADD CONSTRAINT concursos_tenant_id_tenants_id_fk FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: contracts contracts_licitacao_id_licitacoes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_licitacao_id_licitacoes_id_fk FOREIGN KEY (licitacao_id) REFERENCES public.licitacoes(id);


--
-- Name: contracts contracts_tenant_id_tenants_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_tenant_id_tenants_id_fk FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: despesas despesas_tenant_id_tenants_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.despesas
    ADD CONSTRAINT despesas_tenant_id_tenants_id_fk FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: galeria galeria_tenant_id_tenants_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.galeria
    ADD CONSTRAINT galeria_tenant_id_tenants_id_fk FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: gallery_albums gallery_albums_tenant_id_tenants_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gallery_albums
    ADD CONSTRAINT gallery_albums_tenant_id_tenants_id_fk FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: gallery_items gallery_items_album_id_gallery_albums_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gallery_items
    ADD CONSTRAINT gallery_items_album_id_gallery_albums_id_fk FOREIGN KEY (album_id) REFERENCES public.gallery_albums(id) ON DELETE CASCADE;


--
-- Name: gestores gestores_tenant_id_tenants_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gestores
    ADD CONSTRAINT gestores_tenant_id_tenants_id_fk FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: legislacao legislacao_tenant_id_tenants_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.legislacao
    ADD CONSTRAINT legislacao_tenant_id_tenants_id_fk FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: licitacoes licitacoes_secretaria_id_secretarias_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.licitacoes
    ADD CONSTRAINT licitacoes_secretaria_id_secretarias_id_fk FOREIGN KEY (secretaria_id) REFERENCES public.secretarias(id);


--
-- Name: licitacoes licitacoes_tenant_id_tenants_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.licitacoes
    ADD CONSTRAINT licitacoes_tenant_id_tenants_id_fk FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: menu_items menu_items_tenant_id_tenants_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT menu_items_tenant_id_tenants_id_fk FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: municipio_info municipio_info_tenant_id_tenants_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.municipio_info
    ADD CONSTRAINT municipio_info_tenant_id_tenants_id_fk FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: news_categories news_categories_tenant_id_tenants_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news_categories
    ADD CONSTRAINT news_categories_tenant_id_tenants_id_fk FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: news_versions news_versions_noticia_id_noticias_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news_versions
    ADD CONSTRAINT news_versions_noticia_id_noticias_id_fk FOREIGN KEY (noticia_id) REFERENCES public.noticias(id) ON DELETE CASCADE;


--
-- Name: noticias noticias_categoria_id_news_categories_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.noticias
    ADD CONSTRAINT noticias_categoria_id_news_categories_id_fk FOREIGN KEY (categoria_id) REFERENCES public.news_categories(id);


--
-- Name: noticias noticias_secretaria_id_secretarias_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.noticias
    ADD CONSTRAINT noticias_secretaria_id_secretarias_id_fk FOREIGN KEY (secretaria_id) REFERENCES public.secretarias(id);


--
-- Name: noticias noticias_tenant_id_tenants_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.noticias
    ADD CONSTRAINT noticias_tenant_id_tenants_id_fk FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: orcamentos orcamentos_tenant_id_tenants_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orcamentos
    ADD CONSTRAINT orcamentos_tenant_id_tenants_id_fk FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: page_blocks page_blocks_page_id_pages_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.page_blocks
    ADD CONSTRAINT page_blocks_page_id_pages_id_fk FOREIGN KEY (page_id) REFERENCES public.pages(id) ON DELETE CASCADE;


--
-- Name: pages pages_tenant_id_tenants_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_tenant_id_tenants_id_fk FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: receitas receitas_tenant_id_tenants_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receitas
    ADD CONSTRAINT receitas_tenant_id_tenants_id_fk FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: secretarias secretarias_tenant_id_tenants_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.secretarias
    ADD CONSTRAINT secretarias_tenant_id_tenants_id_fk FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: servicos servicos_tenant_id_tenants_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicos
    ADD CONSTRAINT servicos_tenant_id_tenants_id_fk FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: servidores servidores_tenant_id_tenants_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servidores
    ADD CONSTRAINT servidores_tenant_id_tenants_id_fk FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: site_config site_config_tenant_id_tenants_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.site_config
    ADD CONSTRAINT site_config_tenant_id_tenants_id_fk FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: transparency_docs transparency_docs_tenant_id_tenants_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transparency_docs
    ADD CONSTRAINT transparency_docs_tenant_id_tenants_id_fk FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- PostgreSQL database dump complete
--

\unrestrict Olh3xDZCrC2eLftxI2gSdptPxlinWWcnSsF0ViaOhWbyMi0GhidanqRK2cPPVWj

