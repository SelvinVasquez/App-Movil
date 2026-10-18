import { useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';

import { AnimatedPressable } from '@/components/animated-pressable';
import { ChipsRow } from '@/components/chips-row';
import { IntegracionLista } from '@/components/integracion-lista';
import { ThemedText } from '@/components/themed-text';
import { COMUNIDAD, type Integracion } from '@/constants/integraciones';
import { Radius, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { listarAutores, type Autor } from '@/services/integraciones';

const TODAS = 'Todas';

/** Elige el autor que corresponde al usuario que inició sesión (por nombre completo o primer nombre). */
function autorDelUsuario(autores: Autor[], nombre?: string): string {
  if (!nombre) return TODAS;
  const completo = nombre.trim().toLowerCase();
  const primero = completo.split(/\s+/)[0];
  const coincide =
    autores.find((a) => a.autor.toLowerCase() === completo) ??
    autores.find((a) => a.autor.toLowerCase().split(/\s+/)[0] === primero);
  return coincide?.autor ?? TODAS;
}

export default function ComunidadScreen() {
  const { usuario } = useAuth();
  const [autores, setAutores] = useState<Autor[]>([]);
  const [seleccion, setSeleccion] = useState<string | null>(null);

  const accent = useThemeColor({}, 'accent');
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');

  useEffect(() => {
    let activo = true;
    listarAutores()
      .then((lista) => {
        if (!activo) return;
        setAutores(lista);
        // Al entrar se abre el filtro del propio usuario (por ejemplo, Lester ve solo lo suyo).
        setSeleccion((actual) => actual ?? autorDelUsuario(lista, usuario?.name));
      })
      .catch(() => {
        if (activo) setSeleccion((actual) => actual ?? TODAS);
      });
    return () => {
      activo = false;
    };
  }, [usuario?.name]);

  const activo = seleccion ?? TODAS;

  const integracion: Integracion = useMemo(
    () => ({
      ...COMUNIDAD,
      rutaLista:
        activo === TODAS
          ? COMUNIDAD.rutaLista
          : `${COMUNIDAD.rutaLista}&autor=${encodeURIComponent(activo)}`,
    }),
    [activo]
  );

  const opciones = [{ autor: TODAS, peliculas: autores.reduce((t, a) => t + a.peliculas, 0) }, ...autores];

  return (
    <IntegracionLista
      key={activo}
      integracion={integracion}
      encabezado={
        <ChipsRow>
          {opciones.map((o) => {
            const seleccionado = o.autor === activo;
            return (
              <AnimatedPressable
                key={o.autor}
                onPress={() => setSeleccion(o.autor)}
                style={[
                  styles.chip,
                  { borderColor: seleccionado ? accent : border, backgroundColor: seleccionado ? accent : surface },
                ]}>
                <ThemedText
                  style={[styles.chipTexto, seleccionado && { color: '#151718' }]}
                  numberOfLines={1}>
                  {o.autor} · {o.peliculas}
                </ThemedText>
              </AnimatedPressable>
            );
          })}
        </ChipsRow>
      }
    />
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
  },
  chipTexto: { fontSize: 13, fontWeight: '600' },
});
