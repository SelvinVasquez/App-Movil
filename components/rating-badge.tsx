import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

export function RatingBadge({
  calificacion,
  size = 'small',
}: {
  calificacion: number;
  size?: 'small' | 'large';
}) {
  const isNew = calificacion === 0;
  const large = size === 'large';
  const accent = useThemeColor({}, 'accent');

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: isNew ? '#2E3238' : accent },
        large && styles.badgeLarge,
      ]}>
      {!isNew && <Ionicons name="star" size={large ? 15 : 12} color="#151718" />}
      <ThemedText
        style={[styles.text, large && styles.textLarge]}
        lightColor={isNew ? '#F5F6F7' : '#151718'}
        darkColor={isNew ? '#F5F6F7' : '#151718'}>
        {isNew ? 'Nueva' : calificacion.toFixed(1)}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  badgeLarge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
  textLarge: {
    fontSize: 14,
  },
});
