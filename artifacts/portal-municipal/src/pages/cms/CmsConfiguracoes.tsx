import { useState } from "react";
import { CmsLayout } from "@/components/cms/CmsLayout";
import { CmsCard } from "@/components/cms/CmsCard";
import { Settings, Globe, Mail, Phone, MapPin, Save, Key, Database, RefreshCcw, AlertTriangle, CheckCircle } from "lucide-react";

export default function CmsConfiguracoes() {
  const [saved, setSaved] = useState(false);
  const [config, setConfig] = useState({
    nomePortal: "Portal da Prefeitura Municipal de Parauapebas",
    nomeCurto: "Parauapebas",
    cnpj: "04.105.134/0001-71",
    endereco: "Praça Cívica, s/n — Parauapebas — PA — CEP 68.515-000",
    telefone: "(94) 3183-2000",
    email: "atendimento@parauapebas.pa.gov.br",
    whatsapp: "5594999999999",
    googleAnalytics: "G-XXXXXXXXXX",
    emailSic: "sic@parauapebas.pa.gov.br",
    prazoSic: "20",
    cookiePoliticaUrl: "/privacidade",
    manutencao: false,
  });

  async function handleSave() {
    await new Promise(r => setTimeout(r, 500));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <CmsLayout
      title="Configurações do Portal"
      actions={
        <button onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors">
          <Save className="w-4 h-4" aria-hidden="true" />
          {saved ? "Salvo!" : "Salvar Configurações"}
        </button>
      }
    >
      <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
        {saved && (
          <div className="flex items-center gap-2 bg-green-900/30 border border-green-500/20 rounded-xl px-4 py-3 text-sm text-green-300 font-semibold" role="alert">
            <CheckCircle className="w-4 h-4" aria-hidden="true" /> Configurações salvas com sucesso!
          </div>
        )}

        {/* Informações do município */}
        <CmsCard>
          <h2 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" aria-hidden="true" /> Informações do Município
          </h2>
          <div className="space-y-4">
            {([
              { label: "Nome completo do portal", key: "nomePortal" as const },
              { label: "Nome curto", key: "nomeCurto" as const },
              { label: "CNPJ", key: "cnpj" as const },
              { label: "Endereço completo", key: "endereco" as const },
              { label: "Telefone central", key: "telefone" as const },
              { label: "E-mail de atendimento", key: "email" as const },
              { label: "WhatsApp (somente números)", key: "whatsapp" as const },
            ]).map(({ label, key }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">{label}</label>
                <input type="text" value={config[key] as string} onChange={e => setConfig(c => ({ ...c, [key]: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-zinc-800 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary transition-colors" />
              </div>
            ))}
          </div>
        </CmsCard>

        {/* Integrações */}
        <CmsCard>
          <h2 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
            <Key className="w-4 h-4 text-yellow-400" aria-hidden="true" /> Integrações e Métricas
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Google Analytics (ID)</label>
              <input type="text" value={config.googleAnalytics} onChange={e => setConfig(c => ({ ...c, googleAnalytics: e.target.value }))}
                placeholder="G-XXXXXXXXXX" className="w-full px-3 py-2.5 bg-zinc-800 border border-white/10 rounded-xl text-sm text-white font-mono focus:outline-none focus:border-primary" />
            </div>
          </div>
        </CmsCard>

        {/* SIC */}
        <CmsCard>
          <h2 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
            <Mail className="w-4 h-4 text-green-400" aria-hidden="true" /> Configurações do e-SIC (LAI)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">E-mail da equipe SIC</label>
              <input type="email" value={config.emailSic} onChange={e => setConfig(c => ({ ...c, emailSic: e.target.value }))}
                className="w-full px-3 py-2.5 bg-zinc-800 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Prazo padrão (dias corridos)</label>
              <input type="number" min="1" max="60" value={config.prazoSic} onChange={e => setConfig(c => ({ ...c, prazoSic: e.target.value }))}
                className="w-full px-3 py-2.5 bg-zinc-800 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary" />
              <p className="text-xs text-zinc-600 mt-1">LAI: 20 dias + prorrogação de 10 dias</p>
            </div>
          </div>
        </CmsCard>

        {/* Manutenção */}
        <CmsCard>
          <h2 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
            <Database className="w-4 h-4 text-zinc-400" aria-hidden="true" /> Sistema e Manutenção
          </h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
              <input type="checkbox" checked={config.manutencao} onChange={e => setConfig(c => ({ ...c, manutencao: e.target.checked }))} className="w-4 h-4 rounded accent-red-500" />
              <div>
                <p className="text-sm font-semibold text-zinc-300">Modo de Manutenção</p>
                <p className="text-xs text-zinc-500">O portal exibirá página de manutenção para os visitantes. CMS permanece acessível.</p>
              </div>
            </label>
            <div className="flex gap-3 flex-wrap">
              <button className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-400 border border-white/10 rounded-xl hover:bg-white/5 hover:text-white transition-colors">
                <RefreshCcw className="w-3.5 h-3.5" aria-hidden="true" /> Limpar Cache do Portal
              </button>
              <button className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-400 border border-white/10 rounded-xl hover:bg-white/5 hover:text-white transition-colors">
                <Database className="w-3.5 h-3.5" aria-hidden="true" /> Exportar Backup de Conteúdo
              </button>
            </div>
          </div>
        </CmsCard>
      </div>
    </CmsLayout>
  );
}
