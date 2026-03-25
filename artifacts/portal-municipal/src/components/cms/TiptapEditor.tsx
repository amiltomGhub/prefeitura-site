import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { cn } from "@/lib/utils";
import {
  Bold, Italic, UnderlineIcon, Strikethrough, Heading2, Heading3, Heading4,
  List, ListOrdered, Quote, Code, Minus, Undo, Redo, Link2, Image as ImageIcon,
} from "lucide-react";

interface TiptapEditorProps {
  content?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: number;
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      aria-pressed={active}
      className={cn(
        "w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50",
        active
          ? "bg-primary/20 text-primary"
          : "text-zinc-400 hover:text-white hover:bg-white/10",
        disabled && "opacity-30 cursor-not-allowed"
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-6 bg-white/10 mx-1 flex-shrink-0" aria-hidden="true" />;
}

export function TiptapEditor({ content, onChange, placeholder, className, minHeight = 400 }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-primary underline" } }),
      Image.configure({ HTMLAttributes: { class: "max-w-full rounded-xl my-4" } }),
      Placeholder.configure({ placeholder: placeholder ?? "Escreva o conteúdo aqui..." }),
      Underline.configure({}),
    ],
    content: content ?? "",
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-invert prose-sm max-w-none p-5 focus:outline-none text-zinc-200",
          "prose-headings:text-white prose-headings:font-bold",
          "prose-a:text-primary prose-blockquote:border-l-primary",
          "prose-code:bg-white/10 prose-code:rounded prose-code:text-sm prose-code:px-1.5 prose-code:py-0.5",
          "[&_table]:w-full [&_td]:border [&_td]:border-white/10 [&_td]:p-2"
        ),
      },
    },
  });

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("URL do link:");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("URL da imagem:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className={cn("border border-white/10 rounded-2xl overflow-hidden bg-zinc-900", className)}>
      {/* Toolbar */}
      <div className="border-b border-white/10 p-2 flex flex-wrap items-center gap-0.5 bg-zinc-800/50">
        {/* Text format */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Negrito (Ctrl+B)">
          <Bold className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Itálico (Ctrl+I)">
          <Italic className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Sublinhado (Ctrl+U)">
          <UnderlineIcon className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Tachado">
          <Strikethrough className="w-3.5 h-3.5" />
        </ToolbarButton>

        <Divider />

        {/* Headings */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Título H2">
          <Heading2 className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Título H3">
          <Heading3 className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} active={editor.isActive("heading", { level: 4 })} title="Título H4">
          <Heading4 className="w-3.5 h-3.5" />
        </ToolbarButton>

        <Divider />

        {/* Lists */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Lista não-ordenada">
          <List className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Lista numerada">
          <ListOrdered className="w-3.5 h-3.5" />
        </ToolbarButton>

        <Divider />

        {/* Blocks */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Citação">
          <Quote className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="Código inline">
          <Code className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Separador">
          <Minus className="w-3.5 h-3.5" />
        </ToolbarButton>

        <Divider />

        {/* Media */}
        <ToolbarButton onClick={addLink} active={editor.isActive("link")} title="Inserir link">
          <Link2 className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={addImage} title="Inserir imagem via URL">
          <ImageIcon className="w-3.5 h-3.5" />
        </ToolbarButton>

        <Divider />

        {/* Undo/Redo */}
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Desfazer (Ctrl+Z)">
          <Undo className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Refazer (Ctrl+Y)">
          <Redo className="w-3.5 h-3.5" />
        </ToolbarButton>
      </div>

      {/* Editor area */}
      <EditorContent
        editor={editor}
        style={{ minHeight }}
        className="cursor-text"
        aria-label="Área de edição de conteúdo"
      />

      {/* Footer: word count */}
      <div className="border-t border-white/10 px-4 py-2 flex items-center justify-between text-xs text-zinc-600">
        <span>{editor.storage.characterCount?.words?.() ?? 0} palavras</span>
        <span>{editor.getHTML().length} caracteres</span>
      </div>
    </div>
  );
}
