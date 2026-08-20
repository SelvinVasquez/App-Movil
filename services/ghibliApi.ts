import type { Pelicula } from '@/constants/movies';

const BASE_URL = 'https://ghibliapi.vercel.app';

export interface GhibliFilm {
  id: string;
  title: string;
  description: string;
  image: string;
  release_date: string;
  rt_score: string;
}

export async function obtenerPeliculasGhibli(): Promise<GhibliFilm[]> {
  const respuesta = await fetch(`${BASE_URL}/films`);
  if (!respuesta.ok) {
    throw new Error(`La API respondió con estado ${respuesta.status}`);
  }
  return respuesta.json();
}

export function ghibliAPelicula(
  film: GhibliFilm
): Omit<Pelicula, 'id' | 'favorita' | 'vista'> {
  return {
    titulo: film.title,
    año: Number(film.release_date),
    genero: 'Animación',
    poster: film.image,
    calificacion: Number(film.rt_score) / 10,
    sinopsis: film.description,
    origenId: film.id,
  };
}
