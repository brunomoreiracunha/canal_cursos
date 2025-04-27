import React, { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export function RichTextEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const imageHandler = function (this: any) {
    const quill = this.quill;
    const url = prompt('Insira a URL da imagem:');
    if (url) {
      quill.insertEmbed(quill.getSelection().index, 'image', url, 'user');
    }
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ align: [] }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }), []);

  return (
    <div>
      <ReactQuill
        value={value}
        onChange={onChange}
        modules={modules}
        theme="snow"
        style={{ background: 'white', color: 'black' }}
      />
      <div className="text-xs text-gray-400 mt-2">
        Para inserir uma imagem, clique no ícone de imagem e cole o link de uma imagem hospedada na internet.
      </div>
    </div>
  );
}