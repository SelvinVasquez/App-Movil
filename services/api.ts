import * as SecureStore from 'expo-secure-store';

import type { Pelicula } from '@/constants/movies';

/**
 * URL base de la API Laravel.
 *
 * - Web / simulador iOS: 'http://localhost:8000/api' funciona tal cual.
 * - Emulador Android (Android Studio): usa 'http://10.0.2.2:8000/api' en vez de localhost.
 * - Expo Go en un teléfono físico: "localhost" apunta al teléfono, no a tu PC. Usa la IP
 *   local de tu computadora, ej. 'http://192.168.1.50:8000/api'.
 *   En Windows, obtén tu IP con `ipconfig` en una terminal (busca "Dirección IPv4" en tu
 *   adaptador de red activo) y asegúrate de que el teléfono esté en la misma red Wi-Fi.
 */
export const API_BASE_URL = 'http://192.168.1.40:8000/api';

const TOKEN_KEY = 'auth_token';

export async function guardarToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function obtenerToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function borrarToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface OpcionesPeticion extends RequestInit {
  /** Si es false, no agrega el header Authorization (para /login y /register). Por defecto true. */
  conAuth?: boolean;
}

interface RespuestaSobre<T> {
  success: boolean;
  message: string;
  data: T;
}

async function peticion<T>(ruta: string, opciones: OpcionesPeticion = {}): Promise<T> {
  const { conAuth = true, headers, ...resto } = opciones;

  const headersFinales: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(headers as Record<string, string> | undefined),
  };

  if (conAuth) {
    const token = await obtenerToken();
    if (token) {
      headersFinales.Authorization = `Bearer ${token}`;
    }
  }

  let respuesta: Response;
  try {
    respuesta = await fetch(`${API_BASE_URL}${ruta}`, { ...resto, headers: headersFinales });
  } catch {
    throw new ApiError(
      0,
      `No se pudo conectar con ${API_BASE_URL}. Verifica que el servidor Laravel esté corriendo y que la URL sea correcta.`
    );
  }

  const texto = await respuesta.text();
  const cuerpo = texto ? JSON.parse(texto) : null;

  if (!respuesta.ok) {
    const mensaje = cuerpo?.message ?? `Error ${respuesta.status}`;
    throw new ApiError(respuesta.status, mensaje);
  }

  // Todas las respuestas de esta API vienen envueltas en { success, message, data }.
  return (cuerpo?.data ?? cuerpo) as T;
}

// --- Autenticación ---

export interface UsuarioApi {
  id: number;
  name: string;
  email: string;
}

export interface RespuestaLogin {
  user: UsuarioApi;
  token: string;
}

export function login(email: string, password: string): Promise<RespuestaLogin> {
  return peticion<RespuestaLogin>('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    conAuth: false,
  });
}

export function register(name: string, email: string, password: string): Promise<UsuarioApi> {
  return peticion<UsuarioApi>('/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
    conAuth: false,
  });
}

// --- Películas ---
// El backend usa nombres de columna distintos a los del modelo local:
// "anio" en vez de "año", y "poster_url" en vez de "poster".

interface PeliculaApi {
  id: number;
  titulo: string;
  sinopsis: string | null;
  anio: number;
  genero: string;
  poster_url: string | null;
  calificacion: string | number | null;
  favorita: boolean;
  vista: boolean;
}

function mapearDesdeApi(item: PeliculaApi): Pelicula {
  return {
    id: String(item.id),
    titulo: item.titulo,
    año: item.anio,
    genero: item.genero,
    poster: item.poster_url ?? '',
    calificacion: item.calificacion ? Number(item.calificacion) : 0,
    favorita: Boolean(item.favorita),
    vista: Boolean(item.vista),
    sinopsis: item.sinopsis ?? undefined,
  };
}

function mapearHaciaApi(datos: Partial<Omit<Pelicula, 'id'>>) {
  const cuerpo: Record<string, unknown> = {};
  if (datos.titulo !== undefined) cuerpo.titulo = datos.titulo;
  if (datos.sinopsis !== undefined) cuerpo.sinopsis = datos.sinopsis;
  if (datos.año !== undefined) cuerpo.anio = datos.año;
  if (datos.genero !== undefined) cuerpo.genero = datos.genero;
  if (datos.poster !== undefined) cuerpo.poster_url = datos.poster;
  if (datos.calificacion !== undefined) cuerpo.calificacion = datos.calificacion;
  if (datos.favorita !== undefined) cuerpo.favorita = datos.favorita;
  if (datos.vista !== undefined) cuerpo.vista = datos.vista;
  return cuerpo;
}

export async function obtenerPeliculas(): Promise<Pelicula[]> {
  const datos = await peticion<PeliculaApi[]>('/peliculas');
  return datos.map(mapearDesdeApi);
}

export async function obtenerPelicula(id: string): Promise<Pelicula> {
  const datos = await peticion<PeliculaApi>(`/peliculas/${id}`);
  return mapearDesdeApi(datos);
}

export async function crearPelicula(datos: Omit<Pelicula, 'id'>): Promise<Pelicula> {
  const creada = await peticion<PeliculaApi>('/peliculas', {
    method: 'POST',
    body: JSON.stringify(mapearHaciaApi(datos)),
  });
  return mapearDesdeApi(creada);
}

export async function actualizarPelicula(
  id: string,
  datos: Partial<Omit<Pelicula, 'id'>>
): Promise<Pelicula> {
  const actualizada = await peticion<PeliculaApi>(`/peliculas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(mapearHaciaApi(datos)),
  });
  return mapearDesdeApi(actualizada);
}

export function eliminarPelicula(id: string): Promise<void> {
  return peticion<void>(`/peliculas/${id}`, { method: 'DELETE' });
}
