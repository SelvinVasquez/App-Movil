import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AnimatedPressable } from '@/components/animated-pressable';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { Integracion } from '@/constants/integraciones';
import { Radius, Spacing } from '@/constants/theme';
import { useToast } from '@/contexts/ToastContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { aviso } from '@/services/avisos';
import { crear, verificar } from '@/services/integraciones';

/** Formulario de registro para una API de un compañero, generado desde su configuración. */
export function IntegracionForm({ integracion }: { integracion: Integracion }) {
  const router = useRouter();
  const mostrarToast = useToast();
  const [valores, setValores] = useState<Record<string, string>>(() =>
    Object.fromEntries(integracion.campos.map((c) => [c.key, c.valorInicial ?? '']))
  );
  const [enviando, setEnviando] = useState(false);
  const [esperandoCodigo, setEsperandoCodigo] = useState(false);
  const [codigo, setCodigo] = useState('');

  const accent = useThemeColor({}, 'accent');
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');

  const completo = esperandoCodigo
    ? /^\d{6}$/.test(codigo.trim())
    : integracion.campos.every((c) => !c.requerido || (valores[c.key] ?? '').trim() !== '');

  const guardar = async () => {
    if (!completo) {
      aviso('Faltan datos', 'Completa los campos obligatorios antes de guardar.');
      return;
    }
    const problema = integracion.validar?.(valores);
    if (problema) {
      aviso('Revisa los datos', problema);
      return;
    }
    setEnviando(true);
    try {
      if (esperandoCodigo && integracion.verificacion) {
        await verificar(integracion, valores[integracion.verificacion.campoClave] ?? '', codigo);
      } else {
        await crear(integracion, valores);
        if (integracion.verificacion) {
          setEsperandoCodigo(true);
          mostrarToast('Código enviado a tu correo');
          return;
        }
      }
      router.back();
      mostrarToast(`${integracion.tituloNuevo}: guardado correctamente`);
    } catch (e) {
      aviso('No se pudo guardar', e instanceof Error ? e.message : 'Inténtalo de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <ThemedText type="title">{integracion.tituloNuevo}</ThemedText>
        <ThemedText type="caption" style={styles.subtitulo}>
          Se envía a la API de {integracion.proveedor}.
        </ThemedText>

        {esperandoCodigo && integracion.verificacion && (
          <Animated.View entering={FadeInDown.springify().damping(16)} style={styles.grupo}>
            <ThemedText type="caption">{integracion.verificacion.ayuda}</ThemedText>
            <ThemedText style={styles.label}>Código de verificación *</ThemedText>
            <View style={[styles.inputWrapper, { backgroundColor: surface, borderColor: border }]}>
              <Ionicons name="keypad-outline" size={18} color={iconColor} />
              <TextInput
                style={[styles.input, { color: textColor }]}
                placeholder="123456"
                placeholderTextColor={iconColor}
                value={codigo}
                onChangeText={setCodigo}
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>
          </Animated.View>
        )}

        {(esperandoCodigo ? [] : integracion.campos).map((campo, i) => (
          <Animated.View
            key={campo.key}
            entering={FadeInDown.delay(80 + i * 60).springify().damping(16)}
            style={styles.grupo}>
            <ThemedText style={styles.label}>
              {campo.label}
              {campo.requerido ? ' *' : ''}
            </ThemedText>
            <View
              style={[
                styles.inputWrapper,
                campo.tipo === 'largo' && styles.inputWrapperLargo,
                { backgroundColor: surface, borderColor: border },
              ]}>
              <Ionicons name={campo.icon} size={18} color={iconColor} />
              <TextInput
                style={[styles.input, campo.tipo === 'largo' && styles.inputLargo, { color: textColor }]}
                placeholder={campo.label}
                placeholderTextColor={iconColor}
                value={valores[campo.key]}
                onChangeText={(texto) => setValores((v) => ({ ...v, [campo.key]: texto }))}
                keyboardType={campo.tipo === 'numero' ? 'numeric' : 'default'}
                secureTextEntry={campo.tipo === 'password'}
                autoCapitalize={campo.tipo === 'password' || campo.key === 'email' ? 'none' : 'sentences'}
                multiline={campo.tipo === 'largo'}
                textAlignVertical={campo.tipo === 'largo' ? 'top' : 'center'}
              />
            </View>
          </Animated.View>
        ))}

        <AnimatedPressable
          haptic
          disabled={!completo || enviando}
          onPress={guardar}
          style={[styles.boton, { backgroundColor: accent }, (!completo || enviando) && styles.deshabilitado]}>
          {enviando ? (
            <ActivityIndicator color="#151718" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color="#151718" />
              <ThemedText style={styles.botonTexto}>
                {esperandoCodigo ? 'Verificar y crear' : integracion.verificacion ? 'Enviar código' : 'Guardar'}
              </ThemedText>
            </>
          )}
        </AnimatedPressable>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: Spacing.xl, gap: Spacing.md, paddingBottom: 40 },
  subtitulo: { marginBottom: Spacing.sm },
  grupo: { gap: 6 },
  label: { fontSize: 13, fontWeight: '600', opacity: 0.7 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: Radius.md - 2,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  inputWrapperLargo: { alignItems: 'flex-start' },
  input: { flex: 1, fontSize: 16 },
  inputLargo: { minHeight: 80 },
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: Radius.md - 2,
    marginTop: Spacing.sm,
  },
  deshabilitado: { opacity: 0.4 },
  botonTexto: { color: '#151718', fontWeight: 'bold' },
});
