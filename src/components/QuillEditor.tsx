import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

// Declaração de tipos para MathJax
declare global {
  interface Window {
    MathJax: any;
  }
}

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export interface QuillEditorRef {
  getContent: () => string;
  setContent: (content: string) => void;
  focus: () => void;
}

const QuillEditor = forwardRef<QuillEditorRef, QuillEditorProps>((
  { value, onChange, placeholder = 'Digite o conteúdo...', className = '' },
  ref
) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);
  const toolbarId = useRef(`toolbar-${Math.random().toString(36).substr(2, 9)}`);

  useImperativeHandle(ref, () => ({
    getContent: () => quillRef.current?.root.innerHTML || '',
    setContent: (content: string) => {
      if (quillRef.current) {
        quillRef.current.root.innerHTML = content;
        renderMath();
      }
    },
    focus: () => quillRef.current?.focus()
  }));

  const renderMath = () => {
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([editorRef.current]).catch((err: any) => {
        console.warn('MathJax rendering error:', err);
      });
    }
  };

  const initializeQuill = () => {
    if (!editorRef.current || quillRef.current) return;

    // Verificar se o editor já foi inicializado
    if (editorRef.current.getAttribute('data-quill-initialized') === 'true') {
      return;
    }

    // Limpar qualquer conteúdo existente no container
    editorRef.current.innerHTML = '';
    
    // Marcar como inicializado
    editorRef.current.setAttribute('data-quill-initialized', 'true');

    // Configuração do toolbar do Quill
    const toolbarOptions = [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['formula'],
      ['clean']
    ];

    // Encontrar o container da toolbar
    const toolbarContainer = document.getElementById(toolbarId.current);
    
    // Inicializar Quill com toolbar customizada
    quillRef.current = new Quill(editorRef.current, {
      theme: 'snow',
      placeholder,
      modules: {
        toolbar: {
          container: toolbarContainer || toolbarOptions,
          handlers: {
            bold: function() {
              const format = this.quill.getFormat();
              this.quill.format('bold', !format.bold);
              updateButtonState(toolbarContainer, 'bold', !format.bold);
            },
            italic: function() {
              const format = this.quill.getFormat();
              this.quill.format('italic', !format.italic);
              updateButtonState(toolbarContainer, 'italic', !format.italic);
            },
            underline: function() {
              const format = this.quill.getFormat();
              this.quill.format('underline', !format.underline);
              updateButtonState(toolbarContainer, 'underline', !format.underline);
            },
            strike: function() {
              const format = this.quill.getFormat();
              this.quill.format('strike', !format.strike);
              updateButtonState(toolbarContainer, 'strike', !format.strike);
            }
          }
        },
        formula: true
      }
    });

    // Adicionar listener para mudanças de seleção
    quillRef.current.on('selection-change', function(range) {
      if (range && toolbarContainer) {
        const format = quillRef.current.getFormat();
        updateButtonState(toolbarContainer, 'bold', format.bold);
        updateButtonState(toolbarContainer, 'italic', format.italic);
        updateButtonState(toolbarContainer, 'underline', format.underline);
        updateButtonState(toolbarContainer, 'strike', format.strike);
      }
    });

    // Função auxiliar para atualizar o estado dos botões
    const updateButtonState = (toolbar: HTMLElement | null, format: string, value: boolean) => {
      if (!toolbar) return;
      const button = toolbar.querySelector(`.ql-${format}`);
      if (button) {
        if (value) {
          button.classList.add('ql-active');
        } else {
          button.classList.remove('ql-active');
        }
      }
    };

    // Configurar conteúdo inicial
    if (value) {
      quillRef.current.root.innerHTML = value;
    }

    // Listener para mudanças no conteúdo
    quillRef.current.on('text-change', () => {
      const content = quillRef.current.root.innerHTML;
      onChange(content);
      
      // Renderizar fórmulas matemáticas após mudanças
      setTimeout(renderMath, 100);
    });

    // Renderizar fórmulas matemáticas iniciais
    setTimeout(renderMath, 100);
  };

  const configureMathJax = () => {
    if (window.MathJax) {
      window.MathJax.config = {
        tex: {
          inlineMath: [['$', '$'], ['\\(', '\\)']],
          displayMath: [['$$', '$$'], ['\\[', '\\]']],
          processEscapes: true,
          processEnvironments: true
        },
        options: {
          ignoreHtmlClass: 'tex2jax_ignore',
          processHtmlClass: 'tex2jax_process'
        }
      };
    }
  };

  useEffect(() => {
    // Configurar MathJax
    configureMathJax();

    // Aguardar o carregamento das bibliotecas
    const checkLibraries = () => {
      if (window.Quill && window.MathJax) {
        initializeQuill();
      } else {
        setTimeout(checkLibraries, 100);
      }
    };

    checkLibraries();

    // Cleanup
    return () => {
      if (quillRef.current) {
        // Destruir a instância do Quill adequadamente
        try {
          if (quillRef.current.off) {
            quillRef.current.off('text-change');
          }
        } catch (error) {
          console.warn('Erro ao limpar listeners do Quill:', error);
        }
        quillRef.current = null;
      }
      // Limpar o container do editor
       if (editorRef.current) {
         editorRef.current.innerHTML = '';
         editorRef.current.removeAttribute('data-quill-initialized');
       }
    };
  }, []);

  // Atualizar conteúdo quando value prop mudar
  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = value;
      renderMath();
    }
  }, [value]);

  return (
    <div className={`quill-editor-container ${className}`}>
      <div 
        id={toolbarId.current}
        ref={toolbarRef}
        className="ql-toolbar-custom"
      >
        <span className="ql-formats">
          <select className="ql-header">
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
            <option value="" selected>Normal</option>
          </select>
        </span>
        <span className="ql-formats">
          <button className="ql-bold"></button>
          <button className="ql-italic"></button>
          <button className="ql-underline"></button>
          <button className="ql-strike"></button>
        </span>
        <span className="ql-formats">
          <button className="ql-list" value="ordered"></button>
          <button className="ql-list" value="bullet"></button>
        </span>
        <span className="ql-formats">
          <button className="ql-link"></button>
          <button className="ql-image"></button>
        </span>
        <span className="ql-formats">
          <button className="ql-formula"></button>
        </span>
        <span className="ql-formats">
          <button className="ql-clean"></button>
        </span>
      </div>
      <div 
        ref={editorRef}
        className="min-h-[200px] bg-white border border-gray-300 rounded-md"
      />
      <div className="mt-2 text-sm text-gray-500">
        <p>💡 <strong>Dicas:</strong></p>
        <ul className="list-disc list-inside text-xs space-y-1">
          <li>Use <code>$formula$</code> para fórmulas inline: $x^2 + y^2 = z^2$</li>
          <li>Use <code>$$formula$$</code> para fórmulas em bloco: $$\int_0^1 x^2 dx$$</li>
          <li>Clique no ícone de fórmula (∑) na barra de ferramentas para inserir LaTeX</li>
        </ul>
      </div>
    </div>
  );
});

QuillEditor.displayName = 'QuillEditor';

export default QuillEditor;