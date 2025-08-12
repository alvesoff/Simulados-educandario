import React, { useState } from 'react';
import { 
  ChevronDownIcon, 
  ChevronUpIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { Test } from '../types/test';
import SafeHtmlRenderer from './SafeHtmlRenderer';

interface TestQuestionListProps {
  test: Test;
  onRemoveQuestion: (questionId: string) => void;
  onUpdatePoints: (questionId: string, points: number) => void;
  readOnly?: boolean;
}

const TestQuestionList: React.FC<TestQuestionListProps> = ({
  test,
  onRemoveQuestion,
  onUpdatePoints,
  readOnly = false
}) => {
  const [editingPoints, setEditingPoints] = useState<{ [key: string]: number }>({});
  const [expandedQuestions, setExpandedQuestions] = useState<{ [key: string]: boolean }>({});

  const handlePointsChange = (questionId: string, points: number) => {
    setEditingPoints(prev => ({
      ...prev,
      [questionId]: points
    }));
  };

  const handleSavePoints = (questionId: string) => {
    const points = editingPoints[questionId];
    if (points && points > 0) {
      onUpdatePoints(questionId, points);
      setEditingPoints(prev => {
        const newPoints = { ...prev };
        delete newPoints[questionId];
        return newPoints;
      });
    }
  };

  const handleCancelEdit = (questionId: string) => {
    setEditingPoints(prev => {
      const newPoints = { ...prev };
      delete newPoints[questionId];
      return newPoints;
    });
  };

  const toggleQuestionExpansion = (questionId: string) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'text-green-600 bg-green-50';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50';
      case 'HARD': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'Fácil';
      case 'MEDIUM': return 'Médio';
      case 'HARD': return 'Difícil';
      default: return difficulty;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'MULTIPLE_CHOICE': return 'Múltipla Escolha';
      case 'TRUE_FALSE': return 'Verdadeiro/Falso';
      case 'ESSAY': return 'Dissertativa';
      default: return type;
    }
  };

  if (!test.questions || test.questions.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <div className="mx-auto h-12 w-12 text-gray-400">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma questão adicionada</h3>
        <p className="mt-1 text-sm text-gray-500 leading-relaxed">
          {readOnly 
            ? 'Esta prova não possui questões.' 
            : 'Comece adicionando questões à sua prova.'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {test.questions.map((testQuestion, index) => {
        const question = testQuestion.question;
        const isExpanded = expandedQuestions[question.id];
        const isEditingPoints = editingPoints.hasOwnProperty(question.id);
        
        return (
          <div key={question.id} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Header da Questão */}
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <span className="flex-shrink-0 inline-flex items-center justify-center h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium">
                    {index + 1}
                  </span>
                  
                  <div className="flex flex-wrap items-center gap-2 min-w-0">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                      {getDifficultyText(question.difficulty)}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-blue-600 bg-blue-50">
                      {getTypeText(question.type)}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-gray-600 bg-gray-50">
                      {question.subject}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 sm:space-x-3">
                  {/* Pontuação */}
                  <div className="flex items-center space-x-2">
                    {isEditingPoints ? (
                      <div className="flex items-center space-x-1">
                        <input
                          type="number"
                          min="0.5"
                          max="10"
                          step="0.5"
                          value={editingPoints[question.id]}
                          onChange={(e) => handlePointsChange(question.id, parseFloat(e.target.value) || 0)}
                          className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSavePoints(question.id)}
                          className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => handleCancelEdit(question.id)}
                          className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <span className="text-sm font-medium text-gray-700">
                          {testQuestion.points} pts
                        </span>
                        {!readOnly && (
                          <button
                            onClick={() => setEditingPoints(prev => ({ ...prev, [question.id]: testQuestion.points }))}
                            className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                          >
                            <PencilIcon className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Botões de Ação */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => toggleQuestionExpansion(question.id)}
                      className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                      title={isExpanded ? 'Recolher' : 'Expandir'}
                    >
                      {isExpanded ? (
                        <ChevronUpIcon className="h-4 w-4" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4" />
                      )}
                    </button>

                    {!readOnly && (
                      <button
                        onClick={() => onRemoveQuestion(question.id)}
                        className="p-1 sm:p-2 text-red-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                        title="Remover questão"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Conteúdo da Questão */}
            <div className="px-4 py-3 sm:px-6 sm:py-4">
              <div className="text-sm text-gray-900 leading-relaxed">
                {question.statement.length > 150 && !isExpanded ? (
                  <>
                    <SafeHtmlRenderer 
                      html={question.statement.substring(0, 150) + '...'}
                      className="inline"
                    />
                    <button
                      onClick={() => toggleQuestionExpansion(question.id)}
                      className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Ver mais
                    </button>
                  </>
                ) : (
                  <SafeHtmlRenderer 
                    html={question.statement}
                    className=""
                  />
                )}
              </div>

              {/* Opções (se expandido e for múltipla escolha) */}
              {isExpanded && question.type === 'MULTIPLE_CHOICE' && question.options && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Alternativas:</h4>
                  <div className="space-y-1">
                    {question.options.map((option, optionIndex) => (
                      <div 
                        key={optionIndex} 
                        className={`text-xs p-2 rounded border ${
                          option.isCorrect 
                            ? 'bg-green-50 border-green-200 text-green-700' 
                            : 'bg-gray-50 border-gray-200 text-gray-600'
                        }`}
                      >
                        <span className="font-medium">
                          {String.fromCharCode(65 + optionIndex)})
                        </span>
                        <SafeHtmlRenderer 
                          html={option.text}
                          className="ml-2"
                          tag="span"
                        />
                        {option.isCorrect && (
                          <span className="ml-2 text-green-600 font-medium">(Correta)</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Informações Adicionais (se expandido) */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-gray-600">
                    {question.topic && (
                      <div>
                        <span className="font-medium">Tópico:</span>
                        <span className="ml-1">{question.topic}</span>
                      </div>
                    )}
                    
                    {question.tags && question.tags.length > 0 && (
                      <div>
                        <span className="font-medium">Tags:</span>
                        <span className="ml-1">{question.tags.join(', ')}</span>
                      </div>
                    )}
                    
                    <div>
                      <span className="font-medium">ID:</span>
                      <span className="ml-1">{question.id}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Resumo */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg sm:text-xl font-bold text-blue-900">
              {test.questionsCount}
            </div>
            <div className="text-xs sm:text-sm text-blue-700">Questões</div>
          </div>
          
          <div>
            <div className="text-lg sm:text-xl font-bold text-blue-900">
              {test.totalPoints}
            </div>
            <div className="text-xs sm:text-sm text-blue-700">Pontos</div>
          </div>
          
          <div>
            <div className="text-lg sm:text-xl font-bold text-blue-900">
              {test.duration || '∞'}
            </div>
            <div className="text-xs sm:text-sm text-blue-700">
              {test.duration ? 'Minutos' : 'Sem limite'}
            </div>
          </div>
          
          <div>
            <div className="text-lg sm:text-xl font-bold text-blue-900">
              {test.maxAttempts}
            </div>
            <div className="text-xs sm:text-sm text-blue-700">Tentativas</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestQuestionList;