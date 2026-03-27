--
-- PostgreSQL database dump
--

\restrict s3y66XDbRnYlSCg37LwonLd6EBMx9N4OtV4NlAXC3VzDaJ3tibagCTogLAwpBZV

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
-- Data for Name: chat_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_sessions (id, tenant_id, session_token, total_mensagens, created_at, last_activity_at) FROM stdin;
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
-- Data for Name: contracheque_linhas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contracheque_linhas (id, contracheque_id, tipo, codigo, descricao, referencia, valor, sort_order) FROM stdin;
d8ee1d9d-452a-4701-ac3d-7b78ce51de26	99857816-c1d5-464b-8f85-9acdf5f34d26	vencimento	001	Vencimento Básico	Março/2026	5850	1
ec7b04da-a602-4910-9ee1-2589bcb5d930	99857816-c1d5-464b-8f85-9acdf5f34d26	vencimento	010	Adicional de Insalubridade (10%)	Março/2026	585	2
ea979cab-f3a4-4f2d-b73d-c5bc7324e985	99857816-c1d5-464b-8f85-9acdf5f34d26	vencimento	020	Adicional de Tempo de Serviço (5%)	Março/2026	292.5	3
471425b7-5a0c-4225-8db3-9827bdeab15a	99857816-c1d5-464b-8f85-9acdf5f34d26	desconto	101	INSS	Março/2026	740.025	10
ae978eaa-9201-4969-9944-616c3dc16b99	99857816-c1d5-464b-8f85-9acdf5f34d26	desconto	102	IRRF	Março/2026	980.7025	11
fa50d1de-ad3a-41fc-bb1d-3da23180753c	99857816-c1d5-464b-8f85-9acdf5f34d26	desconto	103	Previdência Municipal	Março/2026	819	12
253cc7a3-83ee-4f12-bad6-ca9f179d35fb	99857816-c1d5-464b-8f85-9acdf5f34d26	informativo	200	Base de Cálculo IRRF	Março/2026	5987.475	20
d005b163-1ce4-4acf-adb7-639e1482927d	99857816-c1d5-464b-8f85-9acdf5f34d26	informativo	201	Base de Cálculo INSS	Março/2026	6727.5	21
93808637-b46c-484c-8a4b-b55e7fdd3d1e	8660a9a7-21a2-44e1-88b3-6fdba731b7ee	vencimento	001	Vencimento Básico	Fevereiro/2026	5850	1
1e334dbf-1745-428f-ba8b-df4bced9e808	8660a9a7-21a2-44e1-88b3-6fdba731b7ee	vencimento	010	Adicional de Insalubridade (10%)	Fevereiro/2026	585	2
4d789e8e-f963-44f1-ba6e-b46521b094d3	8660a9a7-21a2-44e1-88b3-6fdba731b7ee	vencimento	020	Adicional de Tempo de Serviço (5%)	Fevereiro/2026	292.5	3
9e571826-8c0d-43ac-96b1-2bb986581d06	8660a9a7-21a2-44e1-88b3-6fdba731b7ee	desconto	101	INSS	Fevereiro/2026	740.025	10
f023d229-848b-4a87-b9f3-0606b8b5f8ac	8660a9a7-21a2-44e1-88b3-6fdba731b7ee	desconto	102	IRRF	Fevereiro/2026	980.7025	11
5e2f7efa-e609-451d-ab00-ad39155e6798	8660a9a7-21a2-44e1-88b3-6fdba731b7ee	desconto	103	Previdência Municipal	Fevereiro/2026	819	12
a7cff050-5895-4d8d-8a12-84990d0dd3f6	8660a9a7-21a2-44e1-88b3-6fdba731b7ee	informativo	200	Base de Cálculo IRRF	Fevereiro/2026	5987.475	20
21694fed-626f-41f3-8c65-97cb8cbcd941	8660a9a7-21a2-44e1-88b3-6fdba731b7ee	informativo	201	Base de Cálculo INSS	Fevereiro/2026	6727.5	21
c385e122-4213-40dc-8b23-e4f8439524c3	8d959011-5d94-491e-9fe4-add0a8bfb226	vencimento	001	Vencimento Básico	Janeiro/2026	5850	1
084bce8e-c72b-4318-8a5f-0b95665cb895	8d959011-5d94-491e-9fe4-add0a8bfb226	vencimento	010	Adicional de Insalubridade (10%)	Janeiro/2026	585	2
5ff3497a-288b-42c8-9739-179f7389d6aa	8d959011-5d94-491e-9fe4-add0a8bfb226	vencimento	020	Adicional de Tempo de Serviço (5%)	Janeiro/2026	292.5	3
bb6f7f49-70c6-4a72-a7f4-386589cdb0b7	8d959011-5d94-491e-9fe4-add0a8bfb226	desconto	101	INSS	Janeiro/2026	740.025	10
9b2208c8-c634-4c85-b1b2-daa363707d93	8d959011-5d94-491e-9fe4-add0a8bfb226	desconto	102	IRRF	Janeiro/2026	980.7025	11
adfce3af-2b6a-4fe4-9b95-c593b92a7d3c	8d959011-5d94-491e-9fe4-add0a8bfb226	desconto	103	Previdência Municipal	Janeiro/2026	819	12
4eea09ce-2920-42d0-8653-a2063169f1fd	8d959011-5d94-491e-9fe4-add0a8bfb226	informativo	200	Base de Cálculo IRRF	Janeiro/2026	5987.475	20
d0f4ff5d-fd91-45b5-aaf7-408ca45e9336	8d959011-5d94-491e-9fe4-add0a8bfb226	informativo	201	Base de Cálculo INSS	Janeiro/2026	6727.5	21
f3e2e700-6e00-4b96-a543-55e79d9e49b5	015b3d75-5b8f-4ecd-8493-58e03ad1666d	vencimento	001	Vencimento Básico	Dezembro/2025	5850	1
4863db5c-ddd0-4a35-b5af-b5c8f1c48731	015b3d75-5b8f-4ecd-8493-58e03ad1666d	vencimento	010	Adicional de Insalubridade (10%)	Dezembro/2025	585	2
aca8c849-56cb-44d0-a287-a9284aebcf61	015b3d75-5b8f-4ecd-8493-58e03ad1666d	vencimento	020	Adicional de Tempo de Serviço (5%)	Dezembro/2025	292.5	3
9f8fa7bd-2df8-47ba-b2e7-1e50cfeb8ef0	015b3d75-5b8f-4ecd-8493-58e03ad1666d	desconto	101	INSS	Dezembro/2025	740.025	10
6033ae49-de19-4af0-99a9-ce6dcf4f5a62	015b3d75-5b8f-4ecd-8493-58e03ad1666d	desconto	102	IRRF	Dezembro/2025	980.7025	11
f5672b2e-f845-4170-bbc6-3d3a59930310	015b3d75-5b8f-4ecd-8493-58e03ad1666d	desconto	103	Previdência Municipal	Dezembro/2025	819	12
06839559-49cf-49b9-b0e3-0d238469a1db	015b3d75-5b8f-4ecd-8493-58e03ad1666d	informativo	200	Base de Cálculo IRRF	Dezembro/2025	5987.475	20
9b30fa06-e402-4bc1-96f3-5af28aa16605	015b3d75-5b8f-4ecd-8493-58e03ad1666d	informativo	201	Base de Cálculo INSS	Dezembro/2025	6727.5	21
9458ca88-8773-4790-abf7-af9a29f5f7b3	b41ca4a8-0702-4a29-9a1a-0fc85eafb02d	vencimento	001	Vencimento Básico	Novembro/2025	5850	1
f9b7e363-5539-40c7-8dbf-9c047c3d4d26	b41ca4a8-0702-4a29-9a1a-0fc85eafb02d	vencimento	010	Adicional de Insalubridade (10%)	Novembro/2025	585	2
a040c59a-bf0e-4718-8acf-00d751f41049	b41ca4a8-0702-4a29-9a1a-0fc85eafb02d	vencimento	020	Adicional de Tempo de Serviço (5%)	Novembro/2025	292.5	3
117140fd-3e16-4fdc-8542-656ae39d906b	b41ca4a8-0702-4a29-9a1a-0fc85eafb02d	desconto	101	INSS	Novembro/2025	740.025	10
3884f148-dea7-42fc-a7cf-2a60590fd584	b41ca4a8-0702-4a29-9a1a-0fc85eafb02d	desconto	102	IRRF	Novembro/2025	980.7025	11
5b9eba32-2db2-4d6e-b18e-d129b708811a	b41ca4a8-0702-4a29-9a1a-0fc85eafb02d	desconto	103	Previdência Municipal	Novembro/2025	819	12
47d905c8-7e4c-4303-9a92-e36f395da244	b41ca4a8-0702-4a29-9a1a-0fc85eafb02d	informativo	200	Base de Cálculo IRRF	Novembro/2025	5987.475	20
e7cd42c9-b408-4df0-868c-23e92e6023cd	b41ca4a8-0702-4a29-9a1a-0fc85eafb02d	informativo	201	Base de Cálculo INSS	Novembro/2025	6727.5	21
4ce36052-4876-4695-b368-6524fc3b10ee	0f19b1ba-d64f-4d48-a99d-ec451c735fe5	vencimento	001	Vencimento Básico	Outubro/2025	5850	1
ea7f7585-4d9c-4324-a049-3c93550abb8c	0f19b1ba-d64f-4d48-a99d-ec451c735fe5	vencimento	010	Adicional de Insalubridade (10%)	Outubro/2025	585	2
1f72a8f0-95b9-4ab3-8461-88bab13e639a	0f19b1ba-d64f-4d48-a99d-ec451c735fe5	vencimento	020	Adicional de Tempo de Serviço (5%)	Outubro/2025	292.5	3
ce76896f-7663-41b0-b4f7-71062189e455	0f19b1ba-d64f-4d48-a99d-ec451c735fe5	desconto	101	INSS	Outubro/2025	740.025	10
1025d380-39ab-40ec-96f0-47c8bf23020d	0f19b1ba-d64f-4d48-a99d-ec451c735fe5	desconto	102	IRRF	Outubro/2025	980.7025	11
20c71b1d-cac9-4533-96ef-d1128308fd35	0f19b1ba-d64f-4d48-a99d-ec451c735fe5	desconto	103	Previdência Municipal	Outubro/2025	819	12
09f6fa7a-a49a-4017-8f67-0775d474a073	0f19b1ba-d64f-4d48-a99d-ec451c735fe5	informativo	200	Base de Cálculo IRRF	Outubro/2025	5987.475	20
e00b3784-cf11-4fe6-8b32-fe3634235965	0f19b1ba-d64f-4d48-a99d-ec451c735fe5	informativo	201	Base de Cálculo INSS	Outubro/2025	6727.5	21
324ef1fd-443f-4bbb-9bd9-60d41798fa37	ce894e3a-be8d-45a9-a06e-47156a182ed2	vencimento	001	Vencimento Básico	Setembro/2025	5850	1
9fbd80ac-d5e7-49c0-8bc0-3fe5dab17fd2	ce894e3a-be8d-45a9-a06e-47156a182ed2	vencimento	010	Adicional de Insalubridade (10%)	Setembro/2025	585	2
d2409294-35fd-4f3b-b6ab-625dad85854f	ce894e3a-be8d-45a9-a06e-47156a182ed2	vencimento	020	Adicional de Tempo de Serviço (5%)	Setembro/2025	292.5	3
23aa56d6-75fe-4e27-9256-f73870e62b6c	ce894e3a-be8d-45a9-a06e-47156a182ed2	desconto	101	INSS	Setembro/2025	740.025	10
535855ae-8c95-4ce1-8082-437a7cfd4361	ce894e3a-be8d-45a9-a06e-47156a182ed2	desconto	102	IRRF	Setembro/2025	980.7025	11
7f81d168-780e-4d33-9a16-7372d7eb676d	ce894e3a-be8d-45a9-a06e-47156a182ed2	desconto	103	Previdência Municipal	Setembro/2025	819	12
da2b6194-9a1b-4918-b84f-96a1c2188bf5	ce894e3a-be8d-45a9-a06e-47156a182ed2	informativo	200	Base de Cálculo IRRF	Setembro/2025	5987.475	20
73bf443f-036b-4810-bcab-e97f545db0ae	ce894e3a-be8d-45a9-a06e-47156a182ed2	informativo	201	Base de Cálculo INSS	Setembro/2025	6727.5	21
47955394-0021-4173-93cb-1a87819eb3f3	b90c55d6-f23a-4b05-a5ae-c5583dae339c	vencimento	001	Vencimento Básico	Agosto/2025	5850	1
ed697740-aadb-4b3e-bf5c-674e930e072d	b90c55d6-f23a-4b05-a5ae-c5583dae339c	vencimento	010	Adicional de Insalubridade (10%)	Agosto/2025	585	2
703c1aa0-cd4e-4479-8ecb-457835a8b29a	b90c55d6-f23a-4b05-a5ae-c5583dae339c	vencimento	020	Adicional de Tempo de Serviço (5%)	Agosto/2025	292.5	3
ec313934-d354-4c9b-b747-dd7cca77f542	b90c55d6-f23a-4b05-a5ae-c5583dae339c	desconto	101	INSS	Agosto/2025	740.025	10
2a7503e8-1089-4b2b-aa04-accf31456a7a	b90c55d6-f23a-4b05-a5ae-c5583dae339c	desconto	102	IRRF	Agosto/2025	980.7025	11
6ac96f9c-8e2f-45ae-bb70-1799e67dfa5d	b90c55d6-f23a-4b05-a5ae-c5583dae339c	desconto	103	Previdência Municipal	Agosto/2025	819	12
686a752d-55dd-417b-b274-1fc51ff7f057	b90c55d6-f23a-4b05-a5ae-c5583dae339c	informativo	200	Base de Cálculo IRRF	Agosto/2025	5987.475	20
9b62424b-5c3b-41b7-a7e5-c4f1fce58490	b90c55d6-f23a-4b05-a5ae-c5583dae339c	informativo	201	Base de Cálculo INSS	Agosto/2025	6727.5	21
0fdd317b-e049-44d3-9124-661babe8c65b	e3283593-1df4-43d6-aa3f-79ca4f44b523	vencimento	001	Vencimento Básico	Julho/2025	5850	1
a763d63d-aebc-4f2c-8be5-324495568d3c	e3283593-1df4-43d6-aa3f-79ca4f44b523	vencimento	010	Adicional de Insalubridade (10%)	Julho/2025	585	2
1cc7e61a-e217-4f2a-a0dd-bcd9b6ccfb6d	e3283593-1df4-43d6-aa3f-79ca4f44b523	vencimento	020	Adicional de Tempo de Serviço (5%)	Julho/2025	292.5	3
378bba90-bbf8-4b43-b44b-1411f6b8de46	e3283593-1df4-43d6-aa3f-79ca4f44b523	vencimento	030	1/3 Constitucional de Férias	Julho/2025	1930.5	4
e80df173-d91a-47fc-ba5d-e74dd88af46c	e3283593-1df4-43d6-aa3f-79ca4f44b523	desconto	101	INSS	Julho/2025	908.86	10
8097db19-a46d-479f-9ccb-297ce4ad45ad	e3283593-1df4-43d6-aa3f-79ca4f44b523	desconto	102	IRRF	Julho/2025	1511.59	11
2b48aae7-e768-49b8-afcd-13c555c93145	e3283593-1df4-43d6-aa3f-79ca4f44b523	desconto	103	Previdência Municipal	Julho/2025	819	12
72f97f64-a3e2-4bb7-bffc-2b4b81b651ea	e3283593-1df4-43d6-aa3f-79ca4f44b523	informativo	200	Base de Cálculo IRRF	Julho/2025	7749.14	20
60e17d3a-e13b-4840-a8d4-8a679d3920b4	e3283593-1df4-43d6-aa3f-79ca4f44b523	informativo	201	Base de Cálculo INSS	Julho/2025	8658	21
58a0a9a4-396c-4066-8b87-9ede6f2c1ab5	f1d0faad-7407-4a20-9c28-50f68cd84b5a	vencimento	001	Vencimento Básico	Junho/2025	5850	1
052b5c43-9e83-42ab-9050-5547de904e55	f1d0faad-7407-4a20-9c28-50f68cd84b5a	vencimento	010	Adicional de Insalubridade (10%)	Junho/2025	585	2
dd8a0c01-85d5-49c9-afd3-19ee0108e1a0	f1d0faad-7407-4a20-9c28-50f68cd84b5a	vencimento	020	Adicional de Tempo de Serviço (5%)	Junho/2025	292.5	3
eb2fd5ee-8c27-4cf6-8015-ae193b0e493c	f1d0faad-7407-4a20-9c28-50f68cd84b5a	desconto	101	INSS	Junho/2025	740.025	10
92facd2c-3923-4040-a28d-9a4dbc872b61	f1d0faad-7407-4a20-9c28-50f68cd84b5a	desconto	102	IRRF	Junho/2025	980.7025	11
1f2b3cd6-d33b-43d9-b36c-ee554863ee10	f1d0faad-7407-4a20-9c28-50f68cd84b5a	desconto	103	Previdência Municipal	Junho/2025	819	12
a43931ef-d992-44ce-9f6c-bd301346674c	f1d0faad-7407-4a20-9c28-50f68cd84b5a	informativo	200	Base de Cálculo IRRF	Junho/2025	5987.475	20
69d3bd7c-4918-4098-af4d-563929a7f252	f1d0faad-7407-4a20-9c28-50f68cd84b5a	informativo	201	Base de Cálculo INSS	Junho/2025	6727.5	21
08c8dd52-adfd-448c-ad0b-ac531d64a430	bd8e7774-b61c-45d8-841b-38de8c5aa15c	vencimento	001	Vencimento Básico	Maio/2025	5850	1
cccef4c3-3116-4127-8c6c-a58cea9149b4	bd8e7774-b61c-45d8-841b-38de8c5aa15c	vencimento	010	Adicional de Insalubridade (10%)	Maio/2025	585	2
78e13a02-6021-4d75-b2b8-4744e2dce310	bd8e7774-b61c-45d8-841b-38de8c5aa15c	vencimento	020	Adicional de Tempo de Serviço (5%)	Maio/2025	292.5	3
86e06cf8-069c-489c-9e1f-fe49c68ff842	bd8e7774-b61c-45d8-841b-38de8c5aa15c	desconto	101	INSS	Maio/2025	740.025	10
3dd58ff7-2135-40b1-8e11-065881281882	bd8e7774-b61c-45d8-841b-38de8c5aa15c	desconto	102	IRRF	Maio/2025	980.7025	11
86fe925c-0be4-493f-af03-fd6df9ea67c9	bd8e7774-b61c-45d8-841b-38de8c5aa15c	desconto	103	Previdência Municipal	Maio/2025	819	12
4121c926-bf2e-4e52-8bda-3dcc33ac71e1	bd8e7774-b61c-45d8-841b-38de8c5aa15c	informativo	200	Base de Cálculo IRRF	Maio/2025	5987.475	20
b9402f8c-cbf1-4d7b-a256-4708727bc055	bd8e7774-b61c-45d8-841b-38de8c5aa15c	informativo	201	Base de Cálculo INSS	Maio/2025	6727.5	21
f3fba6a5-4987-40e3-a596-862c65a4c19d	223cd1b3-1de7-4695-9815-e3d078ff7230	vencimento	001	Vencimento Básico	Abril/2025	5850	1
8ab361c0-b857-4e1b-a59d-e259ece17bee	223cd1b3-1de7-4695-9815-e3d078ff7230	vencimento	010	Adicional de Insalubridade (10%)	Abril/2025	585	2
fdacb718-866d-4bc5-a6c4-0682a872c186	223cd1b3-1de7-4695-9815-e3d078ff7230	vencimento	020	Adicional de Tempo de Serviço (5%)	Abril/2025	292.5	3
89d1cbe9-4f3c-4eba-b25b-9bb087e3b61b	223cd1b3-1de7-4695-9815-e3d078ff7230	desconto	101	INSS	Abril/2025	740.025	10
8124c092-6959-43d2-908d-cf305f665f15	223cd1b3-1de7-4695-9815-e3d078ff7230	desconto	102	IRRF	Abril/2025	980.7025	11
86556061-f6e4-4146-8834-6a9eb6438c5d	223cd1b3-1de7-4695-9815-e3d078ff7230	desconto	103	Previdência Municipal	Abril/2025	819	12
49fafacf-f6ee-4529-98ff-e15603bb4777	223cd1b3-1de7-4695-9815-e3d078ff7230	informativo	200	Base de Cálculo IRRF	Abril/2025	5987.475	20
a3e684e4-9cc4-4a1d-8fae-54e9f466bf52	223cd1b3-1de7-4695-9815-e3d078ff7230	informativo	201	Base de Cálculo INSS	Abril/2025	6727.5	21
6a5852c4-cd91-483f-8f5d-c66d67369249	9f5b1280-62f1-4757-ad4a-63f5667a6186	vencimento	001	Vencimento Básico	Março/2025	5850	1
af4f0f1d-4b42-420b-bc8d-9f483ecc3809	9f5b1280-62f1-4757-ad4a-63f5667a6186	vencimento	010	Adicional de Insalubridade (10%)	Março/2025	585	2
95f848a2-f197-4957-89df-22c47b6ab123	9f5b1280-62f1-4757-ad4a-63f5667a6186	vencimento	020	Adicional de Tempo de Serviço (5%)	Março/2025	292.5	3
6c63283e-027a-4900-bdf8-3d00ec625e2b	9f5b1280-62f1-4757-ad4a-63f5667a6186	desconto	101	INSS	Março/2025	740.025	10
84e75824-2ff0-4062-9004-84c8af9de891	9f5b1280-62f1-4757-ad4a-63f5667a6186	desconto	102	IRRF	Março/2025	980.7025	11
bd056b5e-d45b-4fce-8e45-7fccf271bf82	9f5b1280-62f1-4757-ad4a-63f5667a6186	desconto	103	Previdência Municipal	Março/2025	819	12
941e5ea3-bebe-4677-8e48-d0324e7eccba	9f5b1280-62f1-4757-ad4a-63f5667a6186	informativo	200	Base de Cálculo IRRF	Março/2025	5987.475	20
3f00def2-9254-43ee-9e29-58df60675e6e	9f5b1280-62f1-4757-ad4a-63f5667a6186	informativo	201	Base de Cálculo INSS	Março/2025	6727.5	21
908e87a2-6b1e-4af5-b294-288a4c1de5b3	0e30c472-7a1b-4355-b054-db5003344060	vencimento	001	Vencimento Básico	Fevereiro/2025	5850	1
35bf59e6-1402-4885-9f56-518b18d968b8	0e30c472-7a1b-4355-b054-db5003344060	vencimento	010	Adicional de Insalubridade (10%)	Fevereiro/2025	585	2
e93bccfe-1fbd-418e-9b16-f3b411e5dbb3	0e30c472-7a1b-4355-b054-db5003344060	vencimento	020	Adicional de Tempo de Serviço (5%)	Fevereiro/2025	292.5	3
7d673968-30f5-4d03-9009-98c93f43c83f	0e30c472-7a1b-4355-b054-db5003344060	desconto	101	INSS	Fevereiro/2025	740.025	10
4b017b41-3bb1-47c1-8264-4dbbd643772f	0e30c472-7a1b-4355-b054-db5003344060	desconto	102	IRRF	Fevereiro/2025	980.7025	11
db010c75-2578-4f20-a351-0827663423da	0e30c472-7a1b-4355-b054-db5003344060	desconto	103	Previdência Municipal	Fevereiro/2025	819	12
72434016-82f6-416b-bc95-8a59b74f7e2b	0e30c472-7a1b-4355-b054-db5003344060	informativo	200	Base de Cálculo IRRF	Fevereiro/2025	5987.475	20
2addf8ad-4bc0-4039-99e0-35a0ec4fe71e	0e30c472-7a1b-4355-b054-db5003344060	informativo	201	Base de Cálculo INSS	Fevereiro/2025	6727.5	21
6e62389c-b5d9-4012-906a-cd7cfdfd02c2	e314bf42-6c0e-406c-bbc3-fb4c061dc7a9	vencimento	001	Vencimento Básico	Janeiro/2025	5850	1
7a39f5ca-b807-42f2-986b-23b075286b3d	e314bf42-6c0e-406c-bbc3-fb4c061dc7a9	vencimento	010	Adicional de Insalubridade (10%)	Janeiro/2025	585	2
061ac5d6-6db4-4638-8719-4a2a11f77e3b	e314bf42-6c0e-406c-bbc3-fb4c061dc7a9	vencimento	020	Adicional de Tempo de Serviço (5%)	Janeiro/2025	292.5	3
49994f01-bf46-4341-9311-71ca6df4ce62	e314bf42-6c0e-406c-bbc3-fb4c061dc7a9	desconto	101	INSS	Janeiro/2025	740.025	10
3cc548a5-d37f-4f36-8c46-86f7acfbdfaf	e314bf42-6c0e-406c-bbc3-fb4c061dc7a9	desconto	102	IRRF	Janeiro/2025	980.7025	11
55cb10ac-eba9-4925-8590-6301915e0bce	e314bf42-6c0e-406c-bbc3-fb4c061dc7a9	desconto	103	Previdência Municipal	Janeiro/2025	819	12
ef449ff3-88c9-4e72-ac39-97a3d0dc34c2	e314bf42-6c0e-406c-bbc3-fb4c061dc7a9	informativo	200	Base de Cálculo IRRF	Janeiro/2025	5987.475	20
dc4b7b70-a61d-4b20-8008-e2f239349427	e314bf42-6c0e-406c-bbc3-fb4c061dc7a9	informativo	201	Base de Cálculo INSS	Janeiro/2025	6727.5	21
e954e45f-c14b-4949-bf6b-6cda3475b9f2	25407c52-ca21-468e-b7bb-29f1af79049a	vencimento	001	Vencimento Básico	Dezembro/2024	5850	1
cd16e928-36aa-4c29-88c0-fd4435ffbc94	25407c52-ca21-468e-b7bb-29f1af79049a	vencimento	010	Adicional de Insalubridade (10%)	Dezembro/2024	585	2
31e55d84-8854-4421-8100-95ffbf1bce7f	25407c52-ca21-468e-b7bb-29f1af79049a	vencimento	020	Adicional de Tempo de Serviço (5%)	Dezembro/2024	292.5	3
08232a77-648d-4230-b77d-4f15976f9f45	25407c52-ca21-468e-b7bb-29f1af79049a	desconto	101	INSS	Dezembro/2024	740.025	10
dd68dd45-d783-4897-a107-a4fe7c3a2492	25407c52-ca21-468e-b7bb-29f1af79049a	desconto	102	IRRF	Dezembro/2024	980.7025	11
3d0af3c5-2801-48e7-97f2-aa09b73927c2	25407c52-ca21-468e-b7bb-29f1af79049a	desconto	103	Previdência Municipal	Dezembro/2024	819	12
ae1b960c-a133-4253-9f47-09c065613ecd	25407c52-ca21-468e-b7bb-29f1af79049a	informativo	200	Base de Cálculo IRRF	Dezembro/2024	5987.475	20
b2bf6c13-9f47-47c3-ab58-34bab8eb3b4a	25407c52-ca21-468e-b7bb-29f1af79049a	informativo	201	Base de Cálculo INSS	Dezembro/2024	6727.5	21
3ad64af7-9059-4dea-ad9f-6fc3aad1bc8f	d8cc3d8e-54ae-4e2a-8448-46fd7da9b7fe	vencimento	001	Vencimento Básico	Novembro/2024	5850	1
ff033990-06a0-4ff9-a3ef-33236b8c88d4	d8cc3d8e-54ae-4e2a-8448-46fd7da9b7fe	vencimento	010	Adicional de Insalubridade (10%)	Novembro/2024	585	2
771fd481-1ed9-4c74-a249-9e1f1d355200	d8cc3d8e-54ae-4e2a-8448-46fd7da9b7fe	vencimento	020	Adicional de Tempo de Serviço (5%)	Novembro/2024	292.5	3
e812fb16-8d9d-4395-96d8-f3014744ed06	d8cc3d8e-54ae-4e2a-8448-46fd7da9b7fe	desconto	101	INSS	Novembro/2024	740.025	10
52ca3e26-7e35-4f44-9d41-0ea0ae250ab8	d8cc3d8e-54ae-4e2a-8448-46fd7da9b7fe	desconto	102	IRRF	Novembro/2024	980.7025	11
bbf83364-2f26-4fc7-8493-d584dd7e3e74	d8cc3d8e-54ae-4e2a-8448-46fd7da9b7fe	desconto	103	Previdência Municipal	Novembro/2024	819	12
0923b27a-4b4b-4e5f-9789-2c334d9990a2	d8cc3d8e-54ae-4e2a-8448-46fd7da9b7fe	informativo	200	Base de Cálculo IRRF	Novembro/2024	5987.475	20
7001da5a-0e88-49c0-b90a-ab9d8475e078	d8cc3d8e-54ae-4e2a-8448-46fd7da9b7fe	informativo	201	Base de Cálculo INSS	Novembro/2024	6727.5	21
73f7a4a1-f4f0-43e5-ad1e-8fcd355adad0	d7307982-e380-4aca-8faf-2ff4a4697299	vencimento	001	Vencimento Básico	Outubro/2024	5850	1
a7238897-018a-4873-a5e7-84e754bb9b4f	d7307982-e380-4aca-8faf-2ff4a4697299	vencimento	010	Adicional de Insalubridade (10%)	Outubro/2024	585	2
a7cde537-efb3-4532-9651-26ecd28197ec	d7307982-e380-4aca-8faf-2ff4a4697299	vencimento	020	Adicional de Tempo de Serviço (5%)	Outubro/2024	292.5	3
82a8dffb-4a71-4fd6-9b36-03586c0f6942	d7307982-e380-4aca-8faf-2ff4a4697299	desconto	101	INSS	Outubro/2024	740.025	10
5b862e2e-8109-438b-83d0-251b4f5b17ff	d7307982-e380-4aca-8faf-2ff4a4697299	desconto	102	IRRF	Outubro/2024	980.7025	11
2e83e846-c9f9-4d82-8918-4eca1da02e81	d7307982-e380-4aca-8faf-2ff4a4697299	desconto	103	Previdência Municipal	Outubro/2024	819	12
734ec4dc-3d2b-443d-9766-410363e3ecff	d7307982-e380-4aca-8faf-2ff4a4697299	informativo	200	Base de Cálculo IRRF	Outubro/2024	5987.475	20
95e190fe-ec2f-476b-b96b-130f8986506a	d7307982-e380-4aca-8faf-2ff4a4697299	informativo	201	Base de Cálculo INSS	Outubro/2024	6727.5	21
d4496792-c69f-4bed-9632-9d07e94a221a	e0889365-29a4-4ff9-ad5b-d6430d8b3784	vencimento	001	Vencimento Básico	Setembro/2024	5850	1
7ead15b1-00d6-407f-853b-3de29323bdd9	e0889365-29a4-4ff9-ad5b-d6430d8b3784	vencimento	010	Adicional de Insalubridade (10%)	Setembro/2024	585	2
1380d4d5-b14b-46b3-bf06-106c9dc03dab	e0889365-29a4-4ff9-ad5b-d6430d8b3784	vencimento	020	Adicional de Tempo de Serviço (5%)	Setembro/2024	292.5	3
69ec61f3-04ba-4111-a0fa-964a85c492ac	e0889365-29a4-4ff9-ad5b-d6430d8b3784	desconto	101	INSS	Setembro/2024	740.025	10
6259e83b-e60c-4b6f-8f99-6cb7eece66b3	e0889365-29a4-4ff9-ad5b-d6430d8b3784	desconto	102	IRRF	Setembro/2024	980.7025	11
74f99bdf-bff7-470b-9eea-0a0c2e8380e7	e0889365-29a4-4ff9-ad5b-d6430d8b3784	desconto	103	Previdência Municipal	Setembro/2024	819	12
9d388800-ba8a-42f2-9ea9-f891e4ff031e	e0889365-29a4-4ff9-ad5b-d6430d8b3784	informativo	200	Base de Cálculo IRRF	Setembro/2024	5987.475	20
9a607feb-a215-4e50-a05a-7f77a70eecc3	e0889365-29a4-4ff9-ad5b-d6430d8b3784	informativo	201	Base de Cálculo INSS	Setembro/2024	6727.5	21
d3bd099a-339d-4861-8cf5-8fc1a61272d7	c21bdc56-5cdd-4f28-a514-50c769f3a55c	vencimento	001	Vencimento Básico	Agosto/2024	5850	1
cf729d3b-41b2-44af-8042-4dcf5ae5d6d2	c21bdc56-5cdd-4f28-a514-50c769f3a55c	vencimento	010	Adicional de Insalubridade (10%)	Agosto/2024	585	2
84b73ae3-1821-46ea-b43f-fd3d8c1ccce2	c21bdc56-5cdd-4f28-a514-50c769f3a55c	vencimento	020	Adicional de Tempo de Serviço (5%)	Agosto/2024	292.5	3
220b3afa-4be6-487b-8352-6827a408d7b4	c21bdc56-5cdd-4f28-a514-50c769f3a55c	desconto	101	INSS	Agosto/2024	740.025	10
0b8b0dec-b467-4e81-957d-096ab20b7aff	c21bdc56-5cdd-4f28-a514-50c769f3a55c	desconto	102	IRRF	Agosto/2024	980.7025	11
bc8b64fc-a5c6-4cff-90ab-7bf8b503f6f8	c21bdc56-5cdd-4f28-a514-50c769f3a55c	desconto	103	Previdência Municipal	Agosto/2024	819	12
d60767af-c21b-4b5a-808c-301d34175658	c21bdc56-5cdd-4f28-a514-50c769f3a55c	informativo	200	Base de Cálculo IRRF	Agosto/2024	5987.475	20
71e35180-ae6b-4155-bf1a-dafa7ab0b847	c21bdc56-5cdd-4f28-a514-50c769f3a55c	informativo	201	Base de Cálculo INSS	Agosto/2024	6727.5	21
df2b17dc-f8ec-4851-9b48-ea3085accac4	73febe98-8e7b-4b3c-90a7-19347d28595f	vencimento	001	Vencimento Básico	Julho/2024	5850	1
bcb5f372-a280-413b-b9b0-8380434eea1c	73febe98-8e7b-4b3c-90a7-19347d28595f	vencimento	010	Adicional de Insalubridade (10%)	Julho/2024	585	2
2d998ed1-f86c-482d-8c86-0e4007bc36df	73febe98-8e7b-4b3c-90a7-19347d28595f	vencimento	020	Adicional de Tempo de Serviço (5%)	Julho/2024	292.5	3
42f43f00-33dc-44d8-8b91-6de7d94a70e7	73febe98-8e7b-4b3c-90a7-19347d28595f	vencimento	030	1/3 Constitucional de Férias	Julho/2024	1930.5	4
270a150b-56bb-464d-a02c-d2a8553e1c41	73febe98-8e7b-4b3c-90a7-19347d28595f	desconto	101	INSS	Julho/2024	908.86	10
3b1c1925-d9eb-4dd9-94b7-896a0a3e2b72	73febe98-8e7b-4b3c-90a7-19347d28595f	desconto	102	IRRF	Julho/2024	1511.59	11
dc30b793-b0c7-4ce9-8f3a-9bbbc4bec975	73febe98-8e7b-4b3c-90a7-19347d28595f	desconto	103	Previdência Municipal	Julho/2024	819	12
18074443-00d9-4732-a850-ba8ebe75299c	73febe98-8e7b-4b3c-90a7-19347d28595f	informativo	200	Base de Cálculo IRRF	Julho/2024	7749.14	20
7e1a026c-2c70-4e76-9125-38cddb993793	73febe98-8e7b-4b3c-90a7-19347d28595f	informativo	201	Base de Cálculo INSS	Julho/2024	8658	21
b2cf53c7-df35-4070-92ab-3ba57135fd7d	408f712b-e103-41eb-ae64-5d82b793fc65	vencimento	001	Vencimento Básico	Junho/2024	5850	1
2163ecc7-1255-49b3-aba4-e9eb533e38ea	408f712b-e103-41eb-ae64-5d82b793fc65	vencimento	010	Adicional de Insalubridade (10%)	Junho/2024	585	2
90c1f384-6327-402d-baa5-52d282052847	408f712b-e103-41eb-ae64-5d82b793fc65	vencimento	020	Adicional de Tempo de Serviço (5%)	Junho/2024	292.5	3
77f6dadf-114a-4652-b57c-306d2c6f1b18	408f712b-e103-41eb-ae64-5d82b793fc65	desconto	101	INSS	Junho/2024	740.025	10
8abc4e70-f88d-4a6a-b572-ccd7ad4cb8e0	408f712b-e103-41eb-ae64-5d82b793fc65	desconto	102	IRRF	Junho/2024	980.7025	11
c9622a78-eda5-4e42-82a5-a0579c63189c	408f712b-e103-41eb-ae64-5d82b793fc65	desconto	103	Previdência Municipal	Junho/2024	819	12
bd312a85-3a3b-404b-a7dc-f2af207d9962	408f712b-e103-41eb-ae64-5d82b793fc65	informativo	200	Base de Cálculo IRRF	Junho/2024	5987.475	20
3283b765-3c25-43bd-97e0-f0ad32c2a81f	408f712b-e103-41eb-ae64-5d82b793fc65	informativo	201	Base de Cálculo INSS	Junho/2024	6727.5	21
cfcf35b7-db10-4327-a061-e35b157c8ed5	bb2a4950-84ee-4c3a-9b93-d8b5c2723936	vencimento	001	Vencimento Básico	Maio/2024	5850	1
af7587c5-a526-4639-8e88-2b962cb9e022	bb2a4950-84ee-4c3a-9b93-d8b5c2723936	vencimento	010	Adicional de Insalubridade (10%)	Maio/2024	585	2
8f17e977-bae7-4e3c-88b8-451cda026b1a	bb2a4950-84ee-4c3a-9b93-d8b5c2723936	vencimento	020	Adicional de Tempo de Serviço (5%)	Maio/2024	292.5	3
61eeef9b-bf7e-4726-8329-e3f1699c5e30	bb2a4950-84ee-4c3a-9b93-d8b5c2723936	desconto	101	INSS	Maio/2024	740.025	10
85cf2b85-6784-4f07-874e-8083659cee73	bb2a4950-84ee-4c3a-9b93-d8b5c2723936	desconto	102	IRRF	Maio/2024	980.7025	11
1548c60e-eeb0-4773-825a-7d88662d70f6	bb2a4950-84ee-4c3a-9b93-d8b5c2723936	desconto	103	Previdência Municipal	Maio/2024	819	12
42ea32e6-f8f8-4bf1-8833-0cf33156853c	bb2a4950-84ee-4c3a-9b93-d8b5c2723936	informativo	200	Base de Cálculo IRRF	Maio/2024	5987.475	20
7360061c-066b-43a5-9d9b-81d557f6fec6	bb2a4950-84ee-4c3a-9b93-d8b5c2723936	informativo	201	Base de Cálculo INSS	Maio/2024	6727.5	21
5e66979e-60eb-443c-b568-ca83ce87026b	9caaec81-34ad-4313-863d-334ffd0c8743	vencimento	001	Vencimento Básico	Abril/2024	5850	1
e02caf5c-a541-497d-a1cd-a1dd71f5df09	9caaec81-34ad-4313-863d-334ffd0c8743	vencimento	010	Adicional de Insalubridade (10%)	Abril/2024	585	2
62df8cc2-7f92-48de-9968-35a716aa7052	9caaec81-34ad-4313-863d-334ffd0c8743	vencimento	020	Adicional de Tempo de Serviço (5%)	Abril/2024	292.5	3
81e94ecc-97cf-4d57-adf4-3c4a19c7b432	9caaec81-34ad-4313-863d-334ffd0c8743	desconto	101	INSS	Abril/2024	740.025	10
11ce6716-fca5-470b-a717-c19a40540ae4	9caaec81-34ad-4313-863d-334ffd0c8743	desconto	102	IRRF	Abril/2024	980.7025	11
49ad77c9-5447-45d2-83a8-e40f9d85eb89	9caaec81-34ad-4313-863d-334ffd0c8743	desconto	103	Previdência Municipal	Abril/2024	819	12
e230e489-8d5d-429f-b44c-44cfef8687cd	9caaec81-34ad-4313-863d-334ffd0c8743	informativo	200	Base de Cálculo IRRF	Abril/2024	5987.475	20
1914380b-1586-43dd-a6c5-c9816875fce0	9caaec81-34ad-4313-863d-334ffd0c8743	informativo	201	Base de Cálculo INSS	Abril/2024	6727.5	21
6890a14e-c6b3-4112-8b38-5996fff41f8d	81dd1368-194b-471a-bfa2-4126621dc256	vencimento	001	Vencimento Básico	Março/2026	3200	1
44b475c8-ca25-4751-9b94-2608f38615d4	81dd1368-194b-471a-bfa2-4126621dc256	vencimento	010	Adicional de Insalubridade (10%)	Março/2026	320	2
75d35f35-f1b9-4d78-8ae3-2190c0033e21	81dd1368-194b-471a-bfa2-4126621dc256	vencimento	020	Adicional de Tempo de Serviço (5%)	Março/2026	160	3
02082508-27de-4d98-9f0f-b770857ba34b	81dd1368-194b-471a-bfa2-4126621dc256	desconto	101	INSS	Março/2026	404.8	10
afc98907-79a8-437b-b817-4dbe0ce379c0	81dd1368-194b-471a-bfa2-4126621dc256	desconto	102	IRRF	Março/2026	197.2	11
e9e3e157-98f1-4f46-8feb-719f4c94b8a8	81dd1368-194b-471a-bfa2-4126621dc256	desconto	103	Previdência Municipal	Março/2026	448	12
d85e69a1-b682-486f-a875-e03b242cb706	81dd1368-194b-471a-bfa2-4126621dc256	informativo	200	Base de Cálculo IRRF	Março/2026	3275.2	20
dd17a93b-2504-42c1-8072-dd45e3562d76	81dd1368-194b-471a-bfa2-4126621dc256	informativo	201	Base de Cálculo INSS	Março/2026	3680	21
4cd52214-ca7c-4a0f-ad9f-ff00e2fb51fe	d83f2198-5c8c-4787-93dd-80c554bd2b8a	vencimento	001	Vencimento Básico	Fevereiro/2026	3200	1
7f3a58c6-f508-4742-bcd0-301f6f689cb8	d83f2198-5c8c-4787-93dd-80c554bd2b8a	vencimento	010	Adicional de Insalubridade (10%)	Fevereiro/2026	320	2
0e078431-03f8-43f2-b0b8-6688f8d2edc6	d83f2198-5c8c-4787-93dd-80c554bd2b8a	vencimento	020	Adicional de Tempo de Serviço (5%)	Fevereiro/2026	160	3
0fce4540-1e86-4d86-a585-4e8f34bc54a1	d83f2198-5c8c-4787-93dd-80c554bd2b8a	desconto	101	INSS	Fevereiro/2026	404.8	10
ac851c4d-3d0b-4cfa-8431-56e64462499e	d83f2198-5c8c-4787-93dd-80c554bd2b8a	desconto	102	IRRF	Fevereiro/2026	197.2	11
97ec71c4-d524-45c1-bfa0-a6b33ba605c9	d83f2198-5c8c-4787-93dd-80c554bd2b8a	desconto	103	Previdência Municipal	Fevereiro/2026	448	12
30878d0c-f5a6-4cec-afbe-5d5bbbbc26fb	d83f2198-5c8c-4787-93dd-80c554bd2b8a	informativo	200	Base de Cálculo IRRF	Fevereiro/2026	3275.2	20
6bb0d679-9b1e-4727-80cf-bc30ced2d92e	d83f2198-5c8c-4787-93dd-80c554bd2b8a	informativo	201	Base de Cálculo INSS	Fevereiro/2026	3680	21
c81b30ce-eac7-41d8-9bc5-00295edc5e60	c41d4e2d-b3cb-46eb-bd4d-05abba3796cd	vencimento	001	Vencimento Básico	Janeiro/2026	3200	1
c505665e-ef28-4f82-8b59-0c5a663d1acb	c41d4e2d-b3cb-46eb-bd4d-05abba3796cd	vencimento	010	Adicional de Insalubridade (10%)	Janeiro/2026	320	2
65e7e633-81ae-4e27-9fa6-7895054d4250	c41d4e2d-b3cb-46eb-bd4d-05abba3796cd	vencimento	020	Adicional de Tempo de Serviço (5%)	Janeiro/2026	160	3
b6232918-6576-4e0c-8307-7eb201ea3e82	c41d4e2d-b3cb-46eb-bd4d-05abba3796cd	desconto	101	INSS	Janeiro/2026	404.8	10
cf41b802-c2a2-44de-8f2d-5efdb6ad43bd	c41d4e2d-b3cb-46eb-bd4d-05abba3796cd	desconto	102	IRRF	Janeiro/2026	197.2	11
6ab3ff01-8acd-479c-93d3-e288cc7da89e	c41d4e2d-b3cb-46eb-bd4d-05abba3796cd	desconto	103	Previdência Municipal	Janeiro/2026	448	12
9916f0b6-c87a-467e-bb8a-85387171ba11	c41d4e2d-b3cb-46eb-bd4d-05abba3796cd	informativo	200	Base de Cálculo IRRF	Janeiro/2026	3275.2	20
66eb8fc2-130f-4c45-8224-cb6bf9b3ec62	c41d4e2d-b3cb-46eb-bd4d-05abba3796cd	informativo	201	Base de Cálculo INSS	Janeiro/2026	3680	21
61817acf-3c25-4900-9e14-9225948241b3	967764f7-16e1-4aad-8f07-f1c685ab8844	vencimento	001	Vencimento Básico	Dezembro/2025	3200	1
b1b20776-b2fe-47ef-a13c-9c6e908568db	967764f7-16e1-4aad-8f07-f1c685ab8844	vencimento	010	Adicional de Insalubridade (10%)	Dezembro/2025	320	2
13902aa6-fb75-404e-a1a1-82bc85b2c216	967764f7-16e1-4aad-8f07-f1c685ab8844	vencimento	020	Adicional de Tempo de Serviço (5%)	Dezembro/2025	160	3
2ea7fc47-7c3b-456d-96fd-294017146a38	967764f7-16e1-4aad-8f07-f1c685ab8844	desconto	101	INSS	Dezembro/2025	404.8	10
496c6591-f371-47d7-9329-cbc73bdd69f7	967764f7-16e1-4aad-8f07-f1c685ab8844	desconto	102	IRRF	Dezembro/2025	197.2	11
26d53457-4646-44be-a00b-fcd8b78814e9	967764f7-16e1-4aad-8f07-f1c685ab8844	desconto	103	Previdência Municipal	Dezembro/2025	448	12
7acf71b3-b3b5-48eb-af2b-a5ba8d24bf71	967764f7-16e1-4aad-8f07-f1c685ab8844	informativo	200	Base de Cálculo IRRF	Dezembro/2025	3275.2	20
5b80e220-fd05-4930-b321-05b7f58f4d1f	967764f7-16e1-4aad-8f07-f1c685ab8844	informativo	201	Base de Cálculo INSS	Dezembro/2025	3680	21
7eb8f6aa-ba84-435a-b0d0-3db096a2ae07	5895d881-e096-4dc0-9de2-c6882c2317f8	vencimento	001	Vencimento Básico	Novembro/2025	3200	1
a5c78c79-e5ce-46d7-8c05-ec59289eb055	5895d881-e096-4dc0-9de2-c6882c2317f8	vencimento	010	Adicional de Insalubridade (10%)	Novembro/2025	320	2
b0027896-a93e-435a-92c9-93b705e3cc3d	5895d881-e096-4dc0-9de2-c6882c2317f8	vencimento	020	Adicional de Tempo de Serviço (5%)	Novembro/2025	160	3
9673f60e-3ef9-4c1c-9ee1-ac728133b146	5895d881-e096-4dc0-9de2-c6882c2317f8	desconto	101	INSS	Novembro/2025	404.8	10
3f64204c-c004-48bb-afb7-a48dafcb4580	5895d881-e096-4dc0-9de2-c6882c2317f8	desconto	102	IRRF	Novembro/2025	197.2	11
9c4fbcd0-f383-4493-be2c-4b71b99d791c	5895d881-e096-4dc0-9de2-c6882c2317f8	desconto	103	Previdência Municipal	Novembro/2025	448	12
1298985a-9b52-4008-b335-394890472ac5	5895d881-e096-4dc0-9de2-c6882c2317f8	informativo	200	Base de Cálculo IRRF	Novembro/2025	3275.2	20
ee956927-6197-4bed-9b85-8aac62dcd754	5895d881-e096-4dc0-9de2-c6882c2317f8	informativo	201	Base de Cálculo INSS	Novembro/2025	3680	21
1318b52b-a312-4e14-be70-d53a05cc8ebb	9c80387d-360f-45c5-bf63-ea1b02bbad55	vencimento	001	Vencimento Básico	Outubro/2025	3200	1
2002d9c7-20e2-4c72-8cf8-2713e38fdc71	9c80387d-360f-45c5-bf63-ea1b02bbad55	vencimento	010	Adicional de Insalubridade (10%)	Outubro/2025	320	2
e80389ac-88aa-4363-8b2d-d9df66c0804b	9c80387d-360f-45c5-bf63-ea1b02bbad55	vencimento	020	Adicional de Tempo de Serviço (5%)	Outubro/2025	160	3
777dbc94-e694-4ef8-9b15-74e97f102a84	9c80387d-360f-45c5-bf63-ea1b02bbad55	desconto	101	INSS	Outubro/2025	404.8	10
eaef6df6-8324-41a9-aa75-ca31fee41708	9c80387d-360f-45c5-bf63-ea1b02bbad55	desconto	102	IRRF	Outubro/2025	197.2	11
c06d2c58-cfa9-4e2d-a344-29d3088fd203	9c80387d-360f-45c5-bf63-ea1b02bbad55	desconto	103	Previdência Municipal	Outubro/2025	448	12
2fbb544d-af5b-4545-8991-31c15d1ce509	9c80387d-360f-45c5-bf63-ea1b02bbad55	informativo	200	Base de Cálculo IRRF	Outubro/2025	3275.2	20
d2e25b1d-4c40-428c-87f5-043d1fcca30c	9c80387d-360f-45c5-bf63-ea1b02bbad55	informativo	201	Base de Cálculo INSS	Outubro/2025	3680	21
d9106244-a3f2-451c-b97c-ce94f5b34943	eec46d0f-10d5-419a-9192-cf235f010927	vencimento	001	Vencimento Básico	Setembro/2025	3200	1
bbd58ba0-bb1c-4b3a-9c29-75787467f6c6	eec46d0f-10d5-419a-9192-cf235f010927	vencimento	010	Adicional de Insalubridade (10%)	Setembro/2025	320	2
3f412f9d-b1b1-441a-98c7-62cb77d3e51d	eec46d0f-10d5-419a-9192-cf235f010927	vencimento	020	Adicional de Tempo de Serviço (5%)	Setembro/2025	160	3
e3060247-b88c-445d-a622-91d1b50ee167	eec46d0f-10d5-419a-9192-cf235f010927	desconto	101	INSS	Setembro/2025	404.8	10
14366310-3966-4a1e-b5e4-d0175f3f922d	eec46d0f-10d5-419a-9192-cf235f010927	desconto	102	IRRF	Setembro/2025	197.2	11
7afcd191-a4f8-40e8-8004-793c530eaafc	eec46d0f-10d5-419a-9192-cf235f010927	desconto	103	Previdência Municipal	Setembro/2025	448	12
2a8eaf56-bdf4-44ea-af43-e685ef6b0104	eec46d0f-10d5-419a-9192-cf235f010927	informativo	200	Base de Cálculo IRRF	Setembro/2025	3275.2	20
404a892f-0a04-4f51-bb90-dbea9b13c183	eec46d0f-10d5-419a-9192-cf235f010927	informativo	201	Base de Cálculo INSS	Setembro/2025	3680	21
0aead208-0369-4a79-8331-f1165d65d20e	50eb8659-e573-4702-b26e-2a3181ebcfbd	vencimento	001	Vencimento Básico	Agosto/2025	3200	1
d991a9e9-2c03-4b70-b42f-c5973faed784	50eb8659-e573-4702-b26e-2a3181ebcfbd	vencimento	010	Adicional de Insalubridade (10%)	Agosto/2025	320	2
aa53bc50-9ffa-4c68-8094-37d43fd4dd54	50eb8659-e573-4702-b26e-2a3181ebcfbd	vencimento	020	Adicional de Tempo de Serviço (5%)	Agosto/2025	160	3
8a1d9805-a12f-461f-afeb-2c4e91a9f27b	50eb8659-e573-4702-b26e-2a3181ebcfbd	desconto	101	INSS	Agosto/2025	404.8	10
57fdbf2b-d559-4a3d-ad99-01bd8a1598d7	50eb8659-e573-4702-b26e-2a3181ebcfbd	desconto	102	IRRF	Agosto/2025	197.2	11
60b829b5-30cf-4cd6-b8a6-ed49650453fb	50eb8659-e573-4702-b26e-2a3181ebcfbd	desconto	103	Previdência Municipal	Agosto/2025	448	12
f73ba586-9dc2-421c-9660-8b7f5f5272b2	50eb8659-e573-4702-b26e-2a3181ebcfbd	informativo	200	Base de Cálculo IRRF	Agosto/2025	3275.2	20
4bd79364-fdf6-42f6-86fc-bd8a6fb9faeb	50eb8659-e573-4702-b26e-2a3181ebcfbd	informativo	201	Base de Cálculo INSS	Agosto/2025	3680	21
f9d284ba-7dbc-4543-bec5-3ad8cab4ca86	0e828afc-2540-4082-92f3-f1efefb137e9	vencimento	001	Vencimento Básico	Julho/2025	3200	1
3d0332e1-63c9-4d7b-b152-065fc48bb919	0e828afc-2540-4082-92f3-f1efefb137e9	vencimento	010	Adicional de Insalubridade (10%)	Julho/2025	320	2
085abe27-59e1-4a0b-b741-028e48ade9c3	0e828afc-2540-4082-92f3-f1efefb137e9	vencimento	020	Adicional de Tempo de Serviço (5%)	Julho/2025	160	3
d2b9ee30-a239-49f6-b24e-1e5d360135ab	0e828afc-2540-4082-92f3-f1efefb137e9	vencimento	030	1/3 Constitucional de Férias	Julho/2025	1056	4
4f5ea172-c9a8-45f5-8042-28adb8e138c5	0e828afc-2540-4082-92f3-f1efefb137e9	desconto	101	INSS	Julho/2025	520.96	10
0a3c5799-d72e-4f7f-b2e1-3f1d8474e4fd	0e828afc-2540-4082-92f3-f1efefb137e9	desconto	102	IRRF	Julho/2025	433.04	11
b051ea52-9861-45a1-bf7f-7ccef0bbc8a1	0e828afc-2540-4082-92f3-f1efefb137e9	desconto	103	Previdência Municipal	Julho/2025	448	12
a0807334-c61c-4355-92e8-01a890c643f1	0e828afc-2540-4082-92f3-f1efefb137e9	informativo	200	Base de Cálculo IRRF	Julho/2025	4215.04	20
c17ce7e2-a703-4dd1-abfb-c56b45ba76d9	0e828afc-2540-4082-92f3-f1efefb137e9	informativo	201	Base de Cálculo INSS	Julho/2025	4736	21
ebefbdca-9904-45fa-97ab-fa14b3e7e9d8	8cb0a4d8-b1fb-420c-9a79-20985d4a71c6	vencimento	001	Vencimento Básico	Junho/2025	3200	1
1c580be9-9e86-4821-ac2d-9305968b9872	8cb0a4d8-b1fb-420c-9a79-20985d4a71c6	vencimento	010	Adicional de Insalubridade (10%)	Junho/2025	320	2
7a74cd24-6d3b-404a-95da-6b61b08d2d12	8cb0a4d8-b1fb-420c-9a79-20985d4a71c6	vencimento	020	Adicional de Tempo de Serviço (5%)	Junho/2025	160	3
af89fe9f-6deb-4801-bfba-312fa777c5b0	8cb0a4d8-b1fb-420c-9a79-20985d4a71c6	desconto	101	INSS	Junho/2025	404.8	10
746aae53-f81d-4d59-a4e3-dca0c590c21e	8cb0a4d8-b1fb-420c-9a79-20985d4a71c6	desconto	102	IRRF	Junho/2025	197.2	11
662586b5-22f6-4b87-a8d9-479d1e0fecb0	8cb0a4d8-b1fb-420c-9a79-20985d4a71c6	desconto	103	Previdência Municipal	Junho/2025	448	12
4be913ab-1290-432e-95df-995c2bb79748	8cb0a4d8-b1fb-420c-9a79-20985d4a71c6	informativo	200	Base de Cálculo IRRF	Junho/2025	3275.2	20
51bda299-74f2-4205-9342-dd7b1255e51c	8cb0a4d8-b1fb-420c-9a79-20985d4a71c6	informativo	201	Base de Cálculo INSS	Junho/2025	3680	21
3fe22fd7-c131-4486-8ce4-31f744b0472e	97f61dd3-0235-41a7-a755-e77c41707864	vencimento	001	Vencimento Básico	Maio/2025	3200	1
9083f2ae-9320-479b-894c-87fe2a17e2c0	97f61dd3-0235-41a7-a755-e77c41707864	vencimento	010	Adicional de Insalubridade (10%)	Maio/2025	320	2
d0c87f0f-1174-4067-a719-87a3346d11b6	97f61dd3-0235-41a7-a755-e77c41707864	vencimento	020	Adicional de Tempo de Serviço (5%)	Maio/2025	160	3
7fc10877-566b-4759-ba86-988193e0c9f4	97f61dd3-0235-41a7-a755-e77c41707864	desconto	101	INSS	Maio/2025	404.8	10
cc40f50c-0cdf-4187-9d9a-cdacca7f6399	97f61dd3-0235-41a7-a755-e77c41707864	desconto	102	IRRF	Maio/2025	197.2	11
e5a9c1ec-7b30-4cf3-aed8-bde4cef3d48b	97f61dd3-0235-41a7-a755-e77c41707864	desconto	103	Previdência Municipal	Maio/2025	448	12
ddfb0fa9-d5c0-40f4-9f5d-37da9de602fa	97f61dd3-0235-41a7-a755-e77c41707864	informativo	200	Base de Cálculo IRRF	Maio/2025	3275.2	20
7937606f-c0e4-453e-9b44-10532963bba0	97f61dd3-0235-41a7-a755-e77c41707864	informativo	201	Base de Cálculo INSS	Maio/2025	3680	21
db3914af-be88-4be7-8158-a1e40cd92ae0	709538e2-562f-4eeb-acf2-63dd1306968d	vencimento	001	Vencimento Básico	Abril/2025	3200	1
3eaec2b9-b418-4248-8424-97fc8a63333e	709538e2-562f-4eeb-acf2-63dd1306968d	vencimento	010	Adicional de Insalubridade (10%)	Abril/2025	320	2
7582efe1-b88f-489f-b7f9-530217b369b4	709538e2-562f-4eeb-acf2-63dd1306968d	vencimento	020	Adicional de Tempo de Serviço (5%)	Abril/2025	160	3
9b18292b-9910-4fbf-93e9-18d46fb3cfbf	709538e2-562f-4eeb-acf2-63dd1306968d	desconto	101	INSS	Abril/2025	404.8	10
40102b34-fbb9-4b7b-a193-15c6ed393592	709538e2-562f-4eeb-acf2-63dd1306968d	desconto	102	IRRF	Abril/2025	197.2	11
0be08684-eb7c-43cc-b147-80fdb07be2d3	709538e2-562f-4eeb-acf2-63dd1306968d	desconto	103	Previdência Municipal	Abril/2025	448	12
d8044268-0f84-46e4-91a5-0ec615ca89e6	709538e2-562f-4eeb-acf2-63dd1306968d	informativo	200	Base de Cálculo IRRF	Abril/2025	3275.2	20
edd4212a-5662-4c86-b8d4-decddb2dacea	709538e2-562f-4eeb-acf2-63dd1306968d	informativo	201	Base de Cálculo INSS	Abril/2025	3680	21
4b277888-6785-4104-a67b-8497bb17b383	21d64111-eded-4728-bb86-8f394e519e5e	vencimento	001	Vencimento Básico	Março/2025	3200	1
94c91d26-d93b-4fa4-8b7d-d398545fec64	21d64111-eded-4728-bb86-8f394e519e5e	vencimento	010	Adicional de Insalubridade (10%)	Março/2025	320	2
2597fe1a-35f9-4a54-9c27-40487d531d85	21d64111-eded-4728-bb86-8f394e519e5e	vencimento	020	Adicional de Tempo de Serviço (5%)	Março/2025	160	3
1ba1cb13-6e83-42c3-add0-30454457de15	21d64111-eded-4728-bb86-8f394e519e5e	desconto	101	INSS	Março/2025	404.8	10
8d5efea2-2cc0-4ba0-852e-41beff0d01da	21d64111-eded-4728-bb86-8f394e519e5e	desconto	102	IRRF	Março/2025	197.2	11
8c632ac7-b479-42bd-80f5-3c92979efd92	21d64111-eded-4728-bb86-8f394e519e5e	desconto	103	Previdência Municipal	Março/2025	448	12
6c6f7965-d2cf-4d13-9f86-46d796fd6fe0	21d64111-eded-4728-bb86-8f394e519e5e	informativo	200	Base de Cálculo IRRF	Março/2025	3275.2	20
18391808-26c6-4b36-ba72-e3f9c7023470	21d64111-eded-4728-bb86-8f394e519e5e	informativo	201	Base de Cálculo INSS	Março/2025	3680	21
e1d4f548-e1ee-48ea-b1fa-284ca399b745	ebdc563e-f8ff-4156-98a1-b071384f13c5	vencimento	001	Vencimento Básico	Fevereiro/2025	3200	1
386dfb91-92d3-4463-b135-4583a815659a	ebdc563e-f8ff-4156-98a1-b071384f13c5	vencimento	010	Adicional de Insalubridade (10%)	Fevereiro/2025	320	2
7b178a3a-8a67-4ad7-88e5-a34040ee56fb	ebdc563e-f8ff-4156-98a1-b071384f13c5	vencimento	020	Adicional de Tempo de Serviço (5%)	Fevereiro/2025	160	3
a42fb2ae-9624-49c5-8df6-3fc739a7323a	ebdc563e-f8ff-4156-98a1-b071384f13c5	desconto	101	INSS	Fevereiro/2025	404.8	10
37393dff-c9db-4921-a5a9-e2f332f26cd7	ebdc563e-f8ff-4156-98a1-b071384f13c5	desconto	102	IRRF	Fevereiro/2025	197.2	11
dbceb8ed-0b55-4bae-912d-d1d47524ebde	ebdc563e-f8ff-4156-98a1-b071384f13c5	desconto	103	Previdência Municipal	Fevereiro/2025	448	12
04034ade-c2e0-41a8-b055-a78f0b07a398	ebdc563e-f8ff-4156-98a1-b071384f13c5	informativo	200	Base de Cálculo IRRF	Fevereiro/2025	3275.2	20
6a2858c2-b6a4-4b07-b45d-0bf8afbe6f7e	ebdc563e-f8ff-4156-98a1-b071384f13c5	informativo	201	Base de Cálculo INSS	Fevereiro/2025	3680	21
4737046e-5bee-4a6b-a2ce-aacc4a2f5a25	cbd4db2f-c39e-4ff4-b892-1ef9bbd5581a	vencimento	001	Vencimento Básico	Janeiro/2025	3200	1
697b9cec-118d-4de8-b8b3-438a2bc19de6	cbd4db2f-c39e-4ff4-b892-1ef9bbd5581a	vencimento	010	Adicional de Insalubridade (10%)	Janeiro/2025	320	2
a6415cfd-0b96-4ce1-bc0c-539159f8c464	cbd4db2f-c39e-4ff4-b892-1ef9bbd5581a	vencimento	020	Adicional de Tempo de Serviço (5%)	Janeiro/2025	160	3
2772f754-4512-49e0-86cb-3d1481413d1c	cbd4db2f-c39e-4ff4-b892-1ef9bbd5581a	desconto	101	INSS	Janeiro/2025	404.8	10
3cf97844-4f77-4e81-9460-032a5017827f	cbd4db2f-c39e-4ff4-b892-1ef9bbd5581a	desconto	102	IRRF	Janeiro/2025	197.2	11
bee717db-5c9f-49f8-afca-e1e3bf141b4a	cbd4db2f-c39e-4ff4-b892-1ef9bbd5581a	desconto	103	Previdência Municipal	Janeiro/2025	448	12
22289f51-0270-4e74-84f9-5dd284ace01b	cbd4db2f-c39e-4ff4-b892-1ef9bbd5581a	informativo	200	Base de Cálculo IRRF	Janeiro/2025	3275.2	20
70ef8890-7134-4b1a-9979-99f2ace34908	cbd4db2f-c39e-4ff4-b892-1ef9bbd5581a	informativo	201	Base de Cálculo INSS	Janeiro/2025	3680	21
4f16c044-e003-475b-a846-d2ccf2003442	42da6283-39da-4bca-95df-6b53133c8e20	vencimento	001	Vencimento Básico	Dezembro/2024	3200	1
ae67de85-be33-4b29-b042-64fcaa8165b9	42da6283-39da-4bca-95df-6b53133c8e20	vencimento	010	Adicional de Insalubridade (10%)	Dezembro/2024	320	2
2e41846c-b2b2-4494-98f6-eaacd8cd19db	42da6283-39da-4bca-95df-6b53133c8e20	vencimento	020	Adicional de Tempo de Serviço (5%)	Dezembro/2024	160	3
d8b16839-8812-4c42-836e-392027a9a1c1	42da6283-39da-4bca-95df-6b53133c8e20	desconto	101	INSS	Dezembro/2024	404.8	10
47a0aa33-31c1-457d-9e83-29c892815fac	42da6283-39da-4bca-95df-6b53133c8e20	desconto	102	IRRF	Dezembro/2024	197.2	11
f9129cb1-738d-4717-a6d6-892da433c18f	42da6283-39da-4bca-95df-6b53133c8e20	desconto	103	Previdência Municipal	Dezembro/2024	448	12
8b22bd01-6ae4-49a2-9653-7c45f9ffb5ec	42da6283-39da-4bca-95df-6b53133c8e20	informativo	200	Base de Cálculo IRRF	Dezembro/2024	3275.2	20
3ca8f694-fd03-4296-b765-24402910c01c	42da6283-39da-4bca-95df-6b53133c8e20	informativo	201	Base de Cálculo INSS	Dezembro/2024	3680	21
d0516052-11fc-4b00-8a79-5646b2ec9bed	b47bd6a2-bb64-41f2-b937-2d9ecba5d781	vencimento	001	Vencimento Básico	Novembro/2024	3200	1
54b29954-eea7-4e3a-83bb-af2a6d54ab5b	b47bd6a2-bb64-41f2-b937-2d9ecba5d781	vencimento	010	Adicional de Insalubridade (10%)	Novembro/2024	320	2
1ad82a02-6ba8-45ca-9d86-c4d3d35b19e5	b47bd6a2-bb64-41f2-b937-2d9ecba5d781	vencimento	020	Adicional de Tempo de Serviço (5%)	Novembro/2024	160	3
d2f066f2-083b-4aaa-a0f6-3a044c1c523c	b47bd6a2-bb64-41f2-b937-2d9ecba5d781	desconto	101	INSS	Novembro/2024	404.8	10
75f3905c-35ce-4558-a78c-403a5a08f38e	b47bd6a2-bb64-41f2-b937-2d9ecba5d781	desconto	102	IRRF	Novembro/2024	197.2	11
22f005f2-2fef-4ea8-8174-c671996a29e3	b47bd6a2-bb64-41f2-b937-2d9ecba5d781	desconto	103	Previdência Municipal	Novembro/2024	448	12
06907883-1e33-452a-8596-bdc3074fc3cb	b47bd6a2-bb64-41f2-b937-2d9ecba5d781	informativo	200	Base de Cálculo IRRF	Novembro/2024	3275.2	20
932860a7-8616-439a-87b9-d0b567b1bc2b	b47bd6a2-bb64-41f2-b937-2d9ecba5d781	informativo	201	Base de Cálculo INSS	Novembro/2024	3680	21
4dfb55b7-bb7e-4729-a0d7-63610da86c47	5f7a82b5-41f7-4ae6-b88e-fe4d447b29db	vencimento	001	Vencimento Básico	Outubro/2024	3200	1
637d0c95-b663-4491-a4d1-9050e3894e6f	5f7a82b5-41f7-4ae6-b88e-fe4d447b29db	vencimento	010	Adicional de Insalubridade (10%)	Outubro/2024	320	2
b7101174-cacc-4e8e-8798-67e4d2ec0ed1	5f7a82b5-41f7-4ae6-b88e-fe4d447b29db	vencimento	020	Adicional de Tempo de Serviço (5%)	Outubro/2024	160	3
105474c0-c2dc-4192-a83a-47019f7038b5	5f7a82b5-41f7-4ae6-b88e-fe4d447b29db	desconto	101	INSS	Outubro/2024	404.8	10
fc1b76ec-4b27-43d7-aea7-99e178ac64d4	5f7a82b5-41f7-4ae6-b88e-fe4d447b29db	desconto	102	IRRF	Outubro/2024	197.2	11
8405d2b5-5e37-4424-9ec0-f51f36628a6e	5f7a82b5-41f7-4ae6-b88e-fe4d447b29db	desconto	103	Previdência Municipal	Outubro/2024	448	12
833d4a7f-6f37-43a3-9f21-3381c4a85215	5f7a82b5-41f7-4ae6-b88e-fe4d447b29db	informativo	200	Base de Cálculo IRRF	Outubro/2024	3275.2	20
db7ea3f8-a8d1-4233-818b-0f45885adaff	5f7a82b5-41f7-4ae6-b88e-fe4d447b29db	informativo	201	Base de Cálculo INSS	Outubro/2024	3680	21
5fc917b1-3d99-4d3f-b958-c165d5b799bb	8e8d9549-60ec-4e5f-8318-d89f00285249	vencimento	001	Vencimento Básico	Setembro/2024	3200	1
5db4ca21-5090-4ba3-879e-3f3ea685d78c	8e8d9549-60ec-4e5f-8318-d89f00285249	vencimento	010	Adicional de Insalubridade (10%)	Setembro/2024	320	2
5d0ebb0c-4b06-4b81-a58f-0287d42291a6	8e8d9549-60ec-4e5f-8318-d89f00285249	vencimento	020	Adicional de Tempo de Serviço (5%)	Setembro/2024	160	3
9e5db0a2-59be-41de-9281-b4cb97a59ce7	8e8d9549-60ec-4e5f-8318-d89f00285249	desconto	101	INSS	Setembro/2024	404.8	10
52ab7cfa-baaa-4cac-86d2-52e4330a1049	8e8d9549-60ec-4e5f-8318-d89f00285249	desconto	102	IRRF	Setembro/2024	197.2	11
18fb965e-d126-446a-80fb-7bdb0eb86502	8e8d9549-60ec-4e5f-8318-d89f00285249	desconto	103	Previdência Municipal	Setembro/2024	448	12
87425b17-4747-4b60-ae9a-33d957a08a64	8e8d9549-60ec-4e5f-8318-d89f00285249	informativo	200	Base de Cálculo IRRF	Setembro/2024	3275.2	20
54a1c57c-786d-42a3-982c-d01de2f4ba53	8e8d9549-60ec-4e5f-8318-d89f00285249	informativo	201	Base de Cálculo INSS	Setembro/2024	3680	21
1d569732-33e2-46b9-986a-8b06a9adb2da	00fb214e-749a-4b73-90e1-c5f9fd4de1dc	vencimento	001	Vencimento Básico	Agosto/2024	3200	1
308ba9db-57f1-430d-ae89-74b7c8718bf1	00fb214e-749a-4b73-90e1-c5f9fd4de1dc	vencimento	010	Adicional de Insalubridade (10%)	Agosto/2024	320	2
a989646e-f361-4330-ab4c-53a1dc7786bf	00fb214e-749a-4b73-90e1-c5f9fd4de1dc	vencimento	020	Adicional de Tempo de Serviço (5%)	Agosto/2024	160	3
89ab507f-ddc5-4504-998f-28bff19788d4	00fb214e-749a-4b73-90e1-c5f9fd4de1dc	desconto	101	INSS	Agosto/2024	404.8	10
0be80677-9423-4df7-84c8-5e561eb9e0be	00fb214e-749a-4b73-90e1-c5f9fd4de1dc	desconto	102	IRRF	Agosto/2024	197.2	11
9454ae4a-c7cc-4a74-b86a-e1c20890d7b1	00fb214e-749a-4b73-90e1-c5f9fd4de1dc	desconto	103	Previdência Municipal	Agosto/2024	448	12
6ce5824e-3f7c-48f2-a11d-2288fbf1eb15	00fb214e-749a-4b73-90e1-c5f9fd4de1dc	informativo	200	Base de Cálculo IRRF	Agosto/2024	3275.2	20
1ec04d9c-434d-43ba-b65d-eebbe29fd198	00fb214e-749a-4b73-90e1-c5f9fd4de1dc	informativo	201	Base de Cálculo INSS	Agosto/2024	3680	21
7cbc5494-56cc-4526-b09a-f1682872d974	9b6d3460-e849-4836-940c-533be1b08a54	vencimento	001	Vencimento Básico	Julho/2024	3200	1
588c5320-c66a-4e3c-b01f-641119921343	9b6d3460-e849-4836-940c-533be1b08a54	vencimento	010	Adicional de Insalubridade (10%)	Julho/2024	320	2
996084be-5d49-42e6-9eb5-8a5dec8ab55c	9b6d3460-e849-4836-940c-533be1b08a54	vencimento	020	Adicional de Tempo de Serviço (5%)	Julho/2024	160	3
c27b89eb-0afb-4ec2-8785-637cc73bff16	9b6d3460-e849-4836-940c-533be1b08a54	vencimento	030	1/3 Constitucional de Férias	Julho/2024	1056	4
fed79d66-6d4f-4ad5-8a76-e8c9c0505c1d	9b6d3460-e849-4836-940c-533be1b08a54	desconto	101	INSS	Julho/2024	520.96	10
c6267e5d-7f29-4ca4-85e4-9419875cc686	9b6d3460-e849-4836-940c-533be1b08a54	desconto	102	IRRF	Julho/2024	433.04	11
6d63f6c2-9de7-4868-ab90-12e558638416	9b6d3460-e849-4836-940c-533be1b08a54	desconto	103	Previdência Municipal	Julho/2024	448	12
e4977021-0b94-48bb-85f5-599f884d1cde	9b6d3460-e849-4836-940c-533be1b08a54	informativo	200	Base de Cálculo IRRF	Julho/2024	4215.04	20
c85ce345-2537-404f-ad2f-0a42d714104e	9b6d3460-e849-4836-940c-533be1b08a54	informativo	201	Base de Cálculo INSS	Julho/2024	4736	21
bd527da9-5337-42fe-a461-549f6d2de083	d73b84ab-d048-4464-8b95-517ee3c97b8a	vencimento	001	Vencimento Básico	Junho/2024	3200	1
6d4253f0-cbeb-4f29-9f53-d5d88d46913b	d73b84ab-d048-4464-8b95-517ee3c97b8a	vencimento	010	Adicional de Insalubridade (10%)	Junho/2024	320	2
b1a1fcdd-1b89-4a2b-a7ab-47a97bbb3ea9	d73b84ab-d048-4464-8b95-517ee3c97b8a	vencimento	020	Adicional de Tempo de Serviço (5%)	Junho/2024	160	3
0dfce53b-ad84-4e65-aee8-2567f66bd4d6	d73b84ab-d048-4464-8b95-517ee3c97b8a	desconto	101	INSS	Junho/2024	404.8	10
d54680d3-e305-49af-89fb-ec5133d028fe	d73b84ab-d048-4464-8b95-517ee3c97b8a	desconto	102	IRRF	Junho/2024	197.2	11
553623d2-c01d-4633-a8ac-2379808981aa	d73b84ab-d048-4464-8b95-517ee3c97b8a	desconto	103	Previdência Municipal	Junho/2024	448	12
b8cb4e3a-2d51-47dd-8a80-5388a3d4f662	d73b84ab-d048-4464-8b95-517ee3c97b8a	informativo	200	Base de Cálculo IRRF	Junho/2024	3275.2	20
49308111-653c-4112-a601-516ae7f45ef7	d73b84ab-d048-4464-8b95-517ee3c97b8a	informativo	201	Base de Cálculo INSS	Junho/2024	3680	21
e933fdb3-3e5f-454e-aa49-409a3ce034a3	485103fa-6526-413d-9c80-a86c66f109b0	vencimento	001	Vencimento Básico	Maio/2024	3200	1
2485e814-739e-4f6c-bfc9-f2e29ac18f1c	485103fa-6526-413d-9c80-a86c66f109b0	vencimento	010	Adicional de Insalubridade (10%)	Maio/2024	320	2
c7d7ab4f-e673-4b5e-a1fe-ff690f2c0bbb	485103fa-6526-413d-9c80-a86c66f109b0	vencimento	020	Adicional de Tempo de Serviço (5%)	Maio/2024	160	3
e7856b6a-5b9c-4720-b37c-888ea1f58872	485103fa-6526-413d-9c80-a86c66f109b0	desconto	101	INSS	Maio/2024	404.8	10
e55b2565-f49e-42c6-b76a-b503c250a539	485103fa-6526-413d-9c80-a86c66f109b0	desconto	102	IRRF	Maio/2024	197.2	11
e13859b6-67e7-452c-87f7-1d17f5e8ae5d	485103fa-6526-413d-9c80-a86c66f109b0	desconto	103	Previdência Municipal	Maio/2024	448	12
dc85cb45-cf55-4907-bc9e-2d8dd753f7a0	485103fa-6526-413d-9c80-a86c66f109b0	informativo	200	Base de Cálculo IRRF	Maio/2024	3275.2	20
587323aa-1ddc-4b20-b8a0-6b1199c4a4a4	485103fa-6526-413d-9c80-a86c66f109b0	informativo	201	Base de Cálculo INSS	Maio/2024	3680	21
51b1dab8-7d90-436c-8e55-a2c9e7716c89	e65397f7-0240-481b-bc52-98bf26f68865	vencimento	001	Vencimento Básico	Abril/2024	3200	1
6fd41bd0-9f24-41ab-b43d-a1f3a59c5a06	e65397f7-0240-481b-bc52-98bf26f68865	vencimento	010	Adicional de Insalubridade (10%)	Abril/2024	320	2
6829932e-3859-4811-89e4-930a4182127e	e65397f7-0240-481b-bc52-98bf26f68865	vencimento	020	Adicional de Tempo de Serviço (5%)	Abril/2024	160	3
51373307-e5a8-4856-978d-a3ba46137c13	e65397f7-0240-481b-bc52-98bf26f68865	desconto	101	INSS	Abril/2024	404.8	10
39b05b81-606f-46ff-9d6f-b5167112594a	e65397f7-0240-481b-bc52-98bf26f68865	desconto	102	IRRF	Abril/2024	197.2	11
9a1e4bf6-c5c0-43af-8d5f-c730adb70735	e65397f7-0240-481b-bc52-98bf26f68865	desconto	103	Previdência Municipal	Abril/2024	448	12
016cfd4f-76ea-4962-a9ef-06b433b65e75	e65397f7-0240-481b-bc52-98bf26f68865	informativo	200	Base de Cálculo IRRF	Abril/2024	3275.2	20
ac0b8520-6986-4fff-921a-d62f88f540f9	e65397f7-0240-481b-bc52-98bf26f68865	informativo	201	Base de Cálculo INSS	Abril/2024	3680	21
bb34256c-58e5-4985-a7de-69128c9d96b0	b3e1b643-983f-4763-ab38-dac12270502b	vencimento	001	Vencimento Básico	Março/2026	4100	1
43c286be-9028-49f6-9997-3b78a8600ec7	b3e1b643-983f-4763-ab38-dac12270502b	vencimento	010	Adicional de Insalubridade (10%)	Março/2026	410	2
367a7c1e-2d8d-4cb8-acf6-c90fb9f6253b	b3e1b643-983f-4763-ab38-dac12270502b	vencimento	020	Adicional de Tempo de Serviço (5%)	Março/2026	205	3
15751376-49bc-461a-adad-8ddb51d50e2e	b3e1b643-983f-4763-ab38-dac12270502b	desconto	101	INSS	Março/2026	518.65	10
9accfddd-0751-4e25-ae12-fc45b96917e7	b3e1b643-983f-4763-ab38-dac12270502b	desconto	102	IRRF	Março/2026	427.265	11
cafa8006-4e71-479c-8285-a63bbb4d0d00	b3e1b643-983f-4763-ab38-dac12270502b	desconto	103	Previdência Municipal	Março/2026	574	12
80d366f4-0ce1-424c-9015-36dcb49561eb	b3e1b643-983f-4763-ab38-dac12270502b	informativo	200	Base de Cálculo IRRF	Março/2026	4196.35	20
90593396-c4e1-4e9c-9412-da4af48a07f4	b3e1b643-983f-4763-ab38-dac12270502b	informativo	201	Base de Cálculo INSS	Março/2026	4715	21
2c3ee44b-6f03-4682-ad5d-98bbbc5e53a8	b200b7e5-cfd6-4be1-bd99-4ff23b5c9b5e	vencimento	001	Vencimento Básico	Fevereiro/2026	4100	1
e1b5e473-3395-4d00-92f3-ac707e6ee9e6	b200b7e5-cfd6-4be1-bd99-4ff23b5c9b5e	vencimento	010	Adicional de Insalubridade (10%)	Fevereiro/2026	410	2
1f15dd00-1bc7-4d3c-a92c-346d233fc485	b200b7e5-cfd6-4be1-bd99-4ff23b5c9b5e	vencimento	020	Adicional de Tempo de Serviço (5%)	Fevereiro/2026	205	3
54c24ac7-1391-4bc6-b2e6-63cb3b5442b0	b200b7e5-cfd6-4be1-bd99-4ff23b5c9b5e	desconto	101	INSS	Fevereiro/2026	518.65	10
b592e18c-8e20-4271-9191-fd3c2a455a0d	b200b7e5-cfd6-4be1-bd99-4ff23b5c9b5e	desconto	102	IRRF	Fevereiro/2026	427.265	11
df4233c2-c917-4c89-82a2-3e906b6f0df4	b200b7e5-cfd6-4be1-bd99-4ff23b5c9b5e	desconto	103	Previdência Municipal	Fevereiro/2026	574	12
f0f2db48-17e9-4a2b-a40e-24e6f24a8984	b200b7e5-cfd6-4be1-bd99-4ff23b5c9b5e	informativo	200	Base de Cálculo IRRF	Fevereiro/2026	4196.35	20
2dddf6cd-e358-41aa-b2c2-d10bba1579a3	b200b7e5-cfd6-4be1-bd99-4ff23b5c9b5e	informativo	201	Base de Cálculo INSS	Fevereiro/2026	4715	21
4c20dd24-7871-40f4-9486-15a9105b5a7f	37bdce1d-963f-4744-8a5f-f0602dad44a9	vencimento	001	Vencimento Básico	Janeiro/2026	4100	1
d5189ef4-728c-41c3-ab47-56c000c3ddb6	37bdce1d-963f-4744-8a5f-f0602dad44a9	vencimento	010	Adicional de Insalubridade (10%)	Janeiro/2026	410	2
590a09a2-cd3b-498e-a338-d131eaa8ff59	37bdce1d-963f-4744-8a5f-f0602dad44a9	vencimento	020	Adicional de Tempo de Serviço (5%)	Janeiro/2026	205	3
3d513791-ede2-4040-8e10-e3ce3d8849db	37bdce1d-963f-4744-8a5f-f0602dad44a9	desconto	101	INSS	Janeiro/2026	518.65	10
d033de41-a215-44c3-a7ba-552a6fc551e3	37bdce1d-963f-4744-8a5f-f0602dad44a9	desconto	102	IRRF	Janeiro/2026	427.265	11
c0952387-01d6-40b5-8aca-93792a40ccc1	37bdce1d-963f-4744-8a5f-f0602dad44a9	desconto	103	Previdência Municipal	Janeiro/2026	574	12
97ff0611-ccce-4fad-8bf8-4196403fece6	37bdce1d-963f-4744-8a5f-f0602dad44a9	informativo	200	Base de Cálculo IRRF	Janeiro/2026	4196.35	20
c4090475-689a-4e36-a2b5-6c15c013b340	37bdce1d-963f-4744-8a5f-f0602dad44a9	informativo	201	Base de Cálculo INSS	Janeiro/2026	4715	21
86691844-fce1-4d02-86cc-5ae7fac30b6a	f5202db7-64db-4547-a86c-fc43015819b7	vencimento	001	Vencimento Básico	Dezembro/2025	4100	1
af4c4e16-f90b-4ca6-8928-d6a982dad40e	f5202db7-64db-4547-a86c-fc43015819b7	vencimento	010	Adicional de Insalubridade (10%)	Dezembro/2025	410	2
9aeb2279-3d7e-4578-b326-7d39c966437b	f5202db7-64db-4547-a86c-fc43015819b7	vencimento	020	Adicional de Tempo de Serviço (5%)	Dezembro/2025	205	3
67f34259-c593-4bfa-ac62-89b41e0d7a0b	f5202db7-64db-4547-a86c-fc43015819b7	desconto	101	INSS	Dezembro/2025	518.65	10
89d6cd1e-190c-4021-bfbc-117665b4c7f0	f5202db7-64db-4547-a86c-fc43015819b7	desconto	102	IRRF	Dezembro/2025	427.265	11
1ef93d9f-a4de-4141-a6d3-a3e2590fb4e5	f5202db7-64db-4547-a86c-fc43015819b7	desconto	103	Previdência Municipal	Dezembro/2025	574	12
1e5e9ae2-b732-402a-9e87-b9ca1862d17f	f5202db7-64db-4547-a86c-fc43015819b7	informativo	200	Base de Cálculo IRRF	Dezembro/2025	4196.35	20
fe97aea4-fe1b-4885-8b52-7f8aa743e263	f5202db7-64db-4547-a86c-fc43015819b7	informativo	201	Base de Cálculo INSS	Dezembro/2025	4715	21
dac00f0e-bb3d-4771-be95-73ac70c84367	03b35c73-6195-49a9-93ef-95f674f5f8ff	vencimento	001	Vencimento Básico	Novembro/2025	4100	1
04521bfa-4539-419b-88f9-7793459e7e2f	03b35c73-6195-49a9-93ef-95f674f5f8ff	vencimento	010	Adicional de Insalubridade (10%)	Novembro/2025	410	2
5c85f5c4-0923-47d0-ac3c-a30b8b881b85	03b35c73-6195-49a9-93ef-95f674f5f8ff	vencimento	020	Adicional de Tempo de Serviço (5%)	Novembro/2025	205	3
fd523c61-efb8-42a7-b05b-8767308054ba	03b35c73-6195-49a9-93ef-95f674f5f8ff	desconto	101	INSS	Novembro/2025	518.65	10
222fa723-4213-4780-97d5-c15112b2cc0a	03b35c73-6195-49a9-93ef-95f674f5f8ff	desconto	102	IRRF	Novembro/2025	427.265	11
7de12a05-b712-4c26-ac69-469260a7d14f	03b35c73-6195-49a9-93ef-95f674f5f8ff	desconto	103	Previdência Municipal	Novembro/2025	574	12
b95b558e-c1c7-4737-bb55-9d68ea65c20e	03b35c73-6195-49a9-93ef-95f674f5f8ff	informativo	200	Base de Cálculo IRRF	Novembro/2025	4196.35	20
e0eeaa94-c47b-4b85-9a0e-ecbdc4e542e1	03b35c73-6195-49a9-93ef-95f674f5f8ff	informativo	201	Base de Cálculo INSS	Novembro/2025	4715	21
0a47e439-3e1c-4e8d-92e1-491398fcdc87	c43c8653-fd48-4b26-9de2-0966ce0476aa	vencimento	001	Vencimento Básico	Outubro/2025	4100	1
4fbaf126-7bb3-4038-9805-c6402d4b662d	c43c8653-fd48-4b26-9de2-0966ce0476aa	vencimento	010	Adicional de Insalubridade (10%)	Outubro/2025	410	2
3b4c550f-13d9-4cf7-9dd7-732fd9052e44	c43c8653-fd48-4b26-9de2-0966ce0476aa	vencimento	020	Adicional de Tempo de Serviço (5%)	Outubro/2025	205	3
3e1a70dc-d3f6-48b8-9b1c-5abbc3b236da	c43c8653-fd48-4b26-9de2-0966ce0476aa	desconto	101	INSS	Outubro/2025	518.65	10
67941f81-0b12-4493-8520-6e2c1925a2bb	c43c8653-fd48-4b26-9de2-0966ce0476aa	desconto	102	IRRF	Outubro/2025	427.265	11
2fe4e4af-44a5-48de-a0e7-dfd66239ee1e	c43c8653-fd48-4b26-9de2-0966ce0476aa	desconto	103	Previdência Municipal	Outubro/2025	574	12
e98ad7c0-ffeb-4602-a356-ca77e71d4d78	c43c8653-fd48-4b26-9de2-0966ce0476aa	informativo	200	Base de Cálculo IRRF	Outubro/2025	4196.35	20
7e4efdb9-eaf1-47f9-ba0f-cde1e0901e68	c43c8653-fd48-4b26-9de2-0966ce0476aa	informativo	201	Base de Cálculo INSS	Outubro/2025	4715	21
118afa91-8cab-41b9-bb3c-7f585f9889e2	7896ab14-6093-4c61-ac73-dc743a428e1c	vencimento	001	Vencimento Básico	Setembro/2025	4100	1
d25f0658-cfea-4357-ab17-f354f1aa1179	7896ab14-6093-4c61-ac73-dc743a428e1c	vencimento	010	Adicional de Insalubridade (10%)	Setembro/2025	410	2
f53b51e7-3ce9-41a4-83e2-2238950fe452	7896ab14-6093-4c61-ac73-dc743a428e1c	vencimento	020	Adicional de Tempo de Serviço (5%)	Setembro/2025	205	3
c059e0cd-aa57-40a1-9cca-1b33b6216575	7896ab14-6093-4c61-ac73-dc743a428e1c	desconto	101	INSS	Setembro/2025	518.65	10
3650f853-bce1-4534-af6b-efcb052bdd3b	7896ab14-6093-4c61-ac73-dc743a428e1c	desconto	102	IRRF	Setembro/2025	427.265	11
33b9a100-c7c8-4685-8a6b-bae4c7bdd181	7896ab14-6093-4c61-ac73-dc743a428e1c	desconto	103	Previdência Municipal	Setembro/2025	574	12
81402a73-55e9-4a96-9534-5af93f80ed62	7896ab14-6093-4c61-ac73-dc743a428e1c	informativo	200	Base de Cálculo IRRF	Setembro/2025	4196.35	20
b7c25821-861c-421a-abbd-aadd9da54b35	7896ab14-6093-4c61-ac73-dc743a428e1c	informativo	201	Base de Cálculo INSS	Setembro/2025	4715	21
3cb7a374-cb3f-4cc8-b7ac-80dca1f940e5	d9ac024b-7beb-4da8-9cd1-915b8980e523	vencimento	001	Vencimento Básico	Agosto/2025	4100	1
7c54bda9-277f-48d3-b210-527a8ed3d848	d9ac024b-7beb-4da8-9cd1-915b8980e523	vencimento	010	Adicional de Insalubridade (10%)	Agosto/2025	410	2
a92fcc1d-8235-4029-bbdf-3029f107019d	d9ac024b-7beb-4da8-9cd1-915b8980e523	vencimento	020	Adicional de Tempo de Serviço (5%)	Agosto/2025	205	3
d1ba4751-f2bc-409c-8db2-17980b5e6da3	d9ac024b-7beb-4da8-9cd1-915b8980e523	desconto	101	INSS	Agosto/2025	518.65	10
962a6fab-c652-4406-a998-f02ca418409f	d9ac024b-7beb-4da8-9cd1-915b8980e523	desconto	102	IRRF	Agosto/2025	427.265	11
ef057c72-5c81-439f-86be-30a94bb92176	d9ac024b-7beb-4da8-9cd1-915b8980e523	desconto	103	Previdência Municipal	Agosto/2025	574	12
504afb59-36de-4456-ba62-9e462fc90b90	d9ac024b-7beb-4da8-9cd1-915b8980e523	informativo	200	Base de Cálculo IRRF	Agosto/2025	4196.35	20
21d4c96c-81ab-45ba-8a1c-328b82b1c25f	d9ac024b-7beb-4da8-9cd1-915b8980e523	informativo	201	Base de Cálculo INSS	Agosto/2025	4715	21
785b0968-6fdb-48fd-abea-29233b54fa2a	0600fff2-e1f4-4093-906d-6c4722c034e5	vencimento	001	Vencimento Básico	Julho/2025	4100	1
4b640bdd-a092-4f69-bdac-1669d522dbea	0600fff2-e1f4-4093-906d-6c4722c034e5	vencimento	010	Adicional de Insalubridade (10%)	Julho/2025	410	2
6233b899-f631-44ba-ae80-a64d5e88f2d2	0600fff2-e1f4-4093-906d-6c4722c034e5	vencimento	020	Adicional de Tempo de Serviço (5%)	Julho/2025	205	3
b5102412-7f7e-4c2d-87fd-c6cf347cfe94	0600fff2-e1f4-4093-906d-6c4722c034e5	vencimento	030	1/3 Constitucional de Férias	Julho/2025	1353	4
f4023d23-ef0a-41d4-969d-fda796248982	0600fff2-e1f4-4093-906d-6c4722c034e5	desconto	101	INSS	Julho/2025	667.48	10
c9f822d4-d385-42fe-8c78-ed24d79fece5	0600fff2-e1f4-4093-906d-6c4722c034e5	desconto	102	IRRF	Julho/2025	799.34	11
8bd4d4d8-f334-407f-832d-4390e3b85cd4	0600fff2-e1f4-4093-906d-6c4722c034e5	desconto	103	Previdência Municipal	Julho/2025	574	12
17b43cb6-e262-4159-9d15-fee0a0a8b8a8	0600fff2-e1f4-4093-906d-6c4722c034e5	informativo	200	Base de Cálculo IRRF	Julho/2025	5400.52	20
cc8f8a10-5ef4-4448-a853-b882d24aaf65	0600fff2-e1f4-4093-906d-6c4722c034e5	informativo	201	Base de Cálculo INSS	Julho/2025	6068	21
3f2fdb91-e6c6-495b-92ab-723ef29e219a	b2347882-1562-474d-978d-2406c1023a11	vencimento	001	Vencimento Básico	Junho/2025	4100	1
39df32e1-58c5-4f04-8cd0-b2a608aba6f9	b2347882-1562-474d-978d-2406c1023a11	vencimento	010	Adicional de Insalubridade (10%)	Junho/2025	410	2
da3123fc-2882-4caa-ab6b-4eb49b78ea1a	b2347882-1562-474d-978d-2406c1023a11	vencimento	020	Adicional de Tempo de Serviço (5%)	Junho/2025	205	3
1080f1ab-ad8c-46f8-9526-509c46cc804c	b2347882-1562-474d-978d-2406c1023a11	desconto	101	INSS	Junho/2025	518.65	10
c9cddd61-dab6-4bda-b898-83c7e18933e0	b2347882-1562-474d-978d-2406c1023a11	desconto	102	IRRF	Junho/2025	427.265	11
e337394f-ad13-4963-9ffc-b36840815d68	b2347882-1562-474d-978d-2406c1023a11	desconto	103	Previdência Municipal	Junho/2025	574	12
323bd826-9032-4736-a920-f8dd305bdcc9	b2347882-1562-474d-978d-2406c1023a11	informativo	200	Base de Cálculo IRRF	Junho/2025	4196.35	20
76fa8099-0818-4dec-9233-d60dc87b9e29	b2347882-1562-474d-978d-2406c1023a11	informativo	201	Base de Cálculo INSS	Junho/2025	4715	21
1b7d26c4-dfb7-4c94-ab38-7e6555571ed6	0b6c8c41-9029-429d-babc-9011327e23a9	vencimento	001	Vencimento Básico	Maio/2025	4100	1
34710be7-caff-44d8-bef5-b37d294b7ffc	0b6c8c41-9029-429d-babc-9011327e23a9	vencimento	010	Adicional de Insalubridade (10%)	Maio/2025	410	2
386288b0-ca47-4a03-9561-f0be2d5392a2	0b6c8c41-9029-429d-babc-9011327e23a9	vencimento	020	Adicional de Tempo de Serviço (5%)	Maio/2025	205	3
e9d72c24-b13b-40a9-903e-9243499489b9	0b6c8c41-9029-429d-babc-9011327e23a9	desconto	101	INSS	Maio/2025	518.65	10
7a14eeb3-0e9f-420c-856f-918ff59bc2fe	0b6c8c41-9029-429d-babc-9011327e23a9	desconto	102	IRRF	Maio/2025	427.265	11
39b0a813-e4c7-4337-a50a-68716aaaf7eb	0b6c8c41-9029-429d-babc-9011327e23a9	desconto	103	Previdência Municipal	Maio/2025	574	12
2b782c96-0a5f-4cb8-8728-cc1625e933bf	0b6c8c41-9029-429d-babc-9011327e23a9	informativo	200	Base de Cálculo IRRF	Maio/2025	4196.35	20
c0347e8f-077a-42ee-9798-922baa7a8aba	0b6c8c41-9029-429d-babc-9011327e23a9	informativo	201	Base de Cálculo INSS	Maio/2025	4715	21
dad27e0d-fc6b-4a84-9623-b7853a7d22ee	71677731-c506-4705-bdc1-d5f91c8d09ef	vencimento	001	Vencimento Básico	Abril/2025	4100	1
7e5b71b6-a0fa-4ddd-8115-f87102e6b860	71677731-c506-4705-bdc1-d5f91c8d09ef	vencimento	010	Adicional de Insalubridade (10%)	Abril/2025	410	2
a6f35a58-4a87-4ee5-8455-318a6f6798c7	71677731-c506-4705-bdc1-d5f91c8d09ef	vencimento	020	Adicional de Tempo de Serviço (5%)	Abril/2025	205	3
419dc58d-cd46-4e50-87f2-974d75c47e75	71677731-c506-4705-bdc1-d5f91c8d09ef	desconto	101	INSS	Abril/2025	518.65	10
8030d9f1-2599-45f6-86c4-c475c1811075	71677731-c506-4705-bdc1-d5f91c8d09ef	desconto	102	IRRF	Abril/2025	427.265	11
6b3e1ede-4a05-41ec-bbc4-8f57178cc2db	71677731-c506-4705-bdc1-d5f91c8d09ef	desconto	103	Previdência Municipal	Abril/2025	574	12
d6abe480-a39f-456a-b088-0ba4f296aabd	71677731-c506-4705-bdc1-d5f91c8d09ef	informativo	200	Base de Cálculo IRRF	Abril/2025	4196.35	20
5467e5b0-c4e6-4404-a3b1-267955e4f791	71677731-c506-4705-bdc1-d5f91c8d09ef	informativo	201	Base de Cálculo INSS	Abril/2025	4715	21
0c7181a8-4102-43ac-b548-29667b2c18ca	c8e9b2bd-025b-41a7-9ade-38f7d29dc3bd	vencimento	001	Vencimento Básico	Março/2025	4100	1
56126475-350c-48fd-bf88-26a25e678af3	c8e9b2bd-025b-41a7-9ade-38f7d29dc3bd	vencimento	010	Adicional de Insalubridade (10%)	Março/2025	410	2
8c026eb2-845a-468b-83f5-1ee14363a071	c8e9b2bd-025b-41a7-9ade-38f7d29dc3bd	vencimento	020	Adicional de Tempo de Serviço (5%)	Março/2025	205	3
8c885bc1-6e63-4667-9fcf-3b3bf10133c5	c8e9b2bd-025b-41a7-9ade-38f7d29dc3bd	desconto	101	INSS	Março/2025	518.65	10
86774630-1776-4ad1-97e7-d43feca630a9	c8e9b2bd-025b-41a7-9ade-38f7d29dc3bd	desconto	102	IRRF	Março/2025	427.265	11
b15e34ce-e352-4371-9ff7-a640af3fc545	c8e9b2bd-025b-41a7-9ade-38f7d29dc3bd	desconto	103	Previdência Municipal	Março/2025	574	12
c11e323a-4a76-4222-bf5e-aa4c9b2173b3	c8e9b2bd-025b-41a7-9ade-38f7d29dc3bd	informativo	200	Base de Cálculo IRRF	Março/2025	4196.35	20
59c04086-ad5c-4ad6-931b-ccac5be6a3b1	c8e9b2bd-025b-41a7-9ade-38f7d29dc3bd	informativo	201	Base de Cálculo INSS	Março/2025	4715	21
3d515b4d-97ef-46cf-9430-c764448343c3	0c9a0dc6-54a7-421a-be6b-4f927a950be6	vencimento	001	Vencimento Básico	Fevereiro/2025	4100	1
c6aec89e-9b3a-4688-a62f-21d0c78900a3	0c9a0dc6-54a7-421a-be6b-4f927a950be6	vencimento	010	Adicional de Insalubridade (10%)	Fevereiro/2025	410	2
7c5fbf4d-f03c-40f3-8ec9-079d43c67822	0c9a0dc6-54a7-421a-be6b-4f927a950be6	vencimento	020	Adicional de Tempo de Serviço (5%)	Fevereiro/2025	205	3
e808a948-1373-478d-b530-06d8c2a64e56	0c9a0dc6-54a7-421a-be6b-4f927a950be6	desconto	101	INSS	Fevereiro/2025	518.65	10
40094fd0-74a0-4785-b1c4-bad7b9ebf098	0c9a0dc6-54a7-421a-be6b-4f927a950be6	desconto	102	IRRF	Fevereiro/2025	427.265	11
8d7d8bf0-6761-4e29-973e-b2d18ccca331	0c9a0dc6-54a7-421a-be6b-4f927a950be6	desconto	103	Previdência Municipal	Fevereiro/2025	574	12
ed7b5971-c84b-4a38-a18f-b4b7e93142f3	0c9a0dc6-54a7-421a-be6b-4f927a950be6	informativo	200	Base de Cálculo IRRF	Fevereiro/2025	4196.35	20
93c21ff8-f698-43a0-8501-b2465ff1d11b	0c9a0dc6-54a7-421a-be6b-4f927a950be6	informativo	201	Base de Cálculo INSS	Fevereiro/2025	4715	21
c3bfdc23-bd54-4c11-ad4b-bdea66961f9c	c2e41b25-8bbb-4e42-8b0b-85367a35a49b	vencimento	001	Vencimento Básico	Janeiro/2025	4100	1
a5ad6f30-c19d-4b12-83b9-3b421d375301	c2e41b25-8bbb-4e42-8b0b-85367a35a49b	vencimento	010	Adicional de Insalubridade (10%)	Janeiro/2025	410	2
5f0cb9bc-05f6-4ef4-9fff-f04a0e1a9020	c2e41b25-8bbb-4e42-8b0b-85367a35a49b	vencimento	020	Adicional de Tempo de Serviço (5%)	Janeiro/2025	205	3
c3be3bd0-0d1f-4259-8594-76adb7a0eb88	c2e41b25-8bbb-4e42-8b0b-85367a35a49b	desconto	101	INSS	Janeiro/2025	518.65	10
c92d840a-9ae1-438c-9c6f-bfd52066901d	c2e41b25-8bbb-4e42-8b0b-85367a35a49b	desconto	102	IRRF	Janeiro/2025	427.265	11
05173687-828e-474a-8975-df3170497e97	c2e41b25-8bbb-4e42-8b0b-85367a35a49b	desconto	103	Previdência Municipal	Janeiro/2025	574	12
272f80d7-35a6-46d2-bb7e-8a6e9ca7ed11	c2e41b25-8bbb-4e42-8b0b-85367a35a49b	informativo	200	Base de Cálculo IRRF	Janeiro/2025	4196.35	20
c12dc2ba-d240-4016-bd85-adb04af7f7d0	c2e41b25-8bbb-4e42-8b0b-85367a35a49b	informativo	201	Base de Cálculo INSS	Janeiro/2025	4715	21
b9ff0f26-cfec-43ab-9e89-fd827bb58402	05f277e7-f430-479e-9a43-6b4b9400676e	vencimento	001	Vencimento Básico	Dezembro/2024	4100	1
796e6f4c-61f5-4c99-aee1-0b7b9db492a8	05f277e7-f430-479e-9a43-6b4b9400676e	vencimento	010	Adicional de Insalubridade (10%)	Dezembro/2024	410	2
1e7304c2-a527-4ea2-9f78-9d98c3a11e74	05f277e7-f430-479e-9a43-6b4b9400676e	vencimento	020	Adicional de Tempo de Serviço (5%)	Dezembro/2024	205	3
9e1fe159-7ad8-4511-9919-c868d6d206ca	05f277e7-f430-479e-9a43-6b4b9400676e	desconto	101	INSS	Dezembro/2024	518.65	10
d26a2773-f1fa-458d-ad1f-80aa7d112184	05f277e7-f430-479e-9a43-6b4b9400676e	desconto	102	IRRF	Dezembro/2024	427.265	11
6d8165bb-028c-46d9-abc3-c896a37af708	05f277e7-f430-479e-9a43-6b4b9400676e	desconto	103	Previdência Municipal	Dezembro/2024	574	12
892131cc-c957-4862-b878-2927886b50d7	05f277e7-f430-479e-9a43-6b4b9400676e	informativo	200	Base de Cálculo IRRF	Dezembro/2024	4196.35	20
224c3f17-be8e-4d7c-a667-bf111a4b74b3	05f277e7-f430-479e-9a43-6b4b9400676e	informativo	201	Base de Cálculo INSS	Dezembro/2024	4715	21
f0fa9c30-a6f4-40da-b6b2-da65a804d17f	28ff94e7-950c-497e-8139-8e56bc203d4e	vencimento	001	Vencimento Básico	Novembro/2024	4100	1
ff65140a-d3ab-44c5-b7f2-fb633f20874b	28ff94e7-950c-497e-8139-8e56bc203d4e	vencimento	010	Adicional de Insalubridade (10%)	Novembro/2024	410	2
3670754e-74b4-4f1b-ba86-872f6746c4df	28ff94e7-950c-497e-8139-8e56bc203d4e	vencimento	020	Adicional de Tempo de Serviço (5%)	Novembro/2024	205	3
ad5ad018-5a88-405f-bc0b-2200c8207e88	28ff94e7-950c-497e-8139-8e56bc203d4e	desconto	101	INSS	Novembro/2024	518.65	10
6d8593b4-5403-4e14-8d1a-3d46843ab9fa	28ff94e7-950c-497e-8139-8e56bc203d4e	desconto	102	IRRF	Novembro/2024	427.265	11
b7285d87-73f3-42a7-b3e9-12c9ff5a8a39	28ff94e7-950c-497e-8139-8e56bc203d4e	desconto	103	Previdência Municipal	Novembro/2024	574	12
178ec806-e114-4eaf-8113-50ad2ee13ea4	28ff94e7-950c-497e-8139-8e56bc203d4e	informativo	200	Base de Cálculo IRRF	Novembro/2024	4196.35	20
24e213b0-f5cc-42e7-857a-ef02bd146a9a	28ff94e7-950c-497e-8139-8e56bc203d4e	informativo	201	Base de Cálculo INSS	Novembro/2024	4715	21
e997e4a8-4024-4d3e-ad7e-f4ca34b8a5c2	ac75d2f1-7aec-4a3e-bec1-58d0defb1071	vencimento	001	Vencimento Básico	Outubro/2024	4100	1
9c8ccaa5-4c69-496e-89fb-14c594e02e2a	ac75d2f1-7aec-4a3e-bec1-58d0defb1071	vencimento	010	Adicional de Insalubridade (10%)	Outubro/2024	410	2
8ec5b47b-e3ff-49d2-8645-200612a50acd	ac75d2f1-7aec-4a3e-bec1-58d0defb1071	vencimento	020	Adicional de Tempo de Serviço (5%)	Outubro/2024	205	3
b6d759f9-c747-4e60-a9e6-b2b5449445ef	ac75d2f1-7aec-4a3e-bec1-58d0defb1071	desconto	101	INSS	Outubro/2024	518.65	10
ee6c491b-f1fb-4926-8fc0-aa24275aba58	ac75d2f1-7aec-4a3e-bec1-58d0defb1071	desconto	102	IRRF	Outubro/2024	427.265	11
851fdd31-37fe-4ca0-a5ee-5a3938a9647c	ac75d2f1-7aec-4a3e-bec1-58d0defb1071	desconto	103	Previdência Municipal	Outubro/2024	574	12
4922a636-c097-4d02-9a6a-63b3e29fb117	ac75d2f1-7aec-4a3e-bec1-58d0defb1071	informativo	200	Base de Cálculo IRRF	Outubro/2024	4196.35	20
79b08ee4-4c59-43fb-8c0a-bb4136c41aa3	ac75d2f1-7aec-4a3e-bec1-58d0defb1071	informativo	201	Base de Cálculo INSS	Outubro/2024	4715	21
6ae546b7-8762-427e-986c-747378af5137	cfb5df52-1f63-4b97-bfff-f159d5fe2a78	vencimento	001	Vencimento Básico	Setembro/2024	4100	1
46a0833e-add2-45e5-b807-529cc6274218	cfb5df52-1f63-4b97-bfff-f159d5fe2a78	vencimento	010	Adicional de Insalubridade (10%)	Setembro/2024	410	2
fe8aebd3-07e3-42fc-a9f0-6d14bfd0c572	cfb5df52-1f63-4b97-bfff-f159d5fe2a78	vencimento	020	Adicional de Tempo de Serviço (5%)	Setembro/2024	205	3
d60e8313-680e-46ac-b80e-7b30ec667876	cfb5df52-1f63-4b97-bfff-f159d5fe2a78	desconto	101	INSS	Setembro/2024	518.65	10
c20394f9-9c05-46cd-bef4-ed5a4a19f1bc	cfb5df52-1f63-4b97-bfff-f159d5fe2a78	desconto	102	IRRF	Setembro/2024	427.265	11
4f805142-734c-4062-961b-2350b9b373c9	cfb5df52-1f63-4b97-bfff-f159d5fe2a78	desconto	103	Previdência Municipal	Setembro/2024	574	12
b3a5a9d8-e7db-4571-a54a-a3c6f5a8360f	cfb5df52-1f63-4b97-bfff-f159d5fe2a78	informativo	200	Base de Cálculo IRRF	Setembro/2024	4196.35	20
05bd25dc-3fe1-4a33-a258-addc099526fb	cfb5df52-1f63-4b97-bfff-f159d5fe2a78	informativo	201	Base de Cálculo INSS	Setembro/2024	4715	21
dc37157e-9fdf-4190-a431-22a9e7dad150	7ba1de2b-7458-4a47-accf-a2fa6b2e3499	vencimento	001	Vencimento Básico	Agosto/2024	4100	1
7bd804b1-bc91-411a-b21e-bb8dff5eb099	7ba1de2b-7458-4a47-accf-a2fa6b2e3499	vencimento	010	Adicional de Insalubridade (10%)	Agosto/2024	410	2
8ce4c77c-9f99-4ba4-bf00-289708959ece	7ba1de2b-7458-4a47-accf-a2fa6b2e3499	vencimento	020	Adicional de Tempo de Serviço (5%)	Agosto/2024	205	3
1f2c272d-f022-49a8-aab4-d8ff08e43f3a	7ba1de2b-7458-4a47-accf-a2fa6b2e3499	desconto	101	INSS	Agosto/2024	518.65	10
d73073c2-91a3-4d6e-aaca-7e9d5875fd16	7ba1de2b-7458-4a47-accf-a2fa6b2e3499	desconto	102	IRRF	Agosto/2024	427.265	11
09e50192-80f8-4088-ac74-5e353f69b5b9	7ba1de2b-7458-4a47-accf-a2fa6b2e3499	desconto	103	Previdência Municipal	Agosto/2024	574	12
46820459-10b0-4dfd-b760-fa4033971689	7ba1de2b-7458-4a47-accf-a2fa6b2e3499	informativo	200	Base de Cálculo IRRF	Agosto/2024	4196.35	20
03d20b99-ad68-4389-a496-0e025f342678	7ba1de2b-7458-4a47-accf-a2fa6b2e3499	informativo	201	Base de Cálculo INSS	Agosto/2024	4715	21
6cb2e6f9-c26c-444b-9c92-cfa6df9a7ffd	5ff8e384-9069-49b7-965d-de170212df03	vencimento	001	Vencimento Básico	Julho/2024	4100	1
89faf131-8d93-443b-88eb-7083bd48f1b4	5ff8e384-9069-49b7-965d-de170212df03	vencimento	010	Adicional de Insalubridade (10%)	Julho/2024	410	2
ad7e6c99-5a58-4110-8611-706af4a2854a	5ff8e384-9069-49b7-965d-de170212df03	vencimento	020	Adicional de Tempo de Serviço (5%)	Julho/2024	205	3
f96fcfe9-09c0-40a9-b38b-0665c96c22ad	5ff8e384-9069-49b7-965d-de170212df03	vencimento	030	1/3 Constitucional de Férias	Julho/2024	1353	4
4a6ae277-6ed7-4c8e-9598-7647d83e56ac	5ff8e384-9069-49b7-965d-de170212df03	desconto	101	INSS	Julho/2024	667.48	10
ba260eda-3eb9-4912-b7e3-a2f634f6e7b9	5ff8e384-9069-49b7-965d-de170212df03	desconto	102	IRRF	Julho/2024	799.34	11
399e1a36-ede2-4f67-b7ab-02e4280aa256	5ff8e384-9069-49b7-965d-de170212df03	desconto	103	Previdência Municipal	Julho/2024	574	12
34286434-5dc3-4778-b738-fc135038bb44	5ff8e384-9069-49b7-965d-de170212df03	informativo	200	Base de Cálculo IRRF	Julho/2024	5400.52	20
7e94705a-5c0a-4a5e-b2d9-98bf65194f5c	5ff8e384-9069-49b7-965d-de170212df03	informativo	201	Base de Cálculo INSS	Julho/2024	6068	21
db468d02-4aa6-491a-aef3-32ff055d44ce	bd42b72e-8122-4ac1-aa17-852b1fb0511b	vencimento	001	Vencimento Básico	Junho/2024	4100	1
d7ee0ed5-e11c-4f56-a581-d78d7810ed4d	bd42b72e-8122-4ac1-aa17-852b1fb0511b	vencimento	010	Adicional de Insalubridade (10%)	Junho/2024	410	2
80e18d97-2dfa-4d68-b882-873d18ac30b7	bd42b72e-8122-4ac1-aa17-852b1fb0511b	vencimento	020	Adicional de Tempo de Serviço (5%)	Junho/2024	205	3
b664c8fe-43dc-4370-83cd-f070829df158	bd42b72e-8122-4ac1-aa17-852b1fb0511b	desconto	101	INSS	Junho/2024	518.65	10
6254f513-a756-4d7b-a46c-e37f39b92380	bd42b72e-8122-4ac1-aa17-852b1fb0511b	desconto	102	IRRF	Junho/2024	427.265	11
d3ac61b8-c8a3-4fd4-b25d-f87e1d6924e7	bd42b72e-8122-4ac1-aa17-852b1fb0511b	desconto	103	Previdência Municipal	Junho/2024	574	12
338bb328-edb9-491a-bf7c-05f13ec661fe	bd42b72e-8122-4ac1-aa17-852b1fb0511b	informativo	200	Base de Cálculo IRRF	Junho/2024	4196.35	20
a2a6f3b5-2031-460e-9890-16e8c7d91100	bd42b72e-8122-4ac1-aa17-852b1fb0511b	informativo	201	Base de Cálculo INSS	Junho/2024	4715	21
28f2c852-a4cf-4685-bade-eab2e2a3ef8f	b9a3d095-2e51-4ba5-994b-ceeb231a7dac	vencimento	001	Vencimento Básico	Maio/2024	4100	1
f9425068-a7e2-4ef7-b7ae-9c1da0d5192c	b9a3d095-2e51-4ba5-994b-ceeb231a7dac	vencimento	010	Adicional de Insalubridade (10%)	Maio/2024	410	2
b0eedc67-240f-4193-abf2-055c60620699	b9a3d095-2e51-4ba5-994b-ceeb231a7dac	vencimento	020	Adicional de Tempo de Serviço (5%)	Maio/2024	205	3
47ac81a4-f096-4745-a6ba-2e829502153d	b9a3d095-2e51-4ba5-994b-ceeb231a7dac	desconto	101	INSS	Maio/2024	518.65	10
6e60a679-e9f0-4cc2-b092-09bb124b74a2	b9a3d095-2e51-4ba5-994b-ceeb231a7dac	desconto	102	IRRF	Maio/2024	427.265	11
fdd0cd07-0253-40db-9dc2-0d81af41ec1b	b9a3d095-2e51-4ba5-994b-ceeb231a7dac	desconto	103	Previdência Municipal	Maio/2024	574	12
e08981e2-0623-48c0-8b06-ad691e38f1f7	b9a3d095-2e51-4ba5-994b-ceeb231a7dac	informativo	200	Base de Cálculo IRRF	Maio/2024	4196.35	20
66bd5da0-6461-4c36-a786-7003e7970b1e	b9a3d095-2e51-4ba5-994b-ceeb231a7dac	informativo	201	Base de Cálculo INSS	Maio/2024	4715	21
92fbce9d-f5c5-48bb-b852-4efa24b0f903	375e1055-1d0a-4f72-af04-138588043b29	vencimento	001	Vencimento Básico	Abril/2024	4100	1
81d23d7d-f056-4d51-aac7-1357ef1ae222	375e1055-1d0a-4f72-af04-138588043b29	vencimento	010	Adicional de Insalubridade (10%)	Abril/2024	410	2
e969e3c3-bdc3-4f39-a11e-3260158572c2	375e1055-1d0a-4f72-af04-138588043b29	vencimento	020	Adicional de Tempo de Serviço (5%)	Abril/2024	205	3
560720c1-4ff6-4f61-8a42-0908c0c1617a	375e1055-1d0a-4f72-af04-138588043b29	desconto	101	INSS	Abril/2024	518.65	10
b8d8e127-398b-41da-b1b6-d15c0e3727ee	375e1055-1d0a-4f72-af04-138588043b29	desconto	102	IRRF	Abril/2024	427.265	11
398516d7-fd0e-427a-8f70-258dd4a99535	375e1055-1d0a-4f72-af04-138588043b29	desconto	103	Previdência Municipal	Abril/2024	574	12
e33120ed-e1c6-47e6-b71e-f6bc380917f5	375e1055-1d0a-4f72-af04-138588043b29	informativo	200	Base de Cálculo IRRF	Abril/2024	4196.35	20
6b68ea27-9ffc-44b9-b0b1-af414432c3fc	375e1055-1d0a-4f72-af04-138588043b29	informativo	201	Base de Cálculo INSS	Abril/2024	4715	21
48d96c38-fb47-4f42-a01c-29757b4ab3bc	82cc471c-e31e-4185-983f-31ce298eed36	vencimento	001	Vencimento Básico	Março/2026	5850	1
4752238a-be44-4a55-95d9-3dce9d26dad2	82cc471c-e31e-4185-983f-31ce298eed36	vencimento	010	Adicional de Insalubridade (10%)	Março/2026	585	2
f70401ce-4512-4093-96db-a2fc93b104f8	82cc471c-e31e-4185-983f-31ce298eed36	vencimento	020	Adicional de Tempo de Serviço (5%)	Março/2026	292.5	3
658ab26f-200f-4399-adeb-17833d0bfb66	82cc471c-e31e-4185-983f-31ce298eed36	desconto	101	INSS	Março/2026	740.025	10
db501be9-940c-4f30-a9d1-61e9f6d846c2	82cc471c-e31e-4185-983f-31ce298eed36	desconto	102	IRRF	Março/2026	980.7025	11
4c93a87b-f0cd-4cc6-ba30-0b6f06bd8b6b	82cc471c-e31e-4185-983f-31ce298eed36	desconto	103	Previdência Municipal	Março/2026	819	12
977dc2b3-3715-4700-a2c2-45e74e380f7f	82cc471c-e31e-4185-983f-31ce298eed36	informativo	200	Base de Cálculo IRRF	Março/2026	5987.475	20
470f3d9c-32c8-41ab-8105-16a06f02f0be	82cc471c-e31e-4185-983f-31ce298eed36	informativo	201	Base de Cálculo INSS	Março/2026	6727.5	21
1986bdc7-2334-442c-982f-0d060b8ddbd2	b0f4c366-711a-4333-821f-9b6fa8901379	vencimento	001	Vencimento Básico	Fevereiro/2026	5850	1
c8fa3c6b-7c66-42a4-a6ea-8e626e1fcaf8	b0f4c366-711a-4333-821f-9b6fa8901379	vencimento	010	Adicional de Insalubridade (10%)	Fevereiro/2026	585	2
319dc86e-71e4-41cc-81cd-009458d1b1c9	b0f4c366-711a-4333-821f-9b6fa8901379	vencimento	020	Adicional de Tempo de Serviço (5%)	Fevereiro/2026	292.5	3
24b3b699-d2ab-4139-918e-f43503549287	b0f4c366-711a-4333-821f-9b6fa8901379	desconto	101	INSS	Fevereiro/2026	740.025	10
439cdcf2-96be-4206-915b-43ba032d521a	b0f4c366-711a-4333-821f-9b6fa8901379	desconto	102	IRRF	Fevereiro/2026	980.7025	11
8c768b3e-5455-462d-8ced-86e436e9fe3c	b0f4c366-711a-4333-821f-9b6fa8901379	desconto	103	Previdência Municipal	Fevereiro/2026	819	12
e0faeafb-d04d-4d1c-8ddf-c269f3b87292	b0f4c366-711a-4333-821f-9b6fa8901379	informativo	200	Base de Cálculo IRRF	Fevereiro/2026	5987.475	20
491e8e11-2086-49c5-ad3c-b38765bf5319	b0f4c366-711a-4333-821f-9b6fa8901379	informativo	201	Base de Cálculo INSS	Fevereiro/2026	6727.5	21
26e52b5a-6991-42de-ad61-f679083d0008	1065b7e7-d5b5-44cd-b515-bbc9d073e60f	vencimento	001	Vencimento Básico	Janeiro/2026	5850	1
0f4353aa-4756-4975-81a0-429e4e30f1e2	1065b7e7-d5b5-44cd-b515-bbc9d073e60f	vencimento	010	Adicional de Insalubridade (10%)	Janeiro/2026	585	2
abe1e9a1-a44d-4bec-90a6-04db61780984	1065b7e7-d5b5-44cd-b515-bbc9d073e60f	vencimento	020	Adicional de Tempo de Serviço (5%)	Janeiro/2026	292.5	3
58e50a40-c07b-4e0c-bfe4-bce2c130e7b6	1065b7e7-d5b5-44cd-b515-bbc9d073e60f	desconto	101	INSS	Janeiro/2026	740.025	10
7100abd2-0184-49b1-842b-6a2715b68afa	1065b7e7-d5b5-44cd-b515-bbc9d073e60f	desconto	102	IRRF	Janeiro/2026	980.7025	11
0ccb2682-58e4-47e9-a13e-dcdad508e1b9	1065b7e7-d5b5-44cd-b515-bbc9d073e60f	desconto	103	Previdência Municipal	Janeiro/2026	819	12
4494cdb9-67ab-4742-9b2b-82e814ee19da	1065b7e7-d5b5-44cd-b515-bbc9d073e60f	informativo	200	Base de Cálculo IRRF	Janeiro/2026	5987.475	20
8c1553c8-e1d4-4237-af63-72a72c8c3c0e	1065b7e7-d5b5-44cd-b515-bbc9d073e60f	informativo	201	Base de Cálculo INSS	Janeiro/2026	6727.5	21
583b6d96-e8bd-4dd6-abc9-1b2a8bf8fa65	f9102977-d389-42ec-b1bb-279112dbb194	vencimento	001	Vencimento Básico	Dezembro/2025	5850	1
4681af77-c9b6-40f3-9ee0-7392b2fa9235	f9102977-d389-42ec-b1bb-279112dbb194	vencimento	010	Adicional de Insalubridade (10%)	Dezembro/2025	585	2
46eb7092-de80-439b-bc7f-90330578f74f	f9102977-d389-42ec-b1bb-279112dbb194	vencimento	020	Adicional de Tempo de Serviço (5%)	Dezembro/2025	292.5	3
f9efdbae-d0ed-4f90-884d-d485ad0abee0	f9102977-d389-42ec-b1bb-279112dbb194	desconto	101	INSS	Dezembro/2025	740.025	10
e57ea664-08a9-4f6b-806b-35f5461cf825	f9102977-d389-42ec-b1bb-279112dbb194	desconto	102	IRRF	Dezembro/2025	980.7025	11
3fe25f52-6e96-42ff-9277-2bede14b49cc	f9102977-d389-42ec-b1bb-279112dbb194	desconto	103	Previdência Municipal	Dezembro/2025	819	12
a13ece02-cf95-4705-a16f-955e33c27fa4	f9102977-d389-42ec-b1bb-279112dbb194	informativo	200	Base de Cálculo IRRF	Dezembro/2025	5987.475	20
e019d88a-d6a4-4a9e-9447-618f7d1041c2	f9102977-d389-42ec-b1bb-279112dbb194	informativo	201	Base de Cálculo INSS	Dezembro/2025	6727.5	21
5b193306-b5d3-4b0a-9b5c-08512201ffa3	52b02527-46b7-42e2-8f56-25439c01764c	vencimento	001	Vencimento Básico	Novembro/2025	5850	1
eaf69c30-f43e-49da-b9d0-5f23fce5e317	52b02527-46b7-42e2-8f56-25439c01764c	vencimento	010	Adicional de Insalubridade (10%)	Novembro/2025	585	2
23405229-923d-45a2-884e-2f6d422a12fc	52b02527-46b7-42e2-8f56-25439c01764c	vencimento	020	Adicional de Tempo de Serviço (5%)	Novembro/2025	292.5	3
60f16e62-1955-41fd-a729-01aafa688f5c	52b02527-46b7-42e2-8f56-25439c01764c	desconto	101	INSS	Novembro/2025	740.025	10
e2c6dcfe-3d2c-449d-9e9e-7e1ee4b55607	52b02527-46b7-42e2-8f56-25439c01764c	desconto	102	IRRF	Novembro/2025	980.7025	11
853e7a4e-60f0-4697-9305-aa196d8c4697	52b02527-46b7-42e2-8f56-25439c01764c	desconto	103	Previdência Municipal	Novembro/2025	819	12
1731ed14-7151-4bf0-a8e3-92b00692f138	52b02527-46b7-42e2-8f56-25439c01764c	informativo	200	Base de Cálculo IRRF	Novembro/2025	5987.475	20
5cec501a-ef0e-4616-9e5a-87cb9b42c96e	52b02527-46b7-42e2-8f56-25439c01764c	informativo	201	Base de Cálculo INSS	Novembro/2025	6727.5	21
9a95afc0-de14-4d3a-9341-b2a4e9003659	b61d8f94-a693-4a8b-bcb1-91ce0ccf48d4	vencimento	001	Vencimento Básico	Outubro/2025	5850	1
4ab9bda1-1a71-400a-a318-24732e5fec27	b61d8f94-a693-4a8b-bcb1-91ce0ccf48d4	vencimento	010	Adicional de Insalubridade (10%)	Outubro/2025	585	2
da0632d9-fa29-4e5d-9684-dacb710c4b2b	b61d8f94-a693-4a8b-bcb1-91ce0ccf48d4	vencimento	020	Adicional de Tempo de Serviço (5%)	Outubro/2025	292.5	3
35269ddb-2a31-473d-911b-23fff1c8ef3a	b61d8f94-a693-4a8b-bcb1-91ce0ccf48d4	desconto	101	INSS	Outubro/2025	740.025	10
5642b533-9ae6-4044-9ea7-6b7a441e0a34	b61d8f94-a693-4a8b-bcb1-91ce0ccf48d4	desconto	102	IRRF	Outubro/2025	980.7025	11
3b2843e5-4b3f-4132-8223-4d5c26233c24	b61d8f94-a693-4a8b-bcb1-91ce0ccf48d4	desconto	103	Previdência Municipal	Outubro/2025	819	12
de660bb6-4a7a-4db4-9188-dd23b84083a0	b61d8f94-a693-4a8b-bcb1-91ce0ccf48d4	informativo	200	Base de Cálculo IRRF	Outubro/2025	5987.475	20
09434eae-c8aa-42ff-9923-fdb5a7234929	b61d8f94-a693-4a8b-bcb1-91ce0ccf48d4	informativo	201	Base de Cálculo INSS	Outubro/2025	6727.5	21
9855ffeb-9af6-44ae-9db1-7fc6cf04a963	582d1400-95d7-48fc-b809-7e62822f6a9a	vencimento	001	Vencimento Básico	Setembro/2025	5850	1
033d72b9-b3fe-4b32-9926-a5744c3ce8c2	582d1400-95d7-48fc-b809-7e62822f6a9a	vencimento	010	Adicional de Insalubridade (10%)	Setembro/2025	585	2
dc95412e-6aee-4f9e-af2d-024c33460332	582d1400-95d7-48fc-b809-7e62822f6a9a	vencimento	020	Adicional de Tempo de Serviço (5%)	Setembro/2025	292.5	3
d1392a75-444e-4b7d-926f-7ceb18cae707	582d1400-95d7-48fc-b809-7e62822f6a9a	desconto	101	INSS	Setembro/2025	740.025	10
ad2915f4-9879-4563-ba35-e78995f2b884	582d1400-95d7-48fc-b809-7e62822f6a9a	desconto	102	IRRF	Setembro/2025	980.7025	11
d0f1a049-5393-4c62-8d7e-a6676869e0d6	582d1400-95d7-48fc-b809-7e62822f6a9a	desconto	103	Previdência Municipal	Setembro/2025	819	12
3c9298ea-4560-41a0-863c-024d5a60fc9b	582d1400-95d7-48fc-b809-7e62822f6a9a	informativo	200	Base de Cálculo IRRF	Setembro/2025	5987.475	20
638de25f-21d9-4bf1-aa3c-26093cb8ebba	582d1400-95d7-48fc-b809-7e62822f6a9a	informativo	201	Base de Cálculo INSS	Setembro/2025	6727.5	21
480404c0-e789-40a8-8c5f-49ef625ceef5	0bc326cf-2a54-4403-986b-a0df1f1bfee2	vencimento	001	Vencimento Básico	Agosto/2025	5850	1
6dd79148-a84f-4d9f-b3f2-42c89a029410	0bc326cf-2a54-4403-986b-a0df1f1bfee2	vencimento	010	Adicional de Insalubridade (10%)	Agosto/2025	585	2
be679691-4a43-4629-a432-d98a22f516fa	0bc326cf-2a54-4403-986b-a0df1f1bfee2	vencimento	020	Adicional de Tempo de Serviço (5%)	Agosto/2025	292.5	3
9d2d7b08-fdba-45ac-9f7d-dfec60c4c21e	0bc326cf-2a54-4403-986b-a0df1f1bfee2	desconto	101	INSS	Agosto/2025	740.025	10
198b59f1-f150-4c41-b345-03a9df68aed4	0bc326cf-2a54-4403-986b-a0df1f1bfee2	desconto	102	IRRF	Agosto/2025	980.7025	11
2b2ef513-1e91-44ae-a4bf-bb5ce901f8ca	0bc326cf-2a54-4403-986b-a0df1f1bfee2	desconto	103	Previdência Municipal	Agosto/2025	819	12
fc544ca6-50c3-4990-a536-51461eb961e3	0bc326cf-2a54-4403-986b-a0df1f1bfee2	informativo	200	Base de Cálculo IRRF	Agosto/2025	5987.475	20
0306fa2d-29b6-4acd-8895-6e08aeebf700	0bc326cf-2a54-4403-986b-a0df1f1bfee2	informativo	201	Base de Cálculo INSS	Agosto/2025	6727.5	21
fb13916e-5972-48c2-9b12-547ee5f9a3b4	77960bb6-a575-4435-8dd6-4f0f8a8933ce	vencimento	001	Vencimento Básico	Julho/2025	5850	1
d0f6b1f3-c649-4a2c-ba82-ab4dc9ac39aa	77960bb6-a575-4435-8dd6-4f0f8a8933ce	vencimento	010	Adicional de Insalubridade (10%)	Julho/2025	585	2
b8ac29e9-caaf-4373-910e-ddeedbf861b6	77960bb6-a575-4435-8dd6-4f0f8a8933ce	vencimento	020	Adicional de Tempo de Serviço (5%)	Julho/2025	292.5	3
811ca655-b788-4703-9186-c31a8f86b5a0	77960bb6-a575-4435-8dd6-4f0f8a8933ce	vencimento	030	1/3 Constitucional de Férias	Julho/2025	1930.5	4
86ee0de0-b77b-4dd3-94fc-c7060f6b5f5f	77960bb6-a575-4435-8dd6-4f0f8a8933ce	desconto	101	INSS	Julho/2025	908.86	10
2f076560-b5e9-4db5-8ff9-9124b0ec6f19	77960bb6-a575-4435-8dd6-4f0f8a8933ce	desconto	102	IRRF	Julho/2025	1511.59	11
874ef56a-5f2e-4180-a854-186878ca208e	77960bb6-a575-4435-8dd6-4f0f8a8933ce	desconto	103	Previdência Municipal	Julho/2025	819	12
b2df8610-d4a3-4e97-8c8b-26a7ab493bdb	77960bb6-a575-4435-8dd6-4f0f8a8933ce	informativo	200	Base de Cálculo IRRF	Julho/2025	7749.14	20
aa2f7f11-0b79-41a7-a5c4-2054006d0c51	77960bb6-a575-4435-8dd6-4f0f8a8933ce	informativo	201	Base de Cálculo INSS	Julho/2025	8658	21
3f07ef9c-d5f8-4b15-b44a-e42a41183794	9286943b-d5c7-41ee-bbb9-c511485fc8ae	vencimento	001	Vencimento Básico	Junho/2025	5850	1
16cff593-206c-472d-ac65-05c52f808dc1	9286943b-d5c7-41ee-bbb9-c511485fc8ae	vencimento	010	Adicional de Insalubridade (10%)	Junho/2025	585	2
bef01351-49e6-4e21-ae15-cb4bfbdcc046	9286943b-d5c7-41ee-bbb9-c511485fc8ae	vencimento	020	Adicional de Tempo de Serviço (5%)	Junho/2025	292.5	3
b2fd5465-03f9-4c36-b83c-fee02543d097	9286943b-d5c7-41ee-bbb9-c511485fc8ae	desconto	101	INSS	Junho/2025	740.025	10
7682e573-b997-413a-a611-08f2f69584c1	9286943b-d5c7-41ee-bbb9-c511485fc8ae	desconto	102	IRRF	Junho/2025	980.7025	11
f0fe7139-4404-49b7-bf1e-88fcaab1b243	9286943b-d5c7-41ee-bbb9-c511485fc8ae	desconto	103	Previdência Municipal	Junho/2025	819	12
6ff63361-63f1-4f6c-9485-27f959dc1c4d	9286943b-d5c7-41ee-bbb9-c511485fc8ae	informativo	200	Base de Cálculo IRRF	Junho/2025	5987.475	20
2f6bf76d-c6fa-48a2-89bc-34cbc2ee6f66	9286943b-d5c7-41ee-bbb9-c511485fc8ae	informativo	201	Base de Cálculo INSS	Junho/2025	6727.5	21
5fd677a1-7e28-4900-b1df-65d1ea4e22ee	26699635-da43-42e7-ad47-5fe512040513	vencimento	001	Vencimento Básico	Maio/2025	5850	1
4ca1815d-52a2-4794-8f9a-df26b7debf16	26699635-da43-42e7-ad47-5fe512040513	vencimento	010	Adicional de Insalubridade (10%)	Maio/2025	585	2
547da1fb-1fc8-49a3-bb9d-e6b18d29ad6a	26699635-da43-42e7-ad47-5fe512040513	vencimento	020	Adicional de Tempo de Serviço (5%)	Maio/2025	292.5	3
febfb41c-2de7-4348-beb0-b50cd1c2e7df	26699635-da43-42e7-ad47-5fe512040513	desconto	101	INSS	Maio/2025	740.025	10
7bbfd955-69a0-4f8b-8e7c-d8489c45d465	26699635-da43-42e7-ad47-5fe512040513	desconto	102	IRRF	Maio/2025	980.7025	11
9f30093c-1fbb-4c3a-84b2-d79f846954ab	26699635-da43-42e7-ad47-5fe512040513	desconto	103	Previdência Municipal	Maio/2025	819	12
c10934fa-30eb-4249-98c6-69791afae8a2	26699635-da43-42e7-ad47-5fe512040513	informativo	200	Base de Cálculo IRRF	Maio/2025	5987.475	20
58decfbc-3a61-4220-bfb2-dee4f1b0f6fc	26699635-da43-42e7-ad47-5fe512040513	informativo	201	Base de Cálculo INSS	Maio/2025	6727.5	21
d6b27657-3f2f-4213-9a6b-ecb373b07bf2	95b8711c-7a93-4e1f-889b-e008d97767e0	vencimento	001	Vencimento Básico	Abril/2025	5850	1
a1941849-b859-4267-b762-61d022e467c5	95b8711c-7a93-4e1f-889b-e008d97767e0	vencimento	010	Adicional de Insalubridade (10%)	Abril/2025	585	2
57eea923-0d0a-4dad-b0da-15418a38dd45	95b8711c-7a93-4e1f-889b-e008d97767e0	vencimento	020	Adicional de Tempo de Serviço (5%)	Abril/2025	292.5	3
6d8b068a-c5a1-4e73-9180-583a2923b9fc	95b8711c-7a93-4e1f-889b-e008d97767e0	desconto	101	INSS	Abril/2025	740.025	10
ff7975a8-c04e-4759-b8e6-9d3cfd448089	95b8711c-7a93-4e1f-889b-e008d97767e0	desconto	102	IRRF	Abril/2025	980.7025	11
8541827b-1310-41bf-9115-27a27349fc81	95b8711c-7a93-4e1f-889b-e008d97767e0	desconto	103	Previdência Municipal	Abril/2025	819	12
c4c93f1f-023f-4995-a043-f4268ccc68cd	95b8711c-7a93-4e1f-889b-e008d97767e0	informativo	200	Base de Cálculo IRRF	Abril/2025	5987.475	20
8760339e-87c1-45b7-8c4c-bbd8bf742d76	95b8711c-7a93-4e1f-889b-e008d97767e0	informativo	201	Base de Cálculo INSS	Abril/2025	6727.5	21
52661c96-c14f-4d93-818e-6ebeb11caa40	41d34d4c-f1fc-44b5-b764-383861138e6c	vencimento	001	Vencimento Básico	Março/2025	5850	1
7361ba8c-aa0e-481e-9b5e-6ce28c6b89d7	41d34d4c-f1fc-44b5-b764-383861138e6c	vencimento	010	Adicional de Insalubridade (10%)	Março/2025	585	2
e9388688-5de3-4be6-bd91-374988a7355f	41d34d4c-f1fc-44b5-b764-383861138e6c	vencimento	020	Adicional de Tempo de Serviço (5%)	Março/2025	292.5	3
0fe0d63c-64bb-4df3-8b96-b5995f4b37a7	41d34d4c-f1fc-44b5-b764-383861138e6c	desconto	101	INSS	Março/2025	740.025	10
7e518670-8653-4351-9544-6586375a6547	41d34d4c-f1fc-44b5-b764-383861138e6c	desconto	102	IRRF	Março/2025	980.7025	11
442ac180-1e9e-470c-9cd8-981a93eabf6c	41d34d4c-f1fc-44b5-b764-383861138e6c	desconto	103	Previdência Municipal	Março/2025	819	12
0e760adb-432d-4099-bd8a-83dc6d8cb504	41d34d4c-f1fc-44b5-b764-383861138e6c	informativo	200	Base de Cálculo IRRF	Março/2025	5987.475	20
ed216eff-263b-4765-b951-cfc031f66c95	41d34d4c-f1fc-44b5-b764-383861138e6c	informativo	201	Base de Cálculo INSS	Março/2025	6727.5	21
ec394504-13f2-4c5e-8b0e-a9127be97215	80707f3a-2f2b-4fbb-801a-65a1e771b5f8	vencimento	001	Vencimento Básico	Fevereiro/2025	5850	1
aeae2018-a8cd-4963-974a-3001983933da	80707f3a-2f2b-4fbb-801a-65a1e771b5f8	vencimento	010	Adicional de Insalubridade (10%)	Fevereiro/2025	585	2
0b7bc242-1845-42fc-b84d-8a3c0443cc66	80707f3a-2f2b-4fbb-801a-65a1e771b5f8	vencimento	020	Adicional de Tempo de Serviço (5%)	Fevereiro/2025	292.5	3
f50ba3f3-fa81-457c-8153-0ac233e11990	80707f3a-2f2b-4fbb-801a-65a1e771b5f8	desconto	101	INSS	Fevereiro/2025	740.025	10
b6dbfa9c-0e22-42fc-8856-e7c241f964da	80707f3a-2f2b-4fbb-801a-65a1e771b5f8	desconto	102	IRRF	Fevereiro/2025	980.7025	11
0b1d03b5-aabc-42d9-9442-846b5e7bf3c4	80707f3a-2f2b-4fbb-801a-65a1e771b5f8	desconto	103	Previdência Municipal	Fevereiro/2025	819	12
7d258229-0322-4923-92c9-3370fe138975	80707f3a-2f2b-4fbb-801a-65a1e771b5f8	informativo	200	Base de Cálculo IRRF	Fevereiro/2025	5987.475	20
41db9fd5-2dac-4b5e-a020-38b1830067ce	80707f3a-2f2b-4fbb-801a-65a1e771b5f8	informativo	201	Base de Cálculo INSS	Fevereiro/2025	6727.5	21
617f338e-587e-476c-b070-3f67da0f838d	8ff906eb-a89b-4b45-8fcd-ae9c60dea15d	vencimento	001	Vencimento Básico	Janeiro/2025	5850	1
3e76985d-8f2c-4339-84dc-48850b3aa4b0	8ff906eb-a89b-4b45-8fcd-ae9c60dea15d	vencimento	010	Adicional de Insalubridade (10%)	Janeiro/2025	585	2
cec2d536-aa8c-4837-80e4-6b1f3d072af9	8ff906eb-a89b-4b45-8fcd-ae9c60dea15d	vencimento	020	Adicional de Tempo de Serviço (5%)	Janeiro/2025	292.5	3
147a1feb-78fb-4bad-be31-319d940ffc52	8ff906eb-a89b-4b45-8fcd-ae9c60dea15d	desconto	101	INSS	Janeiro/2025	740.025	10
07bbe10e-a390-4d18-9fba-2d780ec46deb	8ff906eb-a89b-4b45-8fcd-ae9c60dea15d	desconto	102	IRRF	Janeiro/2025	980.7025	11
652e5b08-164b-4c7f-b35b-fbd114bdc62d	8ff906eb-a89b-4b45-8fcd-ae9c60dea15d	desconto	103	Previdência Municipal	Janeiro/2025	819	12
7d193ef3-6aa3-47d2-a4fa-ce222b3dd70e	8ff906eb-a89b-4b45-8fcd-ae9c60dea15d	informativo	200	Base de Cálculo IRRF	Janeiro/2025	5987.475	20
0de00192-cbe2-4a10-aff4-cee6fe95322c	8ff906eb-a89b-4b45-8fcd-ae9c60dea15d	informativo	201	Base de Cálculo INSS	Janeiro/2025	6727.5	21
66f80598-cf40-4335-b6d5-599ac1530877	5286e7fc-51c4-4356-8a00-421afc56a7b2	vencimento	001	Vencimento Básico	Dezembro/2024	5850	1
8aa626e4-ddb9-4198-862f-8cc90f1eb824	5286e7fc-51c4-4356-8a00-421afc56a7b2	vencimento	010	Adicional de Insalubridade (10%)	Dezembro/2024	585	2
1cc4f1c7-27f3-46f3-bc1e-88313d9607cd	5286e7fc-51c4-4356-8a00-421afc56a7b2	vencimento	020	Adicional de Tempo de Serviço (5%)	Dezembro/2024	292.5	3
db722475-cb9e-4cff-9454-d2d910fe1f81	5286e7fc-51c4-4356-8a00-421afc56a7b2	desconto	101	INSS	Dezembro/2024	740.025	10
5ea7e525-44ee-410d-8a43-0b8a0ff4e3bb	5286e7fc-51c4-4356-8a00-421afc56a7b2	desconto	102	IRRF	Dezembro/2024	980.7025	11
8fcf1fcb-4d0f-4f7b-b204-00ee5324f77c	5286e7fc-51c4-4356-8a00-421afc56a7b2	desconto	103	Previdência Municipal	Dezembro/2024	819	12
4460393e-7d73-43b1-84e6-91149cfeaaae	5286e7fc-51c4-4356-8a00-421afc56a7b2	informativo	200	Base de Cálculo IRRF	Dezembro/2024	5987.475	20
17d16bab-c5ef-487b-9b47-aba5c4498423	5286e7fc-51c4-4356-8a00-421afc56a7b2	informativo	201	Base de Cálculo INSS	Dezembro/2024	6727.5	21
ef9deaa6-09ed-4ee3-8f94-51fa9e92959a	d140428a-aeb1-43f0-9b70-432cb2aac01c	vencimento	001	Vencimento Básico	Novembro/2024	5850	1
705075f4-e677-4e8c-98e8-2eb309abd997	d140428a-aeb1-43f0-9b70-432cb2aac01c	vencimento	010	Adicional de Insalubridade (10%)	Novembro/2024	585	2
f9ed0408-e4b7-43f1-aa37-0f9565b22c2d	d140428a-aeb1-43f0-9b70-432cb2aac01c	vencimento	020	Adicional de Tempo de Serviço (5%)	Novembro/2024	292.5	3
bde589f4-9325-4278-ad98-c12ca0bd5d9c	d140428a-aeb1-43f0-9b70-432cb2aac01c	desconto	101	INSS	Novembro/2024	740.025	10
80378f94-21ab-4778-8f85-4034f21fce33	d140428a-aeb1-43f0-9b70-432cb2aac01c	desconto	102	IRRF	Novembro/2024	980.7025	11
5a7c49ae-5bab-4ba7-9277-fd01956c1628	d140428a-aeb1-43f0-9b70-432cb2aac01c	desconto	103	Previdência Municipal	Novembro/2024	819	12
238cfe70-78ca-4f4a-b1b4-506f7a890917	d140428a-aeb1-43f0-9b70-432cb2aac01c	informativo	200	Base de Cálculo IRRF	Novembro/2024	5987.475	20
a1f5f137-324e-4198-8023-db36a60cd3a1	d140428a-aeb1-43f0-9b70-432cb2aac01c	informativo	201	Base de Cálculo INSS	Novembro/2024	6727.5	21
0e626a07-a38f-4a70-9943-6cf8626106f9	3a1c8456-f562-4d90-86ef-6b3fc8f4834a	vencimento	001	Vencimento Básico	Outubro/2024	5850	1
749b3892-9199-444a-b2d6-94a36c9cd208	3a1c8456-f562-4d90-86ef-6b3fc8f4834a	vencimento	010	Adicional de Insalubridade (10%)	Outubro/2024	585	2
0285d691-f39a-4b24-931d-bb90412a6788	3a1c8456-f562-4d90-86ef-6b3fc8f4834a	vencimento	020	Adicional de Tempo de Serviço (5%)	Outubro/2024	292.5	3
64f9d475-febd-4abf-a03a-c6fc04d6058a	3a1c8456-f562-4d90-86ef-6b3fc8f4834a	desconto	101	INSS	Outubro/2024	740.025	10
27a28a49-370f-44d4-b6ce-eadb67c662aa	3a1c8456-f562-4d90-86ef-6b3fc8f4834a	desconto	102	IRRF	Outubro/2024	980.7025	11
c5964952-541c-4885-8082-ed454e8d433a	3a1c8456-f562-4d90-86ef-6b3fc8f4834a	desconto	103	Previdência Municipal	Outubro/2024	819	12
2f14cad7-a0cd-4e2c-9874-007f813cbcd6	3a1c8456-f562-4d90-86ef-6b3fc8f4834a	informativo	200	Base de Cálculo IRRF	Outubro/2024	5987.475	20
e50a015f-6c0c-4a4f-9545-e14138963742	3a1c8456-f562-4d90-86ef-6b3fc8f4834a	informativo	201	Base de Cálculo INSS	Outubro/2024	6727.5	21
77441909-9798-427e-89db-69921f24ee28	213d73b1-c014-4abb-a642-5f689d34c8f9	vencimento	001	Vencimento Básico	Setembro/2024	5850	1
5069e4ea-38b5-45d4-bf7d-bd4f369544cb	213d73b1-c014-4abb-a642-5f689d34c8f9	vencimento	010	Adicional de Insalubridade (10%)	Setembro/2024	585	2
de8a4763-de7b-47db-a1fd-f634ba6d57b4	213d73b1-c014-4abb-a642-5f689d34c8f9	vencimento	020	Adicional de Tempo de Serviço (5%)	Setembro/2024	292.5	3
9339a359-a5d8-4b8f-bd86-3a7525e90f1f	213d73b1-c014-4abb-a642-5f689d34c8f9	desconto	101	INSS	Setembro/2024	740.025	10
fdf4d7e1-a30b-428e-8f68-4dc4ecaf739b	213d73b1-c014-4abb-a642-5f689d34c8f9	desconto	102	IRRF	Setembro/2024	980.7025	11
69f5c697-a8bc-4f24-b71b-cf48a70092fa	213d73b1-c014-4abb-a642-5f689d34c8f9	desconto	103	Previdência Municipal	Setembro/2024	819	12
7de2d6ed-6969-4426-b7a9-2336cb37f304	213d73b1-c014-4abb-a642-5f689d34c8f9	informativo	200	Base de Cálculo IRRF	Setembro/2024	5987.475	20
554edc6c-edbd-4f66-ad77-3ae43f61f405	213d73b1-c014-4abb-a642-5f689d34c8f9	informativo	201	Base de Cálculo INSS	Setembro/2024	6727.5	21
561afccc-84c2-4ae1-b015-e4eb9f22e560	8bf765d7-4867-4bea-8f6f-cee25d27dcce	vencimento	001	Vencimento Básico	Agosto/2024	5850	1
e5644948-b73c-42d8-af33-ac4ed904c8fc	8bf765d7-4867-4bea-8f6f-cee25d27dcce	vencimento	010	Adicional de Insalubridade (10%)	Agosto/2024	585	2
4a9bbff2-dc07-4747-abac-f062ea4e0f75	8bf765d7-4867-4bea-8f6f-cee25d27dcce	vencimento	020	Adicional de Tempo de Serviço (5%)	Agosto/2024	292.5	3
b115c0fa-68eb-4431-b4b2-e5797c047530	8bf765d7-4867-4bea-8f6f-cee25d27dcce	desconto	101	INSS	Agosto/2024	740.025	10
ebaf9a9a-4ea5-422b-84ec-7a2def1275e8	8bf765d7-4867-4bea-8f6f-cee25d27dcce	desconto	102	IRRF	Agosto/2024	980.7025	11
af7b00ee-c8a7-49e9-a043-43c94b79c425	8bf765d7-4867-4bea-8f6f-cee25d27dcce	desconto	103	Previdência Municipal	Agosto/2024	819	12
af178770-96cb-468c-b599-a0c2a7ffb7de	8bf765d7-4867-4bea-8f6f-cee25d27dcce	informativo	200	Base de Cálculo IRRF	Agosto/2024	5987.475	20
bec599c0-505b-45e2-910d-6365cda83943	8bf765d7-4867-4bea-8f6f-cee25d27dcce	informativo	201	Base de Cálculo INSS	Agosto/2024	6727.5	21
c742be6a-b379-4df0-bee3-9f6b3bdda226	6657c3e4-f0cc-410a-a665-c3de5e93ec7b	vencimento	001	Vencimento Básico	Julho/2024	5850	1
a485cc4a-0b40-45b2-bd1d-8861e96f4dca	6657c3e4-f0cc-410a-a665-c3de5e93ec7b	vencimento	010	Adicional de Insalubridade (10%)	Julho/2024	585	2
b75a5ffe-664c-4562-8215-130e1dbe12e9	6657c3e4-f0cc-410a-a665-c3de5e93ec7b	vencimento	020	Adicional de Tempo de Serviço (5%)	Julho/2024	292.5	3
ab865ecd-c186-4613-aba1-f502242b3293	6657c3e4-f0cc-410a-a665-c3de5e93ec7b	vencimento	030	1/3 Constitucional de Férias	Julho/2024	1930.5	4
0ba107a8-6cc9-4d96-997e-4fe9e2050590	6657c3e4-f0cc-410a-a665-c3de5e93ec7b	desconto	101	INSS	Julho/2024	908.86	10
fa6dec8d-c486-416c-9327-7867a8795643	6657c3e4-f0cc-410a-a665-c3de5e93ec7b	desconto	102	IRRF	Julho/2024	1511.59	11
cce534e3-bc8c-47a9-aaae-6ea6b3e23130	6657c3e4-f0cc-410a-a665-c3de5e93ec7b	desconto	103	Previdência Municipal	Julho/2024	819	12
7e9c9c2c-20b0-48c3-93c4-326a0a40f0cc	6657c3e4-f0cc-410a-a665-c3de5e93ec7b	informativo	200	Base de Cálculo IRRF	Julho/2024	7749.14	20
b3d61e35-8d64-4e5b-a770-bbaa71e937cd	6657c3e4-f0cc-410a-a665-c3de5e93ec7b	informativo	201	Base de Cálculo INSS	Julho/2024	8658	21
5239f1e3-3b6d-4310-8767-9c38dcd2a8ab	86fa5b41-a5cc-403a-aed6-3b9b661e69a1	vencimento	001	Vencimento Básico	Junho/2024	5850	1
7bed3d4a-7dcb-40a3-8bc2-39858acd3cb2	86fa5b41-a5cc-403a-aed6-3b9b661e69a1	vencimento	010	Adicional de Insalubridade (10%)	Junho/2024	585	2
ad14e07d-4993-4dd6-a2e1-4777e0119b3b	86fa5b41-a5cc-403a-aed6-3b9b661e69a1	vencimento	020	Adicional de Tempo de Serviço (5%)	Junho/2024	292.5	3
2c224a09-2d45-42ea-89ea-254b18f3f4e7	86fa5b41-a5cc-403a-aed6-3b9b661e69a1	desconto	101	INSS	Junho/2024	740.025	10
a36c0dc3-d967-4c5f-ab37-1767301768a2	86fa5b41-a5cc-403a-aed6-3b9b661e69a1	desconto	102	IRRF	Junho/2024	980.7025	11
1ea2aad3-208d-4070-83af-664f5a7bd4fa	86fa5b41-a5cc-403a-aed6-3b9b661e69a1	desconto	103	Previdência Municipal	Junho/2024	819	12
23e3b4ee-5d69-4d7f-9875-8018b71f6a09	86fa5b41-a5cc-403a-aed6-3b9b661e69a1	informativo	200	Base de Cálculo IRRF	Junho/2024	5987.475	20
3af5a29d-0f35-4616-9360-5b83b03d8c84	86fa5b41-a5cc-403a-aed6-3b9b661e69a1	informativo	201	Base de Cálculo INSS	Junho/2024	6727.5	21
303b826b-d4d9-493a-a728-8c8d855bbde5	a0d5e1be-a170-4efc-9cae-dd108c86e2e0	vencimento	001	Vencimento Básico	Maio/2024	5850	1
7335c05d-c89d-4146-b535-0cc7dc6f4b18	a0d5e1be-a170-4efc-9cae-dd108c86e2e0	vencimento	010	Adicional de Insalubridade (10%)	Maio/2024	585	2
5aef8567-c77d-45df-989b-5dd6dd125445	a0d5e1be-a170-4efc-9cae-dd108c86e2e0	vencimento	020	Adicional de Tempo de Serviço (5%)	Maio/2024	292.5	3
6e82f3ee-3db1-4e70-8a47-8e42b5d8df97	a0d5e1be-a170-4efc-9cae-dd108c86e2e0	desconto	101	INSS	Maio/2024	740.025	10
c0f94509-d4c8-4f86-bcec-943ee356ddcc	a0d5e1be-a170-4efc-9cae-dd108c86e2e0	desconto	102	IRRF	Maio/2024	980.7025	11
166928f0-b278-45a5-95b3-427d06dfd117	a0d5e1be-a170-4efc-9cae-dd108c86e2e0	desconto	103	Previdência Municipal	Maio/2024	819	12
e5507977-2108-46ad-beff-13985c6ebd97	a0d5e1be-a170-4efc-9cae-dd108c86e2e0	informativo	200	Base de Cálculo IRRF	Maio/2024	5987.475	20
779c9780-b2f1-4bfa-b86f-6eb831e8dfdb	a0d5e1be-a170-4efc-9cae-dd108c86e2e0	informativo	201	Base de Cálculo INSS	Maio/2024	6727.5	21
a103c94c-6ad5-4c07-b61b-339c4f7fd9ff	42c8df3f-984f-4117-aa93-d6a5d68b3f41	vencimento	001	Vencimento Básico	Abril/2024	5850	1
65f07fc9-d1dd-46e7-b573-74cf96094085	42c8df3f-984f-4117-aa93-d6a5d68b3f41	vencimento	010	Adicional de Insalubridade (10%)	Abril/2024	585	2
29da2eb0-c302-47cc-8cb1-de0a25b95625	42c8df3f-984f-4117-aa93-d6a5d68b3f41	vencimento	020	Adicional de Tempo de Serviço (5%)	Abril/2024	292.5	3
fb26ccc4-3bea-4bbf-b17a-e0134b8b62ff	42c8df3f-984f-4117-aa93-d6a5d68b3f41	desconto	101	INSS	Abril/2024	740.025	10
deaaa194-65b8-456d-a145-a9ee31ab3a79	42c8df3f-984f-4117-aa93-d6a5d68b3f41	desconto	102	IRRF	Abril/2024	980.7025	11
716db798-33b4-458a-87a1-966ec863a7c6	42c8df3f-984f-4117-aa93-d6a5d68b3f41	desconto	103	Previdência Municipal	Abril/2024	819	12
9193bfa7-da57-4565-9f44-6f2a6e492a26	42c8df3f-984f-4117-aa93-d6a5d68b3f41	informativo	200	Base de Cálculo IRRF	Abril/2024	5987.475	20
8cd9a81c-ef1c-45dc-bfaf-fdfbeaca206b	42c8df3f-984f-4117-aa93-d6a5d68b3f41	informativo	201	Base de Cálculo INSS	Abril/2024	6727.5	21
3223ab87-a098-4862-8729-e9c576363b6c	7939af9c-a4fd-4353-9dc2-8f69cc76e75f	vencimento	001	Vencimento Básico	Março/2026	3200	1
c1ae8e74-161c-4674-a699-5339960f4daf	7939af9c-a4fd-4353-9dc2-8f69cc76e75f	vencimento	010	Adicional de Insalubridade (10%)	Março/2026	320	2
64cd2678-7c4f-4fb5-b6ca-b2e4b4edeb8f	7939af9c-a4fd-4353-9dc2-8f69cc76e75f	vencimento	020	Adicional de Tempo de Serviço (5%)	Março/2026	160	3
229ca882-e091-4bb5-9d2b-0e427a48ea32	7939af9c-a4fd-4353-9dc2-8f69cc76e75f	desconto	101	INSS	Março/2026	404.8	10
5dd6ec1a-3c50-4c67-8092-5892b980560f	7939af9c-a4fd-4353-9dc2-8f69cc76e75f	desconto	102	IRRF	Março/2026	197.2	11
0e56b066-889d-4819-a215-21e776a2fdcd	7939af9c-a4fd-4353-9dc2-8f69cc76e75f	desconto	103	Previdência Municipal	Março/2026	448	12
2bfb49a4-a221-44e1-9710-1e8cd2c5293d	7939af9c-a4fd-4353-9dc2-8f69cc76e75f	informativo	200	Base de Cálculo IRRF	Março/2026	3275.2	20
8da365da-a655-4016-911a-7efcbd5c8c23	7939af9c-a4fd-4353-9dc2-8f69cc76e75f	informativo	201	Base de Cálculo INSS	Março/2026	3680	21
6cc40745-b896-49a0-a712-14f49b97e68d	7bc0d1d3-4fe1-4107-a91a-c57ffeb7ceaa	vencimento	001	Vencimento Básico	Fevereiro/2026	3200	1
2e95d528-3e2f-40c1-a224-9d5a7011f603	7bc0d1d3-4fe1-4107-a91a-c57ffeb7ceaa	vencimento	010	Adicional de Insalubridade (10%)	Fevereiro/2026	320	2
8681cc9b-d23f-456f-ae04-7940e1422cab	7bc0d1d3-4fe1-4107-a91a-c57ffeb7ceaa	vencimento	020	Adicional de Tempo de Serviço (5%)	Fevereiro/2026	160	3
a6033ad2-5523-48cf-aba3-e40189a16529	7bc0d1d3-4fe1-4107-a91a-c57ffeb7ceaa	desconto	101	INSS	Fevereiro/2026	404.8	10
79bcaa6a-b9a5-4de4-904e-539caf6f2365	7bc0d1d3-4fe1-4107-a91a-c57ffeb7ceaa	desconto	102	IRRF	Fevereiro/2026	197.2	11
81b46732-1bf5-41f9-ad08-5857afc2d3dc	7bc0d1d3-4fe1-4107-a91a-c57ffeb7ceaa	desconto	103	Previdência Municipal	Fevereiro/2026	448	12
7a62446e-5071-420e-914f-cd622122dac0	7bc0d1d3-4fe1-4107-a91a-c57ffeb7ceaa	informativo	200	Base de Cálculo IRRF	Fevereiro/2026	3275.2	20
74482c72-5b0e-4483-b591-0c8702fc4f2d	7bc0d1d3-4fe1-4107-a91a-c57ffeb7ceaa	informativo	201	Base de Cálculo INSS	Fevereiro/2026	3680	21
419cb4f8-6eb6-4802-9b97-dcc7010f7955	d00cadaa-d9a3-46b0-8eab-5a2a26ec484e	vencimento	001	Vencimento Básico	Janeiro/2026	3200	1
3caf468a-ce03-4fb6-90e5-8829993c2014	d00cadaa-d9a3-46b0-8eab-5a2a26ec484e	vencimento	010	Adicional de Insalubridade (10%)	Janeiro/2026	320	2
2104223b-2149-4a1a-abe8-484564a859a2	d00cadaa-d9a3-46b0-8eab-5a2a26ec484e	vencimento	020	Adicional de Tempo de Serviço (5%)	Janeiro/2026	160	3
6528701f-fd38-49bc-9a97-47be0ffcd399	d00cadaa-d9a3-46b0-8eab-5a2a26ec484e	desconto	101	INSS	Janeiro/2026	404.8	10
e017fbbb-7cc5-412a-ab7b-a582d3e7e3cd	d00cadaa-d9a3-46b0-8eab-5a2a26ec484e	desconto	102	IRRF	Janeiro/2026	197.2	11
ffe27249-1cd0-4a41-ac3b-596b3eed1d95	d00cadaa-d9a3-46b0-8eab-5a2a26ec484e	desconto	103	Previdência Municipal	Janeiro/2026	448	12
bc9768d3-aa93-4055-acf5-f05bef816112	d00cadaa-d9a3-46b0-8eab-5a2a26ec484e	informativo	200	Base de Cálculo IRRF	Janeiro/2026	3275.2	20
e4b04472-c21f-4caa-86b8-0204a54ea558	d00cadaa-d9a3-46b0-8eab-5a2a26ec484e	informativo	201	Base de Cálculo INSS	Janeiro/2026	3680	21
a775eb3f-667b-49cf-9123-cedd84bec2b5	ff29ede4-099c-4b7c-b671-f945e1e6d136	vencimento	001	Vencimento Básico	Dezembro/2025	3200	1
ea531e6d-5466-432f-94fa-7117abd6e020	ff29ede4-099c-4b7c-b671-f945e1e6d136	vencimento	010	Adicional de Insalubridade (10%)	Dezembro/2025	320	2
682469ec-e936-4fdf-aa4b-0774c0f68dc3	ff29ede4-099c-4b7c-b671-f945e1e6d136	vencimento	020	Adicional de Tempo de Serviço (5%)	Dezembro/2025	160	3
9e88ec81-d45f-4656-9e63-b216823e9ccb	ff29ede4-099c-4b7c-b671-f945e1e6d136	desconto	101	INSS	Dezembro/2025	404.8	10
e6c40d16-b653-4987-82ee-1f91b3737431	ff29ede4-099c-4b7c-b671-f945e1e6d136	desconto	102	IRRF	Dezembro/2025	197.2	11
2e297a5f-584c-43cb-a839-81540fe6cc5e	ff29ede4-099c-4b7c-b671-f945e1e6d136	desconto	103	Previdência Municipal	Dezembro/2025	448	12
50734f9f-ea3b-4306-a3a6-d2a2bc52ce1a	ff29ede4-099c-4b7c-b671-f945e1e6d136	informativo	200	Base de Cálculo IRRF	Dezembro/2025	3275.2	20
d55551b8-82b4-47cd-bbb8-5a556451bf48	ff29ede4-099c-4b7c-b671-f945e1e6d136	informativo	201	Base de Cálculo INSS	Dezembro/2025	3680	21
774339e1-ccce-461a-9d7d-38bbcc3a6461	1e5969a4-1108-4518-b2fa-ab6b35b08eda	vencimento	001	Vencimento Básico	Novembro/2025	3200	1
18f62531-4500-4046-a3f1-4dc76f6c83ea	1e5969a4-1108-4518-b2fa-ab6b35b08eda	vencimento	010	Adicional de Insalubridade (10%)	Novembro/2025	320	2
2cbeedb7-161e-4265-8998-c31d37ce86a8	1e5969a4-1108-4518-b2fa-ab6b35b08eda	vencimento	020	Adicional de Tempo de Serviço (5%)	Novembro/2025	160	3
0d858743-ed75-44f7-a32e-6d5fa968fdc9	1e5969a4-1108-4518-b2fa-ab6b35b08eda	desconto	101	INSS	Novembro/2025	404.8	10
5f90137a-cfcf-4e37-8dc1-ae92fb4d699d	1e5969a4-1108-4518-b2fa-ab6b35b08eda	desconto	102	IRRF	Novembro/2025	197.2	11
6273b691-01e9-4d65-b80f-ee682cad60e7	1e5969a4-1108-4518-b2fa-ab6b35b08eda	desconto	103	Previdência Municipal	Novembro/2025	448	12
0baa9d93-7a21-4e76-81ec-a1bc76dbd7e1	1e5969a4-1108-4518-b2fa-ab6b35b08eda	informativo	200	Base de Cálculo IRRF	Novembro/2025	3275.2	20
25a85e27-79c5-4261-a661-5effc988c0ba	1e5969a4-1108-4518-b2fa-ab6b35b08eda	informativo	201	Base de Cálculo INSS	Novembro/2025	3680	21
3305456d-d11f-42fa-b0a8-a2f99c18a814	1ee72560-d11f-4a94-92cf-a344bca4ba0f	vencimento	001	Vencimento Básico	Outubro/2025	3200	1
caf81226-b359-4df6-9a6b-4cff80a1baa3	1ee72560-d11f-4a94-92cf-a344bca4ba0f	vencimento	010	Adicional de Insalubridade (10%)	Outubro/2025	320	2
c42efe21-58c6-4cb9-86e1-7d0cb01d0939	1ee72560-d11f-4a94-92cf-a344bca4ba0f	vencimento	020	Adicional de Tempo de Serviço (5%)	Outubro/2025	160	3
1cd3b4ab-e0d8-4b5f-b788-9ac7703a406b	1ee72560-d11f-4a94-92cf-a344bca4ba0f	desconto	101	INSS	Outubro/2025	404.8	10
0a150581-3728-469d-b19e-98239f15ec40	1ee72560-d11f-4a94-92cf-a344bca4ba0f	desconto	102	IRRF	Outubro/2025	197.2	11
8bfeaf53-8559-425f-99cc-4d2ecb8af942	1ee72560-d11f-4a94-92cf-a344bca4ba0f	desconto	103	Previdência Municipal	Outubro/2025	448	12
6da3c79d-18b6-41f1-a537-7c3b3d4ba841	1ee72560-d11f-4a94-92cf-a344bca4ba0f	informativo	200	Base de Cálculo IRRF	Outubro/2025	3275.2	20
a5554500-52a3-479f-b816-8cdd337b5335	1ee72560-d11f-4a94-92cf-a344bca4ba0f	informativo	201	Base de Cálculo INSS	Outubro/2025	3680	21
e5f8b4d0-af31-4c59-8752-89a342d4f6b5	e728c5eb-faec-4e93-9383-9c1fa1cc8f10	vencimento	001	Vencimento Básico	Setembro/2025	3200	1
3a3138db-30ab-4b1a-acee-f5628b1c1ea0	e728c5eb-faec-4e93-9383-9c1fa1cc8f10	vencimento	010	Adicional de Insalubridade (10%)	Setembro/2025	320	2
639093ac-a6fe-4722-a2bf-9429ce6bf7a5	e728c5eb-faec-4e93-9383-9c1fa1cc8f10	vencimento	020	Adicional de Tempo de Serviço (5%)	Setembro/2025	160	3
7eecbbdd-79ce-405d-ae67-619adf546082	e728c5eb-faec-4e93-9383-9c1fa1cc8f10	desconto	101	INSS	Setembro/2025	404.8	10
e65f5054-5d86-4efb-b4e3-8a6ef4146872	e728c5eb-faec-4e93-9383-9c1fa1cc8f10	desconto	102	IRRF	Setembro/2025	197.2	11
d882db93-81d1-4c49-b14c-367b1d94424a	e728c5eb-faec-4e93-9383-9c1fa1cc8f10	desconto	103	Previdência Municipal	Setembro/2025	448	12
d6e7a4bd-4251-4e80-a912-85d743f1e70e	e728c5eb-faec-4e93-9383-9c1fa1cc8f10	informativo	200	Base de Cálculo IRRF	Setembro/2025	3275.2	20
9a46b34c-cc77-4d10-bce7-27d5866e5a0d	e728c5eb-faec-4e93-9383-9c1fa1cc8f10	informativo	201	Base de Cálculo INSS	Setembro/2025	3680	21
96278cc0-3d06-4b56-980a-467bc2773c7b	05edd39d-f355-4df6-a813-26339565dfab	vencimento	001	Vencimento Básico	Agosto/2025	3200	1
79d5285c-ed74-4b76-badb-3ab8ef92bcaf	05edd39d-f355-4df6-a813-26339565dfab	vencimento	010	Adicional de Insalubridade (10%)	Agosto/2025	320	2
23456cf7-35cc-4833-ac60-e4cd71202966	05edd39d-f355-4df6-a813-26339565dfab	vencimento	020	Adicional de Tempo de Serviço (5%)	Agosto/2025	160	3
8323022f-b5fe-4a56-b53e-7b0b76143412	05edd39d-f355-4df6-a813-26339565dfab	desconto	101	INSS	Agosto/2025	404.8	10
097684f1-066a-416a-a29f-adafc7a9abb9	05edd39d-f355-4df6-a813-26339565dfab	desconto	102	IRRF	Agosto/2025	197.2	11
9ac96242-4ecf-4d65-a5c8-cfa84b15d942	05edd39d-f355-4df6-a813-26339565dfab	desconto	103	Previdência Municipal	Agosto/2025	448	12
6ba82ec8-dbef-4b2b-ae1d-c83c04eb3d9d	05edd39d-f355-4df6-a813-26339565dfab	informativo	200	Base de Cálculo IRRF	Agosto/2025	3275.2	20
260d135c-69fb-430f-b6b9-7fa5a17ae88a	05edd39d-f355-4df6-a813-26339565dfab	informativo	201	Base de Cálculo INSS	Agosto/2025	3680	21
ece1a06a-20a2-4172-a474-567e0a20d44e	b5bfbc1a-6467-439d-b880-2d6fbd7566d1	vencimento	001	Vencimento Básico	Julho/2025	3200	1
794f6782-3aad-47bf-b43f-c37a95a18a28	b5bfbc1a-6467-439d-b880-2d6fbd7566d1	vencimento	010	Adicional de Insalubridade (10%)	Julho/2025	320	2
10c4b8bf-3d0b-4511-81f2-7da08e7b4427	b5bfbc1a-6467-439d-b880-2d6fbd7566d1	vencimento	020	Adicional de Tempo de Serviço (5%)	Julho/2025	160	3
50e7c91c-fd14-4083-91fe-3bcf50726942	b5bfbc1a-6467-439d-b880-2d6fbd7566d1	vencimento	030	1/3 Constitucional de Férias	Julho/2025	1056	4
c0411171-a718-49ac-bfca-31b4d6538b7a	b5bfbc1a-6467-439d-b880-2d6fbd7566d1	desconto	101	INSS	Julho/2025	520.96	10
bb17e12f-99ea-4ab5-9f2e-a4122e6133c1	b5bfbc1a-6467-439d-b880-2d6fbd7566d1	desconto	102	IRRF	Julho/2025	433.04	11
d1d4e8a4-00e4-4ec4-bf73-fb586d7f18e2	b5bfbc1a-6467-439d-b880-2d6fbd7566d1	desconto	103	Previdência Municipal	Julho/2025	448	12
65f2d132-1fda-4e96-b924-596b851fa667	b5bfbc1a-6467-439d-b880-2d6fbd7566d1	informativo	200	Base de Cálculo IRRF	Julho/2025	4215.04	20
3e1abae0-a131-4ecb-9d55-7585159d47a3	b5bfbc1a-6467-439d-b880-2d6fbd7566d1	informativo	201	Base de Cálculo INSS	Julho/2025	4736	21
a98d6246-abf1-4a98-9c0e-b9af3b5f7160	61b26c61-0e3f-48dd-9b0f-ab46f1602763	vencimento	001	Vencimento Básico	Junho/2025	3200	1
cc436000-2035-4855-89dd-8d4e775f8324	61b26c61-0e3f-48dd-9b0f-ab46f1602763	vencimento	010	Adicional de Insalubridade (10%)	Junho/2025	320	2
6b7aed4d-6d34-4536-99c2-3e8bf665fc82	61b26c61-0e3f-48dd-9b0f-ab46f1602763	vencimento	020	Adicional de Tempo de Serviço (5%)	Junho/2025	160	3
08da6bbc-8e00-4407-81fb-3038086c09b5	61b26c61-0e3f-48dd-9b0f-ab46f1602763	desconto	101	INSS	Junho/2025	404.8	10
ff557161-930f-429c-9fee-b83bddccc457	61b26c61-0e3f-48dd-9b0f-ab46f1602763	desconto	102	IRRF	Junho/2025	197.2	11
7db286c8-8fbd-482a-b5a3-afa5eef9a73f	61b26c61-0e3f-48dd-9b0f-ab46f1602763	desconto	103	Previdência Municipal	Junho/2025	448	12
409044de-e101-4b15-b057-8d7c4d058bc0	61b26c61-0e3f-48dd-9b0f-ab46f1602763	informativo	200	Base de Cálculo IRRF	Junho/2025	3275.2	20
f8fa974d-d1ce-4e37-bb7e-d0532e74d0d7	61b26c61-0e3f-48dd-9b0f-ab46f1602763	informativo	201	Base de Cálculo INSS	Junho/2025	3680	21
55d20d82-aedf-4b8a-b6a8-c0bfaa229946	782da821-ab95-499c-b206-eae0293d3658	vencimento	001	Vencimento Básico	Maio/2025	3200	1
494d6e31-d85b-43ea-b4d2-3f6f701286f3	782da821-ab95-499c-b206-eae0293d3658	vencimento	010	Adicional de Insalubridade (10%)	Maio/2025	320	2
34057f8b-b29d-4b55-9a79-f645fb4d7677	782da821-ab95-499c-b206-eae0293d3658	vencimento	020	Adicional de Tempo de Serviço (5%)	Maio/2025	160	3
37c5d77a-740e-427c-971f-3b13aac6f234	782da821-ab95-499c-b206-eae0293d3658	desconto	101	INSS	Maio/2025	404.8	10
f9bddc14-652e-454a-b10c-b8908a3a7bcb	782da821-ab95-499c-b206-eae0293d3658	desconto	102	IRRF	Maio/2025	197.2	11
339ac5d4-5d5c-4350-88fc-c83979fe311c	782da821-ab95-499c-b206-eae0293d3658	desconto	103	Previdência Municipal	Maio/2025	448	12
c2808775-e5ea-4387-967c-6b4237388081	782da821-ab95-499c-b206-eae0293d3658	informativo	200	Base de Cálculo IRRF	Maio/2025	3275.2	20
e3cd26a6-87d7-410b-b001-88c5d3593877	782da821-ab95-499c-b206-eae0293d3658	informativo	201	Base de Cálculo INSS	Maio/2025	3680	21
66807876-6b31-4692-a5a4-7cd34e7ebcc0	0f670e90-0081-40ad-99c7-621eda1b79a9	vencimento	001	Vencimento Básico	Abril/2025	3200	1
980ef59f-eef0-4699-bc95-7152f89aa7b5	0f670e90-0081-40ad-99c7-621eda1b79a9	vencimento	010	Adicional de Insalubridade (10%)	Abril/2025	320	2
d92233e3-c76c-4dad-bf85-f8645fe343d4	0f670e90-0081-40ad-99c7-621eda1b79a9	vencimento	020	Adicional de Tempo de Serviço (5%)	Abril/2025	160	3
47ba9e39-72ab-469a-8b0c-cf4c871bb897	0f670e90-0081-40ad-99c7-621eda1b79a9	desconto	101	INSS	Abril/2025	404.8	10
5e9874d6-b5c7-487d-8c51-7bc570c8cdd6	0f670e90-0081-40ad-99c7-621eda1b79a9	desconto	102	IRRF	Abril/2025	197.2	11
ffa0362b-ab5f-4259-9247-3c7d6280152d	0f670e90-0081-40ad-99c7-621eda1b79a9	desconto	103	Previdência Municipal	Abril/2025	448	12
7ade17be-2da9-4cce-8d35-a5135d4b8479	0f670e90-0081-40ad-99c7-621eda1b79a9	informativo	200	Base de Cálculo IRRF	Abril/2025	3275.2	20
b5284f05-0bc6-4e35-b32d-8c27c498740e	0f670e90-0081-40ad-99c7-621eda1b79a9	informativo	201	Base de Cálculo INSS	Abril/2025	3680	21
509aeb7e-e834-4c19-8fc4-f2feacc6ea3b	ee5f1521-138f-4d2b-adde-f4cbf2409e88	vencimento	001	Vencimento Básico	Março/2025	3200	1
2e66e050-d3e0-428d-b8ea-48590fd9f51c	ee5f1521-138f-4d2b-adde-f4cbf2409e88	vencimento	010	Adicional de Insalubridade (10%)	Março/2025	320	2
cf718cea-7ffd-47ef-9158-7ce7412119ce	ee5f1521-138f-4d2b-adde-f4cbf2409e88	vencimento	020	Adicional de Tempo de Serviço (5%)	Março/2025	160	3
1f415c32-1aa9-4bc6-8727-cdc4b7e4df2f	ee5f1521-138f-4d2b-adde-f4cbf2409e88	desconto	101	INSS	Março/2025	404.8	10
8d79929d-79a1-48ed-9029-0d3023880f78	ee5f1521-138f-4d2b-adde-f4cbf2409e88	desconto	102	IRRF	Março/2025	197.2	11
63ad4474-f847-46ba-b187-4a416c6126e6	ee5f1521-138f-4d2b-adde-f4cbf2409e88	desconto	103	Previdência Municipal	Março/2025	448	12
f8854ed9-8389-49a6-af49-2af84af8058a	ee5f1521-138f-4d2b-adde-f4cbf2409e88	informativo	200	Base de Cálculo IRRF	Março/2025	3275.2	20
fc3b2bef-8c96-4521-9ed7-28afb8db4331	ee5f1521-138f-4d2b-adde-f4cbf2409e88	informativo	201	Base de Cálculo INSS	Março/2025	3680	21
46d4c4a7-d435-433e-8bf0-9097cc6b6f43	f223dfbb-af24-4c09-a305-a9732e62891e	vencimento	001	Vencimento Básico	Fevereiro/2025	3200	1
5f84e060-879b-49ce-adc8-97591526ba7e	f223dfbb-af24-4c09-a305-a9732e62891e	vencimento	010	Adicional de Insalubridade (10%)	Fevereiro/2025	320	2
b7e6ec57-f009-4b0f-9270-d2c6d1bedc55	f223dfbb-af24-4c09-a305-a9732e62891e	vencimento	020	Adicional de Tempo de Serviço (5%)	Fevereiro/2025	160	3
bb3dd7d6-3335-4703-bc0b-92b5163c99f0	f223dfbb-af24-4c09-a305-a9732e62891e	desconto	101	INSS	Fevereiro/2025	404.8	10
3ef5de7a-a248-443e-af3f-313ddda13683	f223dfbb-af24-4c09-a305-a9732e62891e	desconto	102	IRRF	Fevereiro/2025	197.2	11
a7e1d3cf-f564-4157-8a48-c629cf2e1db9	f223dfbb-af24-4c09-a305-a9732e62891e	desconto	103	Previdência Municipal	Fevereiro/2025	448	12
8a27c030-3f24-4c5e-b7d2-c6f8a22cf762	f223dfbb-af24-4c09-a305-a9732e62891e	informativo	200	Base de Cálculo IRRF	Fevereiro/2025	3275.2	20
3ca64d68-644d-459e-a2f2-79369260563b	f223dfbb-af24-4c09-a305-a9732e62891e	informativo	201	Base de Cálculo INSS	Fevereiro/2025	3680	21
9474ac2a-8096-4730-bac7-dec229b3738e	3ee1ed03-3d66-4449-889e-3568ece9ad98	vencimento	001	Vencimento Básico	Janeiro/2025	3200	1
eae59ff3-ae64-4dc0-b7b3-b7025d74a43e	3ee1ed03-3d66-4449-889e-3568ece9ad98	vencimento	010	Adicional de Insalubridade (10%)	Janeiro/2025	320	2
e40c6cfa-79d0-4ac6-af3c-cc961a686b86	3ee1ed03-3d66-4449-889e-3568ece9ad98	vencimento	020	Adicional de Tempo de Serviço (5%)	Janeiro/2025	160	3
70e5e084-3005-4618-acc6-dd828d74ce24	3ee1ed03-3d66-4449-889e-3568ece9ad98	desconto	101	INSS	Janeiro/2025	404.8	10
3c42fb49-a5ba-4a8c-9567-9f499f57ccd3	3ee1ed03-3d66-4449-889e-3568ece9ad98	desconto	102	IRRF	Janeiro/2025	197.2	11
e2f1cb0d-cb19-4bf5-bae2-8dcdc1c5ade7	3ee1ed03-3d66-4449-889e-3568ece9ad98	desconto	103	Previdência Municipal	Janeiro/2025	448	12
563335fd-d1e6-4670-8478-24396a30112b	3ee1ed03-3d66-4449-889e-3568ece9ad98	informativo	200	Base de Cálculo IRRF	Janeiro/2025	3275.2	20
9778af17-8fe1-4fa2-89f1-f830c3947362	3ee1ed03-3d66-4449-889e-3568ece9ad98	informativo	201	Base de Cálculo INSS	Janeiro/2025	3680	21
96485dbb-e85d-4d88-8dc1-b1229730dd23	60e2c3ab-900e-43c8-a021-5e01bbf7e3fb	vencimento	001	Vencimento Básico	Dezembro/2024	3200	1
f298a3c4-4c5b-4e7d-af14-7cedeeb767f9	60e2c3ab-900e-43c8-a021-5e01bbf7e3fb	vencimento	010	Adicional de Insalubridade (10%)	Dezembro/2024	320	2
2ae1b30d-f2aa-4487-be11-3ad104019521	60e2c3ab-900e-43c8-a021-5e01bbf7e3fb	vencimento	020	Adicional de Tempo de Serviço (5%)	Dezembro/2024	160	3
bd17cddd-54c2-464a-91d4-aa6a125c96e7	60e2c3ab-900e-43c8-a021-5e01bbf7e3fb	desconto	101	INSS	Dezembro/2024	404.8	10
f7f44cba-6d3a-4b10-bc8b-bd478f2a5073	60e2c3ab-900e-43c8-a021-5e01bbf7e3fb	desconto	102	IRRF	Dezembro/2024	197.2	11
097ead0f-9c0d-49d3-a4d1-f567e1f3b1b5	60e2c3ab-900e-43c8-a021-5e01bbf7e3fb	desconto	103	Previdência Municipal	Dezembro/2024	448	12
7df9554a-17fe-43ee-b55b-c33c5b6e2797	60e2c3ab-900e-43c8-a021-5e01bbf7e3fb	informativo	200	Base de Cálculo IRRF	Dezembro/2024	3275.2	20
d1b18b78-0801-4aa9-9131-09af11d61740	60e2c3ab-900e-43c8-a021-5e01bbf7e3fb	informativo	201	Base de Cálculo INSS	Dezembro/2024	3680	21
51d4b9eb-40f5-4bf8-bc8c-6d77de04a983	a4d1cfda-5aa5-410d-a18b-4f8944380d3d	vencimento	001	Vencimento Básico	Novembro/2024	3200	1
13d69e0b-9555-43fc-9574-b7b309be7637	a4d1cfda-5aa5-410d-a18b-4f8944380d3d	vencimento	010	Adicional de Insalubridade (10%)	Novembro/2024	320	2
b3d5371a-1567-473d-80ab-43b9cd5634f9	a4d1cfda-5aa5-410d-a18b-4f8944380d3d	vencimento	020	Adicional de Tempo de Serviço (5%)	Novembro/2024	160	3
1e7c9d9e-d259-4148-9f06-a2fcd31eb6dc	a4d1cfda-5aa5-410d-a18b-4f8944380d3d	desconto	101	INSS	Novembro/2024	404.8	10
adf499ab-b32d-41fa-8eb3-d275b834c807	a4d1cfda-5aa5-410d-a18b-4f8944380d3d	desconto	102	IRRF	Novembro/2024	197.2	11
76fabc7e-9f42-4650-a0ca-9ceb14adc373	a4d1cfda-5aa5-410d-a18b-4f8944380d3d	desconto	103	Previdência Municipal	Novembro/2024	448	12
107a2c45-ed18-4c40-af07-ef4b205707d9	a4d1cfda-5aa5-410d-a18b-4f8944380d3d	informativo	200	Base de Cálculo IRRF	Novembro/2024	3275.2	20
1765b919-6019-42ef-b55b-0890d55e62f2	a4d1cfda-5aa5-410d-a18b-4f8944380d3d	informativo	201	Base de Cálculo INSS	Novembro/2024	3680	21
2265baf4-b11e-4a70-8b8b-809abc861398	37fcc065-1e17-4a9f-bdb5-46dd655ed790	vencimento	001	Vencimento Básico	Outubro/2024	3200	1
c89d897c-42ea-4d41-81fe-beb8d18993b6	37fcc065-1e17-4a9f-bdb5-46dd655ed790	vencimento	010	Adicional de Insalubridade (10%)	Outubro/2024	320	2
e4c3a0b8-13b5-4438-844e-95ec73e04fd7	37fcc065-1e17-4a9f-bdb5-46dd655ed790	vencimento	020	Adicional de Tempo de Serviço (5%)	Outubro/2024	160	3
a35368bd-d3e9-4e8f-91f4-b5b46fde17aa	37fcc065-1e17-4a9f-bdb5-46dd655ed790	desconto	101	INSS	Outubro/2024	404.8	10
d7c42e2b-1e7c-45ff-b115-0a8f950a61c5	37fcc065-1e17-4a9f-bdb5-46dd655ed790	desconto	102	IRRF	Outubro/2024	197.2	11
541b49c3-910b-436f-a86f-46029c50017f	37fcc065-1e17-4a9f-bdb5-46dd655ed790	desconto	103	Previdência Municipal	Outubro/2024	448	12
5588e46b-8199-41a4-b5e7-77e45d95d8c3	37fcc065-1e17-4a9f-bdb5-46dd655ed790	informativo	200	Base de Cálculo IRRF	Outubro/2024	3275.2	20
60833929-80c9-4943-9617-4382f7d519bd	37fcc065-1e17-4a9f-bdb5-46dd655ed790	informativo	201	Base de Cálculo INSS	Outubro/2024	3680	21
a615b059-43a1-41cf-99a3-ecf4517d2e62	165bb1af-bc78-474f-99f8-13fd2d7310fd	vencimento	001	Vencimento Básico	Setembro/2024	3200	1
794439e9-7dd6-4d2c-846e-5f80c45cd9ea	165bb1af-bc78-474f-99f8-13fd2d7310fd	vencimento	010	Adicional de Insalubridade (10%)	Setembro/2024	320	2
7e7150bb-7b79-4f31-978e-198c710b4d99	165bb1af-bc78-474f-99f8-13fd2d7310fd	vencimento	020	Adicional de Tempo de Serviço (5%)	Setembro/2024	160	3
edd385f1-1f03-480a-bfd6-0c6e1bbaf543	165bb1af-bc78-474f-99f8-13fd2d7310fd	desconto	101	INSS	Setembro/2024	404.8	10
6adf493b-493d-4fbe-b0f0-4bdb75600dda	165bb1af-bc78-474f-99f8-13fd2d7310fd	desconto	102	IRRF	Setembro/2024	197.2	11
ab5a3307-c57d-497f-ba00-198fea2ad29e	165bb1af-bc78-474f-99f8-13fd2d7310fd	desconto	103	Previdência Municipal	Setembro/2024	448	12
c36771b8-9c0e-4b56-bb84-e477f2a365db	165bb1af-bc78-474f-99f8-13fd2d7310fd	informativo	200	Base de Cálculo IRRF	Setembro/2024	3275.2	20
8cb5ccc4-99c4-4158-9ec4-7802af1b37d5	165bb1af-bc78-474f-99f8-13fd2d7310fd	informativo	201	Base de Cálculo INSS	Setembro/2024	3680	21
695ffef3-6554-4d86-a957-cc652c37f932	5aef99f4-fb79-460f-b696-d0a85490429e	vencimento	001	Vencimento Básico	Agosto/2024	3200	1
e7ec8f62-f546-46aa-b1f7-a049d92e3015	5aef99f4-fb79-460f-b696-d0a85490429e	vencimento	010	Adicional de Insalubridade (10%)	Agosto/2024	320	2
e9f8e3de-da89-457a-be9f-c7010d414cba	5aef99f4-fb79-460f-b696-d0a85490429e	vencimento	020	Adicional de Tempo de Serviço (5%)	Agosto/2024	160	3
c98fe21e-5a7e-4bcd-82f8-ef9febb41180	5aef99f4-fb79-460f-b696-d0a85490429e	desconto	101	INSS	Agosto/2024	404.8	10
eb606961-63d2-46b2-9f56-df9d2e809ea0	5aef99f4-fb79-460f-b696-d0a85490429e	desconto	102	IRRF	Agosto/2024	197.2	11
ea62ae91-ca60-4141-b02b-3c06f5e9c1ae	5aef99f4-fb79-460f-b696-d0a85490429e	desconto	103	Previdência Municipal	Agosto/2024	448	12
1bd62724-0634-4cdc-a121-2f26b974bcaf	5aef99f4-fb79-460f-b696-d0a85490429e	informativo	200	Base de Cálculo IRRF	Agosto/2024	3275.2	20
652ff7df-a1a7-45c0-9b8d-561a1d07f61b	5aef99f4-fb79-460f-b696-d0a85490429e	informativo	201	Base de Cálculo INSS	Agosto/2024	3680	21
31a2d36f-852c-4dfb-85fb-9df17782a448	6137d7d6-028b-4e3c-8bb9-05d529b79ceb	vencimento	001	Vencimento Básico	Julho/2024	3200	1
6acdb921-e533-40d7-a464-4a6c6b5bb753	6137d7d6-028b-4e3c-8bb9-05d529b79ceb	vencimento	010	Adicional de Insalubridade (10%)	Julho/2024	320	2
71f13f30-5b2c-4cb6-8745-0b3d943e186e	6137d7d6-028b-4e3c-8bb9-05d529b79ceb	vencimento	020	Adicional de Tempo de Serviço (5%)	Julho/2024	160	3
59cb5994-8f72-4628-a5e2-904c741b1ebd	6137d7d6-028b-4e3c-8bb9-05d529b79ceb	vencimento	030	1/3 Constitucional de Férias	Julho/2024	1056	4
aed25f34-1a7b-484b-a795-ec4daace5f27	6137d7d6-028b-4e3c-8bb9-05d529b79ceb	desconto	101	INSS	Julho/2024	520.96	10
243862b8-2348-4dd2-ac7c-78b993c1e181	6137d7d6-028b-4e3c-8bb9-05d529b79ceb	desconto	102	IRRF	Julho/2024	433.04	11
dfad471e-c1f9-4847-a628-7b7e6d4e68b1	6137d7d6-028b-4e3c-8bb9-05d529b79ceb	desconto	103	Previdência Municipal	Julho/2024	448	12
f71300a9-d586-4177-a7aa-a2a6dfa6f1ea	6137d7d6-028b-4e3c-8bb9-05d529b79ceb	informativo	200	Base de Cálculo IRRF	Julho/2024	4215.04	20
cd5f5be4-ca28-47b5-98a8-a29117c43037	6137d7d6-028b-4e3c-8bb9-05d529b79ceb	informativo	201	Base de Cálculo INSS	Julho/2024	4736	21
e8fc5b3d-38fb-4892-8fa2-a118c0d48f57	c3c61131-497e-4e90-a899-f33d78360a19	vencimento	001	Vencimento Básico	Junho/2024	3200	1
c2e7417f-652f-42c1-96ab-a7a07b8e0db8	c3c61131-497e-4e90-a899-f33d78360a19	vencimento	010	Adicional de Insalubridade (10%)	Junho/2024	320	2
3f1e0050-5a0b-4274-9bb0-18e7bd5c4613	c3c61131-497e-4e90-a899-f33d78360a19	vencimento	020	Adicional de Tempo de Serviço (5%)	Junho/2024	160	3
c6b457c1-6009-46f4-86ff-344a3928a1f9	c3c61131-497e-4e90-a899-f33d78360a19	desconto	101	INSS	Junho/2024	404.8	10
13688598-b8b1-4b85-8886-7cd537af74b7	c3c61131-497e-4e90-a899-f33d78360a19	desconto	102	IRRF	Junho/2024	197.2	11
bc691e8f-5012-4711-8804-f4ebc802bcad	c3c61131-497e-4e90-a899-f33d78360a19	desconto	103	Previdência Municipal	Junho/2024	448	12
c117bda0-10ef-40bc-82b5-776c91203827	c3c61131-497e-4e90-a899-f33d78360a19	informativo	200	Base de Cálculo IRRF	Junho/2024	3275.2	20
ccc30c15-d75a-4c5a-acfb-210f0f4e7e01	c3c61131-497e-4e90-a899-f33d78360a19	informativo	201	Base de Cálculo INSS	Junho/2024	3680	21
c739d506-11d2-429b-86c5-79e7926f970a	fe38c761-7ce0-488e-b8fd-77315030bd15	vencimento	001	Vencimento Básico	Maio/2024	3200	1
19ec0b3f-b287-4e17-aa56-e79c4a6dea3a	fe38c761-7ce0-488e-b8fd-77315030bd15	vencimento	010	Adicional de Insalubridade (10%)	Maio/2024	320	2
ecc27f1f-9937-4b6f-acb6-d805758effeb	fe38c761-7ce0-488e-b8fd-77315030bd15	vencimento	020	Adicional de Tempo de Serviço (5%)	Maio/2024	160	3
17e06953-0f66-4601-b76b-c3d3fd928c45	fe38c761-7ce0-488e-b8fd-77315030bd15	desconto	101	INSS	Maio/2024	404.8	10
17882c3d-2c15-47d7-917e-83cd533f60ef	fe38c761-7ce0-488e-b8fd-77315030bd15	desconto	102	IRRF	Maio/2024	197.2	11
3f5eb92c-62dc-4247-9929-e6e3e955b141	fe38c761-7ce0-488e-b8fd-77315030bd15	desconto	103	Previdência Municipal	Maio/2024	448	12
b2d63a28-ef48-4283-9189-d3c6175ebbc9	fe38c761-7ce0-488e-b8fd-77315030bd15	informativo	200	Base de Cálculo IRRF	Maio/2024	3275.2	20
3d06d7e0-ea81-4ec3-b5bd-3a0fb9f3eca6	fe38c761-7ce0-488e-b8fd-77315030bd15	informativo	201	Base de Cálculo INSS	Maio/2024	3680	21
5abf86b9-9409-496f-b760-3cbcafab87a9	fb3cd068-b483-413e-bbda-379c19346b37	vencimento	001	Vencimento Básico	Abril/2024	3200	1
83142754-42f4-4f20-a03e-4e571d004ac3	fb3cd068-b483-413e-bbda-379c19346b37	vencimento	010	Adicional de Insalubridade (10%)	Abril/2024	320	2
f242645d-26bc-4b12-98dd-8c6908f002c0	fb3cd068-b483-413e-bbda-379c19346b37	vencimento	020	Adicional de Tempo de Serviço (5%)	Abril/2024	160	3
0558d2d1-48b0-422e-b181-aa1e8e93fb09	fb3cd068-b483-413e-bbda-379c19346b37	desconto	101	INSS	Abril/2024	404.8	10
039f72a7-395e-4360-b598-846cf9cc9116	fb3cd068-b483-413e-bbda-379c19346b37	desconto	102	IRRF	Abril/2024	197.2	11
880e9832-dc2a-4163-b999-b3f51a592ccb	fb3cd068-b483-413e-bbda-379c19346b37	desconto	103	Previdência Municipal	Abril/2024	448	12
9420923e-a1f4-4239-9e4c-94a7ad4e8c58	fb3cd068-b483-413e-bbda-379c19346b37	informativo	200	Base de Cálculo IRRF	Abril/2024	3275.2	20
c22365c8-c2a4-418f-94ad-f7b857025ae8	fb3cd068-b483-413e-bbda-379c19346b37	informativo	201	Base de Cálculo INSS	Abril/2024	3680	21
de305dc9-f03e-4d27-bc93-9105c3ff0225	1977f9b2-c446-4d22-b7d3-6ca3b02c76f1	vencimento	001	Vencimento Básico	Março/2026	4100	1
08b2aeb8-a2bb-4db9-ab11-e925a34f382a	1977f9b2-c446-4d22-b7d3-6ca3b02c76f1	vencimento	010	Adicional de Insalubridade (10%)	Março/2026	410	2
07cbadaa-8154-4a8e-945c-8271c1d12538	1977f9b2-c446-4d22-b7d3-6ca3b02c76f1	vencimento	020	Adicional de Tempo de Serviço (5%)	Março/2026	205	3
5dc517c7-d8cf-4164-8d23-1bedf042748c	1977f9b2-c446-4d22-b7d3-6ca3b02c76f1	desconto	101	INSS	Março/2026	518.65	10
2798c9b6-41e1-4d0e-89d6-caf400ef9d5f	1977f9b2-c446-4d22-b7d3-6ca3b02c76f1	desconto	102	IRRF	Março/2026	427.265	11
0a116ea6-1500-4225-aae6-54cb0c45c59c	1977f9b2-c446-4d22-b7d3-6ca3b02c76f1	desconto	103	Previdência Municipal	Março/2026	574	12
e3876a8d-5abe-4083-9c7f-a7c3ae39b16d	1977f9b2-c446-4d22-b7d3-6ca3b02c76f1	informativo	200	Base de Cálculo IRRF	Março/2026	4196.35	20
1aa8c7cb-0993-4c11-9d88-97489bd2ff35	1977f9b2-c446-4d22-b7d3-6ca3b02c76f1	informativo	201	Base de Cálculo INSS	Março/2026	4715	21
0a63ae0a-e98a-4154-afa2-5b516e668fe3	8e4747fb-f51b-4316-8794-2dfa2917d2e3	vencimento	001	Vencimento Básico	Fevereiro/2026	4100	1
34fa1274-fb6d-4e26-a0d0-c080eb75a92e	8e4747fb-f51b-4316-8794-2dfa2917d2e3	vencimento	010	Adicional de Insalubridade (10%)	Fevereiro/2026	410	2
c0849ad0-974e-443f-8915-e45830c71795	8e4747fb-f51b-4316-8794-2dfa2917d2e3	vencimento	020	Adicional de Tempo de Serviço (5%)	Fevereiro/2026	205	3
3cca3726-cb10-41de-a96b-7e59f1c3541f	8e4747fb-f51b-4316-8794-2dfa2917d2e3	desconto	101	INSS	Fevereiro/2026	518.65	10
8f5efdf9-9f42-42a8-ae5e-c3430be87173	8e4747fb-f51b-4316-8794-2dfa2917d2e3	desconto	102	IRRF	Fevereiro/2026	427.265	11
e3e98162-d1a6-466c-8755-8b7e7a8f1e5d	8e4747fb-f51b-4316-8794-2dfa2917d2e3	desconto	103	Previdência Municipal	Fevereiro/2026	574	12
40b46881-fb8d-41cd-aec2-9869aeb995db	8e4747fb-f51b-4316-8794-2dfa2917d2e3	informativo	200	Base de Cálculo IRRF	Fevereiro/2026	4196.35	20
3c135cd6-936c-444b-add7-73d4db5b7ccd	8e4747fb-f51b-4316-8794-2dfa2917d2e3	informativo	201	Base de Cálculo INSS	Fevereiro/2026	4715	21
bd91abee-bc30-4657-bf96-971989f16d24	3446ab10-2f90-4887-a538-5f11aa7799a3	vencimento	001	Vencimento Básico	Janeiro/2026	4100	1
3dd25f7d-5074-42ac-b53c-d9e16a2422e4	3446ab10-2f90-4887-a538-5f11aa7799a3	vencimento	010	Adicional de Insalubridade (10%)	Janeiro/2026	410	2
0c56dc12-802d-4ef1-8dd2-f323a2d5fa5a	3446ab10-2f90-4887-a538-5f11aa7799a3	vencimento	020	Adicional de Tempo de Serviço (5%)	Janeiro/2026	205	3
e19cb784-4a8a-4852-9525-5893150d6a1f	3446ab10-2f90-4887-a538-5f11aa7799a3	desconto	101	INSS	Janeiro/2026	518.65	10
0a9c59ba-9fc5-43b7-ac1f-6dd616008d72	3446ab10-2f90-4887-a538-5f11aa7799a3	desconto	102	IRRF	Janeiro/2026	427.265	11
8d4845a5-c38f-4c6e-b78b-222968011f47	3446ab10-2f90-4887-a538-5f11aa7799a3	desconto	103	Previdência Municipal	Janeiro/2026	574	12
c3b2fe0c-8d04-4059-8d9b-20a5c2345968	3446ab10-2f90-4887-a538-5f11aa7799a3	informativo	200	Base de Cálculo IRRF	Janeiro/2026	4196.35	20
635e1e50-4bcf-48b0-980f-0e91556d0234	3446ab10-2f90-4887-a538-5f11aa7799a3	informativo	201	Base de Cálculo INSS	Janeiro/2026	4715	21
517950ff-ae6c-479e-bea5-7726c7a6c06e	5a67716f-0fe6-497f-9bc2-eaf9d979ed1b	vencimento	001	Vencimento Básico	Dezembro/2025	4100	1
b6fcf1ce-5b94-4369-9299-f59837950648	5a67716f-0fe6-497f-9bc2-eaf9d979ed1b	vencimento	010	Adicional de Insalubridade (10%)	Dezembro/2025	410	2
dc811121-a9e2-4645-8c41-de75071c58c4	5a67716f-0fe6-497f-9bc2-eaf9d979ed1b	vencimento	020	Adicional de Tempo de Serviço (5%)	Dezembro/2025	205	3
24914066-1e23-41d7-9840-78cfc3b19d63	5a67716f-0fe6-497f-9bc2-eaf9d979ed1b	desconto	101	INSS	Dezembro/2025	518.65	10
94445721-bdb7-4c48-bb44-cfccffbde128	5a67716f-0fe6-497f-9bc2-eaf9d979ed1b	desconto	102	IRRF	Dezembro/2025	427.265	11
2957be0a-ea25-4684-8d99-abe44666c263	5a67716f-0fe6-497f-9bc2-eaf9d979ed1b	desconto	103	Previdência Municipal	Dezembro/2025	574	12
1dfc832c-946c-4d8e-86d3-ca5ca3312f09	5a67716f-0fe6-497f-9bc2-eaf9d979ed1b	informativo	200	Base de Cálculo IRRF	Dezembro/2025	4196.35	20
f9e3c3e2-e178-4209-ba82-468ce9b46cd8	5a67716f-0fe6-497f-9bc2-eaf9d979ed1b	informativo	201	Base de Cálculo INSS	Dezembro/2025	4715	21
9ae309e6-5c82-44b9-821b-0d8fa6df91c8	42214891-c204-4b0e-82d1-630dd1c9cde1	vencimento	001	Vencimento Básico	Novembro/2025	4100	1
a4c2fdaa-f65a-45de-96bb-7403be82e0ad	42214891-c204-4b0e-82d1-630dd1c9cde1	vencimento	010	Adicional de Insalubridade (10%)	Novembro/2025	410	2
5f55bbe2-4c53-403a-aa89-4e2e0be525c4	42214891-c204-4b0e-82d1-630dd1c9cde1	vencimento	020	Adicional de Tempo de Serviço (5%)	Novembro/2025	205	3
731283f9-ff7b-4854-a77f-8bcfea6fb58b	42214891-c204-4b0e-82d1-630dd1c9cde1	desconto	101	INSS	Novembro/2025	518.65	10
a590a3b7-03b4-4429-b7d0-9cce771fbd8d	42214891-c204-4b0e-82d1-630dd1c9cde1	desconto	102	IRRF	Novembro/2025	427.265	11
b1d30712-e3f3-4745-b1ad-11221c0a11c2	42214891-c204-4b0e-82d1-630dd1c9cde1	desconto	103	Previdência Municipal	Novembro/2025	574	12
566d34cf-11db-4476-b330-e4f43c1807e1	42214891-c204-4b0e-82d1-630dd1c9cde1	informativo	200	Base de Cálculo IRRF	Novembro/2025	4196.35	20
985bd895-6181-4b1a-9be4-1efb6382201e	42214891-c204-4b0e-82d1-630dd1c9cde1	informativo	201	Base de Cálculo INSS	Novembro/2025	4715	21
1e3afc6b-6eab-4f3e-9866-594332a8bc74	ff4a9132-2629-4930-8740-e726d2214e90	vencimento	001	Vencimento Básico	Outubro/2025	4100	1
afb5ee78-8854-4cd0-a514-36e500ae987f	ff4a9132-2629-4930-8740-e726d2214e90	vencimento	010	Adicional de Insalubridade (10%)	Outubro/2025	410	2
cf302e72-1609-49fc-9b20-697504c55691	ff4a9132-2629-4930-8740-e726d2214e90	vencimento	020	Adicional de Tempo de Serviço (5%)	Outubro/2025	205	3
c00aadac-ca2f-4237-83c7-0fe9d81719b4	ff4a9132-2629-4930-8740-e726d2214e90	desconto	101	INSS	Outubro/2025	518.65	10
001c927e-6b0a-49f9-a04a-fd66640a36fb	ff4a9132-2629-4930-8740-e726d2214e90	desconto	102	IRRF	Outubro/2025	427.265	11
209255da-c224-418c-9a83-13faba1acaa4	ff4a9132-2629-4930-8740-e726d2214e90	desconto	103	Previdência Municipal	Outubro/2025	574	12
0a658974-47bb-42d6-a2dd-b7884a4f73eb	ff4a9132-2629-4930-8740-e726d2214e90	informativo	200	Base de Cálculo IRRF	Outubro/2025	4196.35	20
7a9c4db7-88a0-4b1d-a781-0cddbcf31fd8	ff4a9132-2629-4930-8740-e726d2214e90	informativo	201	Base de Cálculo INSS	Outubro/2025	4715	21
a00f3b41-9ab9-4ff9-92bb-de37fbd118ba	029b1ae5-1f2e-4b17-af19-9b656e211629	vencimento	001	Vencimento Básico	Setembro/2025	4100	1
8ff2c0bb-0905-492f-ad83-4e8b996aa411	029b1ae5-1f2e-4b17-af19-9b656e211629	vencimento	010	Adicional de Insalubridade (10%)	Setembro/2025	410	2
6bd159b5-1523-48f4-abe1-a319c5f2c433	029b1ae5-1f2e-4b17-af19-9b656e211629	vencimento	020	Adicional de Tempo de Serviço (5%)	Setembro/2025	205	3
b3413aa9-69f8-4bae-abd0-56e827476053	029b1ae5-1f2e-4b17-af19-9b656e211629	desconto	101	INSS	Setembro/2025	518.65	10
5d4b86fd-bad2-4c76-947d-2bb8c65b3c08	029b1ae5-1f2e-4b17-af19-9b656e211629	desconto	102	IRRF	Setembro/2025	427.265	11
3e49270c-1171-4548-8ff6-f83287db2664	029b1ae5-1f2e-4b17-af19-9b656e211629	desconto	103	Previdência Municipal	Setembro/2025	574	12
71b146dd-779c-4e82-9c37-78dd87cc7e15	029b1ae5-1f2e-4b17-af19-9b656e211629	informativo	200	Base de Cálculo IRRF	Setembro/2025	4196.35	20
5b7ae7dc-cc92-4d01-8d36-eda74da23af6	029b1ae5-1f2e-4b17-af19-9b656e211629	informativo	201	Base de Cálculo INSS	Setembro/2025	4715	21
9cc599d1-9376-4975-8d1e-14434cf7c2ad	1f900ca8-fb05-4f2a-bf45-591f426d1c80	vencimento	001	Vencimento Básico	Agosto/2025	4100	1
7d948186-6a1b-4722-a432-30439c10c7c8	1f900ca8-fb05-4f2a-bf45-591f426d1c80	vencimento	010	Adicional de Insalubridade (10%)	Agosto/2025	410	2
1ffb6039-b672-4451-87e1-bc787d607bcf	1f900ca8-fb05-4f2a-bf45-591f426d1c80	vencimento	020	Adicional de Tempo de Serviço (5%)	Agosto/2025	205	3
3a107f5a-7495-475c-a315-5b844e88eb00	1f900ca8-fb05-4f2a-bf45-591f426d1c80	desconto	101	INSS	Agosto/2025	518.65	10
1cc1caab-7980-46c3-8dd7-c243e9802ddc	1f900ca8-fb05-4f2a-bf45-591f426d1c80	desconto	102	IRRF	Agosto/2025	427.265	11
f771fd38-cec0-4259-a2f7-7ce45826b592	1f900ca8-fb05-4f2a-bf45-591f426d1c80	desconto	103	Previdência Municipal	Agosto/2025	574	12
ab12e66b-6e6a-4540-9b6f-04aee991ed56	1f900ca8-fb05-4f2a-bf45-591f426d1c80	informativo	200	Base de Cálculo IRRF	Agosto/2025	4196.35	20
9e5902b0-0ae9-4a48-8511-d3550e9e55dd	1f900ca8-fb05-4f2a-bf45-591f426d1c80	informativo	201	Base de Cálculo INSS	Agosto/2025	4715	21
2484613d-9228-4722-a73d-c4b0e161ff81	81a0a679-9121-4549-bdda-64282ea71414	vencimento	001	Vencimento Básico	Julho/2025	4100	1
c80939a7-5254-4c65-943a-aca3afbea634	81a0a679-9121-4549-bdda-64282ea71414	vencimento	010	Adicional de Insalubridade (10%)	Julho/2025	410	2
ba04d968-3add-4af8-94b0-2fa6c6f7d80e	81a0a679-9121-4549-bdda-64282ea71414	vencimento	020	Adicional de Tempo de Serviço (5%)	Julho/2025	205	3
4ad5ec80-2ab7-44ab-b41a-4abfbbb42ff8	81a0a679-9121-4549-bdda-64282ea71414	vencimento	030	1/3 Constitucional de Férias	Julho/2025	1353	4
3dd9a93b-3b27-480a-a1af-a3cb79f3a3f1	81a0a679-9121-4549-bdda-64282ea71414	desconto	101	INSS	Julho/2025	667.48	10
500bb5e7-2a25-4e13-84e9-b98f3f31e9b7	81a0a679-9121-4549-bdda-64282ea71414	desconto	102	IRRF	Julho/2025	799.34	11
6397dc9b-69e4-4d8d-90dc-655d0842c223	81a0a679-9121-4549-bdda-64282ea71414	desconto	103	Previdência Municipal	Julho/2025	574	12
b8246b4b-c46b-4843-8cdf-69edc8309aa8	81a0a679-9121-4549-bdda-64282ea71414	informativo	200	Base de Cálculo IRRF	Julho/2025	5400.52	20
1a1580a3-9951-4fb5-8a30-ef35ea03095d	81a0a679-9121-4549-bdda-64282ea71414	informativo	201	Base de Cálculo INSS	Julho/2025	6068	21
f71bddf3-a1c4-4fdc-a417-2cc9cee38fd6	fc4e68b1-0a9e-45f9-ac17-c461bdc14577	vencimento	001	Vencimento Básico	Junho/2025	4100	1
a2a34b50-a6a1-4a91-944b-3091e45cc052	fc4e68b1-0a9e-45f9-ac17-c461bdc14577	vencimento	010	Adicional de Insalubridade (10%)	Junho/2025	410	2
8e2b4701-5485-4395-8527-b5caa27a9955	fc4e68b1-0a9e-45f9-ac17-c461bdc14577	vencimento	020	Adicional de Tempo de Serviço (5%)	Junho/2025	205	3
e0d07da7-5a4c-4ca9-951e-01e52f713f8e	fc4e68b1-0a9e-45f9-ac17-c461bdc14577	desconto	101	INSS	Junho/2025	518.65	10
0ae0ff55-ebd4-488d-a6a5-f620e9ffa755	fc4e68b1-0a9e-45f9-ac17-c461bdc14577	desconto	102	IRRF	Junho/2025	427.265	11
bdea6f23-15f6-4c91-b7a5-38be61583027	fc4e68b1-0a9e-45f9-ac17-c461bdc14577	desconto	103	Previdência Municipal	Junho/2025	574	12
0a16a34e-8ad2-4ae8-9098-ce58552b755d	fc4e68b1-0a9e-45f9-ac17-c461bdc14577	informativo	200	Base de Cálculo IRRF	Junho/2025	4196.35	20
93dac4f9-3240-4a16-86d0-d27712c8f589	fc4e68b1-0a9e-45f9-ac17-c461bdc14577	informativo	201	Base de Cálculo INSS	Junho/2025	4715	21
e155ad37-3bf3-4b75-b533-58f169285c86	1b131f19-7a7c-4936-af12-024de1b5b4ca	vencimento	001	Vencimento Básico	Maio/2025	4100	1
7d0b64be-f7df-4a62-bc62-7eb79bde3817	1b131f19-7a7c-4936-af12-024de1b5b4ca	vencimento	010	Adicional de Insalubridade (10%)	Maio/2025	410	2
1e5d0632-e3ed-4332-9e98-4af606e30d68	1b131f19-7a7c-4936-af12-024de1b5b4ca	vencimento	020	Adicional de Tempo de Serviço (5%)	Maio/2025	205	3
7adf7a7d-c09b-457d-82b9-bcae376b5d77	1b131f19-7a7c-4936-af12-024de1b5b4ca	desconto	101	INSS	Maio/2025	518.65	10
c5187295-7061-405a-9021-9cee164ec0b1	1b131f19-7a7c-4936-af12-024de1b5b4ca	desconto	102	IRRF	Maio/2025	427.265	11
4194fa2d-8a77-4936-99e3-c03f4cc7e2f0	1b131f19-7a7c-4936-af12-024de1b5b4ca	desconto	103	Previdência Municipal	Maio/2025	574	12
1451c91c-edc4-4e0b-9df1-b430f1ef0ef5	1b131f19-7a7c-4936-af12-024de1b5b4ca	informativo	200	Base de Cálculo IRRF	Maio/2025	4196.35	20
ea5001e9-2862-46bd-ab50-bbf0ef83e6b5	1b131f19-7a7c-4936-af12-024de1b5b4ca	informativo	201	Base de Cálculo INSS	Maio/2025	4715	21
594ee320-82e4-4e82-b355-d5269b574cda	23ad0e3a-f017-4941-ab25-490a35c6ac0b	vencimento	001	Vencimento Básico	Abril/2025	4100	1
1e514d0a-209c-4d89-8f48-1a81f89cab29	23ad0e3a-f017-4941-ab25-490a35c6ac0b	vencimento	010	Adicional de Insalubridade (10%)	Abril/2025	410	2
759133a1-c5a1-48fc-98cf-a68389dc1e44	23ad0e3a-f017-4941-ab25-490a35c6ac0b	vencimento	020	Adicional de Tempo de Serviço (5%)	Abril/2025	205	3
d9d100c2-9790-42b4-af3e-80bac0a296ea	23ad0e3a-f017-4941-ab25-490a35c6ac0b	desconto	101	INSS	Abril/2025	518.65	10
9b812231-9f1a-46f1-ae56-90ac072975d6	23ad0e3a-f017-4941-ab25-490a35c6ac0b	desconto	102	IRRF	Abril/2025	427.265	11
ebe137d2-4a6f-4705-9a97-e6506800d86e	23ad0e3a-f017-4941-ab25-490a35c6ac0b	desconto	103	Previdência Municipal	Abril/2025	574	12
17f3c255-fde5-4fbf-9bb0-e066bd67cc19	23ad0e3a-f017-4941-ab25-490a35c6ac0b	informativo	200	Base de Cálculo IRRF	Abril/2025	4196.35	20
cbc5fed7-bbe8-435d-8f57-48c8768b6993	23ad0e3a-f017-4941-ab25-490a35c6ac0b	informativo	201	Base de Cálculo INSS	Abril/2025	4715	21
43a9f985-4201-410d-9692-9bc146cabf2d	677b1fba-d109-400c-92b1-1b56956e9717	vencimento	001	Vencimento Básico	Março/2025	4100	1
ce753802-bae1-40b6-bf31-259e4977f107	677b1fba-d109-400c-92b1-1b56956e9717	vencimento	010	Adicional de Insalubridade (10%)	Março/2025	410	2
76795231-1cc8-4554-a5b0-ea460c60acb4	677b1fba-d109-400c-92b1-1b56956e9717	vencimento	020	Adicional de Tempo de Serviço (5%)	Março/2025	205	3
a75bb415-5203-4416-913f-169bb1fdc80d	677b1fba-d109-400c-92b1-1b56956e9717	desconto	101	INSS	Março/2025	518.65	10
a0336fe2-61c7-457e-9f94-81228e5ec282	677b1fba-d109-400c-92b1-1b56956e9717	desconto	102	IRRF	Março/2025	427.265	11
3c907bdf-5a94-4110-99a1-1115fc7ef4a2	677b1fba-d109-400c-92b1-1b56956e9717	desconto	103	Previdência Municipal	Março/2025	574	12
ea2107c2-d73c-4d66-b8fd-0dcd8e5e9aa7	677b1fba-d109-400c-92b1-1b56956e9717	informativo	200	Base de Cálculo IRRF	Março/2025	4196.35	20
d6ce9506-756f-467a-97fb-22e64c61e1f9	677b1fba-d109-400c-92b1-1b56956e9717	informativo	201	Base de Cálculo INSS	Março/2025	4715	21
a7e1be27-b48c-4ab7-aa04-58eb35a6efa8	50d73210-c15d-438f-adbf-74be53f6c11c	vencimento	001	Vencimento Básico	Fevereiro/2025	4100	1
7ace5f3f-2253-4689-8080-a440793eaf0a	50d73210-c15d-438f-adbf-74be53f6c11c	vencimento	010	Adicional de Insalubridade (10%)	Fevereiro/2025	410	2
4071a618-d660-40a8-a693-fd020e94ad09	50d73210-c15d-438f-adbf-74be53f6c11c	vencimento	020	Adicional de Tempo de Serviço (5%)	Fevereiro/2025	205	3
dea49b69-58d2-4452-8999-d6cb1010f0e4	50d73210-c15d-438f-adbf-74be53f6c11c	desconto	101	INSS	Fevereiro/2025	518.65	10
daa010ea-f780-4e61-9ee0-9313bc6abf7d	50d73210-c15d-438f-adbf-74be53f6c11c	desconto	102	IRRF	Fevereiro/2025	427.265	11
fa3b270e-ed77-43d6-865e-c2b87f4aebcc	50d73210-c15d-438f-adbf-74be53f6c11c	desconto	103	Previdência Municipal	Fevereiro/2025	574	12
18da5851-ca8f-41b8-bea3-61e17a9cbda6	50d73210-c15d-438f-adbf-74be53f6c11c	informativo	200	Base de Cálculo IRRF	Fevereiro/2025	4196.35	20
65abf2bb-9236-4379-936d-edd7bef994b0	50d73210-c15d-438f-adbf-74be53f6c11c	informativo	201	Base de Cálculo INSS	Fevereiro/2025	4715	21
dc802268-773e-4e3f-a007-8ef7442e9ae2	ecf24193-3d2a-4abd-946f-661b52ac9159	vencimento	001	Vencimento Básico	Janeiro/2025	4100	1
85203362-0c24-4e3f-9e85-3d97b82dde5b	ecf24193-3d2a-4abd-946f-661b52ac9159	vencimento	010	Adicional de Insalubridade (10%)	Janeiro/2025	410	2
0828dd0a-e5ea-4089-ab0e-67127cb70262	ecf24193-3d2a-4abd-946f-661b52ac9159	vencimento	020	Adicional de Tempo de Serviço (5%)	Janeiro/2025	205	3
f1e41e25-f434-4b2b-953e-5dcaf50bb345	ecf24193-3d2a-4abd-946f-661b52ac9159	desconto	101	INSS	Janeiro/2025	518.65	10
58b24636-5d2f-428b-a8ab-389ecd51cb1b	ecf24193-3d2a-4abd-946f-661b52ac9159	desconto	102	IRRF	Janeiro/2025	427.265	11
aa58cebb-56d1-4e6f-a604-f7754566acff	ecf24193-3d2a-4abd-946f-661b52ac9159	desconto	103	Previdência Municipal	Janeiro/2025	574	12
8e657914-5a77-4524-8fe1-016202cc36f4	ecf24193-3d2a-4abd-946f-661b52ac9159	informativo	200	Base de Cálculo IRRF	Janeiro/2025	4196.35	20
d386319d-96c1-4011-b9ba-289539d1de82	ecf24193-3d2a-4abd-946f-661b52ac9159	informativo	201	Base de Cálculo INSS	Janeiro/2025	4715	21
ae6cfeba-1f67-4485-807a-ac9c3407422e	5e2832f5-492b-4c50-8b24-019bb1267774	vencimento	001	Vencimento Básico	Dezembro/2024	4100	1
cfdc581c-0920-49a2-be63-b4f597970a44	5e2832f5-492b-4c50-8b24-019bb1267774	vencimento	010	Adicional de Insalubridade (10%)	Dezembro/2024	410	2
ed400add-8175-480a-8b55-47961766c5a9	5e2832f5-492b-4c50-8b24-019bb1267774	vencimento	020	Adicional de Tempo de Serviço (5%)	Dezembro/2024	205	3
f1cf4b55-291b-472e-b4e2-bcad78f0d6cb	5e2832f5-492b-4c50-8b24-019bb1267774	desconto	101	INSS	Dezembro/2024	518.65	10
40f06577-2621-420d-9bea-90deadfdb713	5e2832f5-492b-4c50-8b24-019bb1267774	desconto	102	IRRF	Dezembro/2024	427.265	11
0ed5a080-f1f5-4b90-9c26-d4ddc5a52f87	5e2832f5-492b-4c50-8b24-019bb1267774	desconto	103	Previdência Municipal	Dezembro/2024	574	12
934d6c0b-fa3a-4de3-b04f-c76aa02496df	5e2832f5-492b-4c50-8b24-019bb1267774	informativo	200	Base de Cálculo IRRF	Dezembro/2024	4196.35	20
9d29108c-7cda-4749-bb8a-4c6e18f37f33	5e2832f5-492b-4c50-8b24-019bb1267774	informativo	201	Base de Cálculo INSS	Dezembro/2024	4715	21
d9beba0e-5d48-4f6e-bee9-10c313b86564	cbf69bc0-a49f-4dd3-8efa-93c4579f2a9c	vencimento	001	Vencimento Básico	Novembro/2024	4100	1
d34769b1-eb08-40ef-9af8-2994b22be72d	cbf69bc0-a49f-4dd3-8efa-93c4579f2a9c	vencimento	010	Adicional de Insalubridade (10%)	Novembro/2024	410	2
334fbbd6-e05f-418a-a90f-d8c1ce95419e	cbf69bc0-a49f-4dd3-8efa-93c4579f2a9c	vencimento	020	Adicional de Tempo de Serviço (5%)	Novembro/2024	205	3
ccc78bc6-4f88-4beb-9b4a-f5b9b04b3d6e	cbf69bc0-a49f-4dd3-8efa-93c4579f2a9c	desconto	101	INSS	Novembro/2024	518.65	10
b309bfd1-b019-4b7d-89c6-a37b3e13f4ff	cbf69bc0-a49f-4dd3-8efa-93c4579f2a9c	desconto	102	IRRF	Novembro/2024	427.265	11
5e00f315-2463-42e6-9b53-cef51ae21559	cbf69bc0-a49f-4dd3-8efa-93c4579f2a9c	desconto	103	Previdência Municipal	Novembro/2024	574	12
f93c3522-e51e-4dc5-aa1b-1d17ff2177bf	cbf69bc0-a49f-4dd3-8efa-93c4579f2a9c	informativo	200	Base de Cálculo IRRF	Novembro/2024	4196.35	20
6b9cde13-e902-4588-bc53-992ac0e0f991	cbf69bc0-a49f-4dd3-8efa-93c4579f2a9c	informativo	201	Base de Cálculo INSS	Novembro/2024	4715	21
a0846d1f-f369-4fa1-ae59-5557887bd67a	157b3727-7d29-411a-af4d-5d4e578ae8a9	vencimento	001	Vencimento Básico	Outubro/2024	4100	1
89f1c994-083c-4892-b866-21ba598e72f8	157b3727-7d29-411a-af4d-5d4e578ae8a9	vencimento	010	Adicional de Insalubridade (10%)	Outubro/2024	410	2
7ae06699-557f-4eed-81ed-a4ef0a3a299a	157b3727-7d29-411a-af4d-5d4e578ae8a9	vencimento	020	Adicional de Tempo de Serviço (5%)	Outubro/2024	205	3
d0a3d21e-bff8-43ca-87df-fcc577814030	157b3727-7d29-411a-af4d-5d4e578ae8a9	desconto	101	INSS	Outubro/2024	518.65	10
4033b24c-a4df-47e5-ab96-28c0486f9ca8	157b3727-7d29-411a-af4d-5d4e578ae8a9	desconto	102	IRRF	Outubro/2024	427.265	11
c977f04f-6720-41ae-872f-2148c8c59c70	157b3727-7d29-411a-af4d-5d4e578ae8a9	desconto	103	Previdência Municipal	Outubro/2024	574	12
98662322-c2db-423d-8f2d-6ae8629b5e25	157b3727-7d29-411a-af4d-5d4e578ae8a9	informativo	200	Base de Cálculo IRRF	Outubro/2024	4196.35	20
76869ebf-98ab-4994-8932-465d9fa94abc	157b3727-7d29-411a-af4d-5d4e578ae8a9	informativo	201	Base de Cálculo INSS	Outubro/2024	4715	21
6950d298-c8ec-48c3-9dce-29eed0a1e21d	c52d70ae-da90-47e9-9dd3-3f4950dac11e	vencimento	001	Vencimento Básico	Setembro/2024	4100	1
62f1afad-fd7d-43a1-98ee-973478fb946d	c52d70ae-da90-47e9-9dd3-3f4950dac11e	vencimento	010	Adicional de Insalubridade (10%)	Setembro/2024	410	2
89cca63d-ecad-4bc0-b8c6-e9a2177f0979	c52d70ae-da90-47e9-9dd3-3f4950dac11e	vencimento	020	Adicional de Tempo de Serviço (5%)	Setembro/2024	205	3
2efa318f-980f-4b1b-b266-b1e21f545e0e	c52d70ae-da90-47e9-9dd3-3f4950dac11e	desconto	101	INSS	Setembro/2024	518.65	10
c8adb407-a814-4765-be35-de390d3723a7	c52d70ae-da90-47e9-9dd3-3f4950dac11e	desconto	102	IRRF	Setembro/2024	427.265	11
7ac9cfce-7013-4f1b-b9b9-525c8c88bbe6	c52d70ae-da90-47e9-9dd3-3f4950dac11e	desconto	103	Previdência Municipal	Setembro/2024	574	12
0591c975-c416-4c9e-b4d0-b02075edf56e	c52d70ae-da90-47e9-9dd3-3f4950dac11e	informativo	200	Base de Cálculo IRRF	Setembro/2024	4196.35	20
2fd7be6f-f4ba-419f-a831-dce455e7167d	c52d70ae-da90-47e9-9dd3-3f4950dac11e	informativo	201	Base de Cálculo INSS	Setembro/2024	4715	21
8f8e2e77-e84b-4b63-9c1c-052c5ba1845a	2aee76ec-cb1d-472d-9637-cda0c45e413d	vencimento	001	Vencimento Básico	Agosto/2024	4100	1
f6403aca-f38b-4d58-9969-b37f35bc0f48	2aee76ec-cb1d-472d-9637-cda0c45e413d	vencimento	010	Adicional de Insalubridade (10%)	Agosto/2024	410	2
0f28cc88-cb86-41d5-8744-6cc060ef7dcd	2aee76ec-cb1d-472d-9637-cda0c45e413d	vencimento	020	Adicional de Tempo de Serviço (5%)	Agosto/2024	205	3
34b6f590-0343-4aca-a995-b58e80167abd	2aee76ec-cb1d-472d-9637-cda0c45e413d	desconto	101	INSS	Agosto/2024	518.65	10
0506a6d1-882d-45f9-83b9-d006bac89514	2aee76ec-cb1d-472d-9637-cda0c45e413d	desconto	102	IRRF	Agosto/2024	427.265	11
6db129e3-c7c2-4456-9206-fc60ce4d5e93	2aee76ec-cb1d-472d-9637-cda0c45e413d	desconto	103	Previdência Municipal	Agosto/2024	574	12
ec638f7a-b908-4dff-8537-ab372ef33797	2aee76ec-cb1d-472d-9637-cda0c45e413d	informativo	200	Base de Cálculo IRRF	Agosto/2024	4196.35	20
c74d5c8a-3748-490c-944e-8e54705490b5	2aee76ec-cb1d-472d-9637-cda0c45e413d	informativo	201	Base de Cálculo INSS	Agosto/2024	4715	21
03b48f76-5e8b-41ba-b546-6cb3d5808914	e2e9d8b2-8bbc-4fd1-bfec-7e23092d00db	vencimento	001	Vencimento Básico	Julho/2024	4100	1
fd513ba8-bace-4686-9918-24b34a229259	e2e9d8b2-8bbc-4fd1-bfec-7e23092d00db	vencimento	010	Adicional de Insalubridade (10%)	Julho/2024	410	2
73815029-d6a1-442d-b6ff-ef843b01c39a	e2e9d8b2-8bbc-4fd1-bfec-7e23092d00db	vencimento	020	Adicional de Tempo de Serviço (5%)	Julho/2024	205	3
9a53338f-59c7-40a0-b4e6-79fbb2cc33e3	e2e9d8b2-8bbc-4fd1-bfec-7e23092d00db	vencimento	030	1/3 Constitucional de Férias	Julho/2024	1353	4
2138582d-87b0-41bc-9ebd-e425cfaa0f02	e2e9d8b2-8bbc-4fd1-bfec-7e23092d00db	desconto	101	INSS	Julho/2024	667.48	10
2177c6fc-14a0-41e3-8bd7-c8ea63d4b214	e2e9d8b2-8bbc-4fd1-bfec-7e23092d00db	desconto	102	IRRF	Julho/2024	799.34	11
38d26398-df90-4d2d-aae4-4feb28611b4a	e2e9d8b2-8bbc-4fd1-bfec-7e23092d00db	desconto	103	Previdência Municipal	Julho/2024	574	12
ebe6dee7-a9d6-4191-9dc0-b022975e0bc0	e2e9d8b2-8bbc-4fd1-bfec-7e23092d00db	informativo	200	Base de Cálculo IRRF	Julho/2024	5400.52	20
92b668a2-9510-41f7-bb7e-38c3ea06fe75	e2e9d8b2-8bbc-4fd1-bfec-7e23092d00db	informativo	201	Base de Cálculo INSS	Julho/2024	6068	21
c4c34077-06c8-4f5f-8db6-83d4958e371b	3231a60d-471d-4612-b66f-9975131e1b99	vencimento	001	Vencimento Básico	Junho/2024	4100	1
28e11d1f-0ad6-407b-bf2e-1745cc1eea48	3231a60d-471d-4612-b66f-9975131e1b99	vencimento	010	Adicional de Insalubridade (10%)	Junho/2024	410	2
dd29bd57-4b65-4269-8166-23e292382ec1	3231a60d-471d-4612-b66f-9975131e1b99	vencimento	020	Adicional de Tempo de Serviço (5%)	Junho/2024	205	3
a40f2b80-9b83-44b9-be40-1693753c77bd	3231a60d-471d-4612-b66f-9975131e1b99	desconto	101	INSS	Junho/2024	518.65	10
f0239b20-1d36-454b-b97c-f498dd8b3d66	3231a60d-471d-4612-b66f-9975131e1b99	desconto	102	IRRF	Junho/2024	427.265	11
6bd38306-a8c7-44b2-8ed6-f6e7be33b43f	3231a60d-471d-4612-b66f-9975131e1b99	desconto	103	Previdência Municipal	Junho/2024	574	12
547f8d5b-1bc7-4a53-a34f-422c845f51e8	3231a60d-471d-4612-b66f-9975131e1b99	informativo	200	Base de Cálculo IRRF	Junho/2024	4196.35	20
1e643c6e-f760-4bfb-9074-ce2372647da4	3231a60d-471d-4612-b66f-9975131e1b99	informativo	201	Base de Cálculo INSS	Junho/2024	4715	21
9025eb17-4ee5-4392-8349-e17ae06ea620	3506bd00-e020-47ca-8680-4ee281a3552e	vencimento	001	Vencimento Básico	Maio/2024	4100	1
773aaddd-a9e4-4e4c-b52a-a08e21c5b11e	3506bd00-e020-47ca-8680-4ee281a3552e	vencimento	010	Adicional de Insalubridade (10%)	Maio/2024	410	2
1abc80bd-9fa6-4621-be4d-a690714616b4	3506bd00-e020-47ca-8680-4ee281a3552e	vencimento	020	Adicional de Tempo de Serviço (5%)	Maio/2024	205	3
fb3501db-7f6e-4456-877f-9186c16e95d2	3506bd00-e020-47ca-8680-4ee281a3552e	desconto	101	INSS	Maio/2024	518.65	10
e2e7a3ef-2bf6-4bbb-b5d6-4320e8e38a66	3506bd00-e020-47ca-8680-4ee281a3552e	desconto	102	IRRF	Maio/2024	427.265	11
a1322e12-a364-4adf-9162-14b9528b9226	3506bd00-e020-47ca-8680-4ee281a3552e	desconto	103	Previdência Municipal	Maio/2024	574	12
c422d9d5-456b-45ca-afd3-3396acb90c20	3506bd00-e020-47ca-8680-4ee281a3552e	informativo	200	Base de Cálculo IRRF	Maio/2024	4196.35	20
1e89dae6-d55e-4faf-ae89-3f5b8ec6a3b5	3506bd00-e020-47ca-8680-4ee281a3552e	informativo	201	Base de Cálculo INSS	Maio/2024	4715	21
6ecf7781-4ccc-415f-849e-57f4445b68d7	6865babc-5b3b-4bcd-bec9-8b76191a33cc	vencimento	001	Vencimento Básico	Abril/2024	4100	1
76e105ee-f2c0-4e1d-8fcd-af21485f65d8	6865babc-5b3b-4bcd-bec9-8b76191a33cc	vencimento	010	Adicional de Insalubridade (10%)	Abril/2024	410	2
f5a5d35b-ae43-4c10-8ee1-6ce51c1fc7bd	6865babc-5b3b-4bcd-bec9-8b76191a33cc	vencimento	020	Adicional de Tempo de Serviço (5%)	Abril/2024	205	3
e4015e88-c6ff-400c-8482-7d0925f83dcc	6865babc-5b3b-4bcd-bec9-8b76191a33cc	desconto	101	INSS	Abril/2024	518.65	10
b7ef5fd7-c3d2-494a-b333-8d98258fffa2	6865babc-5b3b-4bcd-bec9-8b76191a33cc	desconto	102	IRRF	Abril/2024	427.265	11
da8564ce-46f1-4e65-8120-75fa6e8e32a4	6865babc-5b3b-4bcd-bec9-8b76191a33cc	desconto	103	Previdência Municipal	Abril/2024	574	12
f7c50c15-210c-4cb6-85c8-8e7971cb6de0	6865babc-5b3b-4bcd-bec9-8b76191a33cc	informativo	200	Base de Cálculo IRRF	Abril/2024	4196.35	20
de2b5282-812b-4ade-9f78-ddd405c28342	6865babc-5b3b-4bcd-bec9-8b76191a33cc	informativo	201	Base de Cálculo INSS	Abril/2024	4715	21
\.


