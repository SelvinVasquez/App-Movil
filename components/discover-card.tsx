import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { RatingBadge } from '@/components/rating-badge';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import type { GhibliFilm } from '@/services/ghibliApi';
import { useThemeColor } from '@/hooks/use-theme-color';

export function DiscoverCard({
  film,
  enBiblioteca,
  onImportar,
}: {
  film: GhibliFilm;
  enBiblioteca: boolean;
  onImportar: () => void;
}) {
  const cardBackground = useThemeColor({}, 'surface');
  const borderColor = useThemeColor({}, 'border');
  const accent = useThemeColor({}, 'accent');
  const success = useThemeColor({}, 'success');

  return (
    <View style={[styles.card, { backgroundColor: cardBackground, borderColor }]}>
      <View style={styles.posterWrapper}>
        <Image source={{ uri: film.image }} style={styles.poster} contentFit="cover" />
        <View style={styles.badgeOverlay}>
          <RatingBadge calificacion={Number(film.rt_score) / 10} />
        </View>
      </View>

      <View style={styles.info}>
        <ThemedText type="defaultSemiBold" numberOfLines={2}>
          {film.title}
        </ThemedText>
        <ThemedText type="caption">{film.release_date} · Animación</ThemedText>
      </View>

      <Pressable
        hitSlop={10}
        disabled={enBiblioteca}
        onPress={onImportar}
        accessibilityLabel={enBiblioteca ? `${film.title} ya está en tu biblioteca` : `Agregar ${film.title} a mi biblioteca`}
        style={[
          styles.boton,
          { backgroundColor: enBiblioteca ? success + '22' : accent },
        ]}>
        <Ionicons
          name={enBiblioteca ? 'checkmark' : 'add'}
          size={20}
          color={enBiblioteca ? success : '#151718'}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.sm + 2,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  posterWrapper: { position: 'relative' },
  poster: { width: 72, height: 104, borderRadius: Radius.sm + 2 },
  badgeOverlay: { position: 'absolute', bottom: 6, left: 6 },
  info: { flex: 1, gap: 6 },
  boton: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
