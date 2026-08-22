import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import * as api from '@/services/api';

interface AuthContextType {
  token: string | null;
  cargando: boolean;
  iniciarSesion: (email: string, password: string) => Promise<void>;
  cerrarSesion: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    api
      .obtenerToken()
      .then(setToken)
      .finally(() => setCargando(false));
  }, []);

  const iniciarSesion = async (email: string, password: string) => {
    const respuesta = await api.login(email, password);
    await api.guardarToken(respuesta.token);
    setToken(respuesta.token);
  };

  const cerrarSesion = async () => {
    await api.borrarToken();
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, cargando, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
