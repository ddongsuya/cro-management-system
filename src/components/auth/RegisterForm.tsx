import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Input, Card } from '../ui/UIComponents';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    department: '',
    phone: '',
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

    // 비밀번호 확인
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      setIsLoading(false);
      return;
    }

    // 비밀번호 길이 확인
    if (formData.password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      setIsLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
    } catch (error: any) {
      setError(error.message || '회원가입에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">회원가입</h2>
        <p className="text-gray-600 mt-2">새 계정을 만들어 시작하세요</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="이름"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="이름"
          />
          <Input
            label="성"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="성"
          />
        </div>

        <Input
          label="사용자명"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          placeholder="사용자명 (최소 3자)"
        />

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
          label="부서"
          name="department"
          value={formData.department}
          onChange={handleChange}
          placeholder="부서명"
        />

        <Input
          label="전화번호"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="010-1234-5678"
        />

        <Input
          label="비밀번호"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="비밀번호 (최소 6자)"
        />

        <Input
          label="비밀번호 확인"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          placeholder="비밀번호를 다시 입력하세요"
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
          {isLoading ? '가입 중...' : '회원가입'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          이미 계정이 있으신가요?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-brand-primary hover:underline font-medium"
          >
            로그인
          </button>
        </p>
      </div>
    </Card>
  );
};