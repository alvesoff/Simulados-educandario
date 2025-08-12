import React, { useState } from 'react';
import { Mail, Copy, MessageCircle, Check } from 'lucide-react';
import { Modal } from './Modal';

interface ContactAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactAdminModal: React.FC<ContactAdminModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copied, setCopied] = useState(false);
  const adminEmail = 'xxxxxxx@gmail.com';

  const handleEmailClick = () => {
    window.open(`mailto:${adminEmail}?subject=Solicitação de Acesso - Sistema de Simulados&body=Olá,%0D%0A%0D%0AGostaria de solicitar acesso ao sistema de simulados.%0D%0A%0D%0AAtenciosamente,`, '_blank');
  };

  const copyEmailToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(adminEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar email:', err);
      // Fallback para navegadores mais antigos
      const textArea = document.createElement('textarea');
      textArea.value = adminEmail;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Contato com Administrador"
      size="md"
    >
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 mb-4">
            <MessageCircle className="h-6 w-6 text-primary-600" />
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            Solicite Acesso ao Sistema
          </h4>
          <p className="text-gray-600 text-sm sm:text-base">
            Para obter acesso ao sistema de simulados, entre em contato com o administrador através do e-mail abaixo:
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-center mb-4">
            <Mail className="h-5 w-5 text-gray-500 mr-2" />
            <span className="text-sm text-gray-600">E-mail de Suporte</span>
          </div>
          
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900 mb-4 break-all">
              {adminEmail}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleEmailClick}
                className="btn btn-primary flex items-center justify-center px-4 py-2 text-sm"
              >
                <Mail className="h-4 w-4 mr-2" />
                Enviar E-mail
              </button>
              
              <button
                onClick={copyEmailToClipboard}
                className={`btn flex items-center justify-center px-4 py-2 text-sm transition-all duration-200 ${
                  copied 
                    ? 'bg-green-100 text-green-700 border-green-200' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar E-mail
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <MessageCircle className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h5 className="text-sm font-medium text-blue-800">
                Informações importantes:
              </h5>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Informe seu nome completo</li>
                  <li>Mencione que precisa de acesso ao sistema</li>
                  <li>Aguarde a resposta do administrador</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="btn bg-gray-200 text-gray-700 hover:bg-gray-300 px-6 py-2"
          >
            Fechar
          </button>
        </div>
      </div>
    </Modal>
  );
};