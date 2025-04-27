// components/CourseInfoEditor.tsx
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import { useEffect } from 'react'

type Props = {
  value: string
  onChange: (html: string) => void
}

export default function CourseInfoEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value])

  return (
    <div className="bg-gray-900 text-white p-4 rounded-md border border-gray-700">
      <div className="flex flex-wrap gap-2 mb-2">
        <button onClick={() => editor?.chain().focus().toggleBold().run()} className="btn">Negrito</button>
        <button onClick={() => editor?.chain().focus().toggleItalic().run()} className="btn">Itálico</button>
        <button onClick={() => editor?.chain().focus().setParagraph().run()} className="btn">Parágrafo</button>
        <button onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className="btn">Título H2</button>
        <button onClick={() => editor?.chain().focus().setTextAlign('left').run()} className="btn">Esquerda</button>
        <button onClick={() => editor?.chain().focus().setTextAlign('center').run()} className="btn">Centro</button>
        <button onClick={() => editor?.chain().focus().setTextAlign('right').run()} className="btn">Direita</button>
      </div>

      <div className="prose prose-invert max-w-none bg-gray-800 p-3 rounded">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
