import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { RatingBadge } from '@/components/rating-badge';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { Pelicula } from '@/constants/movies';
import { Radius, Spacing } from '@/constants/theme';
import { useMovies } from '@/contexts/MoviesContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ApiError, obtenerPelicula } from '@/services/api';

export default function DetallePelicula() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { toggleFavorita, toggleVista, eliminarPelicula } = useMovies();

  const [pelicula, setPelicula] = useState<Pelicula | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cardBackground = useThemeColor({}, 'surface');
  const borderColor = useThemeColor({}, 'border');
  const accent = useThemeColor({}, 'accent');
  const success = useThemeColor({}, 'success');
  const danger = useThemeColor({}, 'danger');
  const iconColor = useThemeColor({}, 'icon');
  const background = useThemeColor({}, 'background');

  const cargar = useCallback(async () => {
    if (!id) return;
    setCargando(true);
    setError(null);
    try {
      const datos = await obtenerPelicula(id);
      setPelicula(datos);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'No se pudo cargar la película.');
    } finally {
      setCargando(false);
    }
  }, [id]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  if (cargando) {
    return (
      <ThemedView style={[styles.container, styles.centro]}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator color={accent} size="large" />
      </ThemedView>
    );
  }

  if (error || !pelicula) {
    return (
      <ThemedView style={[styles.container, styles.centro]}>
        <Stack.Screen options={{ headerShown: false }} />
        <Ionicons name="alert-circle-outline" size={40} color={danger} />
        <ThemedText style={styles.errorTexto}>
          {error ?? 'No se encontró la película.'}
        </ThemedText>
        <Pressable style={[styles.reintentar, { borderColor: accent }]} onPress={cargar}>
          <Ionicons name="refresh" size={16} color={accent} />
          <ThemedText style={{ color: accent, fontWeight: '600' }}>Reintentar</ThemedText>
        </Pressable>
        <Pressable onPress={() => router.back()}>
          <ThemedText type="link">Volver</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  const onToggleFavorita = () => {
    setPelicula({ ...pelicula, favorita: !pelicula.favorita });
    toggleFavorita(pelicula.id);
  };

  const onToggleVista = () => {
    setPelicula({ ...pelicula, vista: !pelicula.vista });
    toggleVista(pelicula.id);
  };

  const confirmarEliminar = () => {
    Alert.alert('Eliminar película', `¿Seguro que quieres eliminar "${pelicula.titulo}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => {
          eliminarPelicula(pelicula.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.posterWrapper}>
          <Image source={{ uri: pelicula.poster }} style={styles.poster} contentFit="cover" />
          <LinearGradient
            colors={['transparent', background]}
            style={styles.gradient}
            pointerEvents="none"
          />

          <Pressable style={[styles.backButton, { backgroundColor: 'rgba(11,13,16,0.55)' }]} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color="#F5F6F7" />
          </Pressable>

          <View style={styles.topActions}>
            <Pressable
              style={[styles.iconButton, { backgroundColor: 'rgba(11,13,16,0.55)' }]}
              onPress={onToggleFavorita}>
              <Ionicons
                name={pelicula.favorita ? 'heart' : 'heart-outline'}
                size={20}
                color={pelicula.favorita ? accent : '#F5F6F7'}
              />
            </Pressable>
            <Pressable
              style={[styles.iconButton, { backgroundColor: 'rgba(11,13,16,0.55)' }]}
              onPress={() => router.push(`/editar/${pelicula.id}`)}>
              <Ionicons name="pencil" size={18} color="#F5F6F7" />
            </Pressable>
          </View>

          <View style={styles.badgeOverlay}>
            <RatingBadge calificacion={pelicula.calificacion} size="large" />
          </View>
        </View>

        <View style={styles.content}>
          <ThemedText type="title">{pelicula.titulo}</ThemedText>

          <View style={styles.metaRow}>
            <View style={[styles.chip, { backgroundColor: cardBackground, borderColor }]}>
              <ThemedText style={styles.chipText}>{pelicula.año}</ThemedText>
            </View>
            <View style={[styles.chip, { backgroundColor: cardBackground, borderColor }]}>
              <ThemedText style={styles.chipText}>{pelicula.genero}</ThemedText>
            </View>
          </View>

          <Pressable
            style={[
              styles.vistaButton,
              { borderColor: pelicula.vista ? success : borderColor },
              pelicula.vista && { backgroundColor: success + '22' },
            ]}
            onPress={onToggleVista}>
            <Ionicons
              name={pelicula.vista ? 'checkmark-circle' : 'checkmark-circle-outline'}
              size={18}
              color={pelicula.vista ? success : iconColor}
            />
            <ThemedText style={{ color: pelicula.vista ? success : iconColor, fontWeight: '600' }}>
              {pelicula.vista ? 'Vista' : 'Marcar como vista'}
            </ThemedText>
          </Pressable>

          <View style={[styles.divider, { backgroundColor: borderColor }]} />

          <ThemedText type="subtitle">Sinopsis</ThemedText>
          <ThemedText style={styles.sinopsis}>
            {pelicula.sinopsis && pelicula.sinopsis.length > 0
              ? pelicula.sinopsis
              : 'Aún no hay una sinopsis para esta película.'}
          </ThemedText>

          <View style={[styles.divider, { backgroundColor: borderColor }]} />

          <ThemedText type="subtitle">Calificación</ThemedText>
          <ThemedText style={styles.calificacionTexto}>
            {pelicula.calificacion > 0
              ? `⭐ ${pelicula.calificacion.toFixed(1)} / 10`
              : 'Aún sin calificar'}
          </ThemedText>

          <Pressable
            style={[styles.eliminarButton, { borderColor: danger }]}
            onPress={confirmarEliminar}>
            <Ionicons name="trash-outline" size={18} color={danger} />
            <ThemedText style={{ color: danger, fontWeight: '600' }}>Eliminar película</ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centro: { alignItems: 'center', justifyContent: 'center', gap: Spacing.md, padding: Spacing.xl },
  errorTexto: { textAlign: 'center' },
  reintentar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  scroll: { paddingBottom: 40 },
  posterWrapper: { position: 'relative' },
  poster: { width: '100%', height: 440 },
  gradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 140 },
  backButton: {
    position: 'absolute',
    top: 56,
    left: Spacing.xl,
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topActions: {
    position: 'absolute',
    top: 56,
    right: Spacing.xl,
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeOverlay: { position: 'absolute', bottom: 16, right: 16 },
  content: { padding: Spacing.xl, gap: Spacing.md },
  metaRow: { flexDirection: 'row', gap: Spacing.sm },
  chip: { paddingHorizontal: Spacing.md, paddingVertical: 6, borderRadius: Radius.full, borderWidth: 1 },
  chipText: { fontSize: 13, fontWeight: '600' },
  vistaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  divider: { height: 1, marginVertical: Spacing.xs },
  sinopsis: { fontSize: 15, lineHeight: 22, opacity: 0.85 },
  calificacionTexto: { fontSize: 16, opacity: 0.8 },
  eliminarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: Radius.md - 2,
    paddingVertical: Spacing.md,
    marginTop: Spacing.md,
  },
});
