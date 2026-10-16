import type Ionicons from '@expo/vector-icons/Ionicons';

import { API_BASE_URL } from '@/services/api';

/**
 * Integraciones del proyecto grupal con las APIs de los compañeros.
 *
 *  - Viajes   -> API de Lester Esquivel (App de agenda de viajes)
 *  - Perfiles -> API de Jose Rodriguez (App para deportistas de Gym)
 *
 * Las peticiones van a la API Laravel propia (`/api/integraciones/*`), que guarda las
 * credenciales de los compañeros y llama a sus servicios; la app solo envía su token.
 */

export type Crudo = Record<string, unknown>;

export interface CampoForm {
  /** Nombre del campo tal como lo espera la API del compañero. */
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  requerido?: boolean;
  tipo?: 'texto' | 'numero' | 'fecha' | 'largo' | 'password';
  /** Valor inicial; el usuario puede cambiarlo. */
  valorInicial?: string;
}

export interface ItemVista {
  id: string;
  titulo: string;
  subtitulo?: string;
  detalle?: string;
  etiqueta?: string;
}

export interface Integracion {
  clave: 'viajes' | 'perfiles';
  titulo: string;
  subtitulo: string;
  tituloNuevo: string;
  proveedor: string;
  icono: keyof typeof Ionicons.glyphMap;
  baseUrl: string;
  rutaLista: string;
  rutaCrear: string;
  campos: CampoForm[];
  /** Filtro opcional del listado (p. ej. solo viajes completados). */
  filtrar?: (item: Crudo) => boolean;
  mapear: (item: Crudo) => ItemVista;
  /** Validación previa al envío; devuelve el mensaje de error si algo no cumple. */
  validar?: (valores: Record<string, string>) => string | undefined;
  /** Si la API pide confirmar con un código enviado por correo antes de crear el registro. */
  verificacion?: { ruta: string; campoClave: string; ayuda: string };
}

/** Devuelve el primer valor no vacío entre varios nombres posibles de campo. */
function leer(item: Crudo, ...nombres: string[]): string | undefined {
  for (const nombre of nombres) {
    const valor = item[nombre];
    if (valor !== undefined && valor !== null && String(valor).trim() !== '') {
      return String(valor);
    }
  }
  return undefined;
}

function unir(...partes: (string | undefined)[]): string | undefined {
  const lista = partes.filter(Boolean);
  return lista.length > 0 ? lista.join(' · ') : undefined;
}

export const VIAJES: Integracion = {
  clave: 'viajes',
  titulo: 'Viajes completados',
  subtitulo: 'Viajes con estatus completado, de la app de agenda de viajes',
  tituloNuevo: 'Registrar viaje',
  proveedor: 'Lester Esquivel',
  icono: 'airplane-outline',
  baseUrl: API_BASE_URL,
  rutaLista: '/integraciones/viajes',
  rutaCrear: '/integraciones/viajes',
  campos: [
    { key: 'destino', label: 'Destino', icon: 'location-outline', requerido: true },
    { key: 'pais', label: 'País', icon: 'earth-outline', valorInicial: 'Guatemala' },
    { key: 'fecha_inicio', label: 'Fecha de inicio (AAAA-MM-DD)', icon: 'calendar-outline', requerido: true, tipo: 'fecha' },
    { key: 'fecha_fin', label: 'Fecha de fin (AAAA-MM-DD)', icon: 'calendar-outline', requerido: true, tipo: 'fecha' },
    { key: 'presupuesto', label: 'Presupuesto (opcional)', icon: 'cash-outline', tipo: 'numero' },
    { key: 'moneda', label: 'Moneda', icon: 'logo-usd', valorInicial: 'GTQ' },
    { key: 'descripcion', label: 'Descripción', icon: 'document-text-outline', requerido: true, tipo: 'largo' },
  ],
  // El servidor solo devuelve viajes completados y fuerza ese estado al registrar.
  mapear: (item) => ({
    id: leer(item, 'id', '_id') ?? Math.random().toString(36).slice(2),
    titulo: leer(item, 'destino', 'nombre', 'titulo', 'pais', 'ciudad') ?? 'Viaje',
    subtitulo: unir(
      leer(item, 'fecha_inicio', 'fechaInicio', 'fecha_salida', 'fecha')?.slice(0, 10),
      leer(item, 'fecha_fin', 'fechaFin', 'fecha_regreso')?.slice(0, 10)
    ),
    detalle: leer(item, 'descripcion', 'detalle', 'notas'),
    etiqueta: leer(item, 'estado', 'estatus', 'status'),
  }),
};

export const PERFILES: Integracion = {
  clave: 'perfiles',
  titulo: 'Perfiles',
  subtitulo: 'Perfiles de los usuarios registrados, de la app de gimnasio',
  tituloNuevo: 'Registrar perfil',
  proveedor: 'Jose Rodriguez',
  icono: 'people-outline',
  baseUrl: API_BASE_URL,
  rutaLista: '/integraciones/perfiles',
  rutaCrear: '/integraciones/perfiles',
  campos: [
    { key: 'name', label: 'Nombre', icon: 'person-outline', requerido: true },
    { key: 'email', label: 'Correo electrónico', icon: 'mail-outline', requerido: true },
    { key: 'password', label: 'Contraseña (8+, una mayúscula y un símbolo)', icon: 'lock-closed-outline', requerido: true, tipo: 'password' },
  ],
  validar: (v) => {
    const clave = v.password ?? '';
    if (clave.length < 8 || !/[A-Z]/.test(clave) || !/[^A-Za-z0-9]/.test(clave)) {
      return 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula y un carácter especial (por ejemplo ! @ # $).';
    }
    return undefined;
  },
  verificacion: {
    ruta: '/integraciones/perfiles/verificar',
    campoClave: 'email',
    ayuda: 'Se envió un código de 6 dígitos al correo indicado. Escríbelo para crear el perfil (vence en 10 minutos).',
  },
  mapear: (item) => ({
    id: leer(item, 'id', '_id') ?? Math.random().toString(36).slice(2),
    titulo: leer(item, 'name', 'nombre') ?? 'Perfil',
    subtitulo: leer(item, 'email', 'correo'),
    detalle: leer(item, 'role', 'rol'),
  }),
};

export const INTEGRACIONES = { viajes: VIAJES, perfiles: PERFILES } as const;
