import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { AgendaListResponse, BuscaResponse, ConcursoListResponse, CreateNoticia, DespesaListResponse, GaleriaListResponse, Gestor, GetOrcamentoParams, GetTenantConfigParams, GlobalSearchParams, HealthStatus, Legislacao, LegislacaoListResponse, Licitacao, LicitacaoListResponse, ListAgendaParams, ListConcursosParams, ListDespesasParams, ListGaleriaParams, ListLegislacaoParams, ListLicitacoesParams, ListNoticiasParams, ListReceitasParams, ListServicosParams, ListServidoresParams, MunicipioInfo, Noticia, NoticiaListResponse, OrcamentoResponse, ReceitaListResponse, Secretaria, SecretariaListResponse, Servico, ServicoListResponse, ServidorListResponse, TenantConfig } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * Returns server health status
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get tenant configuration
 */
export declare const getGetTenantConfigUrl: (params?: GetTenantConfigParams) => string;
export declare const getTenantConfig: (params?: GetTenantConfigParams, options?: RequestInit) => Promise<TenantConfig>;
export declare const getGetTenantConfigQueryKey: (params?: GetTenantConfigParams) => readonly ["/api/tenant/config", ...GetTenantConfigParams[]];
export declare const getGetTenantConfigQueryOptions: <TData = Awaited<ReturnType<typeof getTenantConfig>>, TError = ErrorType<unknown>>(params?: GetTenantConfigParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTenantConfig>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getTenantConfig>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetTenantConfigQueryResult = NonNullable<Awaited<ReturnType<typeof getTenantConfig>>>;
export type GetTenantConfigQueryError = ErrorType<unknown>;
/**
 * @summary Get tenant configuration
 */
export declare function useGetTenantConfig<TData = Awaited<ReturnType<typeof getTenantConfig>>, TError = ErrorType<unknown>>(params?: GetTenantConfigParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTenantConfig>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Listar notícias
 */
export declare const getListNoticiasUrl: (params?: ListNoticiasParams) => string;
export declare const listNoticias: (params?: ListNoticiasParams, options?: RequestInit) => Promise<NoticiaListResponse>;
export declare const getListNoticiasQueryKey: (params?: ListNoticiasParams) => readonly ["/api/noticias", ...ListNoticiasParams[]];
export declare const getListNoticiasQueryOptions: <TData = Awaited<ReturnType<typeof listNoticias>>, TError = ErrorType<unknown>>(params?: ListNoticiasParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listNoticias>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listNoticias>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListNoticiasQueryResult = NonNullable<Awaited<ReturnType<typeof listNoticias>>>;
export type ListNoticiasQueryError = ErrorType<unknown>;
/**
 * @summary Listar notícias
 */
export declare function useListNoticias<TData = Awaited<ReturnType<typeof listNoticias>>, TError = ErrorType<unknown>>(params?: ListNoticiasParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listNoticias>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Criar notícia
 */
export declare const getCreateNoticiaUrl: () => string;
export declare const createNoticia: (createNoticia: CreateNoticia, options?: RequestInit) => Promise<Noticia>;
export declare const getCreateNoticiaMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createNoticia>>, TError, {
        data: BodyType<CreateNoticia>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createNoticia>>, TError, {
    data: BodyType<CreateNoticia>;
}, TContext>;
export type CreateNoticiaMutationResult = NonNullable<Awaited<ReturnType<typeof createNoticia>>>;
export type CreateNoticiaMutationBody = BodyType<CreateNoticia>;
export type CreateNoticiaMutationError = ErrorType<unknown>;
/**
 * @summary Criar notícia
 */
export declare const useCreateNoticia: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createNoticia>>, TError, {
        data: BodyType<CreateNoticia>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createNoticia>>, TError, {
    data: BodyType<CreateNoticia>;
}, TContext>;
/**
 * @summary Obter notícia por slug
 */
export declare const getGetNoticiaBySlugUrl: (slug: string) => string;
export declare const getNoticiaBySlug: (slug: string, options?: RequestInit) => Promise<Noticia>;
export declare const getGetNoticiaBySlugQueryKey: (slug: string) => readonly [`/api/noticias/${string}`];
export declare const getGetNoticiaBySlugQueryOptions: <TData = Awaited<ReturnType<typeof getNoticiaBySlug>>, TError = ErrorType<void>>(slug: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getNoticiaBySlug>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getNoticiaBySlug>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetNoticiaBySlugQueryResult = NonNullable<Awaited<ReturnType<typeof getNoticiaBySlug>>>;
export type GetNoticiaBySlugQueryError = ErrorType<void>;
/**
 * @summary Obter notícia por slug
 */
export declare function useGetNoticiaBySlug<TData = Awaited<ReturnType<typeof getNoticiaBySlug>>, TError = ErrorType<void>>(slug: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getNoticiaBySlug>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Atualizar notícia
 */
export declare const getUpdateNoticiaUrl: (slug: string) => string;
export declare const updateNoticia: (slug: string, createNoticia: CreateNoticia, options?: RequestInit) => Promise<Noticia>;
export declare const getUpdateNoticiaMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateNoticia>>, TError, {
        slug: string;
        data: BodyType<CreateNoticia>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateNoticia>>, TError, {
    slug: string;
    data: BodyType<CreateNoticia>;
}, TContext>;
export type UpdateNoticiaMutationResult = NonNullable<Awaited<ReturnType<typeof updateNoticia>>>;
export type UpdateNoticiaMutationBody = BodyType<CreateNoticia>;
export type UpdateNoticiaMutationError = ErrorType<unknown>;
/**
 * @summary Atualizar notícia
 */
export declare const useUpdateNoticia: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateNoticia>>, TError, {
        slug: string;
        data: BodyType<CreateNoticia>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateNoticia>>, TError, {
    slug: string;
    data: BodyType<CreateNoticia>;
}, TContext>;
/**
 * @summary Remover notícia
 */
export declare const getDeleteNoticiaUrl: (slug: string) => string;
export declare const deleteNoticia: (slug: string, options?: RequestInit) => Promise<void>;
export declare const getDeleteNoticiaMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteNoticia>>, TError, {
        slug: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteNoticia>>, TError, {
    slug: string;
}, TContext>;
export type DeleteNoticiaMutationResult = NonNullable<Awaited<ReturnType<typeof deleteNoticia>>>;
export type DeleteNoticiaMutationError = ErrorType<unknown>;
/**
 * @summary Remover notícia
 */
export declare const useDeleteNoticia: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteNoticia>>, TError, {
        slug: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteNoticia>>, TError, {
    slug: string;
}, TContext>;
/**
 * @summary Listar serviços ao cidadão
 */
export declare const getListServicosUrl: (params?: ListServicosParams) => string;
export declare const listServicos: (params?: ListServicosParams, options?: RequestInit) => Promise<ServicoListResponse>;
export declare const getListServicosQueryKey: (params?: ListServicosParams) => readonly ["/api/servicos", ...ListServicosParams[]];
export declare const getListServicosQueryOptions: <TData = Awaited<ReturnType<typeof listServicos>>, TError = ErrorType<unknown>>(params?: ListServicosParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listServicos>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listServicos>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListServicosQueryResult = NonNullable<Awaited<ReturnType<typeof listServicos>>>;
export type ListServicosQueryError = ErrorType<unknown>;
/**
 * @summary Listar serviços ao cidadão
 */
export declare function useListServicos<TData = Awaited<ReturnType<typeof listServicos>>, TError = ErrorType<unknown>>(params?: ListServicosParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listServicos>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Obter serviço por slug
 */
export declare const getGetServicoUrl: (slug: string) => string;
export declare const getServico: (slug: string, options?: RequestInit) => Promise<Servico>;
export declare const getGetServicoQueryKey: (slug: string) => readonly [`/api/servicos/${string}`];
export declare const getGetServicoQueryOptions: <TData = Awaited<ReturnType<typeof getServico>>, TError = ErrorType<void>>(slug: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getServico>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getServico>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetServicoQueryResult = NonNullable<Awaited<ReturnType<typeof getServico>>>;
export type GetServicoQueryError = ErrorType<void>;
/**
 * @summary Obter serviço por slug
 */
export declare function useGetServico<TData = Awaited<ReturnType<typeof getServico>>, TError = ErrorType<void>>(slug: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getServico>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Listar secretarias municipais
 */
export declare const getListSecretariasUrl: () => string;
export declare const listSecretarias: (options?: RequestInit) => Promise<SecretariaListResponse>;
export declare const getListSecretariasQueryKey: () => readonly ["/api/secretarias"];
export declare const getListSecretariasQueryOptions: <TData = Awaited<ReturnType<typeof listSecretarias>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listSecretarias>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listSecretarias>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListSecretariasQueryResult = NonNullable<Awaited<ReturnType<typeof listSecretarias>>>;
export type ListSecretariasQueryError = ErrorType<unknown>;
/**
 * @summary Listar secretarias municipais
 */
export declare function useListSecretarias<TData = Awaited<ReturnType<typeof listSecretarias>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listSecretarias>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Obter secretaria por slug
 */
export declare const getGetSecretariaUrl: (slug: string) => string;
export declare const getSecretaria: (slug: string, options?: RequestInit) => Promise<Secretaria>;
export declare const getGetSecretariaQueryKey: (slug: string) => readonly [`/api/secretarias/${string}`];
export declare const getGetSecretariaQueryOptions: <TData = Awaited<ReturnType<typeof getSecretaria>>, TError = ErrorType<unknown>>(slug: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSecretaria>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getSecretaria>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetSecretariaQueryResult = NonNullable<Awaited<ReturnType<typeof getSecretaria>>>;
export type GetSecretariaQueryError = ErrorType<unknown>;
/**
 * @summary Obter secretaria por slug
 */
export declare function useGetSecretaria<TData = Awaited<ReturnType<typeof getSecretaria>>, TError = ErrorType<unknown>>(slug: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSecretaria>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Dados do orçamento municipal
 */
export declare const getGetOrcamentoUrl: (params?: GetOrcamentoParams) => string;
export declare const getOrcamento: (params?: GetOrcamentoParams, options?: RequestInit) => Promise<OrcamentoResponse>;
export declare const getGetOrcamentoQueryKey: (params?: GetOrcamentoParams) => readonly ["/api/transparencia/orcamento", ...GetOrcamentoParams[]];
export declare const getGetOrcamentoQueryOptions: <TData = Awaited<ReturnType<typeof getOrcamento>>, TError = ErrorType<unknown>>(params?: GetOrcamentoParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getOrcamento>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getOrcamento>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetOrcamentoQueryResult = NonNullable<Awaited<ReturnType<typeof getOrcamento>>>;
export type GetOrcamentoQueryError = ErrorType<unknown>;
/**
 * @summary Dados do orçamento municipal
 */
export declare function useGetOrcamento<TData = Awaited<ReturnType<typeof getOrcamento>>, TError = ErrorType<unknown>>(params?: GetOrcamentoParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getOrcamento>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Listar despesas
 */
export declare const getListDespesasUrl: (params?: ListDespesasParams) => string;
export declare const listDespesas: (params?: ListDespesasParams, options?: RequestInit) => Promise<DespesaListResponse>;
export declare const getListDespesasQueryKey: (params?: ListDespesasParams) => readonly ["/api/transparencia/despesas", ...ListDespesasParams[]];
export declare const getListDespesasQueryOptions: <TData = Awaited<ReturnType<typeof listDespesas>>, TError = ErrorType<unknown>>(params?: ListDespesasParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listDespesas>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listDespesas>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListDespesasQueryResult = NonNullable<Awaited<ReturnType<typeof listDespesas>>>;
export type ListDespesasQueryError = ErrorType<unknown>;
/**
 * @summary Listar despesas
 */
export declare function useListDespesas<TData = Awaited<ReturnType<typeof listDespesas>>, TError = ErrorType<unknown>>(params?: ListDespesasParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listDespesas>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Listar receitas
 */
export declare const getListReceitasUrl: (params?: ListReceitasParams) => string;
export declare const listReceitas: (params?: ListReceitasParams, options?: RequestInit) => Promise<ReceitaListResponse>;
export declare const getListReceitasQueryKey: (params?: ListReceitasParams) => readonly ["/api/transparencia/receitas", ...ListReceitasParams[]];
export declare const getListReceitasQueryOptions: <TData = Awaited<ReturnType<typeof listReceitas>>, TError = ErrorType<unknown>>(params?: ListReceitasParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listReceitas>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listReceitas>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListReceitasQueryResult = NonNullable<Awaited<ReturnType<typeof listReceitas>>>;
export type ListReceitasQueryError = ErrorType<unknown>;
/**
 * @summary Listar receitas
 */
export declare function useListReceitas<TData = Awaited<ReturnType<typeof listReceitas>>, TError = ErrorType<unknown>>(params?: ListReceitasParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listReceitas>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Listar servidores públicos
 */
export declare const getListServidoresUrl: (params?: ListServidoresParams) => string;
export declare const listServidores: (params?: ListServidoresParams, options?: RequestInit) => Promise<ServidorListResponse>;
export declare const getListServidoresQueryKey: (params?: ListServidoresParams) => readonly ["/api/transparencia/servidores", ...ListServidoresParams[]];
export declare const getListServidoresQueryOptions: <TData = Awaited<ReturnType<typeof listServidores>>, TError = ErrorType<unknown>>(params?: ListServidoresParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listServidores>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listServidores>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListServidoresQueryResult = NonNullable<Awaited<ReturnType<typeof listServidores>>>;
export type ListServidoresQueryError = ErrorType<unknown>;
/**
 * @summary Listar servidores públicos
 */
export declare function useListServidores<TData = Awaited<ReturnType<typeof listServidores>>, TError = ErrorType<unknown>>(params?: ListServidoresParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listServidores>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Listar licitações
 */
export declare const getListLicitacoesUrl: (params?: ListLicitacoesParams) => string;
export declare const listLicitacoes: (params?: ListLicitacoesParams, options?: RequestInit) => Promise<LicitacaoListResponse>;
export declare const getListLicitacoesQueryKey: (params?: ListLicitacoesParams) => readonly ["/api/licitacoes", ...ListLicitacoesParams[]];
export declare const getListLicitacoesQueryOptions: <TData = Awaited<ReturnType<typeof listLicitacoes>>, TError = ErrorType<unknown>>(params?: ListLicitacoesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listLicitacoes>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listLicitacoes>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListLicitacoesQueryResult = NonNullable<Awaited<ReturnType<typeof listLicitacoes>>>;
export type ListLicitacoesQueryError = ErrorType<unknown>;
/**
 * @summary Listar licitações
 */
export declare function useListLicitacoes<TData = Awaited<ReturnType<typeof listLicitacoes>>, TError = ErrorType<unknown>>(params?: ListLicitacoesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listLicitacoes>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Obter licitação por ID
 */
export declare const getGetLicitacaoUrl: (id: string) => string;
export declare const getLicitacao: (id: string, options?: RequestInit) => Promise<Licitacao>;
export declare const getGetLicitacaoQueryKey: (id: string) => readonly [`/api/licitacoes/${string}`];
export declare const getGetLicitacaoQueryOptions: <TData = Awaited<ReturnType<typeof getLicitacao>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLicitacao>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getLicitacao>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetLicitacaoQueryResult = NonNullable<Awaited<ReturnType<typeof getLicitacao>>>;
export type GetLicitacaoQueryError = ErrorType<unknown>;
/**
 * @summary Obter licitação por ID
 */
export declare function useGetLicitacao<TData = Awaited<ReturnType<typeof getLicitacao>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLicitacao>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Listar legislação municipal
 */
export declare const getListLegislacaoUrl: (params?: ListLegislacaoParams) => string;
export declare const listLegislacao: (params?: ListLegislacaoParams, options?: RequestInit) => Promise<LegislacaoListResponse>;
export declare const getListLegislacaoQueryKey: (params?: ListLegislacaoParams) => readonly ["/api/legislacao", ...ListLegislacaoParams[]];
export declare const getListLegislacaoQueryOptions: <TData = Awaited<ReturnType<typeof listLegislacao>>, TError = ErrorType<unknown>>(params?: ListLegislacaoParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listLegislacao>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listLegislacao>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListLegislacaoQueryResult = NonNullable<Awaited<ReturnType<typeof listLegislacao>>>;
export type ListLegislacaoQueryError = ErrorType<unknown>;
/**
 * @summary Listar legislação municipal
 */
export declare function useListLegislacao<TData = Awaited<ReturnType<typeof listLegislacao>>, TError = ErrorType<unknown>>(params?: ListLegislacaoParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listLegislacao>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Obter legislação por tipo e slug
 */
export declare const getGetLegislacaoUrl: (tipo: string, slug: string) => string;
export declare const getLegislacao: (tipo: string, slug: string, options?: RequestInit) => Promise<Legislacao>;
export declare const getGetLegislacaoQueryKey: (tipo: string, slug: string) => readonly [`/api/legislacao/${string}/${string}`];
export declare const getGetLegislacaoQueryOptions: <TData = Awaited<ReturnType<typeof getLegislacao>>, TError = ErrorType<unknown>>(tipo: string, slug: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLegislacao>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getLegislacao>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetLegislacaoQueryResult = NonNullable<Awaited<ReturnType<typeof getLegislacao>>>;
export type GetLegislacaoQueryError = ErrorType<unknown>;
/**
 * @summary Obter legislação por tipo e slug
 */
export declare function useGetLegislacao<TData = Awaited<ReturnType<typeof getLegislacao>>, TError = ErrorType<unknown>>(tipo: string, slug: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLegislacao>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Listar eventos da agenda
 */
export declare const getListAgendaUrl: (params?: ListAgendaParams) => string;
export declare const listAgenda: (params?: ListAgendaParams, options?: RequestInit) => Promise<AgendaListResponse>;
export declare const getListAgendaQueryKey: (params?: ListAgendaParams) => readonly ["/api/agenda", ...ListAgendaParams[]];
export declare const getListAgendaQueryOptions: <TData = Awaited<ReturnType<typeof listAgenda>>, TError = ErrorType<unknown>>(params?: ListAgendaParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAgenda>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listAgenda>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListAgendaQueryResult = NonNullable<Awaited<ReturnType<typeof listAgenda>>>;
export type ListAgendaQueryError = ErrorType<unknown>;
/**
 * @summary Listar eventos da agenda
 */
export declare function useListAgenda<TData = Awaited<ReturnType<typeof listAgenda>>, TError = ErrorType<unknown>>(params?: ListAgendaParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAgenda>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Listar álbuns da galeria
 */
export declare const getListGaleriaUrl: (params?: ListGaleriaParams) => string;
export declare const listGaleria: (params?: ListGaleriaParams, options?: RequestInit) => Promise<GaleriaListResponse>;
export declare const getListGaleriaQueryKey: (params?: ListGaleriaParams) => readonly ["/api/galeria", ...ListGaleriaParams[]];
export declare const getListGaleriaQueryOptions: <TData = Awaited<ReturnType<typeof listGaleria>>, TError = ErrorType<unknown>>(params?: ListGaleriaParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listGaleria>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listGaleria>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListGaleriaQueryResult = NonNullable<Awaited<ReturnType<typeof listGaleria>>>;
export type ListGaleriaQueryError = ErrorType<unknown>;
/**
 * @summary Listar álbuns da galeria
 */
export declare function useListGaleria<TData = Awaited<ReturnType<typeof listGaleria>>, TError = ErrorType<unknown>>(params?: ListGaleriaParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listGaleria>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Listar concursos e processos seletivos
 */
export declare const getListConcursosUrl: (params?: ListConcursosParams) => string;
export declare const listConcursos: (params?: ListConcursosParams, options?: RequestInit) => Promise<ConcursoListResponse>;
export declare const getListConcursosQueryKey: (params?: ListConcursosParams) => readonly ["/api/concursos", ...ListConcursosParams[]];
export declare const getListConcursosQueryOptions: <TData = Awaited<ReturnType<typeof listConcursos>>, TError = ErrorType<unknown>>(params?: ListConcursosParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listConcursos>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listConcursos>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListConcursosQueryResult = NonNullable<Awaited<ReturnType<typeof listConcursos>>>;
export type ListConcursosQueryError = ErrorType<unknown>;
/**
 * @summary Listar concursos e processos seletivos
 */
export declare function useListConcursos<TData = Awaited<ReturnType<typeof listConcursos>>, TError = ErrorType<unknown>>(params?: ListConcursosParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listConcursos>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Busca global no portal
 */
export declare const getGlobalSearchUrl: (params: GlobalSearchParams) => string;
export declare const globalSearch: (params: GlobalSearchParams, options?: RequestInit) => Promise<BuscaResponse>;
export declare const getGlobalSearchQueryKey: (params?: GlobalSearchParams) => readonly ["/api/busca", ...GlobalSearchParams[]];
export declare const getGlobalSearchQueryOptions: <TData = Awaited<ReturnType<typeof globalSearch>>, TError = ErrorType<unknown>>(params: GlobalSearchParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof globalSearch>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof globalSearch>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GlobalSearchQueryResult = NonNullable<Awaited<ReturnType<typeof globalSearch>>>;
export type GlobalSearchQueryError = ErrorType<unknown>;
/**
 * @summary Busca global no portal
 */
export declare function useGlobalSearch<TData = Awaited<ReturnType<typeof globalSearch>>, TError = ErrorType<unknown>>(params: GlobalSearchParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof globalSearch>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Informações do município
 */
export declare const getGetMunicipioInfoUrl: () => string;
export declare const getMunicipioInfo: (options?: RequestInit) => Promise<MunicipioInfo>;
export declare const getGetMunicipioInfoQueryKey: () => readonly ["/api/municipio/info"];
export declare const getGetMunicipioInfoQueryOptions: <TData = Awaited<ReturnType<typeof getMunicipioInfo>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMunicipioInfo>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMunicipioInfo>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMunicipioInfoQueryResult = NonNullable<Awaited<ReturnType<typeof getMunicipioInfo>>>;
export type GetMunicipioInfoQueryError = ErrorType<unknown>;
/**
 * @summary Informações do município
 */
export declare function useGetMunicipioInfo<TData = Awaited<ReturnType<typeof getMunicipioInfo>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMunicipioInfo>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Dados do prefeito
 */
export declare const getGetPrefeitoUrl: () => string;
export declare const getPrefeito: (options?: RequestInit) => Promise<Gestor>;
export declare const getGetPrefeitoQueryKey: () => readonly ["/api/governo/prefeito"];
export declare const getGetPrefeitoQueryOptions: <TData = Awaited<ReturnType<typeof getPrefeito>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPrefeito>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getPrefeito>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetPrefeitoQueryResult = NonNullable<Awaited<ReturnType<typeof getPrefeito>>>;
export type GetPrefeitoQueryError = ErrorType<unknown>;
/**
 * @summary Dados do prefeito
 */
export declare function useGetPrefeito<TData = Awaited<ReturnType<typeof getPrefeito>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPrefeito>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Dados do vice-prefeito
 */
export declare const getGetVicePrefeitoUrl: () => string;
export declare const getVicePrefeito: (options?: RequestInit) => Promise<Gestor>;
export declare const getGetVicePrefeitoQueryKey: () => readonly ["/api/governo/vice-prefeito"];
export declare const getGetVicePrefeitoQueryOptions: <TData = Awaited<ReturnType<typeof getVicePrefeito>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getVicePrefeito>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getVicePrefeito>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetVicePrefeitoQueryResult = NonNullable<Awaited<ReturnType<typeof getVicePrefeito>>>;
export type GetVicePrefeitoQueryError = ErrorType<unknown>;
/**
 * @summary Dados do vice-prefeito
 */
export declare function useGetVicePrefeito<TData = Awaited<ReturnType<typeof getVicePrefeito>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getVicePrefeito>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map