import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

/** Icono que "rebota" cada vez que cambia su nombre (p. ej. corazón vacío → lleno). */
export function PopIcon({
  name,
  size,
  color,
}: {
  name: keyof typeof Ionicons.glyphMap;
  size: number;
  color: string;
}) {
  const scale = useSharedValue(1);
  const anterior = useRef(name);

  useEffect(() => {
    if (anterior.current !== name) {
      anterior.current = name;
      scale.set(withSequence(
        withTiming(0.6, { duration: 80 }),
        withSpring(1, { damping: 4, stiffness: 220 })
      ));
    }
  }, [name, scale]);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={style}>
      <Ionicons name={name} size={size} color={color} />
    </Animated.View>
  );
}
