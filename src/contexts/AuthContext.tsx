import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { authApi, ApiError, TOKEN_EXPIRY_MS } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  login: string;
  photo: string;
  printerId: number;
  agence: {
    id: number;
    name: string;
    code: string;
    city: string;
    currency: string;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  login: (login: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearSession = () => {
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    setUser(null);
    setAccessToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiresAt');
    localStorage.removeItem('userId');
    localStorage.removeItem('agenceId');
  };

  const scheduleAutoLogout = (expiresAt: number) => {
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    const delay = expiresAt - Date.now();
    if (delay <= 0) {
      clearSession();
      return;
    }
    logoutTimerRef.current = setTimeout(() => {
      clearSession();
    }, delay);
  };

  // Activity tracking + auto-refresh + inactivity logout
  useEffect(() => {
    const INACTIVITY_MS = 10 * 60 * 1000; // 10 min
    const REFRESH_MS = 10 * 60 * 1000;    // refresh toutes les 10 min d'activité

    const lastActivity = { current: Date.now() };
    const lastRefresh = { current: Date.now() };

    const onActivity = () => { lastActivity.current = Date.now(); };

    const onUnauthorized = () => {
      console.warn('🔒 Token expiré ou invalide — déconnexion');
      clearSession();
    };

    const events = ['mousemove', 'click', 'keypress', 'scroll', 'touchstart'] as const;
    events.forEach(e => window.addEventListener(e, onActivity, { passive: true }));
    window.addEventListener('auth:unauthorized', onUnauthorized);

    const intervalId = setInterval(async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const now = Date.now();
      const inactiveSince = now - lastActivity.current;

      if (inactiveSince >= INACTIVITY_MS) {
        console.warn('⏱ Inactivité détectée — déconnexion');
        clearSession();
        return;
      }

      const sinceLastRefresh = now - lastRefresh.current;
      if (sinceLastRefresh >= REFRESH_MS) {
        const storedRefreshToken = localStorage.getItem('refreshToken');
        if (!storedRefreshToken) { clearSession(); return; }

        try {
          const data = await authApi.refresh(storedRefreshToken);
          localStorage.setItem('accessToken', data.accessToken);
          if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
          const expiresAt = Date.now() + (data.accessExpiresIn ?? TOKEN_EXPIRY_MS);
          localStorage.setItem('tokenExpiresAt', expiresAt.toString());
          setAccessToken(data.accessToken);
          scheduleAutoLogout(expiresAt);
          lastRefresh.current = now;
          console.log('✅ Token rafraîchi avec succès');
        } catch {
          console.warn('❌ Échec du refresh — déconnexion');
          clearSession();
        }
      }
    }, 60_000); // vérification chaque minute

    return () => {
      events.forEach(e => window.removeEventListener(e, onActivity));
      window.removeEventListener('auth:unauthorized', onUnauthorized);
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('accessToken');
    const storedExpiresAt = localStorage.getItem('tokenExpiresAt');

    if (storedUser && storedToken && storedExpiresAt) {
      const expiresAt = parseInt(storedExpiresAt, 10);
      if (Date.now() < expiresAt) {
        setUser(JSON.parse(storedUser));
        setAccessToken(storedToken);
        setIsAuthenticated(true);
        scheduleAutoLogout(expiresAt);
      } else {
        clearSession();
      }
    }

    return () => {
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    };
  }, []);

  const login = async (loginValue: string, password: string) => {
    try {
      const response = await authApi.login(loginValue, password);
      const { user: u, accessToken: token, refreshToken, accessExpiresIn } = response;

      const authenticatedUser: User = {
        id: u.id.toString(),
        name: u.nom,
        email: u.email || loginValue,
        phone: u.phone,
        login: u.login,
        photo: u.photo ?? 'default.png',
        printerId: u.printerId ?? 0,
        agence: {
          id: u.agence.id,
          name: u.agence.name,
          code: u.agence.code,
          city: u.agence.city,
          currency: u.agence.currency,
        },
      };

      const expiresAt = Date.now() + (accessExpiresIn ?? TOKEN_EXPIRY_MS);

      setUser(authenticatedUser);
      setAccessToken(token);
      setIsAuthenticated(true);
      scheduleAutoLogout(expiresAt);

      localStorage.setItem('user', JSON.stringify(authenticatedUser));
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('tokenExpiresAt', expiresAt.toString());
      localStorage.setItem('userId', u.id.toString());
      localStorage.setItem('agenceId', u.agence.id.toString());
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Erreur de connexion');
    }
  };

  const register = async (name: string, email: string, _password: string) => {
    const mockUser: User = {
      id: '1',
      name: name,
      email: email,
      phone: '',
      login: email,
      photo: 'default.png',
      printerId: 0,
      agence: {
        id: 0,
        name: '',
        code: '',
        city: '',
        currency: 'FCFA',
      },
    };

    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const logout = () => {
    clearSession();
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, accessToken, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
