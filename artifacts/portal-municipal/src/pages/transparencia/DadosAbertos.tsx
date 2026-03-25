import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { TransparenciaPageHeader } from "@/components/transparencia/TransparenciaPageHeader";
import { cn } from "@/lib/utils";
import { Database, Download, FileText, ExternalLink, Search, Info, Globe } from "lucide-react";

const DATASETS = [
  {
    id: "orcamento",
    title: "Orçamento Municipal",
    description: "LOA, LDO e PPA. Receitas e despesas previstas e realizadas por exercício fiscal.",
    category: "Financeiro",
    formats: ["CSV", "JSON", "XML"],
    records: "12.847",
    updated: "2026-06-01",
    downloadUrl: "#",
    licenca: "CC BY 4.0",
    tags: ["orçamento", "finanças", "LOA", "LDO"],
  },
  {
    id: "despesas",
    title: "Despesas Municipais",
    description: "Empenhos, liquidações e pagamentos por categoria, secretaria e beneficiário.",
    category: "Financeiro",
    formats: ["CSV", "JSON"],
    records: "45.320",
    updated: "2026-06-10",
    downloadUrl: "#",
    licenca: "CC BY 4.0",
    tags: ["despesas", "empenhos", "pagamentos"],
  },
  {
    id: "receitas",
    title: "Receitas Municipais",
    description: "Arrecadação por fonte de receita, categoria e período de competência.",
    category: "Financeiro",
    formats: ["CSV", "JSON"],
    records: "8.910",
    updated: "2026-06-10",
    downloadUrl: "#",
    licenca: "CC BY 4.0",
    tags: ["receitas", "arrecadação"],
  },
  {
    id: "servidores",
    title: "Servidores Públicos",
    description: "Relação de servidores com cargo, secretaria, vínculo e remuneração (sem dados sensíveis).",
    category: "Pessoal",
    formats: ["CSV", "JSON"],
    records: "4.215",
    updated: "2026-06-01",
    downloadUrl: "#",
    licenca: "CC BY 4.0",
    tags: ["servidores", "pessoal", "folha"],
  },
  {
    id: "licitacoes",
    title: "Licitações e Contratos",
    description: "Editais, pregões, dispensas e contratos firmados pelo município.",
    category: "Contratos",
    formats: ["CSV", "JSON", "XML"],
    records: "2.847",
    updated: "2026-06-08",
    downloadUrl: "#",
    licenca: "CC BY 4.0",
    tags: ["licitações", "contratos", "editais"],
  },
  {
    id: "legislacao",
    title: "Atos Normativos",
    description: "Leis, decretos, portarias e resoluções municipais desde 2000.",
    category: "Legislação",
    formats: ["CSV", "JSON"],
    records: "3.482",
    updated: "2026-06-05",
    downloadUrl: "#",
    licenca: "CC BY 4.0",
    tags: ["legislação", "decretos", "portarias"],
  },
  {
    id: "obras",
    title: "Obras e Investimentos",
    description: "Relação de obras públicas em execução ou concluídas, com localização e valores.",
    category: "Obras",
    formats: ["CSV", "JSON"],
    records: "387",
    updated: "2026-05-28",
    downloadUrl: "#",
    licenca: "CC BY 4.0",
    tags: ["obras", "investimentos", "infraestrutura"],
  },
  {
    id: "equipamentos",
    title: "Equipamentos e Unidades Públicas",
    description: "Cadastro de escolas, UBSs, UPAs, CEMs e demais equipamentos municipais.",
    category: "Serviços",
    formats: ["CSV", "JSON"],
    records: "214",
    updated: "2026-04-15",
    downloadUrl: "#",
    licenca: "CC BY 4.0",
    tags: ["saúde", "educação", "equipamentos"],
  },
];

const CATEGORIES = ["Todos", ...Array.from(new Set(DATASETS.map(d => d.category)))];
const FORMAT_COLORS: Record<string, string> = {
  CSV: "bg-green-100 text-green-700",
  JSON: "bg-yellow-100 text-yellow-700",
  XML: "bg-blue-100 text-blue-700",
};

