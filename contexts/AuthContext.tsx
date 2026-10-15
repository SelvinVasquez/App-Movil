import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import * as api from '@/services/api';

interface AuthContextType {
  usuario: api.UsuarioApi | null;
  cargando: boolean;
  iniciarSesion: (email: string, password: string) => Promise<void>;
  registrarse: (name: string, email: string, password: string) => Promise<void>;
  cerrarSesion: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<api.UsuarioApi | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    api
      .obtenerToken()
      .then(async (token) => {
        if (!token) return;
        try {
          setUsuario(await api.obtenerUsuarioActual());
        } catch {
          await api.borrarToken();
        }
      })
      .finally(() => setCargando(false));
  }, []);

  const iniciarSesion = async (email: string, password: string) => {
    const respuesta = await api.login(email, password);
    await api.guardarToken(respuesta.token);
    setUsuario(respuesta.user);
  };

  const registrarse = async (name: string, email: string, password: string) => {
    await api.registrarse(name, email, password);
    await iniciarSesion(email, password);
  };

  const cerrarSesion = async () => {
    try {
      await api.logout();
    } catch {
      // Si el token ya venció o no hay conexión, igual cerramos sesión localmente.
    }
    await api.borrarToken();
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, cargando, iniciarSesion, registrarse, cerrarSesion }}>
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
