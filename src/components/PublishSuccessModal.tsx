import React from 'react';
import { CheckCircleIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { Modal } from './Modal';
import { toast } from 'react-hot-toast';

interface PublishSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  accessCode: string;
}

export const PublishSuccessModal: React.FC<PublishSuccessModalProps> = ({
  isOpen,
  onClose,
  accessCode
}) => {
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(accessCode);
      toast.success('Código copiado para área de transferência!');
    } catch (error) {
      toast.error('Erro ao copiar código');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Prova Publicada com Sucesso!"
      size="md"
    >
      <div className="text-center">
        {/* Ícone de sucesso */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <CheckCircleIcon className="h-8 w-8 text-green-600" />
        </div>

        {/* Mensagem principal */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Sua prova foi publicada com sucesso!
        </h3>
        
        <p className="text-gray-600 mb-6">
          Os alunos já podem realizar a prova usando o código de acesso abaixo:
        </p>

        {/* Código de acesso */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                Código de Acesso:
              </p>
              <p className="text-2xl font-bold text-blue-600 font-mono">
                {accessCode}
              </p>
            </div>
            <button
              onClick={handleCopyCode}
              className="ml-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              title="Copiar código"
            >
              <ClipboardDocumentIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Instruções */}
        <div className="text-left bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">
            Como os alunos podem acessar:
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Compartilhe o código de acesso com os alunos</li>
            <li>• Os alunos devem inserir o código na página de acesso</li>
            <li>• A prova estará disponível imediatamente</li>
          </ul>
        </div>

        {/* Botões de ação */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={handleCopyCode}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <ClipboardDocumentIcon className="h-4 w-4 mr-2" />
            Copiar Código
          </button>
          
          <button
            onClick={onClose}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Entendi
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PublishSuccessModal;