import { useState } from "react";
import { useForm } from "react-hook-form";
import { Send, CheckCircle, AlertCircle, Clock, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface SicFormData {
  nome: string;
  cpf: string;
  email: string;
  telefone?: string;
  tipoSolicitacao: "informacao" | "recurso" | "outros";
  orgao: string;
  descricao: string;
  formataResposta: "email" | "carta" | "email_carta" | "pessoalmente" | "nao_exige";
  lgpdConsent: boolean;
}

interface SicRequestFormProps {
  className?: string;
}

function formatCpf(v: string) {
  return v.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export function SicRequestForm({ className }: SicRequestFormProps) {
  const [submitted, setSubmitted] = useState<{ protocolo: string; prazo: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<SicFormData>({
    defaultValues: {
      tipoSolicitacao: "informacao",
      formataResposta: "email",
      lgpdConsent: false,
    },
  });

  const onSubmit = async (data: SicFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const base = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
      const res = await fetch(`${base}/api/sic`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Erro ao enviar pedido.");
      }
      const result = await res.json();
      setSubmitted({ protocolo: result.protocolo, prazo: result.prazo });
      reset();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro inesperado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    const prazoDate = new Date(submitted.prazo);
    const daysLeft = Math.ceil((prazoDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return (
      <div className={cn("bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center", className)}>
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" aria-hidden="true" />
        <h3 className="text-xl font-black text-green-900 mb-2">Pedido Registrado com Sucesso!</h3>
        <p className="text-green-800 mb-6 text-sm leading-relaxed">
          Seu pedido de acesso à informação foi registrado conforme a Lei 12.527/2011.
        </p>
        <div className="bg-white border border-green-200 rounded-xl p-4 mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground font-medium">Nº do Protocolo:</span>
            <span className="font-black text-lg text-foreground font-mono">{submitted.protocolo}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />Prazo para resposta:
            </span>
            <span className="font-bold text-foreground">
              {prazoDate.toLocaleDateString("pt-BR")} ({daysLeft} dias corridos)
            </span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mb-6">
          Guarde o número do protocolo para acompanhar o andamento do seu pedido.
          O prazo de resposta é de 20 dias corridos, prorrogáveis por mais 10 dias (LAI, Art. 11).
        </p>
        <button
          onClick={() => setSubmitted(null)}
          className="text-sm font-semibold text-primary hover:underline focus:outline-none focus:underline"
        >
          Fazer novo pedido
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className={cn("space-y-6", className)}
      aria-label="Formulário de Pedido de Acesso à Informação — SIC"
    >
      {/* Info banner */}
      <div className="flex gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div className="text-sm text-blue-800">
          <strong>Prazo de resposta:</strong> 20 dias corridos, prorrogáveis por mais 10 dias mediante justificativa.
          Conforme Lei 12.527/2011 (LAI), Art. 11.
        </div>
      </div>

      {/* Dados pessoais */}
      <fieldset className="space-y-4">
        <legend className="text-base font-bold text-foreground mb-4">Dados do Solicitante</legend>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="sic-nome" className="block text-sm font-semibold text-foreground mb-1.5">
              Nome completo <span className="text-destructive" aria-label="obrigatório">*</span>
            </label>
            <input
              id="sic-nome"
              type="text"
              autoComplete="name"
              {...register("nome", { required: "Nome é obrigatório" })}
              className={cn(
                "w-full px-4 py-2.5 border-2 rounded-xl text-sm bg-background focus:outline-none focus:ring-4 transition-all",
                errors.nome ? "border-destructive focus:ring-destructive/20" : "border-border focus:border-primary focus:ring-primary/10"
              )}
              aria-required="true"
              aria-invalid={!!errors.nome}
              aria-describedby={errors.nome ? "sic-nome-error" : undefined}
            />
            {errors.nome && <p id="sic-nome-error" role="alert" className="text-xs text-destructive mt-1">{errors.nome.message}</p>}
          </div>

          <div>
            <label htmlFor="sic-cpf" className="block text-sm font-semibold text-foreground mb-1.5">
              CPF <span className="text-destructive" aria-label="obrigatório">*</span>
            </label>
            <input
              id="sic-cpf"
              type="text"
              inputMode="numeric"
              maxLength={14}
              autoComplete="off"
              {...register("cpf", {
                required: "CPF é obrigatório",
                onChange: (e) => { e.target.value = formatCpf(e.target.value); },
                pattern: { value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/, message: "CPF inválido" },
              })}
              placeholder="000.000.000-00"
              className={cn(
                "w-full px-4 py-2.5 border-2 rounded-xl text-sm font-mono bg-background focus:outline-none focus:ring-4 transition-all",
                errors.cpf ? "border-destructive focus:ring-destructive/20" : "border-border focus:border-primary focus:ring-primary/10"
              )}
              aria-required="true"
              aria-invalid={!!errors.cpf}
              aria-describedby={errors.cpf ? "sic-cpf-error" : undefined}
            />
            {errors.cpf && <p id="sic-cpf-error" role="alert" className="text-xs text-destructive mt-1">{errors.cpf.message}</p>}
          </div>

          <div>
            <label htmlFor="sic-email" className="block text-sm font-semibold text-foreground mb-1.5">
              E-mail <span className="text-destructive" aria-label="obrigatório">*</span>
            </label>
            <input
              id="sic-email"
              type="email"
              autoComplete="email"
              {...register("email", {
                required: "E-mail é obrigatório",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "E-mail inválido" },
              })}
              className={cn(
                "w-full px-4 py-2.5 border-2 rounded-xl text-sm bg-background focus:outline-none focus:ring-4 transition-all",
                errors.email ? "border-destructive focus:ring-destructive/20" : "border-border focus:border-primary focus:ring-primary/10"
              )}
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "sic-email-error" : undefined}
            />
            {errors.email && <p id="sic-email-error" role="alert" className="text-xs text-destructive mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="sic-telefone" className="block text-sm font-semibold text-foreground mb-1.5">
              Telefone <span className="text-muted-foreground text-xs font-normal">(opcional)</span>
            </label>
            <input
              id="sic-telefone"
              type="tel"
              autoComplete="tel"
              {...register("telefone")}
              placeholder="(00) 00000-0000"
              className="w-full px-4 py-2.5 border-2 border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            />
          </div>
        </div>
      </fieldset>

      {/* Pedido */}
      <fieldset className="space-y-4">
        <legend className="text-base font-bold text-foreground mb-4">Detalhes do Pedido</legend>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="sic-tipo" className="block text-sm font-semibold text-foreground mb-1.5">
              Tipo de solicitação <span className="text-destructive" aria-label="obrigatório">*</span>
            </label>
            <select
              id="sic-tipo"
              {...register("tipoSolicitacao", { required: true })}
              className="w-full px-4 py-2.5 border-2 border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            >
              <option value="informacao">Pedido de Informação</option>
              <option value="recurso">Recurso</option>
              <option value="outros">Outros</option>
            </select>
          </div>

          <div>
            <label htmlFor="sic-orgao" className="block text-sm font-semibold text-foreground mb-1.5">
              Órgão / Secretaria <span className="text-destructive" aria-label="obrigatório">*</span>
            </label>
            <input
              id="sic-orgao"
              type="text"
              {...register("orgao", { required: "Órgão é obrigatório" })}
              placeholder="Ex: Secretaria de Saúde"
              className={cn(
                "w-full px-4 py-2.5 border-2 rounded-xl text-sm bg-background focus:outline-none focus:ring-4 transition-all",
                errors.orgao ? "border-destructive focus:ring-destructive/20" : "border-border focus:border-primary focus:ring-primary/10"
              )}
              aria-required="true"
              aria-invalid={!!errors.orgao}
            />
            {errors.orgao && <p role="alert" className="text-xs text-destructive mt-1">{errors.orgao.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="sic-descricao" className="block text-sm font-semibold text-foreground mb-1.5">
            Descrição detalhada do pedido <span className="text-destructive" aria-label="obrigatório">*</span>
          </label>
          <textarea
            id="sic-descricao"
            rows={5}
            {...register("descricao", { required: "Descrição é obrigatória", minLength: { value: 20, message: "Descreva com mais detalhes (mínimo 20 caracteres)" } })}
            placeholder="Descreva claramente qual informação você precisa acessar, o período de referência e demais dados relevantes..."
            className={cn(
              "w-full px-4 py-2.5 border-2 rounded-xl text-sm bg-background focus:outline-none focus:ring-4 transition-all resize-none",
              errors.descricao ? "border-destructive focus:ring-destructive/20" : "border-border focus:border-primary focus:ring-primary/10"
            )}
            aria-required="true"
            aria-invalid={!!errors.descricao}
            aria-describedby={errors.descricao ? "sic-desc-error" : undefined}
          />
          {errors.descricao && <p id="sic-desc-error" role="alert" className="text-xs text-destructive mt-1">{errors.descricao.message}</p>}
        </div>

        <div>
          <label htmlFor="sic-formato" className="block text-sm font-semibold text-foreground mb-1.5">
            Formato preferido de resposta
          </label>
          <select
            id="sic-formato"
            {...register("formataResposta")}
            className="w-full px-4 py-2.5 border-2 border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
          >
            <option value="email">E-mail</option>
            <option value="carta">Carta/Correspondência</option>
            <option value="email_carta">E-mail e Carta</option>
            <option value="pessoalmente">Pessoalmente</option>
            <option value="nao_exige">Não exige formato específico</option>
          </select>
        </div>
      </fieldset>

      {/* LGPD consent */}
      <div className={cn("flex items-start gap-3 p-4 rounded-xl border-2 transition-colors",
        errors.lgpdConsent ? "border-destructive bg-destructive/5" : "border-border"
      )}>
        <input
          id="sic-lgpd"
          type="checkbox"
          {...register("lgpdConsent", { required: "Você precisa aceitar o tratamento dos dados pessoais para prosseguir." })}
          className="w-4 h-4 mt-0.5 rounded border-border accent-primary flex-shrink-0"
          aria-required="true"
          aria-invalid={!!errors.lgpdConsent}
        />
        <label htmlFor="sic-lgpd" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
          Concordo com o tratamento dos meus dados pessoais para fins de atendimento ao pedido de acesso à informação,
          conforme a <strong>LGPD (Lei 13.709/2018)</strong> e a <strong>LAI (Lei 12.527/2011)</strong>.
          Os dados serão utilizados exclusivamente para o processamento desta solicitação.
        </label>
      </div>
      {errors.lgpdConsent && <p role="alert" className="text-xs text-destructive -mt-4">{errors.lgpdConsent.message}</p>}

      {/* Error */}
      {error && (
        <div role="alert" className="flex items-center gap-2.5 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive">
          <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="flex items-center justify-center gap-2.5 w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-4 focus:ring-primary/30 text-base shadow-lg"
      >
        {isLoading ? (
          <>
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Enviando pedido...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" aria-hidden="true" />
            Enviar Pedido de Informação
          </>
        )}
      </button>
    </form>
  );
}