--
-- Data for Name: contracheques; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contracheques (id, tenant_id, servidor_id, mes, ano, competencia, total_bruto, total_descontos, total_liquido, status, cargo_na_competencia, secretaria_na_competencia, nivel_na_competencia, created_at) FROM stdin;
99857816-c1d5-464b-8f85-9acdf5f34d26	tenant-parauapebas-001	srv-001	3	2026	Março/2026	6727.5	2539.7275	4187.7725	pendente	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:15:26.860239
8660a9a7-21a2-44e1-88b3-6fdba731b7ee	tenant-parauapebas-001	srv-001	2	2026	Fevereiro/2026	6727.5	2539.7275	4187.7725	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:15:26.889911
8d959011-5d94-491e-9fe4-add0a8bfb226	tenant-parauapebas-001	srv-001	1	2026	Janeiro/2026	6727.5	2539.7275	4187.7725	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:15:26.915543
015b3d75-5b8f-4ecd-8493-58e03ad1666d	tenant-parauapebas-001	srv-001	12	2025	Dezembro/2025	6727.5	2539.7275	4187.7725	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:15:26.939665
b41ca4a8-0702-4a29-9a1a-0fc85eafb02d	tenant-parauapebas-001	srv-001	11	2025	Novembro/2025	6727.5	2539.7275	4187.7725	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:15:26.970695
0f19b1ba-d64f-4d48-a99d-ec451c735fe5	tenant-parauapebas-001	srv-001	10	2025	Outubro/2025	6727.5	2539.7275	4187.7725	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:15:26.996557
ce894e3a-be8d-45a9-a06e-47156a182ed2	tenant-parauapebas-001	srv-001	9	2025	Setembro/2025	6727.5	2539.7275	4187.7725	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:15:27.02336
b90c55d6-f23a-4b05-a5ae-c5583dae339c	tenant-parauapebas-001	srv-001	8	2025	Agosto/2025	6727.5	2539.7275	4187.7725	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:15:27.049033
e3283593-1df4-43d6-aa3f-79ca4f44b523	tenant-parauapebas-001	srv-001	7	2025	Julho/2025	8658	3239.45	5418.55	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:15:27.073563
f1d0faad-7407-4a20-9c28-50f68cd84b5a	tenant-parauapebas-001	srv-001	6	2025	Junho/2025	6727.5	2539.7275	4187.7725	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:15:27.100535
bd8e7774-b61c-45d8-841b-38de8c5aa15c	tenant-parauapebas-001	srv-001	5	2025	Maio/2025	6727.5	2539.7275	4187.7725	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:15:27.124352
223cd1b3-1de7-4695-9815-e3d078ff7230	tenant-parauapebas-001	srv-001	4	2025	Abril/2025	6727.5	2539.7275	4187.7725	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:15:27.149288
9f5b1280-62f1-4757-ad4a-63f5667a6186	tenant-parauapebas-001	srv-001	3	2025	Março/2025	6727.5	2539.7275	4187.7725	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:15:27.172892
0e30c472-7a1b-4355-b054-db5003344060	tenant-parauapebas-001	srv-001	2	2025	Fevereiro/2025	6727.5	2539.7275	4187.7725	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:15:27.197874
e314bf42-6c0e-406c-bbc3-fb4c061dc7a9	tenant-parauapebas-001	srv-001	1	2025	Janeiro/2025	6727.5	2539.7275	4187.7725	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:15:27.221648
25407c52-ca21-468e-b7bb-29f1af79049a	tenant-parauapebas-001	srv-001	12	2024	Dezembro/2024	6727.5	2539.7275	4187.7725	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:15:27.247716
d8cc3d8e-54ae-4e2a-8448-46fd7da9b7fe	tenant-parauapebas-001	srv-001	11	2024	Novembro/2024	6727.5	2539.7275	4187.7725	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:15:27.267695
d7307982-e380-4aca-8faf-2ff4a4697299	tenant-parauapebas-001	srv-001	10	2024	Outubro/2024	6727.5	2539.7275	4187.7725	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:15:27.289536
e0889365-29a4-4ff9-ad5b-d6430d8b3784	tenant-parauapebas-001	srv-001	9	2024	Setembro/2024	6727.5	2539.7275	4187.7725	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:15:27.311412
c21bdc56-5cdd-4f28-a514-50c769f3a55c	tenant-parauapebas-001	srv-001	8	2024	Agosto/2024	6727.5	2539.7275	4187.7725	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:15:27.333599
73febe98-8e7b-4b3c-90a7-19347d28595f	tenant-parauapebas-001	srv-001	7	2024	Julho/2024	8658	3239.45	5418.55	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:15:27.355093
408f712b-e103-41eb-ae64-5d82b793fc65	tenant-parauapebas-001	srv-001	6	2024	Junho/2024	6727.5	2539.7275	4187.7725	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:15:27.379405
bb2a4950-84ee-4c3a-9b93-d8b5c2723936	tenant-parauapebas-001	srv-001	5	2024	Maio/2024	6727.5	2539.7275	4187.7725	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:15:27.406235
9caaec81-34ad-4313-863d-334ffd0c8743	tenant-parauapebas-001	srv-001	4	2024	Abril/2024	6727.5	2539.7275	4187.7725	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:15:27.428428
81dd1368-194b-471a-bfa2-4126621dc256	tenant-parauapebas-001	srv-002	3	2026	Março/2026	3680	1050	2630	pendente	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:15:27.451571
d83f2198-5c8c-4787-93dd-80c554bd2b8a	tenant-parauapebas-001	srv-002	2	2026	Fevereiro/2026	3680	1050	2630	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:15:27.472091
c41d4e2d-b3cb-46eb-bd4d-05abba3796cd	tenant-parauapebas-001	srv-002	1	2026	Janeiro/2026	3680	1050	2630	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:15:27.497194
967764f7-16e1-4aad-8f07-f1c685ab8844	tenant-parauapebas-001	srv-002	12	2025	Dezembro/2025	3680	1050	2630	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:15:27.519868
5895d881-e096-4dc0-9de2-c6882c2317f8	tenant-parauapebas-001	srv-002	11	2025	Novembro/2025	3680	1050	2630	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:15:27.543527
9c80387d-360f-45c5-bf63-ea1b02bbad55	tenant-parauapebas-001	srv-002	10	2025	Outubro/2025	3680	1050	2630	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:15:27.564174
eec46d0f-10d5-419a-9192-cf235f010927	tenant-parauapebas-001	srv-002	9	2025	Setembro/2025	3680	1050	2630	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:15:27.586786
50eb8659-e573-4702-b26e-2a3181ebcfbd	tenant-parauapebas-001	srv-002	8	2025	Agosto/2025	3680	1050	2630	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:15:27.608302
0e828afc-2540-4082-92f3-f1efefb137e9	tenant-parauapebas-001	srv-002	7	2025	Julho/2025	4736	1402	3334	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:15:27.629129
8cb0a4d8-b1fb-420c-9a79-20985d4a71c6	tenant-parauapebas-001	srv-002	6	2025	Junho/2025	3680	1050	2630	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:15:27.65252
97f61dd3-0235-41a7-a755-e77c41707864	tenant-parauapebas-001	srv-002	5	2025	Maio/2025	3680	1050	2630	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:15:27.673588
709538e2-562f-4eeb-acf2-63dd1306968d	tenant-parauapebas-001	srv-002	4	2025	Abril/2025	3680	1050	2630	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:15:27.694833
21d64111-eded-4728-bb86-8f394e519e5e	tenant-parauapebas-001	srv-002	3	2025	Março/2025	3680	1050	2630	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:15:27.716116
ebdc563e-f8ff-4156-98a1-b071384f13c5	tenant-parauapebas-001	srv-002	2	2025	Fevereiro/2025	3680	1050	2630	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:15:27.738155
cbd4db2f-c39e-4ff4-b892-1ef9bbd5581a	tenant-parauapebas-001	srv-002	1	2025	Janeiro/2025	3680	1050	2630	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:15:27.760332
42da6283-39da-4bca-95df-6b53133c8e20	tenant-parauapebas-001	srv-002	12	2024	Dezembro/2024	3680	1050	2630	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:15:27.782308
b47bd6a2-bb64-41f2-b937-2d9ecba5d781	tenant-parauapebas-001	srv-002	11	2024	Novembro/2024	3680	1050	2630	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:15:27.803569
5f7a82b5-41f7-4ae6-b88e-fe4d447b29db	tenant-parauapebas-001	srv-002	10	2024	Outubro/2024	3680	1050	2630	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:15:27.824586
8e8d9549-60ec-4e5f-8318-d89f00285249	tenant-parauapebas-001	srv-002	9	2024	Setembro/2024	3680	1050	2630	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:15:27.850304
00fb214e-749a-4b73-90e1-c5f9fd4de1dc	tenant-parauapebas-001	srv-002	8	2024	Agosto/2024	3680	1050	2630	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:15:27.877465
9b6d3460-e849-4836-940c-533be1b08a54	tenant-parauapebas-001	srv-002	7	2024	Julho/2024	4736	1402	3334	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:15:27.899058
d73b84ab-d048-4464-8b95-517ee3c97b8a	tenant-parauapebas-001	srv-002	6	2024	Junho/2024	3680	1050	2630	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:15:27.925331
485103fa-6526-413d-9c80-a86c66f109b0	tenant-parauapebas-001	srv-002	5	2024	Maio/2024	3680	1050	2630	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:15:27.945662
e65397f7-0240-481b-bc52-98bf26f68865	tenant-parauapebas-001	srv-002	4	2024	Abril/2024	3680	1050	2630	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:15:27.966158
b3e1b643-983f-4763-ab38-dac12270502b	tenant-parauapebas-001	srv-003	3	2026	Março/2026	4715	1519.915	3195.085	pendente	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:15:27.987086
b200b7e5-cfd6-4be1-bd99-4ff23b5c9b5e	tenant-parauapebas-001	srv-003	2	2026	Fevereiro/2026	4715	1519.915	3195.085	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:15:28.008865
37bdce1d-963f-4744-8a5f-f0602dad44a9	tenant-parauapebas-001	srv-003	1	2026	Janeiro/2026	4715	1519.915	3195.085	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:15:28.030589
f5202db7-64db-4547-a86c-fc43015819b7	tenant-parauapebas-001	srv-003	12	2025	Dezembro/2025	4715	1519.915	3195.085	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:15:28.050489
03b35c73-6195-49a9-93ef-95f674f5f8ff	tenant-parauapebas-001	srv-003	11	2025	Novembro/2025	4715	1519.915	3195.085	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:15:28.071417
c43c8653-fd48-4b26-9de2-0966ce0476aa	tenant-parauapebas-001	srv-003	10	2025	Outubro/2025	4715	1519.915	3195.085	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:15:28.092345
7896ab14-6093-4c61-ac73-dc743a428e1c	tenant-parauapebas-001	srv-003	9	2025	Setembro/2025	4715	1519.915	3195.085	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:15:28.112399
d9ac024b-7beb-4da8-9cd1-915b8980e523	tenant-parauapebas-001	srv-003	8	2025	Agosto/2025	4715	1519.915	3195.085	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:15:28.136113
0600fff2-e1f4-4093-906d-6c4722c034e5	tenant-parauapebas-001	srv-003	7	2025	Julho/2025	6068	2040.82	4027.18	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:15:28.166926
b2347882-1562-474d-978d-2406c1023a11	tenant-parauapebas-001	srv-003	6	2025	Junho/2025	4715	1519.915	3195.085	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:15:28.191658
0b6c8c41-9029-429d-babc-9011327e23a9	tenant-parauapebas-001	srv-003	5	2025	Maio/2025	4715	1519.915	3195.085	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:15:28.213403
71677731-c506-4705-bdc1-d5f91c8d09ef	tenant-parauapebas-001	srv-003	4	2025	Abril/2025	4715	1519.915	3195.085	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:15:28.235336
c8e9b2bd-025b-41a7-9ade-38f7d29dc3bd	tenant-parauapebas-001	srv-003	3	2025	Março/2025	4715	1519.915	3195.085	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:15:28.256339
0c9a0dc6-54a7-421a-be6b-4f927a950be6	tenant-parauapebas-001	srv-003	2	2025	Fevereiro/2025	4715	1519.915	3195.085	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:15:28.276778
c2e41b25-8bbb-4e42-8b0b-85367a35a49b	tenant-parauapebas-001	srv-003	1	2025	Janeiro/2025	4715	1519.915	3195.085	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:15:28.297035
05f277e7-f430-479e-9a43-6b4b9400676e	tenant-parauapebas-001	srv-003	12	2024	Dezembro/2024	4715	1519.915	3195.085	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:15:28.318768
28ff94e7-950c-497e-8139-8e56bc203d4e	tenant-parauapebas-001	srv-003	11	2024	Novembro/2024	4715	1519.915	3195.085	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:15:28.339784
ac75d2f1-7aec-4a3e-bec1-58d0defb1071	tenant-parauapebas-001	srv-003	10	2024	Outubro/2024	4715	1519.915	3195.085	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:15:28.361242
cfb5df52-1f63-4b97-bfff-f159d5fe2a78	tenant-parauapebas-001	srv-003	9	2024	Setembro/2024	4715	1519.915	3195.085	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:15:28.380858
7ba1de2b-7458-4a47-accf-a2fa6b2e3499	tenant-parauapebas-001	srv-003	8	2024	Agosto/2024	4715	1519.915	3195.085	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:15:28.40077
5ff8e384-9069-49b7-965d-de170212df03	tenant-parauapebas-001	srv-003	7	2024	Julho/2024	6068	2040.82	4027.18	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:15:28.421166
bd42b72e-8122-4ac1-aa17-852b1fb0511b	tenant-parauapebas-001	srv-003	6	2024	Junho/2024	4715	1519.915	3195.085	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:15:28.444061
b9a3d095-2e51-4ba5-994b-ceeb231a7dac	tenant-parauapebas-001	srv-003	5	2024	Maio/2024	4715	1519.915	3195.085	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:15:28.464233
375e1055-1d0a-4f72-af04-138588043b29	tenant-parauapebas-001	srv-003	4	2024	Abril/2024	4715	1519.915	3195.085	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:15:28.487067
82cc471c-e31e-4185-983f-31ce298eed36	tenant-parauapebas-001	srv-001	3	2026	Março/2026	6727.5	2539.7275	4187.7725	pendente	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:31:07.209967
b0f4c366-711a-4333-821f-9b6fa8901379	tenant-parauapebas-001	srv-001	2	2026	Fevereiro/2026	6727.5	2539.7275	4187.7725	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:31:07.240233
1065b7e7-d5b5-44cd-b515-bbc9d073e60f	tenant-parauapebas-001	srv-001	1	2026	Janeiro/2026	6727.5	2539.7275	4187.7725	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:31:07.263426
f9102977-d389-42ec-b1bb-279112dbb194	tenant-parauapebas-001	srv-001	12	2025	Dezembro/2025	6727.5	2539.7275	4187.7725	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:31:07.289576
52b02527-46b7-42e2-8f56-25439c01764c	tenant-parauapebas-001	srv-001	11	2025	Novembro/2025	6727.5	2539.7275	4187.7725	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:31:07.319053
b61d8f94-a693-4a8b-bcb1-91ce0ccf48d4	tenant-parauapebas-001	srv-001	10	2025	Outubro/2025	6727.5	2539.7275	4187.7725	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:31:07.348043
582d1400-95d7-48fc-b809-7e62822f6a9a	tenant-parauapebas-001	srv-001	9	2025	Setembro/2025	6727.5	2539.7275	4187.7725	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:31:07.371799
0bc326cf-2a54-4403-986b-a0df1f1bfee2	tenant-parauapebas-001	srv-001	8	2025	Agosto/2025	6727.5	2539.7275	4187.7725	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:31:07.399144
77960bb6-a575-4435-8dd6-4f0f8a8933ce	tenant-parauapebas-001	srv-001	7	2025	Julho/2025	8658	3239.45	5418.55	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:31:07.423738
9286943b-d5c7-41ee-bbb9-c511485fc8ae	tenant-parauapebas-001	srv-001	6	2025	Junho/2025	6727.5	2539.7275	4187.7725	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:31:07.452038
26699635-da43-42e7-ad47-5fe512040513	tenant-parauapebas-001	srv-001	5	2025	Maio/2025	6727.5	2539.7275	4187.7725	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:31:07.477079
95b8711c-7a93-4e1f-889b-e008d97767e0	tenant-parauapebas-001	srv-001	4	2025	Abril/2025	6727.5	2539.7275	4187.7725	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:31:07.501201
41d34d4c-f1fc-44b5-b764-383861138e6c	tenant-parauapebas-001	srv-001	3	2025	Março/2025	6727.5	2539.7275	4187.7725	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:31:07.531638
80707f3a-2f2b-4fbb-801a-65a1e771b5f8	tenant-parauapebas-001	srv-001	2	2025	Fevereiro/2025	6727.5	2539.7275	4187.7725	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:31:07.555455
8ff906eb-a89b-4b45-8fcd-ae9c60dea15d	tenant-parauapebas-001	srv-001	1	2025	Janeiro/2025	6727.5	2539.7275	4187.7725	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:31:07.577942
5286e7fc-51c4-4356-8a00-421afc56a7b2	tenant-parauapebas-001	srv-001	12	2024	Dezembro/2024	6727.5	2539.7275	4187.7725	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:31:07.600399
d140428a-aeb1-43f0-9b70-432cb2aac01c	tenant-parauapebas-001	srv-001	11	2024	Novembro/2024	6727.5	2539.7275	4187.7725	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:31:07.622727
3a1c8456-f562-4d90-86ef-6b3fc8f4834a	tenant-parauapebas-001	srv-001	10	2024	Outubro/2024	6727.5	2539.7275	4187.7725	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:31:07.64663
213d73b1-c014-4abb-a642-5f689d34c8f9	tenant-parauapebas-001	srv-001	9	2024	Setembro/2024	6727.5	2539.7275	4187.7725	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:31:07.669112
8bf765d7-4867-4bea-8f6f-cee25d27dcce	tenant-parauapebas-001	srv-001	8	2024	Agosto/2024	6727.5	2539.7275	4187.7725	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:31:07.692225
6657c3e4-f0cc-410a-a665-c3de5e93ec7b	tenant-parauapebas-001	srv-001	7	2024	Julho/2024	8658	3239.45	5418.55	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:31:07.716349
86fa5b41-a5cc-403a-aed6-3b9b661e69a1	tenant-parauapebas-001	srv-001	6	2024	Junho/2024	6727.5	2539.7275	4187.7725	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:31:07.741339
a0d5e1be-a170-4efc-9cae-dd108c86e2e0	tenant-parauapebas-001	srv-001	5	2024	Maio/2024	6727.5	2539.7275	4187.7725	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:31:07.766063
42c8df3f-984f-4117-aa93-d6a5d68b3f41	tenant-parauapebas-001	srv-001	4	2024	Abril/2024	6727.5	2539.7275	4187.7725	pago	Analista de Sistemas	SEMGOV - Secretaria Municipal de Gestão	III	2026-03-26 15:31:07.789321
7939af9c-a4fd-4353-9dc2-8f69cc76e75f	tenant-parauapebas-001	srv-002	3	2026	Março/2026	3680	1050	2630	pendente	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:31:07.811351
7bc0d1d3-4fe1-4107-a91a-c57ffeb7ceaa	tenant-parauapebas-001	srv-002	2	2026	Fevereiro/2026	3680	1050	2630	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:31:07.833792
d00cadaa-d9a3-46b0-8eab-5a2a26ec484e	tenant-parauapebas-001	srv-002	1	2026	Janeiro/2026	3680	1050	2630	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:31:07.856105
ff29ede4-099c-4b7c-b671-f945e1e6d136	tenant-parauapebas-001	srv-002	12	2025	Dezembro/2025	3680	1050	2630	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:31:07.878436
1e5969a4-1108-4518-b2fa-ab6b35b08eda	tenant-parauapebas-001	srv-002	11	2025	Novembro/2025	3680	1050	2630	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:31:07.902147
1ee72560-d11f-4a94-92cf-a344bca4ba0f	tenant-parauapebas-001	srv-002	10	2025	Outubro/2025	3680	1050	2630	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:31:07.925293
e728c5eb-faec-4e93-9383-9c1fa1cc8f10	tenant-parauapebas-001	srv-002	9	2025	Setembro/2025	3680	1050	2630	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:31:07.947113
05edd39d-f355-4df6-a813-26339565dfab	tenant-parauapebas-001	srv-002	8	2025	Agosto/2025	3680	1050	2630	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:31:07.968909
b5bfbc1a-6467-439d-b880-2d6fbd7566d1	tenant-parauapebas-001	srv-002	7	2025	Julho/2025	4736	1402	3334	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:31:07.990256
61b26c61-0e3f-48dd-9b0f-ab46f1602763	tenant-parauapebas-001	srv-002	6	2025	Junho/2025	3680	1050	2630	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:31:08.013477
782da821-ab95-499c-b206-eae0293d3658	tenant-parauapebas-001	srv-002	5	2025	Maio/2025	3680	1050	2630	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:31:08.035606
0f670e90-0081-40ad-99c7-621eda1b79a9	tenant-parauapebas-001	srv-002	4	2025	Abril/2025	3680	1050	2630	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:31:08.057765
ee5f1521-138f-4d2b-adde-f4cbf2409e88	tenant-parauapebas-001	srv-002	3	2025	Março/2025	3680	1050	2630	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:31:08.079223
f223dfbb-af24-4c09-a305-a9732e62891e	tenant-parauapebas-001	srv-002	2	2025	Fevereiro/2025	3680	1050	2630	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:31:08.101621
3ee1ed03-3d66-4449-889e-3568ece9ad98	tenant-parauapebas-001	srv-002	1	2025	Janeiro/2025	3680	1050	2630	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:31:08.124889
60e2c3ab-900e-43c8-a021-5e01bbf7e3fb	tenant-parauapebas-001	srv-002	12	2024	Dezembro/2024	3680	1050	2630	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:31:08.14571
a4d1cfda-5aa5-410d-a18b-4f8944380d3d	tenant-parauapebas-001	srv-002	11	2024	Novembro/2024	3680	1050	2630	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:31:08.167473
37fcc065-1e17-4a9f-bdb5-46dd655ed790	tenant-parauapebas-001	srv-002	10	2024	Outubro/2024	3680	1050	2630	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:31:08.188767
165bb1af-bc78-474f-99f8-13fd2d7310fd	tenant-parauapebas-001	srv-002	9	2024	Setembro/2024	3680	1050	2630	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:31:08.213102
5aef99f4-fb79-460f-b696-d0a85490429e	tenant-parauapebas-001	srv-002	8	2024	Agosto/2024	3680	1050	2630	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:31:08.234311
6137d7d6-028b-4e3c-8bb9-05d529b79ceb	tenant-parauapebas-001	srv-002	7	2024	Julho/2024	4736	1402	3334	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:31:08.260783
c3c61131-497e-4e90-a899-f33d78360a19	tenant-parauapebas-001	srv-002	6	2024	Junho/2024	3680	1050	2630	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:31:08.29
fe38c761-7ce0-488e-b8fd-77315030bd15	tenant-parauapebas-001	srv-002	5	2024	Maio/2024	3680	1050	2630	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:31:08.314345
fb3cd068-b483-413e-bbda-379c19346b37	tenant-parauapebas-001	srv-002	4	2024	Abril/2024	3680	1050	2630	pago	Assistente Administrativo	SEMFAZ - Secretaria Municipal de Fazenda	II	2026-03-26 15:31:08.340533
1977f9b2-c446-4d22-b7d3-6ca3b02c76f1	tenant-parauapebas-001	srv-003	3	2026	Março/2026	4715	1519.915	3195.085	pendente	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:31:08.365714
8e4747fb-f51b-4316-8794-2dfa2917d2e3	tenant-parauapebas-001	srv-003	2	2026	Fevereiro/2026	4715	1519.915	3195.085	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:31:08.387644
3446ab10-2f90-4887-a538-5f11aa7799a3	tenant-parauapebas-001	srv-003	1	2026	Janeiro/2026	4715	1519.915	3195.085	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:31:08.415851
5a67716f-0fe6-497f-9bc2-eaf9d979ed1b	tenant-parauapebas-001	srv-003	12	2025	Dezembro/2025	4715	1519.915	3195.085	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:31:08.44453
42214891-c204-4b0e-82d1-630dd1c9cde1	tenant-parauapebas-001	srv-003	11	2025	Novembro/2025	4715	1519.915	3195.085	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:31:08.466036
ff4a9132-2629-4930-8740-e726d2214e90	tenant-parauapebas-001	srv-003	10	2025	Outubro/2025	4715	1519.915	3195.085	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:31:08.487411
029b1ae5-1f2e-4b17-af19-9b656e211629	tenant-parauapebas-001	srv-003	9	2025	Setembro/2025	4715	1519.915	3195.085	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:31:08.514843
1f900ca8-fb05-4f2a-bf45-591f426d1c80	tenant-parauapebas-001	srv-003	8	2025	Agosto/2025	4715	1519.915	3195.085	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:31:08.540418
81a0a679-9121-4549-bdda-64282ea71414	tenant-parauapebas-001	srv-003	7	2025	Julho/2025	6068	2040.82	4027.18	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:31:08.579106
fc4e68b1-0a9e-45f9-ac17-c461bdc14577	tenant-parauapebas-001	srv-003	6	2025	Junho/2025	4715	1519.915	3195.085	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:31:08.607395
1b131f19-7a7c-4936-af12-024de1b5b4ca	tenant-parauapebas-001	srv-003	5	2025	Maio/2025	4715	1519.915	3195.085	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:31:08.629149
23ad0e3a-f017-4941-ab25-490a35c6ac0b	tenant-parauapebas-001	srv-003	4	2025	Abril/2025	4715	1519.915	3195.085	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:31:08.653051
677b1fba-d109-400c-92b1-1b56956e9717	tenant-parauapebas-001	srv-003	3	2025	Março/2025	4715	1519.915	3195.085	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:31:08.675512
50d73210-c15d-438f-adbf-74be53f6c11c	tenant-parauapebas-001	srv-003	2	2025	Fevereiro/2025	4715	1519.915	3195.085	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:31:08.703835
ecf24193-3d2a-4abd-946f-661b52ac9159	tenant-parauapebas-001	srv-003	1	2025	Janeiro/2025	4715	1519.915	3195.085	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:31:08.726223
5e2832f5-492b-4c50-8b24-019bb1267774	tenant-parauapebas-001	srv-003	12	2024	Dezembro/2024	4715	1519.915	3195.085	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:31:08.749128
cbf69bc0-a49f-4dd3-8efa-93c4579f2a9c	tenant-parauapebas-001	srv-003	11	2024	Novembro/2024	4715	1519.915	3195.085	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:31:08.77173
157b3727-7d29-411a-af4d-5d4e578ae8a9	tenant-parauapebas-001	srv-003	10	2024	Outubro/2024	4715	1519.915	3195.085	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:31:08.79309
c52d70ae-da90-47e9-9dd3-3f4950dac11e	tenant-parauapebas-001	srv-003	9	2024	Setembro/2024	4715	1519.915	3195.085	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:31:08.815551
2aee76ec-cb1d-472d-9637-cda0c45e413d	tenant-parauapebas-001	srv-003	8	2024	Agosto/2024	4715	1519.915	3195.085	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:31:08.8382
e2e9d8b2-8bbc-4fd1-bfec-7e23092d00db	tenant-parauapebas-001	srv-003	7	2024	Julho/2024	6068	2040.82	4027.18	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:31:08.862123
3231a60d-471d-4612-b66f-9975131e1b99	tenant-parauapebas-001	srv-003	6	2024	Junho/2024	4715	1519.915	3195.085	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:31:08.886428
3506bd00-e020-47ca-8680-4ee281a3552e	tenant-parauapebas-001	srv-003	5	2024	Maio/2024	4715	1519.915	3195.085	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:31:08.906894
6865babc-5b3b-4bcd-bec9-8b76191a33cc	tenant-parauapebas-001	srv-003	4	2024	Abril/2024	4715	1519.915	3195.085	pago	Professora Municipal	SEMEC - Secretaria Municipal de Educação	I	2026-03-26 15:31:08.928641
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
-- Data for Name: fale_conosco_config; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fale_conosco_config (id, tenant_id, habilitado, nome_assistente, saudacao, system_prompt, modelo_ia, temperatura, max_tokens, avatar_url, cor_botao, tema_widget, canais_ativos, topicos_proibidos, mensagem_offline, updated_at) FROM stdin;
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
-- Data for Name: historico_funcional; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historico_funcional (id, servidor_id, data, tipo, descricao, portaria, portaria_url, despacho, secretaria_destino, cargo_apos, observacoes, created_at) FROM stdin;
77c2415a-b10c-4aad-a7f6-9982708b180a	srv-001	2019-03-01	ingresso	Ingresso no serviço público por concurso	Portaria 001/2019	\N	\N	\N	Analista de Sistemas Nível I-A	\N	2026-03-26 15:15:28.542443
6dc6d115-234d-4f78-a23c-0591025f04e5	srv-001	2021-03-01	progressao	Progressão por tempo de serviço — Nível I-B	Portaria 045/2021	\N	\N	\N	Analista de Sistemas Nível I-B	\N	2026-03-26 15:15:28.545123
2acf3ea9-8674-44ae-88c9-4b265150b10b	srv-001	2022-08-10	remocao	Remoção a pedido para SEMGOV	Portaria 120/2022	\N	\N	SEMGOV - Secretaria Municipal de Gestão	Analista de Sistemas Nível I-B	\N	2026-03-26 15:15:28.547768
21bb7585-bd76-4c27-9c43-b8d8112fd085	srv-001	2023-03-01	progressao	Progressão por tempo de serviço — Nível III-B	Portaria 033/2023	\N	\N	\N	Analista de Sistemas Nível III-B	\N	2026-03-26 15:15:28.550182
1e51ff82-040f-49cb-90fa-0c31e75bebee	srv-002	2015-06-15	ingresso	Ingresso no serviço público por concurso	Portaria 087/2015	\N	\N	\N	Assistente Administrativo Nível I-A	\N	2026-03-26 15:15:28.55245
10e81144-06ff-4b34-a21e-046c3cef9bab	srv-002	2017-06-15	progressao	Progressão por tempo de serviço — Nível I-B	Portaria 112/2017	\N	\N	\N	Assistente Administrativo Nível I-B	\N	2026-03-26 15:15:28.554591
875880ec-b370-4379-94d5-67b383ef8cfc	srv-002	2019-06-15	progressao	Progressão por tempo de serviço — Nível II-A	Portaria 098/2019	\N	\N	\N	Assistente Administrativo Nível II-A	\N	2026-03-26 15:15:28.556936
3583eb5e-f240-4a0c-9b9f-cd29276468b5	srv-002	2021-06-15	progressao	Progressão por mérito — Nível II-B	Portaria 077/2021	\N	\N	\N	Assistente Administrativo Nível II-B	\N	2026-03-26 15:15:28.55961
b3fdd714-3d52-4350-92d0-193e9eb333da	srv-003	2021-02-01	ingresso	Ingresso no serviço público por concurso — Professor	Portaria 042/2021	\N	\N	\N	Professora Municipal Nível I-A	\N	2026-03-26 15:15:28.561727
77d8424f-dfeb-4f03-a19e-fd6de510ecc6	srv-003	2023-02-01	progressao	Progressão por tempo de serviço — Nível I-B	Portaria 018/2023	\N	\N	\N	Professora Municipal Nível I-B	\N	2026-03-26 15:15:28.564575
778d03f3-ecd0-4de2-914c-155ed4333717	srv-003	2024-07-20	afastamento	Afastamento para capacitação — Especialização em Pedagogia	Portaria 200/2024	\N	\N	\N	Professora Municipal Nível I-B	\N	2026-03-26 15:15:28.567423
805b3122-5643-4128-809a-62a1e259f3ea	srv-003	2025-01-10	retorno	Retorno de afastamento para capacitação	Portaria 005/2025	\N	\N	\N	Professora Municipal Nível I-C	\N	2026-03-26 15:15:28.570235
9e0e2277-53d9-4c44-a89c-1364575c5074	srv-001	2019-03-01	ingresso	Ingresso no serviço público por concurso	Portaria 001/2019	\N	\N	\N	Analista de Sistemas Nível I-A	\N	2026-03-26 15:31:08.959284
b47ba060-3470-4d6b-b8fd-9f273b1c9152	srv-001	2021-03-01	progressao	Progressão por tempo de serviço — Nível I-B	Portaria 045/2021	\N	\N	\N	Analista de Sistemas Nível I-B	\N	2026-03-26 15:31:08.961916
22a9a956-b302-4212-a3a4-57c4a7ae7185	srv-001	2022-08-10	remocao	Remoção a pedido para SEMGOV	Portaria 120/2022	\N	\N	SEMGOV - Secretaria Municipal de Gestão	Analista de Sistemas Nível I-B	\N	2026-03-26 15:31:08.964785
0c0524d3-26c6-4c46-ba57-51c12c6cdc9a	srv-001	2023-03-01	progressao	Progressão por tempo de serviço — Nível III-B	Portaria 033/2023	\N	\N	\N	Analista de Sistemas Nível III-B	\N	2026-03-26 15:31:08.967114
a23c0260-010d-4d53-a5ae-ef183be1b069	srv-002	2015-06-15	ingresso	Ingresso no serviço público por concurso	Portaria 087/2015	\N	\N	\N	Assistente Administrativo Nível I-A	\N	2026-03-26 15:31:08.969504
5af2d5cb-978b-4658-876e-bc394c32e17c	srv-002	2017-06-15	progressao	Progressão por tempo de serviço — Nível I-B	Portaria 112/2017	\N	\N	\N	Assistente Administrativo Nível I-B	\N	2026-03-26 15:31:08.971638
eeb792e6-d41a-40be-ae97-9733185a0f1a	srv-002	2019-06-15	progressao	Progressão por tempo de serviço — Nível II-A	Portaria 098/2019	\N	\N	\N	Assistente Administrativo Nível II-A	\N	2026-03-26 15:31:08.973691
a8821719-5555-48ac-8ecb-c7ef5bfb83ee	srv-002	2021-06-15	progressao	Progressão por mérito — Nível II-B	Portaria 077/2021	\N	\N	\N	Assistente Administrativo Nível II-B	\N	2026-03-26 15:31:08.97565
8269d2d1-2cbe-4b7b-8a5d-ffc7682a1744	srv-003	2021-02-01	ingresso	Ingresso no serviço público por concurso — Professor	Portaria 042/2021	\N	\N	\N	Professora Municipal Nível I-A	\N	2026-03-26 15:31:08.977958
7435543c-be03-4570-a5ff-a4e13b304dac	srv-003	2023-02-01	progressao	Progressão por tempo de serviço — Nível I-B	Portaria 018/2023	\N	\N	\N	Professora Municipal Nível I-B	\N	2026-03-26 15:31:08.980773
5e93ab9c-5c4e-47fa-86c7-46c14ca9b44d	srv-003	2024-07-20	afastamento	Afastamento para capacitação — Especialização em Pedagogia	Portaria 200/2024	\N	\N	\N	Professora Municipal Nível I-B	\N	2026-03-26 15:31:08.983131
3de8a44b-0279-4d33-98b9-4ef9c2fe9e72	srv-003	2025-01-10	retorno	Retorno de afastamento para capacitação	Portaria 005/2025	\N	\N	\N	Professora Municipal Nível I-C	\N	2026-03-26 15:31:08.985932
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
-- Data for Name: manifestacoes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.manifestacoes (id, tenant_id, protocolo, tipo, status, prioridade, nome_cidadao, email_cidadao, telefone_cidadao, cpf_cidadao, is_anonimo, assunto, descricao, secretaria_id, categoria_id, prazo, resolvida_em, atribuida_a_em, lgpd_consent, origem, noticias_relacionadas, created_at, updated_at) FROM stdin;
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
-- Data for Name: ouvidoria_estatisticas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ouvidoria_estatisticas (id, tenant_id, periodo, total_manifestacoes, resolvidas, em_andamento, no_prazo, fora_prazo, por_tipo, created_at) FROM stdin;
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
-- Data for Name: periodos_aquisitivos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.periodos_aquisitivos (id, servidor_id, data_inicio, data_fim, dias_direito, dias_gozados, dias_vendidos, dias_saldo, prazo_limite, status, created_at) FROM stdin;
pa-001-1	srv-001	2023-03-01	2024-02-29	30	30	0	0	2025-02-28	esgotado	2026-03-26 15:15:28.509557
pa-001-2	srv-001	2024-03-01	2025-02-28	30	0	10	20	2026-02-28	disponivel	2026-03-26 15:15:28.512197
pa-002-1	srv-002	2021-06-15	2022-06-14	30	30	0	0	2023-06-14	esgotado	2026-03-26 15:15:28.514478
pa-002-2	srv-002	2022-06-15	2023-06-14	30	20	0	10	2024-06-14	vencido	2026-03-26 15:15:28.517081
pa-002-3	srv-002	2023-06-15	2024-06-14	30	0	0	30	2025-06-14	disponivel	2026-03-26 15:15:28.519169
pa-003-1	srv-003	2022-02-01	2023-01-31	30	15	0	15	2024-01-31	disponivel	2026-03-26 15:15:28.521642
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
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refresh_tokens (id, usuario_id, token, expires_at, created_at) FROM stdin;
a28f5ead-cc7d-435a-ba9b-faafa421213a	usr-srv-001	4c5660fc-0f90-4a26-8d1f-fc1c4805d93f	2026-04-25 15:32:43.118	2026-03-26 15:32:43.119051
f060a1be-ceac-4f63-9397-054268911df6	usr-srv-001	ab4ee24f-eb99-46fb-af29-6f6b0335788f	2026-04-25 15:32:53.282	2026-03-26 15:32:53.28297
d303c2d8-f658-4a7f-a55e-482fc9fb8bb3	usr-srv-001	e9d46d90-a557-4255-9099-809eab51a53e	2026-04-25 15:36:33.848	2026-03-26 15:36:33.849521
4ef9dd30-722a-4663-845e-7b512b02f722	8d7e0368-068a-40e7-af57-3ab72403d82d	c2f02ac1-b22a-4cb0-9e0b-03d61692dc9d	2026-04-25 15:36:34.438	2026-03-26 15:36:34.438948
272a767a-67b9-4bb8-a5ff-63becad07760	8d7e0368-068a-40e7-af57-3ab72403d82d	c8ecd309-9498-4bc4-ac1b-a85f0df17807	2026-04-25 15:36:40.141	2026-03-26 15:36:40.14182
590b5f1e-6ee6-4e93-b781-15f5f7a72f86	8d7e0368-068a-40e7-af57-3ab72403d82d	b1da7269-b6fa-4f7c-b72a-45c9fa8b2aa1	2026-04-25 15:37:34.723	2026-03-26 15:37:34.723995
400dadd4-301e-462a-99c3-befde99dce1a	usr-srv-001	b811a0a8-b344-4e60-a621-9d55ce4b07d5	2026-04-25 15:37:34.967	2026-03-26 15:37:34.967627
c2f89683-f6c3-444e-a90a-5a4a227f03fa	usr-srv-001	acb1b209-945d-4049-90b2-96dee290f052	2026-04-25 15:37:41.92	2026-03-26 15:37:41.920913
bb6a4769-b986-4f1a-ae11-bdeb951f5925	usr-srv-001	82c43b2c-d2a2-4550-aff0-01a8d4d42578	2026-04-25 15:37:46.402	2026-03-26 15:37:46.402711
94da5a9b-7f98-41a2-a230-fa2a25a1afd6	usr-srv-001	c9bcfd5e-fcfc-443a-aa67-7a68aaf09cdc	2026-04-25 15:37:53.777	2026-03-26 15:37:53.777372
dd1c02bb-9cb3-4655-9e01-0a06a4543858	usr-srv-001	ee258b1c-e04c-4a94-9f13-b6900e42d937	2026-04-25 15:37:58.018	2026-03-26 15:37:58.018978
255b8fc6-5aec-4fde-a733-8ddbbcc6a9f8	usr-srv-001	c5bced65-78b4-4b6d-a79d-08daa2f3d3ee	2026-04-25 15:38:16.199	2026-03-26 15:38:16.199373
\.


