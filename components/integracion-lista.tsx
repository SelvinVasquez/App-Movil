import Ionicons from '@expo/vector-icons/Ionicons';
import { type Href, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AnimatedPressable } from '@/components/animated-pressable';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { Integracion, ItemVista } from '@/constants/integraciones';
import { Radius, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { listar } from '@/services/integraciones';

/** Pantalla de listado para una API de un compañero, con botón para registrar uno nuevo. */
export function IntegracionLista({ integracion }: { integracion: Integracion }) {
  const router = useRouter();
  const [items, setItems] = useState<ItemVista[]>([]);
  const [estado, setEstado] = useState<'cargando' | 'listo' | 'error'>('cargando');
  const [error, setError] = useState('');
  const [refrescando, setRefrescando] = useState(false);

  const accent = useThemeColor({}, 'accent');
  const iconColor = useThemeColor({}, 'icon');
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');

  const cargar = useCallback(() => {
    return listar(integracion)
      .then((datos) => {
        setItems(datos);
        setEstado('listo');
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : 'No se pudo cargar la información.');
        setEstado('error');
      });
  }, [integracion]);

  useEffect(() => {
    // Se carga al montar la pantalla; los setState ocurren al resolver la promesa.
    let activo = true;
    listar(integracion)
      .then((datos) => {
        if (!activo) return;
        setItems(datos);
        setEstado('listo');
      })
      .catch((e: unknown) => {
        if (!activo) return;
        setError(e instanceof Error ? e.message : 'No se pudo cargar la información.');
        setEstado('error');
      });
    return () => {
      activo = false;
    };
  }, [integracion]);

  const reintentar = () => {
    setEstado('cargando');
    cargar();
  };

  const refrescar = () => {
    setRefrescando(true);
    cargar().finally(() => setRefrescando(false));
  };

  return (
    <ThemedView style={styles.container}>
      <Animated.View entering={FadeInDown.duration(500)} style={styles.headerRow}>
        <View style={styles.headerTexto}>
          <ThemedText type="title">{integracion.titulo}</ThemedText>
          <ThemedText type="caption">{integracion.subtitulo}</ThemedText>
        </View>
        <AnimatedPressable
          haptic
          accessibilityLabel={integracion.tituloNuevo}
          onPress={() => router.push(`/integracion/${integracion.clave}` as Href)}
          style={[styles.addButton, { backgroundColor: accent }]}>
          <Ionicons name="add" size={26} color="#151718" />
        </AnimatedPressable>
      </Animated.View>

      {estado === 'cargando' && (
        <View style={styles.centro}>
          <ActivityIndicator color={accent} size="large" />
          <ThemedText type="caption">Cargando...</ThemedText>
        </View>
      )}

      {estado === 'error' && (
        <View style={styles.centro}>
          <Ionicons name="cloud-offline-outline" size={40} color={iconColor} />
          <ThemedText type="caption" style={styles.centroTexto}>
            {error}
          </ThemedText>
          <AnimatedPressable
            onPress={reintentar}
            style={[styles.reintentar, { borderColor: accent }]}>
            <Ionicons name="refresh" size={16} color={accent} />
            <ThemedText style={{ color: accent, fontWeight: '600' }}>Reintentar</ThemedText>
          </AnimatedPressable>
        </View>
      )}

      {estado === 'listo' && (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refrescando} onRefresh={refrescar} tintColor={accent} />
          }
          renderItem={({ item, index }) => (
            <Animated.View
              entering={FadeInDown.delay(Math.min(index, 8) * 60).springify().damping(16)}
              style={[styles.card, { backgroundColor: surface, borderColor: border }]}>
              <View style={[styles.icono, { backgroundColor: accent + '22' }]}>
                <Ionicons name={integracion.icono} size={22} color={accent} />
              </View>
              <View style={styles.info}>
                <ThemedText type="defaultSemiBold" numberOfLines={2}>
                  {item.titulo}
                </ThemedText>
                {item.subtitulo && <ThemedText type="caption">{item.subtitulo}</ThemedText>}
                {item.detalle && (
                  <ThemedText type="caption" numberOfLines={2}>
                    {item.detalle}
                  </ThemedText>
                )}
              </View>
              {item.etiqueta && (
                <View style={[styles.etiqueta, { borderColor: accent }]}>
                  <ThemedText style={[styles.etiquetaTexto, { color: accent }]}>
                    {item.etiqueta}
                  </ThemedText>
                </View>
              )}
            </Animated.View>
          )}
          ListEmptyComponent={
            <View style={styles.centro}>
              <Ionicons name={integracion.icono} size={40} color={iconColor} />
              <ThemedText type="caption">No hay registros todavía.</ThemedText>
            </View>
          }
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  headerTexto: { flex: 1, gap: 2 },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: { paddingHorizontal: Spacing.xl, paddingBottom: 24, gap: Spacing.md },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  icono: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, gap: 4 },
  etiqueta: {
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  etiquetaTexto: { fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
  centro: { alignItems: 'center', marginTop: 60, gap: 10, paddingHorizontal: Spacing.xl },
  centroTexto: { textAlign: 'center' },
  reintentar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    marginTop: 4,
  },
});
