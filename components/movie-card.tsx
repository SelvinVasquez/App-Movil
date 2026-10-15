import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOutLeft, LinearTransition } from 'react-native-reanimated';

import { AnimatedPressable } from '@/components/animated-pressable';
import { PopIcon } from '@/components/pop-icon';

import { RatingBadge } from '@/components/rating-badge';
import { ThemedText } from '@/components/themed-text';
import type { Pelicula } from '@/constants/movies';
import { Radius, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export function MovieCard({
  pelicula,
  onPress,
  onToggleFavorita,
  index = 0,
}: {
  index?: number;
  pelicula: Pelicula;
  onPress: () => void;
  onToggleFavorita?: () => void;
}) {
  const cardBackground = useThemeColor({}, 'surface');
  const borderColor = useThemeColor({}, 'border');
  const iconColor = useThemeColor({}, 'icon');
  const accent = useThemeColor({}, 'accent');
  const success = useThemeColor({}, 'success');

  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index, 8) * 60).springify().damping(16)}
      exiting={FadeOutLeft.duration(250)}
      layout={LinearTransition.springify().damping(18)}>
      <AnimatedPressable
        scaleTo={0.97}
        style={[styles.card, { backgroundColor: cardBackground, borderColor }]}
        onPress={onPress}>
      <View style={styles.posterWrapper}>
        <Image source={{ uri: pelicula.poster }} style={styles.poster} contentFit="cover" transition={400} />
        <View style={styles.badgeOverlay}>
          <RatingBadge calificacion={pelicula.calificacion} />
        </View>
        {pelicula.vista && (
          <Animated.View
            entering={FadeInDown.springify()}
            style={[styles.vistaBadge, { backgroundColor: success }]}>
            <Ionicons name="checkmark" size={12} color="#0B0D10" />
          </Animated.View>
        )}
      </View>

      <View style={styles.info}>
        <ThemedText type="defaultSemiBold" numberOfLines={2}>
          {pelicula.titulo}
        </ThemedText>
        <View style={styles.metaRow}>
          <ThemedText type="caption">{pelicula.año}</ThemedText>
          <View style={[styles.dot, { backgroundColor: iconColor }]} />
          <ThemedText type="caption" numberOfLines={1} style={styles.genero}>
            {pelicula.genero}
          </ThemedText>
        </View>
      </View>

      {onToggleFavorita && (
        <Pressable hitSlop={10} onPress={onToggleFavorita} style={styles.favButton}>
          <PopIcon
            name={pelicula.favorita ? 'heart' : 'heart-outline'}
            size={20}
            color={pelicula.favorita ? accent : iconColor}
          />
        </Pressable>
      )}
      </AnimatedPressable>
    </Animated.View>
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
  cardPressed: { opacity: 0.7 },
  posterWrapper: { position: 'relative' },
  poster: { width: 72, height: 104, borderRadius: Radius.sm + 2 },
  badgeOverlay: { position: 'absolute', bottom: 6, left: 6 },
  vistaBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 20,
    height: 20,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, gap: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  genero: { flexShrink: 1 },
  dot: { width: 3, height: 3, borderRadius: 1.5 },
  favButton: { padding: 4 },
});
