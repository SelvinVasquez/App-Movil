/**
 * Paleta "cine oscuro premium": fondo carbón, tarjetas con superficie elevada
 * y un único acento dorado-ámbar para calificaciones y llamadas a la acción.
 */

import { Platform } from 'react-native';

const tintColorLight = '#B8860B';
const tintColorDark = '#E8B84B';

export const Colors = {
  light: {
    text: '#14171A',
    background: '#F7F5F1',
    surface: '#FFFFFF',
    surfaceElevated: '#FBFAF7',
    tint: tintColorLight,
    accent: tintColorLight,
    icon: '#6B7076',
    tabIconDefault: '#6B7076',
    tabIconSelected: tintColorLight,
    border: '#E4E0D8',
    danger: '#C4453D',
    success: '#2E8B57',
  },
  dark: {
    text: '#F5F6F7',
    background: '#0B0D10',
    surface: '#15181C',
    surfaceElevated: '#1B1F24',
    tint: tintColorDark,
    accent: tintColorDark,
    icon: '#9BA3AC',
    tabIconDefault: '#9BA3AC',
    tabIconSelected: tintColorDark,
    border: '#23272C',
    danger: '#E5484D',
    success: '#3DCC7B',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