export default function DadosAbertos() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");

  const filtered = DATASETS.filter(d =>
    (category === "Todos" || d.category === category) &&
    (!search.trim() || d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase()) ||
      d.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <Layout>
      <TransparenciaPageHeader
        title="Dados Abertos"
        subtitle="Catálogo de conjuntos de dados públicos para download nos formatos CSV, JSON e XML. Conforme LAI, Art. 8°, §3°, II."
        icon={Database}
        breadcrumbs={[{ label: "Dados Abertos" }]}
        laiRef="LAI, Art. 8°, §3°, II — Decreto 8.777/2016"
        lastUpdated={new Date().toISOString()}
        complianceStatus="ok"
        complianceLabel="Catálogo Publicado"
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Info banner */}
        <div className="flex gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl mb-8">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-sm text-blue-800">
            Todos os dados estão licenciados sob <strong>Creative Commons Attribution 4.0 (CC BY 4.0)</strong>.
            Você pode usar, compartilhar e adaptar livremente os dados, desde que cite a fonte (Prefeitura de Parauapebas — PA).
            Para integração via API, consulte nossa{" "}
            <a href="#" className="underline font-semibold">documentação da API pública</a>.
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Datasets", value: DATASETS.length.toString() },
            { label: "Total de Registros", value: "77k+" },
            { label: "Formatos", value: "3" },
            { label: "Atualização", value: "Mensal" },
          ].map(({ label, value }) => (
            <div key={label} className="bg-card border border-border rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">{label}</p>
              <p className="font-black text-2xl text-primary">{value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8 items-center">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
            <input type="search" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar dataset..." className="pl-10 pr-3 py-2.5 border-2 border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary w-full" aria-label="Buscar dataset" />
          </div>
          <div className="flex gap-2 flex-wrap" role="group" aria-label="Filtrar por categoria">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={cn("px-3 py-2 rounded-xl text-sm font-semibold border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary",
                  category === cat ? "bg-primary text-white border-primary" : "bg-background border-border hover:border-primary/40")}
                aria-pressed={category === cat}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Datasets grid */}
        <p className="text-sm text-muted-foreground mb-4">{filtered.length} dataset{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}</p>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground border-2 border-dashed border-border rounded-2xl">
            <Database className="w-10 h-10 mx-auto mb-3 opacity-30" aria-hidden="true" />
            <p className="text-sm">Nenhum dataset encontrado.</p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list" aria-label="Catálogo de dados abertos">
            {filtered.map(dataset => (
              <li key={dataset.id}>
                <article className="group h-full flex flex-col bg-card border border-border rounded-2xl p-5 hover:border-primary/30 hover:shadow-md transition-all">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Database className="w-5 h-5 text-primary" aria-hidden="true" />
                    </div>
                    <span className="text-[11px] font-bold px-2 py-1 bg-muted rounded-lg text-muted-foreground">{dataset.category}</span>
                  </div>

                  <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors mb-2">{dataset.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-4">{dataset.description}</p>

                  {/* Metadata */}
                  <div className="space-y-2 mb-4 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Registros</span>
                      <span className="font-bold text-foreground tabular-nums">{dataset.records}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Atualizado</span>
                      <span className="font-bold text-foreground">{new Date(dataset.updated).toLocaleDateString("pt-BR")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Licença</span>
                      <span className="font-bold text-foreground">{dataset.licenca}</span>
                    </div>
                  </div>

                  {/* Formats */}
                  <div className="flex gap-1.5 mb-4 flex-wrap">
                    {dataset.formats.map(f => (
                      <span key={f} className={cn("text-[10px] font-bold px-2 py-1 rounded uppercase", FORMAT_COLORS[f] ?? "bg-muted text-muted-foreground")}>
                        {f}
                      </span>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="flex gap-1 flex-wrap mb-4">
                    {dataset.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">#{tag}</span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto pt-3 border-t border-border">
                    <a href={dataset.downloadUrl}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-white font-bold text-xs rounded-xl hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                      aria-label={`Baixar dataset ${dataset.title}`}>
                      <Download className="w-3.5 h-3.5" aria-hidden="true" /> Baixar
                    </a>
                    <a href={`#dataset-${dataset.id}`}
                      className="px-3 py-2.5 border border-border rounded-xl text-xs font-bold text-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                      aria-label={`Ver metadados do dataset ${dataset.title}`}>
                      <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}

        {/* API reference */}
        <div className="mt-12 p-6 bg-zinc-900 text-white rounded-2xl">
          <div className="flex items-start gap-4">
            <Globe className="w-8 h-8 text-primary flex-shrink-0 mt-1" aria-hidden="true" />
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">API Pública — Integração</h3>
              <p className="text-zinc-300 text-sm mb-4">
                Além dos downloads, todos os dados estão disponíveis via API REST para integração com sistemas externos.
                Compatível com o padrão CKAN para interoperabilidade com outros portais de dados abertos.
              </p>
              <div className="bg-zinc-800 rounded-xl p-4 font-mono text-sm text-green-400 mb-4 overflow-x-auto">
                <p>GET /api/dados-abertos/orcamento?ano=2026&formato=json</p>
                <p className="text-zinc-500 mt-1"># Retorna dados do orçamento em formato JSON</p>
              </div>
              <a href="#" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline focus:outline-none focus:underline">
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
                Ver documentação completa da API
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
