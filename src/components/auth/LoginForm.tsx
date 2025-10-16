import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Input, Card } from '../ui/UIComponents';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
    } catch (error: any) {
      setError(error.message || '로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">로그인</h2>
        <p className="text-gray-600 mt-2">CRO 관리 시스템에 로그인하세요</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="이메일"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="your@email.com"
        />

        <Input
          label="비밀번호"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="비밀번호를 입력하세요"
        />

        {error && (
          <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? '로그인 중...' : '로그인'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          계정이 없으신가요?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-brand-primary hover:underline font-medium"
          >
            회원가입
          </button>
        </p>
      </div>
    </Card>
  );
};