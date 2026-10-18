import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';

/**
 * Fila de filtros (chips) que baja a otra línea cuando no caben.
 * Se usa en lugar de un scroll horizontal: en la web de escritorio no hay forma cómoda de
 * desplazarlo y en algunas pantallas los chips se veían recortados.
 */
export function ChipsRow({ children }: { children: ReactNode }) {
  return <View style={styles.fila}>{children}</View>;
}

const styles = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
  },
});
