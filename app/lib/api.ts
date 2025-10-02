const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

export class ApiClient {
  private baseURL: string;
  
  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.message || 'An error occurred',
          status: response.status,
        };
      }

      return {
        data,
        status: response.status,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error',
        status: 0,
      };
    }
  }

  async get<T>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  async post<T>(
    endpoint: string,
    body: any,
    token?: string
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  async patch<T>(
    endpoint: string,
    body: any,
    token?: string
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  async delete<T>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }
}

export const apiClient = new ApiClient();

// Helper functions for common operations
export const authAPI = {
  signIn: (email: string, password: string) =>
    apiClient.post('/auth/signin', { email, password }),
  
  signUp: (userData: { name: string; email: string; password: string; role?: string }) =>
    apiClient.post('/auth/signup', userData),
};

export const ticketsAPI = {
  getAll: (token: string) =>
    apiClient.get('/tickets', token),
  
  create: (ticket: { title: string; description: string; priority: string }, token: string) =>
    apiClient.post('/tickets', ticket, token),
  
  update: (id: string, updates: any, token: string) =>
    apiClient.patch(`/tickets/${id}`, updates, token),
  
  delete: (id: string, token: string) =>
    apiClient.delete(`/tickets/${id}`, token),
};

export const auditAPI = {
  getLogs: (token: string) =>
    apiClient.get('/audit/logs', token),
  
  getDatabaseStatus: (token: string) =>
    apiClient.get('/audit/database/status', token),
  
  toggleDatabase: (down: boolean, token: string) =>
    apiClient.post('/audit/database/toggle', { down }, token),
};