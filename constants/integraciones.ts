import type Ionicons from '@expo/vector-icons/Ionicons';

/**
 * Integraciones del proyecto grupal con las APIs de los compañeros.
 *
 *  - Viajes   -> API de Lester Esquivel (App de agenda de viajes)
 *  - Perfiles -> API de Jose Rodriguez (App para deportistas de Gym)
 *
 * Las URLs base se definen en .env (EXPO_PUBLIC_VIAJES_API_URL y
 * EXPO_PUBLIC_PERFILES_API_URL). Las rutas y los nombres de los campos son
 * los que se esperan por defecto; si la API del compañero usa otros, basta
 * con cambiarlos aquí (rutas, `campos` y `mapear`).
 */

export type Crudo = Record<string, unknown>;

export interface CampoForm {
  /** Nombre del campo tal como lo espera la API del compañero. */
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  requerido?: boolean;
  tipo?: 'texto' | 'numero' | 'fecha' | 'largo';
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
  baseUrl: (process.env.EXPO_PUBLIC_VIAJES_API_URL ?? '').replace(/\/+$/, ''),
  rutaLista: '/viajes',
  rutaCrear: '/viajes',
  campos: [
    { key: 'destino', label: 'Destino', icon: 'location-outline', requerido: true },
    { key: 'fecha_inicio', label: 'Fecha de inicio (AAAA-MM-DD)', icon: 'calendar-outline', requerido: true, tipo: 'fecha' },
    { key: 'fecha_fin', label: 'Fecha de fin (AAAA-MM-DD)', icon: 'calendar-outline', tipo: 'fecha' },
    { key: 'estado', label: 'Estado', icon: 'flag-outline', requerido: true, valorInicial: 'completado' },
    { key: 'descripcion', label: 'Descripción (opcional)', icon: 'document-text-outline', tipo: 'largo' },
  ],
  filtrar: (item) => /complet/i.test(leer(item, 'estado', 'estatus', 'status', 'estado_nombre') ?? ''),
  mapear: (item) => ({
    id: leer(item, 'id', '_id') ?? Math.random().toString(36).slice(2),
    titulo: leer(item, 'destino', 'nombre', 'titulo', 'pais', 'ciudad') ?? 'Viaje',
    subtitulo: unir(
      leer(item, 'fecha_inicio', 'fechaInicio', 'fecha_salida', 'fecha'),
      leer(item, 'fecha_fin', 'fechaFin', 'fecha_regreso')
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
  baseUrl: (process.env.EXPO_PUBLIC_PERFILES_API_URL ?? '').replace(/\/+$/, ''),
  rutaLista: '/perfiles',
  rutaCrear: '/perfiles',
  campos: [
    { key: 'nombre', label: 'Nombre', icon: 'person-outline', requerido: true },
    { key: 'email', label: 'Correo electrónico', icon: 'mail-outline', requerido: true },
    { key: 'edad', label: 'Edad', icon: 'time-outline', tipo: 'numero' },
    { key: 'peso', label: 'Peso (kg)', icon: 'barbell-outline', tipo: 'numero' },
    { key: 'objetivo', label: 'Objetivo (opcional)', icon: 'trophy-outline' },
  ],
  mapear: (item) => ({
    id: leer(item, 'id', '_id') ?? Math.random().toString(36).slice(2),
    titulo: leer(item, 'nombre', 'name', 'usuario', 'username') ?? 'Perfil',
    subtitulo: leer(item, 'email', 'correo'),
    detalle: unir(
      leer(item, 'objetivo', 'meta'),
      leer(item, 'edad') ? `${leer(item, 'edad')} años` : undefined,
      leer(item, 'peso') ? `${leer(item, 'peso')} kg` : undefined
    ),
  }),
};

export const INTEGRACIONES = { viajes: VIAJES, perfiles: PERFILES } as const;
