import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { authService } from '../services/authService';
import { cn } from '../utils/cn';
import toast from 'react-hot-toast';

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'E-mail é obrigatório')
    .email('Formato de e-mail inválido'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBack }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await authService.forgotPassword(data.email);
      toast.success('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
      onBack(); // Voltar para o login após envio
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || 'Erro ao enviar e-mail de recuperação';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Esqueceu a Senha?
        </h1>
        <p className="text-gray-600">
          Digite seu e-mail para receber as instruções de recuperação
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Campo E-mail */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            E-mail
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('email')}
              type="email"
              id="email"
              placeholder="Digite seu e-mail"
              className={cn(
                'input pl-10',
                errors.email && 'border-red-300 focus-visible:ring-red-500'
              )}
              disabled={isSubmitting}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs sm:text-sm text-red-600 leading-relaxed">{errors.email.message}</p>
          )}
        </div>

        {/* Botão de Envio */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            'btn btn-primary w-full h-12 text-base font-medium',
            isSubmitting && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Enviando...
            </div>
          ) : (
            'Enviar E-mail de Recuperação'
          )}
        </button>
      </form>

      {/* Botão Voltar */}
      <div className="mt-8 text-center">
        <button
          onClick={onBack}
          className="inline-flex items-center text-primary-600 hover:text-primary-500 font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao login
        </button>
      </div>
    </div>
  );
};