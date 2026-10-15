import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInUp, ZoomIn } from 'react-native-reanimated';

import { AnimatedPressable } from '@/components/animated-pressable';
import { PopIcon } from '@/components/pop-icon';

import { RatingBadge } from '@/components/rating-badge';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Radius, Spacing } from '@/constants/theme';
import { useMovies } from '@/contexts/MoviesContext';
import { useToast } from '@/contexts/ToastContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { aviso, confirmar } from '@/services/avisos';

export default function DetallePelicula() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { peliculas, toggleFavorita, toggleVista, eliminarPelicula } = useMovies();
  const mostrarToast = useToast();
  const pelicula = peliculas.find((p) => p.id === id);

  const cardBackground = useThemeColor({}, 'surface');
  const borderColor = useThemeColor({}, 'border');
  const accent = useThemeColor({}, 'accent');
  const success = useThemeColor({}, 'success');
  const danger = useThemeColor({}, 'danger');
  const iconColor = useThemeColor({}, 'icon');
  const background = useThemeColor({}, 'background');

  if (!pelicula) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>No se encontró la película.</ThemedText>
      </ThemedView>
    );
  }

  const confirmarEliminar = () => {
    confirmar('Eliminar película', `¿Seguro que quieres eliminar "${pelicula.titulo}"?`, 'Eliminar', async () => {
      try {
        await eliminarPelicula(pelicula.id);
        router.back();
        mostrarToast('Película eliminada', 'info');
      } catch {
        aviso('Error', 'No se pudo eliminar la película.');
      }
    });
  };

  const manejarToggleFavorita = () => {
    toggleFavorita(pelicula.id).catch(() => aviso('Error', 'No se pudo actualizar la película.'));
  };

  const manejarToggleVista = () => {
    toggleVista(pelicula.id).catch(() => aviso('Error', 'No se pudo actualizar la película.'));
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.posterWrapper}>
          <Animated.View entering={FadeIn.duration(600)}>
            <Image source={{ uri: pelicula.poster }} style={styles.poster} contentFit="cover" transition={400} />
          </Animated.View>
          <LinearGradient
            colors={['transparent', background]}
            style={styles.gradient}
            pointerEvents="none"
          />

          <Pressable style={[styles.backButton, { backgroundColor: 'rgba(11,13,16,0.55)' }]} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color="#F5F6F7" />
          </Pressable>

          <View style={styles.topActions}>
            <AnimatedPressable
              haptic
              style={[styles.iconButton, { backgroundColor: 'rgba(11,13,16,0.55)' }]}
              onPress={manejarToggleFavorita}>
              <PopIcon
                name={pelicula.favorita ? 'heart' : 'heart-outline'}
                size={20}
                color={pelicula.favorita ? accent : '#F5F6F7'}
              />
            </AnimatedPressable>
            <Pressable
              style={[styles.iconButton, { backgroundColor: 'rgba(11,13,16,0.55)' }]}
              onPress={() => router.push(`/editar/${pelicula.id}`)}>
              <Ionicons name="pencil" size={18} color="#F5F6F7" />
            </Pressable>
          </View>

          <Animated.View entering={ZoomIn.delay(350).springify().damping(10)} style={styles.badgeOverlay}>
            <RatingBadge calificacion={pelicula.calificacion} size="large" />
          </Animated.View>
        </View>

        <Animated.View entering={FadeInUp.delay(150).duration(500)} style={styles.content}>
          <ThemedText type="title">{pelicula.titulo}</ThemedText>

          <View style={styles.metaRow}>
            <View style={[styles.chip, { backgroundColor: cardBackground, borderColor }]}>
              <ThemedText style={styles.chipText}>{pelicula.año}</ThemedText>
            </View>
            <View style={[styles.chip, { backgroundColor: cardBackground, borderColor }]}>
              <ThemedText style={styles.chipText}>{pelicula.genero}</ThemedText>
            </View>
          </View>

          <AnimatedPressable
            haptic
            style={[
              styles.vistaButton,
              { borderColor: pelicula.vista ? success : borderColor },
              pelicula.vista && { backgroundColor: success + '22' },
            ]}
            onPress={manejarToggleVista}>
            <Ionicons
              name={pelicula.vista ? 'checkmark-circle' : 'checkmark-circle-outline'}
              size={18}
              color={pelicula.vista ? success : iconColor}
            />
            <ThemedText style={{ color: pelicula.vista ? success : iconColor, fontWeight: '600' }}>
              {pelicula.vista ? 'Vista' : 'Marcar como vista'}
            </ThemedText>
          </AnimatedPressable>

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

          <AnimatedPressable
            style={[styles.eliminarButton, { borderColor: danger }]}
            onPress={confirmarEliminar}>
            <Ionicons name="trash-outline" size={18} color={danger} />
            <ThemedText style={{ color: danger, fontWeight: '600' }}>Eliminar película</ThemedText>
          </AnimatedPressable>
        </Animated.View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
