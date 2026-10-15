import Ionicons from '@expo/vector-icons/Ionicons';
import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

type Tipo = 'exito' | 'info';

interface Toast {
  id: number;
  mensaje: string;
  tipo: Tipo;
}

const ToastContext = createContext<((mensaje: string, tipo?: Tipo) => void) | null>(null);

const DURACION_MS = 2600;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contador = useRef(0);

  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const success = useThemeColor({}, 'success');
  const accent = useThemeColor({}, 'accent');

  const mostrar = useCallback((mensaje: string, tipo: Tipo = 'exito') => {
    if (temporizador.current) clearTimeout(temporizador.current);
    contador.current += 1;
    setToast({ id: contador.current, mensaje, tipo });
    temporizador.current = setTimeout(() => setToast(null), DURACION_MS);
  }, []);

  useEffect(
    () => () => {
      if (temporizador.current) clearTimeout(temporizador.current);
    },
    []
  );

  const color = toast?.tipo === 'info' ? accent : success;

  return (
    <ToastContext.Provider value={mostrar}>
      {children}
      <View pointerEvents="none" style={styles.capa}>
        {toast && (
          <Animated.View
            key={toast.id}
            entering={FadeInUp.springify().damping(15)}
            exiting={FadeOutUp.duration(200)}
            style={[styles.toast, { backgroundColor: surface, borderColor: color }]}>
            <Ionicons
              name={toast.tipo === 'info' ? 'information-circle' : 'checkmark-circle'}
              size={22}
              color={color}
            />
            <ThemedText style={styles.texto}>{toast.mensaje}</ThemedText>
          </Animated.View>
        )}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe usarse dentro de un ToastProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  capa: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    zIndex: 1000,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    maxWidth: 480,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  texto: { fontWeight: '600', flexShrink: 1 },
});
