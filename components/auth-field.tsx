import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

type Props = TextInputProps & {
  icono: React.ComponentProps<typeof Ionicons>['name'];
};

/** Campo de formulario con ícono; si es de contraseña, permite mostrarla/ocultarla. */
export function AuthField({ icono, secureTextEntry, style, ...rest }: Props) {
  const [enfocado, setEnfocado] = useState(false);
  const [oculta, setOculta] = useState(true);

  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const accent = useThemeColor({}, 'accent');
  const text = useThemeColor({}, 'text');
  const icon = useThemeColor({}, 'icon');

  const esPassword = !!secureTextEntry;

  return (
    <View
      style={[
        styles.contenedor,
        { backgroundColor: surface, borderColor: enfocado ? accent : border },
      ]}>
      <Ionicons name={icono} size={20} color={enfocado ? accent : icon} />
      <TextInput
        {...rest}
        style={[styles.input, { color: text }, style]}
        placeholderTextColor={icon}
        secureTextEntry={esPassword && oculta}
        onFocus={(e) => {
          setEnfocado(true);
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          setEnfocado(false);
          rest.onBlur?.(e);
        }}
      />
      {esPassword && (
        <Pressable
          hitSlop={10}
          onPress={() => setOculta((v) => !v)}
          accessibilityLabel={oculta ? 'Mostrar contraseña' : 'Ocultar contraseña'}>
          <Ionicons name={oculta ? 'eye-outline' : 'eye-off-outline'} size={20} color={icon} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 1.5,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.md + 2,
    fontSize: 16,
    // En web evita el contorno azul por defecto del navegador.
    ...({ outlineStyle: 'none' } as object),
  },
});
