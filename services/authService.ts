import api from './api';
import { User } from '../types';

interface AuthResponse {
    _id: string;
    name: string;
    email: string;
    role: 'client' | 'admin';
    token: string;
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
    role?: 'client' | 'admin';
}

interface LoginData {
    email: string;
    password: string;
}

export const authService = {
    register: async (userData: RegisterData): Promise<AuthResponse> => {
        const response = await api.post('/auth/register', userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    login: async (credentials: LoginData): Promise<AuthResponse> => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: (): User | null => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            return JSON.parse(userStr);
        }
        return null;
    }
};
