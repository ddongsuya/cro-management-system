const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API 응답 타입
interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  errors?: any[];
}

// HTTP 클라이언트 클래스
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // 기본 헤더 설정
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // 토큰이 있으면 Authorization 헤더 추가
    const token = localStorage.getItem('token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// API 클라이언트 인스턴스
export const apiClient = new ApiClient(API_BASE_URL);

// 인증 API
export const authAPI = {
  register: (userData: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    department?: string;
    phone?: string;
  }) => apiClient.post('/auth/register', userData),

  login: (credentials: { email: string; password: string }) =>
    apiClient.post('/auth/login', credentials),

  getCurrentUser: () => apiClient.get('/auth/me'),

  updateProfile: (profileData: {
    firstName?: string;
    lastName?: string;
    department?: string;
    phone?: string;
  }) => apiClient.put('/auth/profile', profileData),
};

// 고객사 API
export const companiesAPI = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return apiClient.get(`/companies${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id: string) => apiClient.get(`/companies/${id}`),

  create: (companyData: any) => apiClient.post('/companies', companyData),

  update: (id: string, companyData: any) =>
    apiClient.put(`/companies/${id}`, companyData),

  delete: (id: string) => apiClient.delete(`/companies/${id}`),

  addQuotation: (companyId: string, quotationData: any) =>
    apiClient.post(`/companies/${companyId}/quotations`, quotationData),
};

// 미팅 API
export const meetingsAPI = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    companyId?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return apiClient.get(`/meetings${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id: string) => apiClient.get(`/meetings/${id}`),

  create: (meetingData: any) => apiClient.post('/meetings', meetingData),

  update: (id: string, meetingData: any) =>
    apiClient.put(`/meetings/${id}`, meetingData),

  delete: (id: string) => apiClient.delete(`/meetings/${id}`),

  getUpcoming: (limit?: number) =>
    apiClient.get(`/meetings/upcoming${limit ? `?limit=${limit}` : ''}`),
};

// 업무 API
export const tasksAPI = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    companyId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return apiClient.get(`/tasks${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id: string) => apiClient.get(`/tasks/${id}`),

  create: (taskData: any) => apiClient.post('/tasks', taskData),

  update: (id: string, taskData: any) =>
    apiClient.put(`/tasks/${id}`, taskData),

  delete: (id: string) => apiClient.delete(`/tasks/${id}`),

  getOverdue: () => apiClient.get('/tasks/overdue'),

  getUpcoming: (params?: { limit?: number; days?: number }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return apiClient.get(`/tasks/upcoming${queryString ? `?${queryString}` : ''}`);
  },

  checkOverdue: () => apiClient.post('/tasks/check-overdue'),
};

// 알림 API
export const notificationsAPI = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    isRead?: boolean;
    type?: 'info' | 'warning' | 'error';
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return apiClient.get(`/notifications${queryString ? `?${queryString}` : ''}`);
  },

  getUnread: (limit?: number) =>
    apiClient.get(`/notifications/unread${limit ? `?limit=${limit}` : ''}`),

  getById: (id: string) => apiClient.get(`/notifications/${id}`),

  create: (notificationData: {
    message: string;
    type?: 'info' | 'warning' | 'error';
    relatedId?: string;
    relatedType?: 'task' | 'meeting' | 'company' | 'contract' | 'study';
  }) => apiClient.post('/notifications', notificationData),

  markAsRead: (id: string) => apiClient.put(`/notifications/${id}/read`),

  markAllAsRead: () => apiClient.put('/notifications/mark-all-read'),

  delete: (id: string) => apiClient.delete(`/notifications/${id}`),

  clearRead: () => apiClient.delete('/notifications/clear-read'),
};

// 헬스 체크 API
export const healthAPI = {
  check: () => apiClient.get('/health'),
};