--
-- Data for Name: requerimentos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.requerimentos (id, tenant_id, servidor_id, protocolo, tipo, assunto, justificativa, campos_especificos, documentos, status, timeline, parecer_tecnico, decisao, motivo_decisao, decisor_nome, decidido_em, prazo_recurso, recurso_apresentado, created_at, updated_at, despacho) FROM stdin;
req-001	tenant-parauapebas-001	srv-001	REQ-2025-000001	progressao-funcional	Progressão Funcional por Mérito	Solicito progressão funcional por mérito conforme Art. 45 do Estatuto Municipal. Completei 3 anos no nível atual sem progressão, atendendo todos os requisitos legais, incluindo avaliação de desempenho positiva nos últimos dois biênios e ausência de punições disciplinares no período.	{"nivelAtual": "III-B", "anoAvaliacao": 2024, "nivelSolicitado": "III-C"}	[{"url": "/docs/avaliacao.pdf", "nome": "Avaliacao_Desempenho_2024.pdf", "tamanho": 245000}, {"url": "/docs/ficha.pdf", "nome": "Ficha_Funcional.pdf", "tamanho": 180000}]	deferido	[{"data": "2025-01-10T09:00:00Z", "status": "protocolado", "descricao": "Requerimento protocolado", "responsavel": "Ana Paula Ferreira Costa"}, {"data": "2025-01-15T11:00:00Z", "status": "em_analise", "descricao": "Em análise pelo RH", "responsavel": "RH SEMGOV"}, {"data": "2025-02-15T14:00:00Z", "status": "deferido", "descricao": "Requerimento deferido", "responsavel": "Chefe de RH - SEMGOV"}]	Servidor atende todos os requisitos legais para progressão funcional. Documentação completa e regular.	Deferido	Aprovado conforme análise da documentação e cumprimento dos requisitos estatutários.	Chefe de RH - SEMGOV	2025-02-15 00:00:00	\N	f	2026-03-26 15:15:28.533664	2026-03-26 15:15:28.533664	\N
req-002	tenant-parauapebas-001	srv-002	REQ-2026-000001	certidao-tempo-servico	Certidão de Tempo de Serviço	Solicito emissão de certidão de tempo de serviço para fins de aposentadoria proporcional junto ao INSS. Necessito da certidão para instrução de processo administrativo no INSS referente à contagem de tempo de serviço no setor público municipal, conforme exigido pelo Decreto 3.048/99.	{"finalidade": "aposentadoria", "orgaoDestino": "INSS"}	[]	em_analise	[{"data": "2026-03-18T10:30:00Z", "status": "protocolado", "descricao": "Requerimento protocolado", "responsavel": "Carlos Eduardo Mendes Silva"}, {"data": "2026-03-19T08:00:00Z", "status": "em_analise", "descricao": "Em análise pelo setor de RH", "responsavel": "RH SEMFAZ"}]	\N	\N	\N	\N	\N	\N	f	2026-03-26 15:15:28.536452	2026-03-26 15:15:28.536452	\N
req-003	tenant-parauapebas-001	srv-003	REQ-2025-000050	licenca-saude	Licença para Tratamento de Saúde	Solicito licença para tratamento de saúde conforme atestado médico em anexo. Estou em tratamento de saúde que requer repouso absoluto por 30 dias, conforme recomendação médica do Dr. Roberto Alves, CRM 12345-PA, especialista em ortopedia, em decorrência de procedimento cirúrgico realizado no joelho direito.	{"cid": "M17.1", "crm": "12345-PA", "medico": "Dr. Roberto Alves", "diasSolicitados": 30}	[{"url": "/docs/atestado.pdf", "nome": "Atestado_Medico.pdf", "tamanho": 95000}, {"url": "/docs/laudo.pdf", "nome": "Laudo_Cirurgico.pdf", "tamanho": 210000}]	indeferido	[{"data": "2025-11-01T08:00:00Z", "status": "protocolado", "descricao": "Requerimento protocolado", "responsavel": "Fernanda Lima Rodrigues"}, {"data": "2025-11-05T10:00:00Z", "status": "em_analise", "descricao": "Em análise pela perícia médica", "responsavel": "Junta Médica Municipal"}, {"data": "2025-11-20T16:00:00Z", "status": "indeferido", "descricao": "Indeferido por documentação insuficiente", "responsavel": "Médico Perito Municipal"}]	Documentação incompleta. Necessário apresentar laudo de junta médica oficial do município.	Indeferido	Atestado médico particular não aceito. Obrigatória perícia pela junta médica municipal.	Médico Perito Municipal	2025-11-20 00:00:00	2025-12-05	f	2026-03-26 15:15:28.539513	2026-03-26 15:15:28.539513	\N
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
-- Data for Name: servidores_cadastro; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.servidores_cadastro (id, tenant_id, nome, cpf, matricula, email, email_pessoal, telefone, data_nascimento, cargo, codigo_cargo, nivel, referencia, vinculo, status, data_ingresso, data_concurso, concurso_origem, secretaria, local_trabalho, banco, agencia, conta, tipo_conta, endereco, numero, complemento, bairro, cidade, estado, cep, salario_base, dependentes, created_at, updated_at) FROM stdin;
srv-001	tenant-parauapebas-001	Ana Paula Ferreira Costa	12345678901	2019.001	ana.costa@parauapebas.pa.gov.br	ana.costa@gmail.com	(94) 99123-4567	1985-03-15	Analista de Sistemas	TI-003	III	B	estatutario	ativo	2019-03-01	\N	Concurso Público 001/2019	SEMGOV - Secretaria Municipal de Gestão	Prefeitura Municipal - Bloco A	Banco do Brasil	1234-5	00012345-6	corrente	Rua das Palmeiras	123	\N	Centro	Parauapebas	PA	68515-000	5850	[{"nome": "Lucas Costa", "parentesco": "filho", "dataNascimento": "2010-08-20"}]	2026-03-26 15:15:26.84417	2026-03-26 15:15:26.84417
srv-002	tenant-parauapebas-001	Carlos Eduardo Mendes Silva	98765432100	2015.087	carlos.silva@parauapebas.pa.gov.br	carlos.mendes@hotmail.com	(94) 99234-5678	1978-11-22	Assistente Administrativo	ADM-001	II	A	estatutario	ativo	2015-06-15	\N	Concurso Público 003/2015	SEMFAZ - Secretaria Municipal de Fazenda	Secretaria de Fazenda - Sala 205	Caixa Econômica Federal	0987	00098765-3	corrente	Avenida das Acácias	456	\N	Parque dos Carajás	Parauapebas	PA	68516-000	3200	[{"nome": "Maria Silva", "parentesco": "cônjuge", "dataNascimento": "1980-05-10"}, {"nome": "Pedro Silva", "parentesco": "filho", "dataNascimento": "2008-02-14"}, {"nome": "Sofia Silva", "parentesco": "filha", "dataNascimento": "2012-09-30"}]	2026-03-26 15:15:26.851206	2026-03-26 15:15:26.851206
srv-003	tenant-parauapebas-001	Fernanda Lima Rodrigues	45678901234	2021.042	fernanda.rodrigues@parauapebas.pa.gov.br	fern.lima@yahoo.com.br	(94) 99345-6789	1992-07-08	Professora Municipal	EDU-002	I	C	estatutario	ativo	2021-02-01	\N	Concurso Público 002/2020	SEMEC - Secretaria Municipal de Educação	EMEF Prof. João Paulo II	Bradesco	2233	00045678-9	corrente	Travessa das Mangueiras	789	\N	Novo Brasil	Parauapebas	PA	68517-000	4100	[]	2026-03-26 15:15:26.855884	2026-03-26 15:15:26.855884
\.


