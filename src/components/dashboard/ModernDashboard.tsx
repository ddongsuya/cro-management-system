import React from 'react';
import { Company, Meeting, Task, TaskStatus } from '../../../types';

interface ModernDashboardProps {
  companies: Company[];
  meetings: Meeting[];
  tasks: Task[];
  onViewTask: (task: Task) => void;
  onViewMeeting: (meeting: Meeting) => void;
}

export const ModernDashboard: React.FC<ModernDashboardProps> = ({
  companies,
  meetings,
  tasks,
  onViewTask,
  onViewMeeting,
}) => {
  // 통계 계산
  const totalClients = companies.length;
  const totalMeetings = meetings.length;
  const activeTasks = tasks.filter(t => t.status !== TaskStatus.Completed).length;
  const completedTasks = tasks.filter(t => t.status === TaskStatus.Completed).length;
  const overdueTasks = tasks.filter(t => {
    const dueDate = new Date(t.endDate);
    const today = new Date();
    return t.status !== TaskStatus.Completed && dueDate < today;
  }).length;

  // 최근 활동
  const upcomingMeetings = meetings
    .filter(m => new Date(m.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const upcomingTasks = tasks
    .filter(t => t.status !== TaskStatus.Completed)
    .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
    .slice(0, 5);

  // 월별 통계
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const monthlyMeetings = meetings.filter(m => {
    const date = new Date(m.date);
    return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
  }).length;

  const monthlyCompletedTasks = tasks.filter(t => {
    if (t.status !== TaskStatus.Completed) return false;
    const date = new Date(t.endDate);
    return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
  }).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">
          Dashboard Overview
        </h1>
        <p className="text-medium-text text-lg">
          {new Date().toLocaleDateString('ko-KR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
          })}
        </p>
      </div>

      {/* 주요 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 총 고객사 */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-soft hover:shadow-glow transition-all duration-300 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
              전체
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-5xl font-bold">{totalClients}</p>
            <p className="text-blue-100 text-sm">총 고객사</p>
          </div>
        </div>

        {/* 이번 달 미팅 */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-soft hover:shadow-glow transition-all duration-300 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
              이번 달
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-5xl font-bold">{monthlyMeetings}</p>
            <p className="text-purple-100 text-sm">미팅 진행</p>
          </div>
        </div>

        {/* 진행 중인 업무 */}
        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl p-6 text-white shadow-soft hover:shadow-glow transition-all duration-300 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
              진행중
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-5xl font-bold">{activeTasks}</p>
            <p className="text-cyan-100 text-sm">활성 업무</p>
          </div>
        </div>

        {/* 완료된 업무 */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-soft hover:shadow-glow transition-all duration-300 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
              이번 달
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-5xl font-bold">{monthlyCompletedTasks}</p>
            <p className="text-green-100 text-sm">완료된 업무</p>
          </div>
        </div>
      </div>

      {/* 경고 알림 */}
      {overdueTasks > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-xl p-6 shadow-soft animate-slide-up">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-red-800">
                {overdueTasks}개의 업무가 기한을 초과했습니다.
              </p>
              <p className="text-sm text-red-600 mt-1">
                빠른 조치가 필요합니다.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 메인 콘텐츠 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 다가오는 미팅 */}
        <div className="bg-white rounded-2xl shadow-soft p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-dark-text flex items-center">
              <span className="bg-gradient-to-r from-purple-500 to-purple-600 w-1 h-8 rounded-full mr-3"></span>
              다가오는 미팅
            </h2>
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
              {upcomingMeetings.length}개
            </span>
          </div>

          {upcomingMeetings.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-medium-text">예정된 미팅이 없습니다</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingMeetings.map((meeting, index) => {
                const company = companies.find(c => c.id === meeting.companyId);
                return (
                  <div
                    key={meeting.id}
                    className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-transparent rounded-xl hover:from-purple-100 transition-all duration-200 cursor-pointer group"
                    onClick={() => onViewMeeting(meeting)}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md group-hover:scale-110 transition-transform">
                      {new Date(meeting.date).getDate()}
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="font-semibold text-dark-text group-hover:text-purple-600 transition-colors">
                        {meeting.title}
                      </p>
                      <p className="text-sm text-medium-text">
                        {company?.name} • {new Date(meeting.date).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                    <svg className="w-5 h-5 text-purple-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 다가오는 업무 */}
        <div className="bg-white rounded-2xl shadow-soft p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-dark-text flex items-center">
              <span className="bg-gradient-to-r from-cyan-500 to-cyan-600 w-1 h-8 rounded-full mr-3"></span>
              다가오는 업무
            </h2>
            <span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-sm font-semibold">
              {upcomingTasks.length}개
            </span>
          </div>

          {upcomingTasks.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-medium-text">진행 중인 업무가 없습니다</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingTasks.map((task, index) => {
                const company = companies.find(c => c.id === task.companyId);
                const isOverdue = new Date(task.endDate) < new Date();
                const statusColors = {
                  [TaskStatus.Pending]: 'bg-yellow-100 text-yellow-700',
                  [TaskStatus.InProgress]: 'bg-blue-100 text-blue-700',
                  [TaskStatus.Completed]: 'bg-green-100 text-green-700',
                  [TaskStatus.Delayed]: 'bg-red-100 text-red-700',
                  [TaskStatus.OnHold]: 'bg-gray-100 text-gray-700',
                };

                return (
                  <div
                    key={task.id}
                    className="flex items-center p-4 bg-gradient-to-r from-cyan-50 to-transparent rounded-xl hover:from-cyan-100 transition-all duration-200 cursor-pointer group"
                    onClick={() => onViewTask(task)}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-dark-text group-hover:text-cyan-600 transition-colors">
                          {task.name}
                        </p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
                          {task.status}
                        </span>
                      </div>
                      <p className="text-sm text-medium-text">
                        {company?.name} • 마감: {new Date(task.endDate).toLocaleDateString('ko-KR')}
                        {isOverdue && <span className="text-red-500 ml-2">⚠️ 지연</span>}
                      </p>
                    </div>
                    <svg className="w-5 h-5 text-cyan-400 group-hover:text-cyan-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 빠른 통계 */}
      <div className="bg-white rounded-2xl shadow-soft p-6">
        <h2 className="text-2xl font-bold text-dark-text mb-6 flex items-center">
          <span className="bg-gradient-to-r from-blue-500 to-blue-600 w-1 h-8 rounded-full mr-3"></span>
          빠른 통계
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
            <p className="text-3xl font-bold text-blue-600">{totalMeetings}</p>
            <p className="text-sm text-blue-700 mt-1">총 미팅</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
            <p className="text-3xl font-bold text-green-600">{completedTasks}</p>
            <p className="text-sm text-green-700 mt-1">완료된 업무</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
            <p className="text-3xl font-bold text-purple-600">{activeTasks}</p>
            <p className="text-sm text-purple-700 mt-1">진행 중</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl">
            <p className="text-3xl font-bold text-red-600">{overdueTasks}</p>
            <p className="text-sm text-red-700 mt-1">지연된 업무</p>
          </div>
        </div>
      </div>
    </div>
  );
};
