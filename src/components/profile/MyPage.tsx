import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Input, Card } from '../ui/UIComponents';

export const MyPage: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.profile.firstName || '',
    lastName: user?.profile.lastName || '',
    department: user?.profile.department || '',
    phone: user?.profile.phone || '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await updateProfile(formData);
      setSuccess('프로필이 성공적으로 업데이트되었습니다.');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || '프로필 업데이트에 실패했습니다.');
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.profile.firstName || '',
      lastName: user?.profile.lastName || '',
      department: user?.profile.department || '',
      phone: user?.profile.phone || '',
    });
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-dark-text mb-6">마이페이지</h1>

      {/* 사용자 정보 카드 */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-dark-text">프로필 정보</h2>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>
              프로필 수정
            </Button>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-text mb-1">
                  이름
                </label>
                <Input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="이름"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text mb-1">
                  성
                </label>
                <Input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="성"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text mb-1">
                  부서
                </label>
                <Input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="부서"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text mb-1">
                  전화번호
                </label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="010-1234-5678"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button type="submit">
                저장
              </Button>
              <Button type="button" onClick={handleCancel} variant="secondary">
                취소
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-medium-text">사용자명</p>
                <p className="text-lg font-medium text-dark-text">{user.username}</p>
              </div>

              <div>
                <p className="text-sm text-medium-text">이메일</p>
                <p className="text-lg font-medium text-dark-text">{user.email}</p>
              </div>

              <div>
                <p className="text-sm text-medium-text">이름</p>
                <p className="text-lg font-medium text-dark-text">
                  {user.profile.firstName || user.profile.lastName
                    ? `${user.profile.lastName || ''} ${user.profile.firstName || ''}`.trim()
                    : '미설정'}
                </p>
              </div>

              <div>
                <p className="text-sm text-medium-text">부서</p>
                <p className="text-lg font-medium text-dark-text">
                  {user.profile.department || '미설정'}
                </p>
              </div>

              <div>
                <p className="text-sm text-medium-text">전화번호</p>
                <p className="text-lg font-medium text-dark-text">
                  {user.profile.phone || '미설정'}
                </p>
              </div>

              <div>
                <p className="text-sm text-medium-text">권한</p>
                <p className="text-lg font-medium text-dark-text">
                  {user.role === 'admin' ? '관리자' : user.role === 'manager' ? '매니저' : '사용자'}
                </p>
              </div>

              {user.lastLogin && (
                <div>
                  <p className="text-sm text-medium-text">마지막 로그인</p>
                  <p className="text-lg font-medium text-dark-text">
                    {new Date(user.lastLogin).toLocaleString('ko-KR')}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* 계정 관리 카드 */}
      <Card>
        <h2 className="text-2xl font-semibold text-dark-text mb-4">계정 관리</h2>
        <div className="space-y-3">
          <Button onClick={logout} variant="secondary" className="w-full md:w-auto">
            로그아웃
          </Button>
        </div>
      </Card>
    </div>
  );
};
