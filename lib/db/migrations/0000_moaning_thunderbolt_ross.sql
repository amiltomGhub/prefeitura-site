CREATE TABLE "gestores" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"nome" text NOT NULL,
	"cargo" text NOT NULL,
	"partido" text,
	"mandato" text,
	"foto" text,
	"bio" text,
	"email" text,
	"redes_sociais" jsonb,
	"ativo" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "municipio_info" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"nome" text NOT NULL,
	"estado" text NOT NULL,
	"regiao" text NOT NULL,
	"populacao" integer DEFAULT 0 NOT NULL,
	"area" real DEFAULT 0 NOT NULL,
	"altitude" real,
	"idh" real,
	"pib" real,
	"historia" text,
	"simbolos" jsonb,
	"localizacao" jsonb,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tenants" (
	"id" text PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"slug" text NOT NULL,
	"brasao" text,
	"cor_primaria" text DEFAULT '#1351B4' NOT NULL,
	"cor_secundaria" text DEFAULT '#168821' NOT NULL,
	"cor_terciaria" text DEFAULT '#FFCD07' NOT NULL,
	"estado" text NOT NULL,
	"populacao" integer DEFAULT 0 NOT NULL,
	"area" real DEFAULT 0 NOT NULL,
	"fundacao" text DEFAULT '' NOT NULL,
	"lema" text,
	"site_url" text DEFAULT '' NOT NULL,
	"modulos_ativos" text[] DEFAULT '{"site","ouvidoria"}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tenants_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "news_categories" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"color" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "news_versions" (
	"id" text PRIMARY KEY NOT NULL,
	"noticia_id" text NOT NULL,
	"conteudo" text NOT NULL,
	"saved_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "noticias" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"titulo" text NOT NULL,
	"slug" text NOT NULL,
	"resumo" text NOT NULL,
	"conteudo" text NOT NULL,
	"imagem_capa" text,
	"imagem_capa_alt" text,
	"categoria" text NOT NULL,
	"categoria_id" text,
	"secretaria_id" text,
	"autor" text,
	"status" text DEFAULT 'rascunho' NOT NULL,
	"publicado" boolean DEFAULT true NOT NULL,
	"destaque" boolean DEFAULT false NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"visualizacoes" integer DEFAULT 0 NOT NULL,
	"meta_title" text,
	"meta_description" text,
	"og_image_url" text,
	"data_publicacao" timestamp DEFAULT now() NOT NULL,
	"agendado_em" timestamp,
	"deletado_em" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "servicos" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"titulo" text NOT NULL,
	"slug" text NOT NULL,
	"descricao" text NOT NULL,
	"categoria" text NOT NULL,
	"orgao" text,
	"link_externo" text,
	"requisitos" text[] DEFAULT '{}' NOT NULL,
	"documentos" text[] DEFAULT '{}' NOT NULL,
	"prazo_atendimento" text,
	"gratuito" boolean DEFAULT true NOT NULL,
	"online" boolean DEFAULT false NOT NULL,
	"icone" text,
	"ativo" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "secretarias" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"nome" text NOT NULL,
	"slug" text NOT NULL,
	"sigla" text NOT NULL,
	"descricao" text NOT NULL,
	"secretario" text,
	"foto_secretario" text,
	"telefone" text,
	"email" text,
	"endereco" text,
	"horario" text,
	"competencias" text[] DEFAULT '{}' NOT NULL,
	"ativa" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "despesas" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"data" date NOT NULL,
	"descricao" text NOT NULL,
	"secretaria" text NOT NULL,
	"categoria" text NOT NULL,
	"valor" real NOT NULL,
	"beneficiario" text,
	"empenho" text,
	"modalidade" text,
	"ano" integer NOT NULL,
	"mes" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orcamentos" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"ano" integer NOT NULL,
	"receita_prevista" real DEFAULT 0 NOT NULL,
	"receita_realizada" real DEFAULT 0 NOT NULL,
	"despesa_prevista" real DEFAULT 0 NOT NULL,
	"despesa_realizada" real DEFAULT 0 NOT NULL,
	"saldo_atual" real DEFAULT 0 NOT NULL,
	"categorias" text DEFAULT '[]' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "receitas" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"data" date NOT NULL,
	"descricao" text NOT NULL,
	"fonte" text NOT NULL,
	"categoria" text NOT NULL,
	"valor" real NOT NULL,
	"ano" integer NOT NULL,
	"mes" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "servidores" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"nome" text NOT NULL,
	"cargo" text NOT NULL,
	"secretaria" text NOT NULL,
	"vinculo" text NOT NULL,
	"remuneracao" real,
	"admissao" date,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bid_events" (
	"id" text PRIMARY KEY NOT NULL,
	"licitacao_id" text NOT NULL,
	"titulo" text NOT NULL,
	"descricao" text,
	"file_url" text,
	"ocorrido_em" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contracts" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"licitacao_id" text,
	"numero" text NOT NULL,
	"objeto" text NOT NULL,
	"contratado" text NOT NULL,
	"cnpj_contratado" text NOT NULL,
	"valor" real NOT NULL,
	"data_inicio" date NOT NULL,
	"data_fim" date NOT NULL,
	"file_url" text,
	"ativo" boolean DEFAULT true NOT NULL,
	"fiscal_nome" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "licitacoes" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"numero" text NOT NULL,
	"objeto" text NOT NULL,
	"modalidade" text NOT NULL,
	"situacao" text DEFAULT 'aberta' NOT NULL,
	"data_abertura" timestamp,
	"data_encerramento" timestamp,
	"valor_estimado" real,
	"valor_homologado" real,
	"secretaria" text,
	"secretaria_id" text,
	"edital" text,
	"edital_url" text,
	"result_url" text,
	"ata" text,
	"descricao" text,
	"vencedor" text,
	"vencedor_cnpj" text,
	"pncp_id" text,
	"download_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "legislacao" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"numero" text NOT NULL,
	"tipo" text NOT NULL,
	"ementa" text NOT NULL,
	"slug" text NOT NULL,
	"data_publicacao" date NOT NULL,
	"ano" integer NOT NULL,
	"conteudo" text,
	"arquivo_pdf" text,
	"nome_arquivo" text,
	"status" text DEFAULT 'publicado' NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"visualizacoes" integer DEFAULT 0 NOT NULL,
	"downloads" integer DEFAULT 0 NOT NULL,
	"assinado_em" date,
	"revogado_em" date,
	"revogado_por_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "agenda" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"titulo" text NOT NULL,
	"descricao" text,
	"tipo" text DEFAULT 'evento' NOT NULL,
	"local" text,
	"endereco" text,
	"is_online" boolean DEFAULT false NOT NULL,
	"online_url" text,
	"data_inicio" timestamp NOT NULL,
	"data_fim" timestamp,
	"dia_inteiro" boolean DEFAULT false NOT NULL,
	"secretaria_id" text,
	"categoria" text,
	"publico_alvo" text,
	"is_publico" boolean DEFAULT true NOT NULL,
	"gratuito" boolean DEFAULT true NOT NULL,
	"link_inscricao" text,
	"anexo_url" text,
	"ativo" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "galeria" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"titulo" text NOT NULL,
	"descricao" text,
	"tipo" text DEFAULT 'foto' NOT NULL,
	"thumbnail" text,
	"url_video" text,
	"fotos" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"data_publicacao" timestamp DEFAULT now() NOT NULL,
	"categoria" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gallery_albums" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"titulo" text NOT NULL,
	"descricao" text,
	"cover_url" text,
	"is_publico" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gallery_items" (
	"id" text PRIMARY KEY NOT NULL,
	"album_id" text NOT NULL,
	"tipo" text DEFAULT 'image' NOT NULL,
	"url" text NOT NULL,
	"thumb_url" text,
	"alt_text" text NOT NULL,
	"legenda" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "concursos" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"titulo" text NOT NULL,
	"descricao" text,
	"tipo" text DEFAULT 'concurso-publico' NOT NULL,
	"situacao" text DEFAULT 'previsto' NOT NULL,
	"numero_vagas" integer,
	"data_publicacao" date NOT NULL,
	"data_inscricao_inicio" date,
	"data_inscricao_fim" date,
	"link_edital" text,
	"link_inscricao" text,
	"organizadora" text,
	"remuneracao" real,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "banners" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"titulo" text NOT NULL,
	"subtitulo" text,
	"image_desktop_url" text NOT NULL,
	"image_mobile_url" text,
	"image_alt" text NOT NULL,
	"cta_label" text,
	"cta_url" text,
	"cta_abre_nova_aba" boolean DEFAULT false NOT NULL,
	"overlay_color" text,
	"overlay_opacity" real DEFAULT 0.4 NOT NULL,
	"is_ativo" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"inicia_em" timestamp,
	"expira_em" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "menu_items" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"menu_slot" text NOT NULL,
	"label" text NOT NULL,
	"url" text,
	"tipo" text DEFAULT 'pagina' NOT NULL,
	"abre_nova_aba" boolean DEFAULT false NOT NULL,
	"icone" text,
	"parent_id" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_ativo" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page_blocks" (
	"id" text PRIMARY KEY NOT NULL,
	"page_id" text NOT NULL,
	"tipo" text NOT NULL,
	"conteudo" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pages" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"titulo" text NOT NULL,
	"slug" text NOT NULL,
	"status" text DEFAULT 'rascunho' NOT NULL,
	"is_protegida" boolean DEFAULT false NOT NULL,
	"meta_title" text,
	"meta_description" text,
	"autor" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_config" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"hero_type" text DEFAULT 'carousel' NOT NULL,
	"hero_video_url" text,
	"hero_sections" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"site_title" text,
	"site_description" text,
	"google_analytics_id" text,
	"google_tag_manager_id" text,
	"social_facebook" text,
	"social_instagram" text,
	"social_youtube" text,
	"social_twitter" text,
	"social_linkedin" text,
	"floating_widget_enabled" boolean DEFAULT true NOT NULL,
	"floating_widget_position" text DEFAULT 'right' NOT NULL,
	"vlibras_enabled" boolean DEFAULT true NOT NULL,
	"rodape_texto" text,
	"sic_prazo_resposta" integer DEFAULT 20 NOT NULL,
	"sic_email" text,
	"modo_manutencao" boolean DEFAULT false NOT NULL,
	"modo_manutencao_msg" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "site_config_tenant_id_unique" UNIQUE("tenant_id")
);
--> statement-breakpoint
CREATE TABLE "transparency_docs" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"categoria" text NOT NULL,
	"subcategoria" text,
	"titulo" text NOT NULL,
	"descricao" text,
	"ano_referencia" integer NOT NULL,
	"periodo_referencia" text,
	"file_url" text NOT NULL,
	"nome_arquivo" text NOT NULL,
	"tamanho_bytes" integer DEFAULT 0 NOT NULL,
	"downloads" integer DEFAULT 0 NOT NULL,
	"publicado_por" text NOT NULL,
	"publicado_em" timestamp NOT NULL,
	"expira_em" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"id" text PRIMARY KEY NOT NULL,
	"usuario_id" text NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "refresh_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "usuarios" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"nome" text NOT NULL,
	"email" text NOT NULL,
	"senha_hash" text NOT NULL,
	"cargo" text,
	"avatar" text,
	"modulos_permitidos" text[] DEFAULT '{"site"}' NOT NULL,
	"permissoes" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_admin" boolean DEFAULT false NOT NULL,
	"is_ativo" boolean DEFAULT true NOT NULL,
	"ultimo_acesso" timestamp,
	"servidor_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "usuarios_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "manifestacoes" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"protocolo" text NOT NULL,
	"tipo" text DEFAULT 'reclamacao' NOT NULL,
	"status" text DEFAULT 'aberta' NOT NULL,
	"prioridade" text DEFAULT 'normal' NOT NULL,
	"nome_cidadao" text,
	"email_cidadao" text,
	"telefone_cidadao" text,
	"cpf_cidadao" text,
	"is_anonimo" boolean DEFAULT false NOT NULL,
	"assunto" text NOT NULL,
	"descricao" text NOT NULL,
	"secretaria_id" text,
	"categoria_id" text,
	"prazo" timestamp,
	"resolvida_em" timestamp,
	"atribuida_a_em" timestamp,
	"lgpd_consent" boolean DEFAULT false NOT NULL,
	"origem" text DEFAULT 'portal' NOT NULL,
	"noticias_relacionadas" text[] DEFAULT '{}',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "manifestacoes_protocolo_unique" UNIQUE("protocolo")
);
--> statement-breakpoint
CREATE TABLE "ouvidoria_estatisticas" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"periodo" text NOT NULL,
	"total_manifestacoes" integer DEFAULT 0 NOT NULL,
	"resolvidas" integer DEFAULT 0 NOT NULL,
	"em_andamento" integer DEFAULT 0 NOT NULL,
	"no_prazo" integer DEFAULT 0 NOT NULL,
	"fora_prazo" integer DEFAULT 0 NOT NULL,
	"por_tipo" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sic_pedidos" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"protocolo" text NOT NULL,
	"nome" text NOT NULL,
	"cpf" text NOT NULL,
	"email" text NOT NULL,
	"telefone" text,
	"tipo_solicitacao" text NOT NULL,
	"orgao" text NOT NULL,
	"descricao" text NOT NULL,
	"formata_resposta" text DEFAULT 'email' NOT NULL,
	"status" text DEFAULT 'aberto' NOT NULL,
	"resposta" text,
	"prazo" timestamp NOT NULL,
	"respondido_em" timestamp,
	"lgpd_consent" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sic_pedidos_protocolo_unique" UNIQUE("protocolo")
);
--> statement-breakpoint
CREATE TABLE "chat_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"session_token" text NOT NULL,
	"total_mensagens" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_activity_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "chat_sessions_session_token_unique" UNIQUE("session_token")
);
--> statement-breakpoint
CREATE TABLE "fale_conosco_config" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"habilitado" boolean DEFAULT true NOT NULL,
	"nome_assistente" text DEFAULT 'Assistente Municipal' NOT NULL,
	"saudacao" text DEFAULT 'Olá! Como posso ajudar você hoje?' NOT NULL,
	"system_prompt" text DEFAULT 'Você é um assistente virtual da Prefeitura Municipal. Responda de forma objetiva, cordial e em português brasileiro. Ajude os cidadãos com informações sobre serviços, transparência, ouvidoria e demais assuntos municipais. Não forneça informações que não sejam de sua competência.' NOT NULL,
	"modelo_ia" text DEFAULT 'gpt-4o-mini' NOT NULL,
	"temperatura" text DEFAULT '0.7' NOT NULL,
	"max_tokens" integer DEFAULT 500 NOT NULL,
	"avatar_url" text,
	"cor_botao" text DEFAULT '#1351B4' NOT NULL,
	"tema_widget" text DEFAULT 'light' NOT NULL,
	"canais_ativos" jsonb DEFAULT '{"ouvidoria":true,"sic":true}'::jsonb NOT NULL,
	"topicos_proibidos" text[] DEFAULT '{"política partidária","candidatos","eleições"}' NOT NULL,
	"mensagem_offline" text DEFAULT 'Nosso atendimento está temporariamente indisponível. Por favor, tente novamente mais tarde.' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "fale_conosco_config_tenant_id_unique" UNIQUE("tenant_id")
);
--> statement-breakpoint
CREATE TABLE "contracheque_linhas" (
	"id" text PRIMARY KEY NOT NULL,
	"contracheque_id" text NOT NULL,
	"tipo" text NOT NULL,
	"codigo" text NOT NULL,
	"descricao" text NOT NULL,
	"referencia" text,
	"valor" real DEFAULT 0 NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contracheques" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"servidor_id" text NOT NULL,
	"mes" integer NOT NULL,
	"ano" integer NOT NULL,
	"competencia" text NOT NULL,
	"total_bruto" real DEFAULT 0 NOT NULL,
	"total_descontos" real DEFAULT 0 NOT NULL,
	"total_liquido" real DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'pago' NOT NULL,
	"cargo_na_competencia" text,
	"secretaria_na_competencia" text,
	"nivel_na_competencia" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "historico_funcional" (
	"id" text PRIMARY KEY NOT NULL,
	"servidor_id" text NOT NULL,
	"data" date NOT NULL,
	"tipo" text NOT NULL,
	"descricao" text NOT NULL,
	"portaria" text,
	"portaria_url" text,
	"despacho" text,
	"secretaria_destino" text,
	"cargo_apos" text,
	"observacoes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "periodos_aquisitivos" (
	"id" text PRIMARY KEY NOT NULL,
	"servidor_id" text NOT NULL,
	"data_inicio" date NOT NULL,
	"data_fim" date NOT NULL,
	"dias_direito" integer DEFAULT 30 NOT NULL,
	"dias_gozados" integer DEFAULT 0 NOT NULL,
	"dias_vendidos" integer DEFAULT 0 NOT NULL,
	"dias_saldo" integer DEFAULT 30 NOT NULL,
	"prazo_limite" date,
	"status" text DEFAULT 'disponivel' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "requerimentos" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"servidor_id" text NOT NULL,
	"protocolo" text NOT NULL,
	"tipo" text NOT NULL,
	"assunto" text NOT NULL,
	"justificativa" text NOT NULL,
	"campos_especificos" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"documentos" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" text DEFAULT 'protocolado' NOT NULL,
	"timeline" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"parecer_tecnico" text,
	"decisao" text,
	"motivo_decisao" text,
	"decisor_nome" text,
	"decidido_em" timestamp,
	"prazo_recurso" date,
	"recurso_apresentado" boolean DEFAULT false NOT NULL,
	"despacho" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "servidores_cadastro" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"nome" text NOT NULL,
	"cpf" text NOT NULL,
	"matricula" text NOT NULL,
	"email" text NOT NULL,
	"email_pessoal" text,
	"telefone" text,
	"data_nascimento" date,
	"cargo" text NOT NULL,
	"codigo_cargo" text,
	"nivel" text,
	"referencia" text,
	"vinculo" text DEFAULT 'estatutario' NOT NULL,
	"status" text DEFAULT 'ativo' NOT NULL,
	"data_ingresso" date NOT NULL,
	"data_concurso" date,
	"concurso_origem" text,
	"secretaria" text NOT NULL,
	"local_trabalho" text,
	"banco" text,
	"agencia" text,
	"conta" text,
	"tipo_conta" text DEFAULT 'corrente',
	"endereco" text,
	"numero" text,
	"complemento" text,
	"bairro" text,
	"cidade" text,
	"estado" text,
	"cep" text,
	"salario_base" real DEFAULT 0 NOT NULL,
	"dependentes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "solicitacoes_ferias" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"servidor_id" text NOT NULL,
	"periodo_aquisitivo_id" text NOT NULL,
	"protocolo" text NOT NULL,
	"data_inicio" date NOT NULL,
	"data_fim" date NOT NULL,
	"data_retorno" date NOT NULL,
	"qtd_dias" integer NOT NULL,
	"parcelamento" integer DEFAULT 1 NOT NULL,
	"adiantamento_13" boolean DEFAULT false NOT NULL,
	"abono_pecuniario" boolean DEFAULT false NOT NULL,
	"dias_abono" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'aguardando_chefia' NOT NULL,
	"timeline" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"aprovado_por" text,
	"aprovado_em" timestamp,
	"motivo_rejeicao" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gestores" ADD CONSTRAINT "gestores_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "municipio_info" ADD CONSTRAINT "municipio_info_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "news_categories" ADD CONSTRAINT "news_categories_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "news_versions" ADD CONSTRAINT "news_versions_noticia_id_noticias_id_fk" FOREIGN KEY ("noticia_id") REFERENCES "public"."noticias"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "noticias" ADD CONSTRAINT "noticias_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "noticias" ADD CONSTRAINT "noticias_categoria_id_news_categories_id_fk" FOREIGN KEY ("categoria_id") REFERENCES "public"."news_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "noticias" ADD CONSTRAINT "noticias_secretaria_id_secretarias_id_fk" FOREIGN KEY ("secretaria_id") REFERENCES "public"."secretarias"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "servicos" ADD CONSTRAINT "servicos_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "secretarias" ADD CONSTRAINT "secretarias_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "despesas" ADD CONSTRAINT "despesas_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orcamentos" ADD CONSTRAINT "orcamentos_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "receitas" ADD CONSTRAINT "receitas_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "servidores" ADD CONSTRAINT "servidores_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bid_events" ADD CONSTRAINT "bid_events_licitacao_id_licitacoes_id_fk" FOREIGN KEY ("licitacao_id") REFERENCES "public"."licitacoes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_licitacao_id_licitacoes_id_fk" FOREIGN KEY ("licitacao_id") REFERENCES "public"."licitacoes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "licitacoes" ADD CONSTRAINT "licitacoes_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "licitacoes" ADD CONSTRAINT "licitacoes_secretaria_id_secretarias_id_fk" FOREIGN KEY ("secretaria_id") REFERENCES "public"."secretarias"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "legislacao" ADD CONSTRAINT "legislacao_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agenda" ADD CONSTRAINT "agenda_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agenda" ADD CONSTRAINT "agenda_secretaria_id_secretarias_id_fk" FOREIGN KEY ("secretaria_id") REFERENCES "public"."secretarias"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "galeria" ADD CONSTRAINT "galeria_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gallery_albums" ADD CONSTRAINT "gallery_albums_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gallery_items" ADD CONSTRAINT "gallery_items_album_id_gallery_albums_id_fk" FOREIGN KEY ("album_id") REFERENCES "public"."gallery_albums"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "concursos" ADD CONSTRAINT "concursos_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "banners" ADD CONSTRAINT "banners_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_blocks" ADD CONSTRAINT "page_blocks_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pages" ADD CONSTRAINT "pages_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_config" ADD CONSTRAINT "site_config_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transparency_docs" ADD CONSTRAINT "transparency_docs_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manifestacoes" ADD CONSTRAINT "manifestacoes_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manifestacoes" ADD CONSTRAINT "manifestacoes_secretaria_id_secretarias_id_fk" FOREIGN KEY ("secretaria_id") REFERENCES "public"."secretarias"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ouvidoria_estatisticas" ADD CONSTRAINT "ouvidoria_estatisticas_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sic_pedidos" ADD CONSTRAINT "sic_pedidos_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fale_conosco_config" ADD CONSTRAINT "fale_conosco_config_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contracheque_linhas" ADD CONSTRAINT "contracheque_linhas_contracheque_id_contracheques_id_fk" FOREIGN KEY ("contracheque_id") REFERENCES "public"."contracheques"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contracheques" ADD CONSTRAINT "contracheques_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contracheques" ADD CONSTRAINT "contracheques_servidor_id_servidores_cadastro_id_fk" FOREIGN KEY ("servidor_id") REFERENCES "public"."servidores_cadastro"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "historico_funcional" ADD CONSTRAINT "historico_funcional_servidor_id_servidores_cadastro_id_fk" FOREIGN KEY ("servidor_id") REFERENCES "public"."servidores_cadastro"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "periodos_aquisitivos" ADD CONSTRAINT "periodos_aquisitivos_servidor_id_servidores_cadastro_id_fk" FOREIGN KEY ("servidor_id") REFERENCES "public"."servidores_cadastro"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "requerimentos" ADD CONSTRAINT "requerimentos_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "requerimentos" ADD CONSTRAINT "requerimentos_servidor_id_servidores_cadastro_id_fk" FOREIGN KEY ("servidor_id") REFERENCES "public"."servidores_cadastro"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "servidores_cadastro" ADD CONSTRAINT "servidores_cadastro_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solicitacoes_ferias" ADD CONSTRAINT "solicitacoes_ferias_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solicitacoes_ferias" ADD CONSTRAINT "solicitacoes_ferias_servidor_id_servidores_cadastro_id_fk" FOREIGN KEY ("servidor_id") REFERENCES "public"."servidores_cadastro"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solicitacoes_ferias" ADD CONSTRAINT "solicitacoes_ferias_periodo_aquisitivo_id_periodos_aquisitivos_id_fk" FOREIGN KEY ("periodo_aquisitivo_id") REFERENCES "public"."periodos_aquisitivos"("id") ON DELETE no action ON UPDATE no action;