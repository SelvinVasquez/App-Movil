import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

import type { Pelicula } from '@/constants/movies';
import { useAuth } from '@/contexts/AuthContext';
import { ApiError, crearPelicula, actualizarPelicula, eliminarPelicula as apiEliminarPelicula, obtenerPeliculas } from '@/services/api';

interface MoviesContextType {
  peliculas: Pelicula[];
  cargando: boolean;
  error: string | null;
  refrescar: () => Promise<void>;
  agregarPelicula: (p: Omit<Pelicula, 'id' | 'favorita' | 'vista'>) => Promise<void>;
  editarPelicula: (id: string, datos: Omit<Pelicula, 'id'>) => Promise<void>;
  eliminarPelicula: (id: string) => Promise<void>;
  toggleFavorita: (id: string) => Promise<void>;
  toggleVista: (id: string) => Promise<void>;
}

const MoviesContext = createContext<MoviesContextType | null>(null);

export function MoviesProvider({ children }: { children: ReactNode }) {
  const { token, cerrarSesion } = useAuth();
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const manejarError = useCallback(
    (e: unknown, mensajePorDefecto: string) => {
      if (e instanceof ApiError) {
        if (e.status === 401) {
          setError('Tu sesión expiró. Inicia sesión de nuevo.');
          cerrarSesion();
          return;
        }
        setError(e.message);
        return;
      }
      setError(mensajePorDefecto);
    },
    [cerrarSesion]
  );

  const refrescar = useCallback(async () => {
    if (!token) {
      setPeliculas([]);
      setCargando(false);
      return;
    }
    setCargando(true);
    setError(null);
    try {
      const datos = await obtenerPeliculas();
      setPeliculas(datos);
    } catch (e) {
      manejarError(e, 'No se pudieron cargar las películas.');
    } finally {
      setCargando(false);
    }
  }, [token, manejarError]);

  useEffect(() => {
    refrescar();
  }, [refrescar]);

  const agregarPelicula: MoviesContextType['agregarPelicula'] = async (nueva) => {
    try {
      const creada = await crearPelicula({ ...nueva, favorita: false, vista: false });
      setPeliculas((actuales) => [...actuales, creada]);
    } catch (e) {
      manejarError(e, 'No se pudo agregar la película.');
    }
  };

  const editarPelicula: MoviesContextType['editarPelicula'] = async (id, datos) => {
    try {
      const actualizada = await actualizarPelicula(id, datos);
      setPeliculas((actuales) => actuales.map((p) => (p.id === id ? actualizada : p)));
    } catch (e) {
      manejarError(e, 'No se pudo editar la película.');
    }
  };

  const eliminarPelicula = async (id: string) => {
    try {
      await apiEliminarPelicula(id);
      setPeliculas((actuales) => actuales.filter((p) => p.id !== id));
    } catch (e) {
      manejarError(e, 'No se pudo eliminar la película.');
    }
  };

  const toggleFavorita = async (id: string) => {
    const pelicula = peliculas.find((p) => p.id === id);
    if (!pelicula) return;
    const favorita = !pelicula.favorita;
    setPeliculas((actuales) => actuales.map((p) => (p.id === id ? { ...p, favorita } : p)));
    try {
      await actualizarPelicula(id, { ...pelicula, favorita });
    } catch (e) {
      setPeliculas((actuales) => actuales.map((p) => (p.id === id ? pelicula : p)));
      manejarError(e, 'No se pudo actualizar la película.');
    }
  };

  const toggleVista = async (id: string) => {
    const pelicula = peliculas.find((p) => p.id === id);
    if (!pelicula) return;
    const vista = !pelicula.vista;
    setPeliculas((actuales) => actuales.map((p) => (p.id === id ? { ...p, vista } : p)));
    try {
      await actualizarPelicula(id, { ...pelicula, vista });
    } catch (e) {
      setPeliculas((actuales) => actuales.map((p) => (p.id === id ? pelicula : p)));
      manejarError(e, 'No se pudo actualizar la película.');
    }
  };

  return (
    <MoviesContext.Provider
      value={{
        peliculas,
        cargando,
        error,
        refrescar,
        agregarPelicula,
        editarPelicula,
        eliminarPelicula,
        toggleFavorita,
        toggleVista,
      }}>
      {children}
    </MoviesContext.Provider>
  );
}

export function useMovies() {
  const context = useContext(MoviesContext);
  if (!context) {
    throw new Error('useMovies debe usarse dentro de un MoviesProvider');
  }
  return context;
}
