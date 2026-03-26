--
-- PostgreSQL database dump
--

\restrict W9gmUcBqbPL0Do8eLvnRVIkiiQhJYowvUugcFqgPspPrFoe2uZStOPdckJ2Zyd9

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
-- Name: chat_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chat_sessions (
    id text NOT NULL,
    tenant_id text NOT NULL,
    session_token text NOT NULL,
    total_mensagens integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    last_activity_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.chat_sessions OWNER TO postgres;

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
-- Name: contracheque_linhas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contracheque_linhas (
    id text NOT NULL,
    contracheque_id text NOT NULL,
    tipo text NOT NULL,
    codigo text NOT NULL,
    descricao text NOT NULL,
    referencia text,
    valor real DEFAULT 0 NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.contracheque_linhas OWNER TO postgres;

--
-- Name: contracheques; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contracheques (
    id text NOT NULL,
    tenant_id text NOT NULL,
    servidor_id text NOT NULL,
    mes integer NOT NULL,
    ano integer NOT NULL,
    competencia text NOT NULL,
    total_bruto real DEFAULT 0 NOT NULL,
    total_descontos real DEFAULT 0 NOT NULL,
    total_liquido real DEFAULT 0 NOT NULL,
    status text DEFAULT 'pago'::text NOT NULL,
    cargo_na_competencia text,
    secretaria_na_competencia text,
    nivel_na_competencia text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.contracheques OWNER TO postgres;

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
-- Name: fale_conosco_config; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fale_conosco_config (
    id text NOT NULL,
    tenant_id text NOT NULL,
    habilitado boolean DEFAULT true NOT NULL,
    nome_assistente text DEFAULT 'Assistente Municipal'::text NOT NULL,
    saudacao text DEFAULT 'Olá! Como posso ajudar você hoje?'::text NOT NULL,
    system_prompt text DEFAULT 'Você é um assistente virtual da Prefeitura Municipal. Responda de forma objetiva, cordial e em português brasileiro. Ajude os cidadãos com informações sobre serviços, transparência, ouvidoria e demais assuntos municipais. Não forneça informações que não sejam de sua competência.'::text NOT NULL,
    modelo_ia text DEFAULT 'gpt-4o-mini'::text NOT NULL,
    temperatura text DEFAULT '0.7'::text NOT NULL,
    max_tokens integer DEFAULT 500 NOT NULL,
    avatar_url text,
    cor_botao text DEFAULT '#1351B4'::text NOT NULL,
    tema_widget text DEFAULT 'light'::text NOT NULL,
    canais_ativos jsonb DEFAULT '{"sic": true, "ouvidoria": true}'::jsonb NOT NULL,
    topicos_proibidos text[] DEFAULT '{"política partidária",candidatos,eleições}'::text[] NOT NULL,
    mensagem_offline text DEFAULT 'Nosso atendimento está temporariamente indisponível. Por favor, tente novamente mais tarde.'::text NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.fale_conosco_config OWNER TO postgres;

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
-- Name: historico_funcional; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historico_funcional (
    id text NOT NULL,
    servidor_id text NOT NULL,
    data date NOT NULL,
    tipo text NOT NULL,
    descricao text NOT NULL,
    portaria text,
    portaria_url text,
    despacho text,
    secretaria_destino text,
    cargo_apos text,
    observacoes text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.historico_funcional OWNER TO postgres;

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
-- Name: manifestacoes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.manifestacoes (
    id text NOT NULL,
    tenant_id text NOT NULL,
    protocolo text NOT NULL,
    tipo text DEFAULT 'reclamacao'::text NOT NULL,
    status text DEFAULT 'aberta'::text NOT NULL,
    prioridade text DEFAULT 'normal'::text NOT NULL,
    nome_cidadao text,
    email_cidadao text,
    telefone_cidadao text,
    cpf_cidadao text,
    is_anonimo boolean DEFAULT false NOT NULL,
    assunto text NOT NULL,
    descricao text NOT NULL,
    secretaria_id text,
    categoria_id text,
    prazo timestamp without time zone,
    resolvida_em timestamp without time zone,
    atribuida_a_em timestamp without time zone,
    lgpd_consent boolean DEFAULT false NOT NULL,
    origem text DEFAULT 'portal'::text NOT NULL,
    noticias_relacionadas text[] DEFAULT '{}'::text[],
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.manifestacoes OWNER TO postgres;

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
-- Name: ouvidoria_estatisticas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ouvidoria_estatisticas (
    id text NOT NULL,
    tenant_id text NOT NULL,
    periodo text NOT NULL,
    total_manifestacoes integer DEFAULT 0 NOT NULL,
    resolvidas integer DEFAULT 0 NOT NULL,
    em_andamento integer DEFAULT 0 NOT NULL,
    no_prazo integer DEFAULT 0 NOT NULL,
    fora_prazo integer DEFAULT 0 NOT NULL,
    por_tipo jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.ouvidoria_estatisticas OWNER TO postgres;

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
-- Name: periodos_aquisitivos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.periodos_aquisitivos (
    id text NOT NULL,
    servidor_id text NOT NULL,
    data_inicio date NOT NULL,
    data_fim date NOT NULL,
    dias_direito integer DEFAULT 30 NOT NULL,
    dias_gozados integer DEFAULT 0 NOT NULL,
    dias_vendidos integer DEFAULT 0 NOT NULL,
    dias_saldo integer DEFAULT 30 NOT NULL,
    prazo_limite date,
    status text DEFAULT 'disponivel'::text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.periodos_aquisitivos OWNER TO postgres;

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
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refresh_tokens (
    id text NOT NULL,
    usuario_id text NOT NULL,
    token text NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.refresh_tokens OWNER TO postgres;

--
-- Name: requerimentos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.requerimentos (
    id text NOT NULL,
    tenant_id text NOT NULL,
    servidor_id text NOT NULL,
    protocolo text NOT NULL,
    tipo text NOT NULL,
    assunto text NOT NULL,
    justificativa text NOT NULL,
    campos_especificos jsonb DEFAULT '{}'::jsonb NOT NULL,
    documentos jsonb DEFAULT '[]'::jsonb NOT NULL,
    status text DEFAULT 'protocolado'::text NOT NULL,
    timeline jsonb DEFAULT '[]'::jsonb NOT NULL,
    parecer_tecnico text,
    decisao text,
    motivo_decisao text,
    decisor_nome text,
    decidido_em timestamp without time zone,
    prazo_recurso date,
    recurso_apresentado boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    despacho text
);


ALTER TABLE public.requerimentos OWNER TO postgres;

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
-- Name: servidores_cadastro; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.servidores_cadastro (
    id text NOT NULL,
    tenant_id text NOT NULL,
    nome text NOT NULL,
    cpf text NOT NULL,
    matricula text NOT NULL,
    email text NOT NULL,
    email_pessoal text,
    telefone text,
    data_nascimento date,
    cargo text NOT NULL,
    codigo_cargo text,
    nivel text,
    referencia text,
    vinculo text DEFAULT 'estatutario'::text NOT NULL,
    status text DEFAULT 'ativo'::text NOT NULL,
    data_ingresso date NOT NULL,
    data_concurso date,
    concurso_origem text,
    secretaria text NOT NULL,
    local_trabalho text,
    banco text,
    agencia text,
    conta text,
    tipo_conta text DEFAULT 'corrente'::text,
    endereco text,
    numero text,
    complemento text,
    bairro text,
    cidade text,
    estado text,
    cep text,
    salario_base real DEFAULT 0 NOT NULL,
    dependentes jsonb DEFAULT '[]'::jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.servidores_cadastro OWNER TO postgres;

--
-- Name: sic_pedidos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sic_pedidos (
    id text NOT NULL,
    tenant_id text NOT NULL,
    protocolo text NOT NULL,
    nome text NOT NULL,
    cpf text NOT NULL,
    email text NOT NULL,
    telefone text,
    tipo_solicitacao text NOT NULL,
    orgao text NOT NULL,
    descricao text NOT NULL,
    formata_resposta text DEFAULT 'email'::text NOT NULL,
    status text DEFAULT 'aberto'::text NOT NULL,
    resposta text,
    prazo timestamp without time zone NOT NULL,
    respondido_em timestamp without time zone,
    lgpd_consent boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.sic_pedidos OWNER TO postgres;

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
-- Name: solicitacoes_ferias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.solicitacoes_ferias (
    id text NOT NULL,
    tenant_id text NOT NULL,
    servidor_id text NOT NULL,
    periodo_aquisitivo_id text NOT NULL,
    protocolo text NOT NULL,
    data_inicio date NOT NULL,
    data_fim date NOT NULL,
    data_retorno date NOT NULL,
    qtd_dias integer NOT NULL,
    parcelamento integer DEFAULT 1 NOT NULL,
    adiantamento_13 boolean DEFAULT false NOT NULL,
    abono_pecuniario boolean DEFAULT false NOT NULL,
    dias_abono integer DEFAULT 0 NOT NULL,
    status text DEFAULT 'aguardando_chefia'::text NOT NULL,
    timeline jsonb DEFAULT '[]'::jsonb NOT NULL,
    aprovado_por text,
    aprovado_em timestamp without time zone,
    motivo_rejeicao text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.solicitacoes_ferias OWNER TO postgres;

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
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id text NOT NULL,
    tenant_id text NOT NULL,
    nome text NOT NULL,
    email text NOT NULL,
    senha_hash text NOT NULL,
    cargo text,
    avatar text,
    modulos_permitidos text[] DEFAULT '{site}'::text[] NOT NULL,
    permissoes jsonb DEFAULT '{}'::jsonb NOT NULL,
    is_admin boolean DEFAULT false NOT NULL,
    is_ativo boolean DEFAULT true NOT NULL,
    ultimo_acesso timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    servidor_id text
);


ALTER TABLE public.usuarios OWNER TO postgres;

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
-- Name: chat_sessions chat_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_sessions
    ADD CONSTRAINT chat_sessions_pkey PRIMARY KEY (id);


--
-- Name: chat_sessions chat_sessions_session_token_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_sessions
    ADD CONSTRAINT chat_sessions_session_token_unique UNIQUE (session_token);


--
-- Name: concursos concursos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.concursos
    ADD CONSTRAINT concursos_pkey PRIMARY KEY (id);


--
-- Name: contracheque_linhas contracheque_linhas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracheque_linhas
    ADD CONSTRAINT contracheque_linhas_pkey PRIMARY KEY (id);


--
-- Name: contracheques contracheques_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracheques
    ADD CONSTRAINT contracheques_pkey PRIMARY KEY (id);


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
-- Name: fale_conosco_config fale_conosco_config_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fale_conosco_config
    ADD CONSTRAINT fale_conosco_config_pkey PRIMARY KEY (id);


--
-- Name: fale_conosco_config fale_conosco_config_tenant_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fale_conosco_config
    ADD CONSTRAINT fale_conosco_config_tenant_id_unique UNIQUE (tenant_id);


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
-- Name: historico_funcional historico_funcional_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historico_funcional
    ADD CONSTRAINT historico_funcional_pkey PRIMARY KEY (id);


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
-- Name: manifestacoes manifestacoes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manifestacoes
    ADD CONSTRAINT manifestacoes_pkey PRIMARY KEY (id);


--
-- Name: manifestacoes manifestacoes_protocolo_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manifestacoes
    ADD CONSTRAINT manifestacoes_protocolo_unique UNIQUE (protocolo);


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
-- Name: ouvidoria_estatisticas ouvidoria_estatisticas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ouvidoria_estatisticas
    ADD CONSTRAINT ouvidoria_estatisticas_pkey PRIMARY KEY (id);


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
-- Name: periodos_aquisitivos periodos_aquisitivos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.periodos_aquisitivos
    ADD CONSTRAINT periodos_aquisitivos_pkey PRIMARY KEY (id);


--
-- Name: receitas receitas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receitas
    ADD CONSTRAINT receitas_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: requerimentos requerimentos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requerimentos
    ADD CONSTRAINT requerimentos_pkey PRIMARY KEY (id);


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
-- Name: servidores_cadastro servidores_cadastro_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servidores_cadastro
    ADD CONSTRAINT servidores_cadastro_pkey PRIMARY KEY (id);


--
-- Name: servidores servidores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servidores
    ADD CONSTRAINT servidores_pkey PRIMARY KEY (id);


--
-- Name: sic_pedidos sic_pedidos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sic_pedidos
    ADD CONSTRAINT sic_pedidos_pkey PRIMARY KEY (id);


--
-- Name: sic_pedidos sic_pedidos_protocolo_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sic_pedidos
    ADD CONSTRAINT sic_pedidos_protocolo_unique UNIQUE (protocolo);


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
-- Name: solicitacoes_ferias solicitacoes_ferias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitacoes_ferias
    ADD CONSTRAINT solicitacoes_ferias_pkey PRIMARY KEY (id);


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
-- Name: usuarios usuarios_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_unique UNIQUE (email);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


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
-- Name: chat_sessions chat_sessions_tenant_id_tenants_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_sessions
    ADD CONSTRAINT chat_sessions_tenant_id_tenants_id_fk FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: concursos concursos_tenant_id_tenants_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.concursos
    ADD CONSTRAINT concursos_tenant_id_tenants_id_fk FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: contracheque_linhas contracheque_linhas_contracheque_id_contracheques_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracheque_linhas
    ADD CONSTRAINT contracheque_linhas_contracheque_id_contracheques_id_fk FOREIGN KEY (contracheque_id) REFERENCES public.contracheques(id) ON DELETE CASCADE;


--
-- Name: contracheques contracheques_servidor_id_servidores_cadastro_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracheques
    ADD CONSTRAINT contracheques_servidor_id_servidores_cadastro_id_fk FOREIGN KEY (servidor_id) REFERENCES public.servidores_cadastro(id);


--
-- Name: contracheques contracheques_tenant_id_tenants_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracheques
    ADD CONSTRAINT contracheques_tenant_id_tenants_id_fk FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


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
-- Name: fale_conosco_config fale_conosco_config_tenant_id_tenants_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fale_conosco_config
    ADD CONSTRAINT fale_conosco_config_tenant_id_tenants_id_fk FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


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
-- Name: historico_funcional historico_funcional_servidor_id_servidores_cadastro_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historico_funcional
    ADD CONSTRAINT historico_funcional_servidor_id_servidores_cadastro_id_fk FOREIGN KEY (servidor_id) REFERENCES public.servidores_cadastro(id);


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
-- Name: manifestacoes manifestacoes_secretaria_id_secretarias_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manifestacoes
    ADD CONSTRAINT manifestacoes_secretaria_id_secretarias_id_fk FOREIGN KEY (secretaria_id) REFERENCES public.secretarias(id);


--
-- Name: manifestacoes manifestacoes_tenant_id_tenants_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manifestacoes
    ADD CONSTRAINT manifestacoes_tenant_id_tenants_id_fk FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


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
-- Name: ouvidoria_estatisticas ouvidoria_estatisticas_tenant_id_tenants_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ouvidoria_estatisticas
    ADD CONSTRAINT ouvidoria_estatisticas_tenant_id_tenants_id_fk FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


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
-- Name: periodos_aquisitivos periodos_aquisitivos_servidor_id_servidores_cadastro_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.periodos_aquisitivos
    ADD CONSTRAINT periodos_aquisitivos_servidor_id_servidores_cadastro_id_fk FOREIGN KEY (servidor_id) REFERENCES public.servidores_cadastro(id);


--
-- Name: receitas receitas_tenant_id_tenants_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receitas
    ADD CONSTRAINT receitas_tenant_id_tenants_id_fk FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: refresh_tokens refresh_tokens_usuario_id_usuarios_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_usuario_id_usuarios_id_fk FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: requerimentos requerimentos_servidor_id_servidores_cadastro_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requerimentos
    ADD CONSTRAINT requerimentos_servidor_id_servidores_cadastro_id_fk FOREIGN KEY (servidor_id) REFERENCES public.servidores_cadastro(id);


--
-- Name: requerimentos requerimentos_tenant_id_tenants_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requerimentos
    ADD CONSTRAINT requerimentos_tenant_id_tenants_id_fk FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


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
-- Name: servidores_cadastro servidores_cadastro_tenant_id_tenants_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servidores_cadastro
    ADD CONSTRAINT servidores_cadastro_tenant_id_tenants_id_fk FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: servidores servidores_tenant_id_tenants_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servidores
    ADD CONSTRAINT servidores_tenant_id_tenants_id_fk FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: sic_pedidos sic_pedidos_tenant_id_tenants_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sic_pedidos
    ADD CONSTRAINT sic_pedidos_tenant_id_tenants_id_fk FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: site_config site_config_tenant_id_tenants_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.site_config
    ADD CONSTRAINT site_config_tenant_id_tenants_id_fk FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: solicitacoes_ferias solicitacoes_ferias_periodo_aquisitivo_id_periodos_aquisitivos_; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitacoes_ferias
    ADD CONSTRAINT solicitacoes_ferias_periodo_aquisitivo_id_periodos_aquisitivos_ FOREIGN KEY (periodo_aquisitivo_id) REFERENCES public.periodos_aquisitivos(id);


--
-- Name: solicitacoes_ferias solicitacoes_ferias_servidor_id_servidores_cadastro_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitacoes_ferias
    ADD CONSTRAINT solicitacoes_ferias_servidor_id_servidores_cadastro_id_fk FOREIGN KEY (servidor_id) REFERENCES public.servidores_cadastro(id);


--
-- Name: solicitacoes_ferias solicitacoes_ferias_tenant_id_tenants_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitacoes_ferias
    ADD CONSTRAINT solicitacoes_ferias_tenant_id_tenants_id_fk FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: transparency_docs transparency_docs_tenant_id_tenants_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transparency_docs
    ADD CONSTRAINT transparency_docs_tenant_id_tenants_id_fk FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: usuarios usuarios_tenant_id_tenants_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_tenant_id_tenants_id_fk FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict W9gmUcBqbPL0Do8eLvnRVIkiiQhJYowvUugcFqgPspPrFoe2uZStOPdckJ2Zyd9

