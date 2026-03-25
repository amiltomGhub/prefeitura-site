import { useState } from "react";
import { CmsLayout } from "@/components/cms/CmsLayout";
import { CmsCard, KpiCard, StatusBadge } from "@/components/cms/CmsCard";
import { Users, Plus, Shield, Pencil, Trash2, Search, Key, X, Save, UserCheck, UserX } from "lucide-react";

type Perfil = "admin" | "editor" | "redator" | "transparencia" | "readonly";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: Perfil;
  status: "ativo" | "inativo";
  ultimoAcesso: string;
  secretaria: string;
}

const PERFIL_LABELS: Record<Perfil, { label: string; color: string }> = {
  admin: { label: "Admin Municipal", color: "bg-red-500/15 text-red-400" },
  editor: { label: "Editor", color: "bg-primary/15 text-primary" },
  redator: { label: "Redator", color: "bg-blue-500/15 text-blue-400" },
  transparencia: { label: "Transparência", color: "bg-green-500/15 text-green-400" },
  readonly: { label: "Somente Leitura", color: "bg-zinc-500/15 text-zinc-400" },
};

const USUARIOS: Usuario[] = [
  { id: "u1", nome: "Admin Municipal", email: "admin@parauapebas.pa.gov.br", perfil: "admin", status: "ativo", ultimoAcesso: "2026-03-25", secretaria: "Gabinete" },
  { id: "u2", nome: "Ana Santos", email: "ana.santos@parauapebas.pa.gov.br", perfil: "editor", status: "ativo", ultimoAcesso: "2026-03-25", secretaria: "SESAU" },
  { id: "u3", nome: "Carlos Lima", email: "carlos.lima@parauapebas.pa.gov.br", perfil: "redator", status: "ativo", ultimoAcesso: "2026-03-24", secretaria: "Gabinete" },
  { id: "u4", nome: "Maria Costa", email: "maria.costa@parauapebas.pa.gov.br", perfil: "transparencia", status: "ativo", ultimoAcesso: "2026-03-23", secretaria: "SEFAZ" },
  { id: "u5", nome: "Pedro Melo", email: "pedro.melo@parauapebas.pa.gov.br", perfil: "redator", status: "ativo", ultimoAcesso: "2026-03-20", secretaria: "SEMOSP" },
  { id: "u6", nome: "Usuário Inativo", email: "inativo@parauapebas.pa.gov.br", perfil: "readonly", status: "inativo", ultimoAcesso: "2025-12-10", secretaria: "SEMED" },
];

const PERMISSIONS: Record<Perfil, string[]> = {
  admin: ["Todas as funcionalidades", "Gestão de usuários", "Configurações do sistema"],
  editor: ["Publicar notícias", "Gerenciar páginas", "Banners", "Galeria"],
  redator: ["Criar e editar notícias (rascunho)", "Enviar para aprovação"],
  transparencia: ["Upload de documentos LAI", "Relatórios de conformidade"],
  readonly: ["Visualizar conteúdo (sem edição)"],
};

