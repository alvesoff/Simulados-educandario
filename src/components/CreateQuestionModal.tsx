import React, { useState, useRef } from 'react';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import QuillEditor, { QuillEditorRef } from './QuillEditor';

interface CreateQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuestionCreated?: (question: any) => void;
}

interface QuestionData {
  statement: string;
  alternatives: string[];
  correctAnswer: number;
  disciplina: string;
  anoEscolar: number;
  nivelDificuldade: string;
  tags: string[];
  has_math: boolean;
}

const CreateQuestionModal: React.FC<CreateQuestionModalProps> = ({
  isOpen,
  onClose,
  onQuestionCreated
}) => {
  const [questionData, setQuestionData] = useState<QuestionData>({
    statement: '',
    alternatives: ['', '', '', ''],
    correctAnswer: 0,
    disciplina: '',
    anoEscolar: 1,
    nivelDificuldade: 'Fácil',
    tags: [],
    has_math: false
  });

  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Referências para os editores Quill
  const statementEditorRef = useRef<QuillEditorRef>(null);
  const alternativeEditorsRef = useRef<(QuillEditorRef | null)[]>([null, null, null, null]);

  const disciplinas = [
    'Português', 'Matemática', 'Ciências', 'História', 'Geografia',
    'Física', 'Química', 'Biologia', 'Inglês', 'Artes', 'Educação Física'
  ];

  const anosEscolares = Array.from({ length: 12 }, (_, i) => i + 1);
  const niveiseDificuldade = ['Fácil', 'Médio', 'Difícil'];

  // Função para detectar fórmulas matemáticas
  const detectMath = (content: string): boolean => {
    return content.includes('$') || 
           content.includes('\(') || 
           content.includes('\[') ||
           content.includes('<span class="ql-formula"') ||
           /\$[^$]+\$/.test(content) ||
           /\$\$[^$]+\$\$/.test(content);
  };

  const handleStatementChange = (value: string) => {
    const hasMathInStatement = detectMath(value);
    const hasMathInAlternatives = questionData.alternatives.some(alt => detectMath(alt));
    
    setQuestionData(prev => ({
      ...prev,
      statement: value,
      has_math: hasMathInStatement || hasMathInAlternatives
    }));
  };

  const handleAlternativeChange = (index: number, value: string) => {
    const newAlternatives = [...questionData.alternatives];
    newAlternatives[index] = value;
    
    const hasMathInAlternatives = newAlternatives.some(alt => detectMath(alt));
    const hasMathInStatement = detectMath(questionData.statement);
    
    setQuestionData(prev => ({
      ...prev,
      alternatives: newAlternatives,
      has_math: hasMathInStatement || hasMathInAlternatives
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !questionData.tags.includes(tagInput.trim())) {
      setQuestionData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setQuestionData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = (): boolean => {
    if (!questionData.statement.trim()) {
      toast.error('O enunciado da questão é obrigatório');
      return false;
    }

    if (questionData.alternatives.some(alt => !alt.trim())) {
      toast.error('Todas as alternativas devem ser preenchidas');
      return false;
    }

    if (!questionData.disciplina) {
      toast.error('A disciplina é obrigatória');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Aqui você pode integrar com a API para salvar a questão
      const response = await fetch('https://api-questao-1.onrender.com/api/v1/questoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(questionData)
      });

      if (!response.ok) {
        throw new Error('Erro ao criar questão');
      }

      const createdQuestion = await response.json();
      toast.success('Questão criada com sucesso!');
      
      if (onQuestionCreated) {
        onQuestionCreated(createdQuestion);
      }
      
      // Reset form
      setQuestionData({
        statement: '',
        alternatives: ['', '', '', ''],
        correctAnswer: 0,
        disciplina: '',
        anoEscolar: 1,
        nivelDificuldade: 'Fácil',
        tags: [],
        has_math: false
      });
      
      // Limpar editores Quill
      if (statementEditorRef.current) {
        statementEditorRef.current.setContent('');
      }
      alternativeEditorsRef.current.forEach(editor => {
        if (editor) {
          editor.setContent('');
        }
      });
      
      setTagInput('');
      
      onClose();
    } catch (error) {
      console.error('Erro ao criar questão:', error);
      toast.error('Erro ao criar questão. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                📚 Criar Nova Questão
              </h3>
              <button
                onClick={onClose}
                className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 py-6 sm:px-6 space-y-6">
            {/* Enunciado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enunciado da Questão *
              </label>
              <QuillEditor
                ref={statementEditorRef}
                value={questionData.statement}
                onChange={handleStatementChange}
                placeholder="Digite o enunciado da questão. Use o editor para formatação e fórmulas matemáticas."
                className="mb-2"
              />
              {questionData.has_math && (
                <p className="text-xs text-blue-600 mt-1">
                  ✓ Fórmulas matemáticas detectadas
                </p>
              )}
            </div>

            {/* Alternativas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Alternativas *
              </label>
              <div className="space-y-3">
                {questionData.alternatives.map((alternative, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex items-center mt-2">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={questionData.correctAnswer === index}
                        onChange={() => setQuestionData(prev => ({ ...prev, correctAnswer: index }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        {String.fromCharCode(65 + index)})
                      </span>
                    </div>
                    <div className="flex-1">
                      <QuillEditor
                        ref={(el) => alternativeEditorsRef.current[index] = el}
                        value={alternative}
                        onChange={(value) => handleAlternativeChange(index, value)}
                        placeholder={`Alternativa ${String.fromCharCode(65 + index)} - Use o editor para formatação e fórmulas`}
                        className="alternative-editor"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Marque o botão de rádio da alternativa correta
              </p>
            </div>

            {/* Metadados */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Disciplina */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Disciplina *
                </label>
                <select
                  value={questionData.disciplina}
                  onChange={(e) => setQuestionData(prev => ({ ...prev, disciplina: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                >
                  <option value="">Selecione uma disciplina</option>
                  {disciplinas.map(disciplina => (
                    <option key={disciplina} value={disciplina}>{disciplina}</option>
                  ))}
                </select>
              </div>

              {/* Ano Escolar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ano Escolar *
                </label>
                <select
                  value={questionData.anoEscolar}
                  onChange={(e) => setQuestionData(prev => ({ ...prev, anoEscolar: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                >
                  {anosEscolares.map(ano => (
                    <option key={ano} value={ano}>{ano}º Ano</option>
                  ))}
                </select>
              </div>

              {/* Nível de Dificuldade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nível de Dificuldade *
                </label>
                <select
                  value={questionData.nivelDificuldade}
                  onChange={(e) => setQuestionData(prev => ({ ...prev, nivelDificuldade: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                >
                  {niveiseDificuldade.map(nivel => (
                    <option key={nivel} value={nivel}>{nivel}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (opcional)
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {questionData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="Digite uma tag e pressione Enter"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Exemplo: álgebra, equações, frações
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Salvando...' : '💾 Salvar Questão'}
            </button>
            <button
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQuestionModal;