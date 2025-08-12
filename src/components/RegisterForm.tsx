import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, User, Building, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { schoolService } from '../services/schoolService';
import { School } from '../types/school';
import { cn } from '../utils/cn';
import toast from 'react-hot-toast';

const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z
    .string()
    .min(1, 'E-mail é obrigatório')
    .email('Formato de e-mail inválido'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z
    .string()
    .min(1, 'Confirmação de senha é obrigatória'),
  role: z.enum(['TEACHER', 'ADMIN'], {
    required_error: 'Tipo de usuário é obrigatório',
  }),
  schoolId: z
    .string()
    .min(1, 'Escola é obrigatória'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onToggleMode: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleMode }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [loadingSchools, setLoadingSchools] = useState(true);
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'TEACHER',
    },
  });

  // Carregar escolas ativas
  useEffect(() => {
    const loadSchools = async () => {
      try {
        const response = await schoolService.getActiveSchools();
        if (response.success) {
          setSchools(response.data);
        }
      } catch (error) {
        console.error('Erro ao carregar escolas:', error);
        toast.error('Erro ao carregar lista de escolas');
      } finally {
        setLoadingSchools(false);
      }
    };

    loadSchools();
  }, []);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const { confirmPassword, ...registerData } = data;
      await registerUser(registerData);
    } catch (error) {
      // Erro já tratado no contexto
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Criar Conta
        </h1>
        <p className="text-gray-600">
          Registre-se para acessar o sistema
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Campo Nome */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nome Completo
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('name')}
              type="text"
              id="name"
              placeholder="Digite seu nome completo"
              className={cn(
                'input pl-10',
                errors.name && 'border-red-300 focus-visible:ring-red-500'
              )}
              disabled={isSubmitting}
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-xs sm:text-sm text-red-600 leading-relaxed">{errors.name.message}</p>
          )}
        </div>

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

        {/* Campo Tipo de Usuário */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Usuário
          </label>
          <select
            {...register('role')}
            id="role"
            className={cn(
              'input',
              errors.role && 'border-red-300 focus-visible:ring-red-500'
            )}
            disabled={isSubmitting}
          >
            <option value="TEACHER">Professor</option>
            <option value="ADMIN">Administrador</option>
          </select>
          {errors.role && (
            <p className="mt-1 text-xs sm:text-sm text-red-600 leading-relaxed">{errors.role.message}</p>
          )}
        </div>

        {/* Campo Escola */}
        <div>
          <label htmlFor="schoolId" className="block text-sm font-medium text-gray-700 mb-2">
            Escola
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building className="h-5 w-5 text-gray-400" />
            </div>
            <select
              {...register('schoolId')}
              id="schoolId"
              className={cn(
                'input pl-10',
                errors.schoolId && 'border-red-300 focus-visible:ring-red-500'
              )}
              disabled={isSubmitting || loadingSchools}
            >
              <option value="">
                {loadingSchools ? 'Carregando escolas...' : 'Selecione uma escola'}
              </option>
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name} ({school.code})
                </option>
              ))}
            </select>
          </div>
          {errors.schoolId && (
            <p className="mt-1 text-xs sm:text-sm text-red-600 leading-relaxed">{errors.schoolId.message}</p>
          )}
        </div>

        {/* Campo Senha */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Senha
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Digite sua senha"
              className={cn(
                'input pl-10 pr-10',
                errors.password && 'border-red-300 focus-visible:ring-red-500'
              )}
              disabled={isSubmitting}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isSubmitting}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs sm:text-sm text-red-600 leading-relaxed">{errors.password.message}</p>
          )}
        </div>

        {/* Campo Confirmar Senha */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirmar Senha
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              placeholder="Confirme sua senha"
              className={cn(
                'input pl-10 pr-10',
                errors.confirmPassword && 'border-red-300 focus-visible:ring-red-500'
              )}
              disabled={isSubmitting}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isSubmitting}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs sm:text-sm text-red-600 leading-relaxed">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Botão de Registro */}
        <button
          type="submit"
          disabled={isSubmitting || loadingSchools}
          className={cn(
            'btn btn-primary w-full h-12 text-base font-medium',
            (isSubmitting || loadingSchools) && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Criando conta...
            </div>
          ) : (
            'Criar Conta'
          )}
        </button>
      </form>

      {/* Link para Login */}
      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Já tem uma conta?{' '}
          <button
            onClick={onToggleMode}
            className="text-primary-600 hover:text-primary-500 font-medium"
          >
            Fazer login
          </button>
        </p>
      </div>
    </div>
  );
};