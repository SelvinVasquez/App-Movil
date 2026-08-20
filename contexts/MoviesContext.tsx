import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Pelicula } from '@/constants/movies';
import { peliculas as peliculasIniciales } from '@/constants/movies';
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'miprimerproyecto:peliculas';

interface MoviesContextType {
  peliculas: Pelicula[];
  cargando: boolean;
  agregarPelicula: (p: Omit<Pelicula, 'id' | 'favorita' | 'vista'>) => void;
  editarPelicula: (id: string, datos: Omit<Pelicula, 'id'>) => void;
  eliminarPelicula: (id: string) => void;
  toggleFavorita: (id: string) => void;
  toggleVista: (id: string) => void;
  restablecerBiblioteca: () => void;
}

const MoviesContext = createContext<MoviesContextType | null>(null);

export function MoviesProvider({ children }: { children: ReactNode }) {
  const [peliculas, setPeliculas] = useState<Pelicula[]>(peliculasIniciales);
  const [cargando, setCargando] = useState(true);
  const hidratado = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((guardadas) => {
        if (guardadas) {
          setPeliculas(JSON.parse(guardadas));
        }
      })
      .finally(() => {
        hidratado.current = true;
        setCargando(false);
      });
  }, []);

  useEffect(() => {
    if (!hidratado.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(peliculas));
  }, [peliculas]);

  const agregarPelicula: MoviesContextType['agregarPelicula'] = (nueva) => {
    setPeliculas((actuales) => [
      ...actuales,
      { ...nueva, id: String(Date.now()), favorita: false, vista: false },
    ]);
  };

  const editarPelicula: MoviesContextType['editarPelicula'] = (id, datos) => {
    setPeliculas((actuales) => actuales.map((p) => (p.id === id ? { ...p, ...datos, id } : p)));
  };

  const eliminarPelicula = (id: string) => {
    setPeliculas((actuales) => actuales.filter((p) => p.id !== id));
  };

  const toggleFavorita = (id: string) => {
    setPeliculas((actuales) =>
      actuales.map((p) => (p.id === id ? { ...p, favorita: !p.favorita } : p))
    );
  };

  const toggleVista = (id: string) => {
    setPeliculas((actuales) => actuales.map((p) => (p.id === id ? { ...p, vista: !p.vista } : p)));
  };

  const restablecerBiblioteca = () => {
    setPeliculas(peliculasIniciales);
  };

  return (
    <MoviesContext.Provider
      value={{
        peliculas,
        cargando,
        agregarPelicula,
        editarPelicula,
        eliminarPelicula,
        toggleFavorita,
        toggleVista,
        restablecerBiblioteca,
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
