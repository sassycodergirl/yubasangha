"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";

const fieldLabelClass = "block text-xs font-medium uppercase tracking-[0.06em] text-gray-700";

function ToolbarButton({ active, onClick, label, children }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()} // keep focus (and the current selection) in the editor, not on this button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
        active ? "bg-maroon text-white" : "text-gray-700 hover:bg-gray-200"
      }`}
    >
      {children}
    </button>
  );
}

// Minimal rich-text input -- bold/italic/lists/links, the handful of tags
// src/components/artist/ArtistProcess.jsx's PROSE_CLASS actually styles.
// Stores (and is given) plain HTML, same as any other text field, so this
// drops into an admin form exactly like ImageUploadField or any other
// LeafField-level input. The Tiptap-based editor named in CLAUDE.md's
// planned tech stack ("Rich text editor (CMS content): Tiptap") -- this is
// its first real use; reach for it again for the next section that needs
// more than a plain textarea instead of building a one-off.
export default function RichTextEditor({ label, value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false }), // headings are their own separate field on every row that uses this
      Link.configure({ openOnClick: false, autolink: true }),
    ],
    content: value || "",
    immediatelyRender: false, // SSR-safe (Tiptap's own recommendation for Next.js) -- avoids a hydration mismatch on first paint
    editorProps: {
      attributes: {
        class:
          "min-h-[120px] px-3.5 py-2.5 text-sm text-ink outline-none [&_a]:text-maroon [&_a]:underline [&_ol]:ml-5 [&_ol]:list-decimal [&_p+p]:mt-2 [&_ul]:ml-5 [&_ul]:list-disc",
      },
    },
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
  });

  if (!editor) return null;

  function setLink() {
    const previous = editor.getAttributes("link").href ?? "";
    const url = window.prompt("Link URL (leave blank to remove)", previous);
    if (url === null) return; // cancelled
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  return (
    <div>
      {label ? <label className={fieldLabelClass}>{label}</label> : null}
      <div className="mt-1.5 overflow-hidden rounded-xl border border-gold bg-white shadow-sm focus-within:shadow-[0_0_0_4px_rgba(201,154,59,0.12)]">
        <div className="flex flex-wrap items-center gap-1 border-b border-gold bg-gray-50 px-2 py-1.5">
          <ToolbarButton
            label="Bold"
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <strong>B</strong>
          </ToolbarButton>
          <ToolbarButton
            label="Italic"
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <em>I</em>
          </ToolbarButton>
          <span className="mx-0.5 h-4 w-px bg-gold/40" />
          <ToolbarButton
            label="Bullet list"
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            • List
          </ToolbarButton>
          <ToolbarButton
            label="Numbered list"
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            1. List
          </ToolbarButton>
          <span className="mx-0.5 h-4 w-px bg-gold/40" />
          <ToolbarButton label="Link" active={editor.isActive("link")} onClick={setLink}>
            Link
          </ToolbarButton>
        </div>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
