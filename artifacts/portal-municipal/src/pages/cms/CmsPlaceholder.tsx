import { CmsLayout } from "@/components/cms/CmsLayout";
import { CmsEmptyState } from "@/components/cms/CmsCard";
import { type LucideIcon } from "lucide-react";

interface CmsPlaceholderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  wip?: boolean;
}

export function CmsPlaceholder({ title, description, icon, wip = true }: CmsPlaceholderProps) {
  return (
    <CmsLayout title={title}>
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <CmsEmptyState
          icon={icon}
          title={title}
          description={wip ? `${description} — Módulo em desenvolvimento.` : description}
        />
      </div>
    </CmsLayout>
  );
}
