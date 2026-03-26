import { useState } from "react";
import { Redirect } from "wouter";
import { RhLayout } from "@/components/servidor/ServidorLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useServidor } from "@/contexts/ServidorContext";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  CheckCircle, XCircle, Clock, Search, FileText,
  ChevronDown, ChevronUp, AlertCircle
} from "lucide-react";
import {
  useRhRequerimentos, useRhDeferirRequerimento, useRhIndeferirRequerimento,
} from "@/services/servidorApi";

function PareceEditor({ onChange }: { onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Escreva o parecer técnico..." }),
    ],
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex items-center gap-1 px-3 py-2 bg-gray-50 border-b border-gray-200 flex-wrap">
        {[
          { label: "B", action: () => editor?.chain().focus().toggleBold().run(), active: editor?.isActive("bold") },
          { label: "I", action: () => editor?.chain().focus().toggleItalic().run(), active: editor?.isActive("italic") },
          { label: "••", action: () => editor?.chain().focus().toggleBulletList().run(), active: editor?.isActive("bulletList") },
        ].map((btn) => (
          <button
            key={btn.label}
            type="button"
            onClick={btn.action}
            className={`px-2 py-1 text-xs font-medium rounded hover:bg-gray-200 transition-colors ${btn.active ? "bg-gray-200 text-gray-800" : "text-gray-600"}`}
          >
            {btn.label}
          </button>
        ))}
      </div>
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-3 text-sm min-h-[120px] focus-within:outline-none"
      />
    </div>
  );
}

function statusBadge(s: string) {
  if (s === "deferido") return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 flex items-center gap-1 text-xs"><CheckCircle className="h-3 w-3" />Deferido</Badge>;
  if (s === "indeferido") return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 flex items-center gap-1 text-xs"><XCircle className="h-3 w-3" />Indeferido</Badge>;
  return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 flex items-center gap-1 text-xs"><Clock className="h-3 w-3" />Aguardando</Badge>;
}

export default function RhRequerimentos() {
  const { servidor } = useServidor();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [pareceres, setPareceres] = useState<Record<string, string>>({});
  const [decisoes, setDecisoes] = useState<Record<string, string>>({});
  const [expandido, setExpandido] = useState<string | null>(null);

  const { data: reqs, isLoading, error } = useRhRequerimentos();
  const { mutateAsync: deferir } = useRhDeferirRequerimento();
  const { mutateAsync: indeferir } = useRhIndeferirRequerimento();

  if (!servidor.isRH && !servidor.isAdmin) {
    return <Redirect to="/servidor/contracheque" />;
  }

  const filtered = (reqs ?? []).filter(r =>
    r.nome.toLowerCase().includes(search.toLowerCase()) ||
    r.protocolo.includes(search) ||
    r.tipo.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDeferir(id: string) {
    const parecer = pareceres[id] ?? "";
    const decisao = decisoes[id] ?? "DEFERIDO";
    try {
      await deferir({ id, parecer, decisao });
      setExpandido(null);
      const req = (reqs ?? []).find(r => r.id === id);
      toast({ title: "Requerimento deferido!", description: `Protocolo ${req?.protocolo}.` });
    } catch {
      toast({ title: "Erro ao deferir requerimento.", variant: "destructive" });
    }
  }

  async function handleIndeferir(id: string) {
    const parecer = pareceres[id] ?? "";
    try {
      await indeferir({ id, parecer });
      setExpandido(null);
      toast({ title: "Requerimento indeferido.", description: "Decisão registrada com prazo de recurso de 15 dias." });
    } catch {
      toast({ title: "Erro ao indeferir requerimento.", variant: "destructive" });
    }
  }

  return (
    <RhLayout title="Requerimentos — Fila de Análise" subtitle="Analise e emita parecer técnico">
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-6">
          <AlertCircle className="h-4 w-4" />
          Não foi possível carregar os requerimentos.
        </div>
      )}

      {/* Filtro */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input className="pl-9 text-sm" placeholder="Nome, protocolo ou tipo..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Lista */}
      {isLoading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((req) => {
            const isExpanded = expandido === req.id;
            const isPending = req.status === "pendente";

            return (
              <Card key={req.id} className={`transition-all ${!isPending ? "opacity-60" : ""}`}>
                <CardContent className="pt-5">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">{req.nome}</p>
                      <p className="text-xs text-gray-500">Mat. {req.matricula} — {req.cargo} — {req.secretaria}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {statusBadge(req.status)}
                      {isPending && (
                        <button
                          onClick={() => setExpandido(isExpanded ? null : req.id)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Info grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-gray-50 rounded-lg p-3">
                    <div>
                      <p className="text-gray-400 mb-0.5">Protocolo</p>
                      <p className="font-mono font-medium text-blue-600">{req.protocolo}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-0.5">Tipo</p>
                      <p className="font-medium text-gray-700">{req.tipo}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-0.5">Protocolado</p>
                      <p className="font-medium text-gray-700">{req.protocolado}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-0.5">Prazo</p>
                      <p className="font-medium text-gray-700">{req.prazo}</p>
                    </div>
                  </div>

                  {/* Expandido */}
                  {isExpanded && isPending && (
                    <div className="mt-4 space-y-4 border-t border-gray-100 pt-4">
                      {/* Justificativa */}
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1.5">Justificativa do Servidor</p>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700">
                          {req.justificativa}
                        </div>
                      </div>

                      {/* Documentos */}
                      {req.documentos && req.documentos.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1.5">Documentos Anexados</p>
                          {req.documentos.map((d, i) => (
                            <div key={i} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded text-xs">
                              <FileText className="h-4 w-4 text-blue-500" />
                              <span className="font-medium">{d.nome}</span>
                              <span className="text-gray-400">{d.tamanho}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Decisão */}
                      <div>
                        <Label className="text-xs font-medium mb-1.5 block">Decisão</Label>
                        <Select
                          value={decisoes[req.id] ?? "DEFERIDO"}
                          onValueChange={(v) => setDecisoes({ ...decisoes, [req.id]: v })}
                        >
                          <SelectTrigger className="text-sm">
                            <SelectValue placeholder="Selecione a decisão..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="DEFERIDO">DEFERIDO</SelectItem>
                            <SelectItem value="DEFERIDO_PARCIALMENTE">DEFERIDO PARCIALMENTE</SelectItem>
                            <SelectItem value="INDEFERIDO">INDEFERIDO</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Parecer TipTap */}
                      <div>
                        <Label className="text-xs font-medium mb-1.5 block">Parecer Técnico</Label>
                        <PareceEditor onChange={(html) => setPareceres({ ...pareceres, [req.id]: html })} />
                      </div>

                      {/* Botões */}
                      <div className="flex gap-3 justify-end">
                        <Button
                          variant="outline"
                          className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleIndeferir(req.id)}
                        >
                          <XCircle className="h-4 w-4" />Indeferir
                        </Button>
                        <Button
                          className="gap-2 bg-green-600 hover:bg-green-700"
                          onClick={() => handleDeferir(req.id)}
                        >
                          <CheckCircle className="h-4 w-4" />Deferir
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <FileText className="h-10 w-10 mx-auto mb-3" />
              <p>Nenhum requerimento encontrado.</p>
            </div>
          )}
        </div>
      )}
    </RhLayout>
  );
}