--
-- Data for Name: sic_pedidos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sic_pedidos (id, tenant_id, protocolo, nome, cpf, email, telefone, tipo_solicitacao, orgao, descricao, formata_resposta, status, resposta, prazo, respondido_em, lgpd_consent, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: site_config; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.site_config (id, tenant_id, hero_type, hero_video_url, hero_sections, site_title, site_description, google_analytics_id, google_tag_manager_id, social_facebook, social_instagram, social_youtube, social_twitter, social_linkedin, floating_widget_enabled, floating_widget_position, vlibras_enabled, rodape_texto, sic_prazo_resposta, sic_email, modo_manutencao, modo_manutencao_msg, updated_at) FROM stdin;
73ba9806-d234-47ec-8b5b-d40fda7ab5ae	tenant-parauapebas-001	carousel	\N	[]	Prefeitura Municipal de Parauapebas	Portal oficial da Prefeitura Municipal de Parauapebas — Pará	\N	\N	https://facebook.com/prefeituraparauapebas	https://instagram.com/prefeituraparauapebas	https://youtube.com/@prefeituraparauapebas	\N	\N	t	right	t	Prefeitura Municipal de Parauapebas — CNPJ: 34.070.421/0001-60 — Av. Presidente Médici, 1246 - Centro — (94) 3346-0000	20	sic@parauapebas.pa.gov.br	f	\N	2026-03-26 00:10:29.792
\.


--
-- Data for Name: solicitacoes_ferias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.solicitacoes_ferias (id, tenant_id, servidor_id, periodo_aquisitivo_id, protocolo, data_inicio, data_fim, data_retorno, qtd_dias, parcelamento, adiantamento_13, abono_pecuniario, dias_abono, status, timeline, aprovado_por, aprovado_em, motivo_rejeicao, created_at, updated_at) FROM stdin;
sf-001	tenant-parauapebas-001	srv-001	pa-001-2	FER-2025-000001	2025-07-07	2025-07-26	2025-07-27	20	1	f	f	0	aprovado	[{"data": "2025-05-15T10:00:00Z", "status": "protocolado", "descricao": "Solicitação registrada pelo servidor", "responsavel": "Ana Paula Ferreira Costa"}, {"data": "2025-05-16T09:00:00Z", "status": "em_analise_chefia", "descricao": "Em análise pela chefia imediata", "responsavel": "João Diretor"}, {"data": "2025-05-20T14:00:00Z", "status": "em_analise_rh", "descricao": "Em análise pelo RH", "responsavel": "RH SEMGOV"}, {"data": "2025-06-01T11:00:00Z", "status": "aprovado", "descricao": "Férias aprovadas pelo RH", "responsavel": "Maria Gestão RH"}]	Maria Gestão RH	2025-06-01 00:00:00	\N	2026-03-26 15:15:28.524357	2026-03-26 15:15:28.524357
sf-002	tenant-parauapebas-001	srv-002	pa-002-3	FER-2025-000002	2025-08-04	2025-09-02	2025-09-03	30	1	t	f	0	aguardando_chefia	[{"data": "2026-03-20T08:30:00Z", "status": "protocolado", "descricao": "Solicitação registrada pelo servidor", "responsavel": "Carlos Eduardo Mendes Silva"}]	\N	\N	\N	2026-03-26 15:15:28.527895	2026-03-26 15:15:28.527895
sf-003	tenant-parauapebas-001	srv-003	pa-003-1	FER-2025-000003	2025-06-02	2025-06-16	2025-06-17	15	1	f	f	0	rejeitado	[{"data": "2025-05-01T09:00:00Z", "status": "protocolado", "descricao": "Solicitação registrada pelo servidor", "responsavel": "Fernanda Lima Rodrigues"}, {"data": "2025-05-02T10:00:00Z", "status": "em_analise_chefia", "descricao": "Em análise pela diretora escolar", "responsavel": "Diretora Escola"}, {"data": "2025-05-05T15:00:00Z", "status": "rejeitado", "descricao": "Período conflita com calendário letivo", "responsavel": "Diretora Escola"}]	\N	\N	Período solicitado conflita com calendário letivo. Solicitar período alternativo.	2026-03-26 15:15:28.530492	2026-03-26 15:15:28.530492
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
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, tenant_id, nome, email, senha_hash, cargo, avatar, modulos_permitidos, permissoes, is_admin, is_ativo, ultimo_acesso, created_at, updated_at, servidor_id) FROM stdin;
usr-srv-002	tenant-parauapebas-001	Carlos Eduardo Santos Lima	carlos.lima@parauapebas.pa.gov.br	d6568c3ad655f35d123a10116efb2d8c:268a838ab80980f0393eac34eaf30494e991f86964ad21e156e8198637012eec	Assistente Administrativo	\N	{servidor}	{}	f	t	\N	2026-03-26 15:31:08.99399	2026-03-26 15:31:08.99399	srv-002
usr-srv-003	tenant-parauapebas-001	Maria Lucia Rodrigues Sousa	maria.sousa@parauapebas.pa.gov.br	760b93751449d61544f5463969bba68a:ec757cdf2b4b121cd68ed110144de607980f5e0a1ac2f8b987d6a4dfc4290622	Professora Municipal	\N	{servidor}	{}	f	t	\N	2026-03-26 15:31:08.996571	2026-03-26 15:31:08.996571	srv-003
8d7e0368-068a-40e7-af57-3ab72403d82d	tenant-parauapebas-001	Admin Municipal	admin@parauapebas.pa.gov.br	ce3ce488e07a9353639a22bf0739c555:10e4598d33a34ad1ed9ce9a58a2d685997e32f7d29cec2f6381a5c18634dffd8	Administrador	\N	{site,ouvidoria}	{}	t	t	2026-03-26 15:37:34.713	2026-03-26 15:36:34.429154	2026-03-26 15:36:34.429154	\N
usr-srv-001	tenant-parauapebas-001	Ana Paula Ferreira Costa	ana.costa@parauapebas.pa.gov.br	4d4b32fc649a71d550e97d71646fd15b:9b462b15e3fd8dad9e86fef446308c63d524fcb561c5a841400fb7c14f391b4f	Analista de Sistemas	\N	{servidor}	{}	f	t	2026-03-26 15:38:16.195	2026-03-26 15:31:08.990685	2026-03-26 15:31:08.990685	srv-001
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

\unrestrict s3y66XDbRnYlSCg37LwonLd6EBMx9N4OtV4NlAXC3VzDaJ3tibagCTogLAwpBZV

