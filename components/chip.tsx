import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet } from 'react-native';

import { AnimatedPressable } from '@/components/animated-pressable';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export function Chip({
  label,
  active = false,
  onPress,
  icon,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  const accent = useThemeColor({}, 'accent');
  const cardBackground = useThemeColor({}, 'surface');
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const activeTextColor = '#151718';

  return (
    <AnimatedPressable
      haptic
      scaleTo={0.92}
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: active ? accent : cardBackground,
          borderColor: active ? accent : borderColor,
        },
      ]}>
      {icon && (
        <Ionicons
          name={icon}
          size={14}
          color={active ? activeTextColor : textColor}
          style={styles.icon}
        />
      )}
      <ThemedText style={[styles.label, { color: active ? activeTextColor : textColor }]}>
        {label}
      </ThemedText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    alignSelf: 'flex-start',
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  icon: { marginRight: 4 },
  label: { fontSize: 13, lineHeight: 18, fontWeight: '600' },
});
