import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

export function RatingBadge({
  calificacion,
  size = 'small',
}: {
  calificacion: number;
  size?: 'small' | 'large';
}) {
  const isNew = calificacion === 0;
  const large = size === 'large';

  return (
    <View style={[styles.badge, isNew && styles.badgeNew, large && styles.badgeLarge]}>
      {!isNew && <Ionicons name="star" size={large ? 15 : 12} color="#151718" />}
      <ThemedText
        style={[styles.text, large && styles.textLarge]}
        lightColor={isNew ? '#fff' : '#151718'}
        darkColor={isNew ? '#fff' : '#151718'}>
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
    backgroundColor: '#f5c518',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  badgeNew: {
    backgroundColor: '#0a7ea4',
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
