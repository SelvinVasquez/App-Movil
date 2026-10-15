import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import type { Pelicula } from '@/constants/movies';

/**
 * Puerto donde corre `php artisan serve` (configurado en el .env de Laravel
 * con SERVER_HOST=0.0.0.0 y SERVER_PORT=8000).
 */
const PUERTO_LARAVEL = 8000;

/**
 * Obtiene la IP de la PC en la red local a partir de la dirección del servidor
 * de Expo (por ejemplo "192.168.1.5:8081"). Así no hay que cambiar la IP a mano
 * cada vez que se cambia de red WiFi: Laravel y Expo corren en la misma PC.
 */
function obtenerHostLocal(): string {
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    return hostUri.split(':')[0];
  }
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return window.location.hostname;
  }
  return 'localhost';
}

/**
 * URL base de la API Laravel. Se puede forzar otra con la variable
 * EXPO_PUBLIC_API_URL en un archivo .env (por ejemplo, la API de un compañero).
 */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? `http://${obtenerHostLocal()}:${PUERTO_LARAVEL}/api`;

const TOKEN_KEY = 'auth_token';

// En el móvil el token va en el almacén seguro del sistema. SecureStore no
// existe en el navegador, así que en web se usa localStorage.
const esWeb = Platform.OS === 'web';

export async function guardarToken(token: string): Promise<void> {
  if (esWeb) {
    localStorage.setItem(TOKEN_KEY, token);
    return;
  }
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function obtenerToken(): Promise<string | null> {
  if (esWeb) {
    return localStorage.getItem(TOKEN_KEY);
  }
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function borrarToken(): Promise<void> {
  if (esWeb) {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }
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
      `No se pudo conectar con ${API_BASE_URL}. Verifica que Laravel esté corriendo (php artisan serve) y que el teléfono esté en la misma red WiFi que la PC.`
    );
  }

  const texto = await respuesta.text();
  const cuerpo = texto ? JSON.parse(texto) : null;

  if (!respuesta.ok) {
    if (respuesta.status === 401) {
      throw new ApiError(401, 'Tu sesión expiró. Inicia sesión de nuevo.');
    }
    const primerError = cuerpo?.errors ? Object.values(cuerpo.errors)[0] : null;
    const mensaje =
      (Array.isArray(primerError) ? primerError[0] : null) ?? cuerpo?.message ?? `Error ${respuesta.status}`;
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

export function registrarse(name: string, email: string, password: string): Promise<UsuarioApi> {
  return peticion<UsuarioApi>('/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
    conAuth: false,
  });
}

export function obtenerUsuarioActual(): Promise<UsuarioApi> {
  return peticion<UsuarioApi>('/user');
}

export function logout(): Promise<void> {
  return peticion<void>('/logout', { method: 'POST' });
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