export default function CmsUsuarios() {
  const [search, setSearch] = useState("");
  const [showNewForm, setShowNewForm] = useState(false);
  const [newUser, setNewUser] = useState({ nome: "", email: "", perfil: "redator" as Perfil, secretaria: "" });

  const filtered = USUARIOS.filter(u => !search || u.nome.toLowerCase().includes(search.toLowerCase()) || u.email.includes(search.toLowerCase()));

  return (
    <CmsLayout
      title="Gestão de Usuários"
      actions={
        <button onClick={() => setShowNewForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" aria-hidden="true" /> Novo Usuário
        </button>
      }
    >
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KpiCard label="Total de usuários" value={USUARIOS.length} icon={Users} color="blue" />
          <KpiCard label="Ativos" value={USUARIOS.filter(u => u.status === "ativo").length} icon={UserCheck} color="green" />
          <KpiCard label="Inativos" value={USUARIOS.filter(u => u.status === "inativo").length} icon={UserX} color="default" />
          <KpiCard label="Admins" value={USUARIOS.filter(u => u.perfil === "admin").length} icon={Shield} color="red" />
        </div>

        {/* Profiles legend */}
        <CmsCard className="mb-6">
          <h2 className="text-sm font-bold text-white mb-4">Perfis de Acesso</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(Object.entries(PERFIL_LABELS) as [Perfil, { label: string; color: string }][]).map(([perfil, { label, color }]) => (
              <div key={perfil} className="flex flex-col gap-1 p-3 bg-zinc-800 rounded-xl">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full self-start ${color}`}>{label}</span>
                <ul className="text-xs text-zinc-600 space-y-0.5 mt-1">
                  {PERMISSIONS[perfil].map(p => <li key={p}>· {p}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </CmsCard>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" aria-hidden="true" />
          <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar usuário..."
            className="w-full pl-10 pr-3 py-2.5 bg-zinc-800 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary" />
        </div>

        <CmsCard padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Lista de usuários">
              <thead className="border-b border-white/10 bg-zinc-800/50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">Usuário</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide hidden md:table-cell">Perfil</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide hidden lg:table-cell">Secretaria</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide hidden xl:table-cell">Último acesso</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide hidden sm:table-cell">Status</th>
                  <th scope="col" className="px-4 py-3 w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(user => {
                  const pc = PERFIL_LABELS[user.perfil];
                  return (
                    <tr key={user.id} className="hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-black text-primary">{user.nome.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-medium text-zinc-200 text-sm">{user.nome}</p>
                            <p className="text-xs text-zinc-600 font-mono">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${pc.color}`}>{pc.label}</span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell"><span className="text-xs text-zinc-500">{user.secretaria}</span></td>
                      <td className="px-4 py-3 hidden xl:table-cell"><span className="text-xs text-zinc-600 font-mono">{new Date(user.ultimoAcesso).toLocaleDateString("pt-BR")}</span></td>
                      <td className="px-4 py-3 hidden sm:table-cell"><StatusBadge status={user.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <button className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition-colors" title="Editar usuário"><Pencil className="w-3.5 h-3.5" aria-hidden="true" /></button>
                          <button className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-500 hover:text-yellow-400 hover:bg-yellow-500/10 transition-colors" title="Redefinir senha"><Key className="w-3.5 h-3.5" aria-hidden="true" /></button>
                          <button className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Desativar usuário"><Trash2 className="w-3.5 h-3.5" aria-hidden="true" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CmsCard>
      </div>

      {showNewForm && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setShowNewForm(false)}>
          <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h2 className="font-bold text-white">Novo Usuário do CMS</h2>
              <button onClick={() => setShowNewForm(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-zinc-400 hover:text-white" aria-label="Fechar"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              {([
                { label: "Nome completo", key: "nome" as const, placeholder: "João da Silva" },
                { label: "E-mail gov.br", key: "email" as const, placeholder: "joao@parauapebas.pa.gov.br" },
                { label: "Secretaria", key: "secretaria" as const, placeholder: "SESAU" },
              ]).map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">{label}</label>
                  <input type="text" value={newUser[key]} onChange={e => setNewUser(u => ({ ...u, [key]: e.target.value }))} placeholder={placeholder}
                    className="w-full px-3 py-2.5 bg-zinc-800 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary" />
                </div>
              ))}
              <div>
                <label htmlFor="new-user-perfil" className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Perfil de acesso</label>
                <select id="new-user-perfil" value={newUser.perfil} onChange={e => setNewUser(u => ({ ...u, perfil: e.target.value as Perfil }))}
                  className="w-full px-3 py-2.5 bg-zinc-800 border border-white/10 rounded-xl text-sm text-zinc-300 focus:outline-none focus:border-primary">
                  {(Object.entries(PERFIL_LABELS) as [Perfil, { label: string; color: string }][]).map(([v, { label }]) => <option key={v} value={v}>{label}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 justify-end p-5 border-t border-white/10">
              <button onClick={() => setShowNewForm(false)} className="px-4 py-2.5 text-sm font-medium text-zinc-400 border border-white/10 rounded-xl hover:bg-white/5">Cancelar</button>
              <button onClick={() => setShowNewForm(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-primary rounded-xl hover:bg-primary/90">
                <Save className="w-4 h-4" aria-hidden="true" /> Criar Usuário
              </button>
            </div>
          </div>
        </div>
      )}
    </CmsLayout>
  );
}
