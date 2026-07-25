import type { Pelicula } from '@/constants/movies';
import { peliculas as peliculasIniciales } from '@/constants/movies';
import { createContext, ReactNode, useContext, useState } from 'react';

interface MoviesContextType {
  peliculas: Pelicula[];
  agregarPelicula: (p: Omit<Pelicula, 'id'>) => void;
}

const MoviesContext = createContext<MoviesContextType | null>(null);

export function MoviesProvider({ children }: { children: ReactNode }) {
  const [peliculas, setPeliculas] = useState<Pelicula[]>(peliculasIniciales);

  const agregarPelicula = (nueva: Omit<Pelicula, 'id'>) => {
    setPeliculas((actuales) => [
      ...actuales,
      { ...nueva, id: String(actuales.length + 1) },
    ]);
  };

  return (
    <MoviesContext.Provider value={{ peliculas, agregarPelicula }}>
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