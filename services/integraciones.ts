import type { Crudo, Integracion } from '@/constants/integraciones';
import { obtenerToken } from '@/services/api';

/**
 * Cliente genérico para consumir las APIs de los compañeros.
 * Tolera las formas de respuesta más comunes:
 *   [ ... ] | { data: [ ... ] } | { data: { data: [ ... ] } } (paginado de Laravel)
 *   | { results: [ ... ] } | { items: [ ... ] }
 */

export class IntegracionError extends Error {}

function extraerLista(cuerpo: unknown): Crudo[] {
  if (Array.isArray(cuerpo)) return cuerpo as Crudo[];
  if (cuerpo && typeof cuerpo === 'object') {
    const objeto = cuerpo as Record<string, unknown>;
    for (const clave of ['data', 'results', 'items', 'rows']) {
      if (clave in objeto) return extraerLista(objeto[clave]);
    }
  }
  return [];
}

function mensajeDeError(cuerpo: unknown, estado: number): string {
  if (cuerpo && typeof cuerpo === 'object') {
    const objeto = cuerpo as Record<string, unknown>;
    const errores = objeto.errors;
    if (errores && typeof errores === 'object') {
      const texto = Object.values(errores as Record<string, unknown>).flat().join(' ');
      if (texto) return texto;
    }
    if (typeof objeto.message === 'string') return objeto.message;
  }
  return `La API respondió con estado ${estado}`;
}

async function pedir(integracion: Integracion, ruta: string, init?: RequestInit): Promise<unknown> {
  if (!integracion.baseUrl) {
    throw new IntegracionError(
      `Falta configurar la URL de la API (EXPO_PUBLIC_API_URL).`
    );
  }

  const token = await obtenerToken();
  let respuesta: Response;
  try {
    respuesta = await fetch(`${integracion.baseUrl}${ruta}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init?.headers,
      },
    });
  } catch {
    throw new IntegracionError(`No se pudo conectar con la API de ${integracion.proveedor}.`);
  }

  const cuerpo = await respuesta.json().catch(() => null);
  if (!respuesta.ok) {
    throw new IntegracionError(mensajeDeError(cuerpo, respuesta.status));
  }
  return cuerpo;
}

export async function listar(integracion: Integracion) {
  const cuerpo = await pedir(integracion, integracion.rutaLista);
  const lista = extraerLista(cuerpo);
  const filtrada = integracion.filtrar ? lista.filter(integracion.filtrar) : lista;
  return filtrada.map(integracion.mapear);
}

export async function crear(integracion: Integracion, valores: Record<string, string>) {
  const cuerpo: Record<string, string | number> = {};
  for (const campo of integracion.campos) {
    const valor = (valores[campo.key] ?? '').trim();
    if (valor === '') continue;
    cuerpo[campo.key] = campo.tipo === 'numero' ? Number(valor) : valor;
  }
  await pedir(integracion, integracion.rutaCrear, { method: 'POST', body: JSON.stringify(cuerpo) });
}

/** Segundo paso de los registros que exigen un código enviado por correo. */
export async function verificar(integracion: Integracion, clave: string, codigo: string) {
  if (!integracion.verificacion) throw new IntegracionError('Esta integración no requiere verificación.');
  await pedir(integracion, integracion.verificacion.ruta, {
    method: 'POST',
    body: JSON.stringify({ [integracion.verificacion.campoClave]: clave.trim(), code: codigo.trim() }),
  });
}
