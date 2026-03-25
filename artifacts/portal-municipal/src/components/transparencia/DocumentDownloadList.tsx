import { FileText, Download, Eye, CalendarDays, HardDrive } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentItem {
  id: string;
  title: string;
  description?: string;
  fileUrl?: string | null;
  previewUrl?: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  fileSize?: string;
  fileType?: "PDF" | "CSV" | "XML" | "JSON" | "DOC" | "XLS" | "ZIP";
  year?: number;
  category?: string;
}

interface DocumentDownloadListProps {
  documents: DocumentItem[];
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}

const TYPE_COLORS: Record<string, string> = {
  PDF: "bg-red-100 text-red-700",
  CSV: "bg-green-100 text-green-700",
  XML: "bg-blue-100 text-blue-700",
  JSON: "bg-yellow-100 text-yellow-700",
  DOC: "bg-blue-100 text-blue-700",
  XLS: "bg-green-100 text-green-700",
  ZIP: "bg-zinc-100 text-zinc-700",
};

function SkeletonRow() {
  return (
    <li className="flex items-center gap-4 p-4 animate-pulse border-b border-border last:border-0">
      <div className="w-10 h-10 bg-muted rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-muted rounded w-2/3" />
        <div className="h-3 bg-muted rounded w-1/3" />
      </div>
      <div className="flex gap-2">
        <div className="w-24 h-8 bg-muted rounded-lg" />
      </div>
    </li>
  );
}

export function DocumentDownloadList({ documents, isLoading, emptyMessage, className }: DocumentDownloadListProps) {
  if (isLoading) {
    return (
      <ul role="list" className={cn("divide-y divide-border border border-border rounded-2xl overflow-hidden bg-card", className)}>
        {Array(3).fill(0).map((_, i) => <SkeletonRow key={i} />)}
      </ul>
    );
  }

  if (!documents.length) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-16 border-2 border-dashed border-border rounded-2xl text-muted-foreground gap-3", className)}>
        <FileText className="w-10 h-10 opacity-30" aria-hidden="true" />
        <p className="text-sm">{emptyMessage ?? "Nenhum documento disponível."}</p>
      </div>
    );
  }

  return (
    <ul role="list" className={cn("divide-y divide-border border border-border rounded-2xl overflow-hidden bg-card", className)}>
      {documents.map((doc) => {
        const typeColor = TYPE_COLORS[doc.fileType ?? "PDF"] ?? TYPE_COLORS["PDF"]!;
        return (
          <li key={doc.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 hover:bg-muted/40 transition-colors">
            {/* Icon */}
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0" aria-hidden="true">
              <FileText className="w-5 h-5 text-muted-foreground" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-sm text-foreground">{doc.title}</h3>
                {doc.fileType && (
                  <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded uppercase", typeColor)}>
                    {doc.fileType}
                  </span>
                )}
                {doc.year && (
                  <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    {doc.year}
                  </span>
                )}
              </div>
              {doc.description && (
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{doc.description}</p>
              )}
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                {doc.publishedAt && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarDays className="w-3 h-3" aria-hidden="true" />
                    {new Date(doc.publishedAt).toLocaleDateString("pt-BR")}
                  </span>
                )}
                {doc.fileSize && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <HardDrive className="w-3 h-3" aria-hidden="true" />
                    {doc.fileSize}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {doc.previewUrl && (
                <a
                  href={doc.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-foreground border border-border rounded-lg hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label={`Visualizar ${doc.title}`}
                >
                  <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                  Visualizar
                </a>
              )}
              {doc.fileUrl ? (
                <a
                  href={doc.fileUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label={`Baixar ${doc.title}`}
                >
                  <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  Baixar
                </a>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-muted-foreground bg-muted rounded-lg cursor-not-allowed opacity-50">
                  <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  Indisponível
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
