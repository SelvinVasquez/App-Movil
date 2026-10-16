import { useLocalSearchParams } from 'expo-router';

import { IntegracionForm } from '@/components/integracion-form';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { INTEGRACIONES } from '@/constants/integraciones';

export default function NuevoRegistroIntegracion() {
  const { tipo } = useLocalSearchParams<{ tipo: string }>();
  const integracion = tipo === 'viajes' || tipo === 'perfiles' ? INTEGRACIONES[tipo] : undefined;

  if (!integracion) {
    return (
      <ThemedView style={{ flex: 1, padding: 20 }}>
        <ThemedText>No se encontró este formulario.</ThemedText>
      </ThemedView>
    );
  }

  return <IntegracionForm integracion={integracion} />;
}
