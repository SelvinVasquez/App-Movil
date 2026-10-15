import type { Pelicula } from '@/constants/movies';

const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w342';

// Acepta la API Key (v3, 32 caracteres) o el "API Read Access Token" (v4, JWT).
const CLAVE = process.env.EXPO_PUBLIC_TMDB_KEY ?? '';
const ES_TOKEN = CLAVE.length > 40;

export const tmdbConfigurado = CLAVE.length > 0;

export interface TmdbPelicula {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date?: string;
  vote_average: number;
  genre_ids: number[];
}

export interface TmdbPagina {
  results: TmdbPelicula[];
  page: number;
  total_pages: number;
}

const GENEROS: Record<number, string> = {
  28: 'Acción',
  12: 'Aventura',
  16: 'Animación',
  35: 'Comedia',
  80: 'Crimen',
  99: 'Documental',
  18: 'Drama',
  10751: 'Familiar',
  14: 'Fantasía',
  36: 'Historia',
  27: 'Terror',
  10402: 'Música',
  9648: 'Misterio',
  10749: 'Romance',
  878: 'Ciencia ficción',
  10770: 'Película de TV',
  53: 'Suspenso',
  10752: 'Bélica',
  37: 'Western',
};

async function pedir(ruta: string, params: Record<string, string>): Promise<TmdbPagina> {
  const query = new URLSearchParams({ language: 'es-MX', ...params });
  if (!ES_TOKEN) query.set('api_key', CLAVE);
  const respuesta = await fetch(`${BASE_URL}${ruta}?${query}`, {
    headers: ES_TOKEN ? { Authorization: `Bearer ${CLAVE}` } : undefined,
  });
  if (!respuesta.ok) {
    throw new Error(`TMDB respondió con estado ${respuesta.status}`);
  }
  return respuesta.json();
}

export function peliculasPopulares(pagina: number) {
  return pedir('/movie/popular', { page: String(pagina) });
}

export function buscarPeliculas(texto: string, pagina: number) {
  return pedir('/search/movie', { query: texto, page: String(pagina), include_adult: 'false' });
}

export function posterUrl(path: string | null): string {
  return path ? `${IMG_URL}${path}` : '';
}

export function tmdbAPelicula(
  p: TmdbPelicula
): Omit<Pelicula, 'id' | 'favorita' | 'vista'> {
  return {
    titulo: p.title,
    año: Number(p.release_date?.slice(0, 4)) || 0,
    genero: GENEROS[p.genre_ids[0]] ?? 'Otro',
    poster: posterUrl(p.poster_path),
    calificacion: Math.round(p.vote_average * 10) / 10,
    sinopsis: p.overview || undefined,
    origenId: `tmdb-${p.id}`,
  };
}
