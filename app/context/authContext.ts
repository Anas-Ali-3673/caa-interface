'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export interface User {
  _id: string;
  email: string;
  role: 'admin' | 'user' | 'Admin';
  name?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (userData: SignupData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;