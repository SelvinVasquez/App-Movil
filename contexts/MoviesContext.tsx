import type { Pelicula } from '@/constants/movies';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import * as api from '@/services/api';

interface MoviesContextType {
  peliculas: Pelicula[];
  cargando: boolean;
  error: string | null;
  recargar: () => Promise<void>;
  agregarPelicula: (p: Omit<Pelicula, 'id' | 'favorita' | 'vista'>) => Promise<void>;
  editarPelicula: (id: string, datos: Omit<Pelicula, 'id'>) => Promise<void>;
  eliminarPelicula: (id: string) => Promise<void>;
  toggleFavorita: (id: string) => Promise<void>;
  toggleVista: (id: string) => Promise<void>;
}

const MoviesContext = createContext<MoviesContextType | null>(null);

export function MoviesProvider({ children }: { children: ReactNode }) {
  const { usuario } = useAuth();
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      setPeliculas(await api.obtenerPeliculas());
    } catch (e) {
      setError(e instanceof api.ApiError ? e.message : 'No se pudieron cargar las películas.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    if (usuario) {
      recargar();
    } else {
      setPeliculas([]);
    }
  }, [usuario, recargar]);

  // Misma regla que el backend: mismo título (sin distinguir mayúsculas) y año.
  const existeDuplicada = (titulo: string, año: number, ignorarId?: string) =>
    peliculas.some(
      (p) =>
        p.id !== ignorarId &&
        p.año === año &&
        p.titulo.trim().toLowerCase() === titulo.trim().toLowerCase()
    );

  const agregarPelicula: MoviesContextType['agregarPelicula'] = async (nueva) => {
    if (existeDuplicada(nueva.titulo, nueva.año)) {
      throw new api.ApiError(422, 'Esta película ya está en tu lista.');
    }
    const creada = await api.crearPelicula({ ...nueva, favorita: false, vista: false });
    setPeliculas((actuales) => [...actuales, creada]);
  };

  const editarPelicula: MoviesContextType['editarPelicula'] = async (id, datos) => {
    if (existeDuplicada(datos.titulo, datos.año, id)) {
      throw new api.ApiError(422, 'Esta película ya está en tu lista.');
    }
    const actualizada = await api.actualizarPelicula(id, datos);
    setPeliculas((actuales) => actuales.map((p) => (p.id === id ? actualizada : p)));
  };

  const eliminarPelicula = async (id: string) => {
    await api.eliminarPelicula(id);
    setPeliculas((actuales) => actuales.filter((p) => p.id !== id));
  };

  const toggleFavorita = async (id: string) => {
    const pelicula = peliculas.find((p) => p.id === id);
    if (!pelicula) return;
    const actualizada = await api.actualizarPelicula(id, { favorita: !pelicula.favorita });
    setPeliculas((actuales) => actuales.map((p) => (p.id === id ? actualizada : p)));
  };

  const toggleVista = async (id: string) => {
    const pelicula = peliculas.find((p) => p.id === id);
    if (!pelicula) return;
    const actualizada = await api.actualizarPelicula(id, { vista: !pelicula.vista });
    setPeliculas((actuales) => actuales.map((p) => (p.id === id ? actualizada : p)));
  };

  return (
    <MoviesContext.Provider
      value={{
        peliculas,
        cargando,
        error,
        recargar,
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
