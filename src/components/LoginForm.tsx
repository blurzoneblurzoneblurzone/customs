import React, { useState } from 'react';
import { Lock, Mail, AlertCircle, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

export default function LoginForm({ onSuccess, onClose }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Проверяем, настроен ли Supabase
    if (import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co') {
      setError('Supabase не настроен. Обратитесь к администратору для настройки подключения к базе данных.');
      setIsLoading(false);
      return;
    }

    // Имитируем задержку
    await new Promise(resolve => setTimeout(resolve, 500));

    const success = await login(email, password);
    
    if (success) {
      onSuccess();
    } else {
      setError('Неверный логин или пароль. Обратитесь к администратору.');
    }

    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-6 w-6" style={{color: '#0e7a65'}} />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Вход в систему управления
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Доступ только для уполномоченных сотрудников
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent" style={{'--tw-ring-color': '#0e7a65'} as any}
                placeholder="Введите email"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Пароль
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent" style={{'--tw-ring-color': '#0e7a65'} as any}
                placeholder="Введите пароль"
                required
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>Неверные учетные данные. Обратитесь к системному администратору.</span>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-white rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" style={{backgroundColor: '#0e7a65', '--tw-ring-color': '#0e7a65'} as any}
            >
              {isLoading ? 'Вход...' : 'Войти'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}