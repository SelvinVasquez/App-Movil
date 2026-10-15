import { Alert, Platform } from 'react-native';

/**
 * Alert.alert de React Native no hace nada en web, así que en navegador se usa
 * window.alert / window.confirm. En móvil se mantiene el diálogo nativo.
 */
export function aviso(titulo: string, mensaje?: string) {
  if (Platform.OS === 'web') {
    window.alert(mensaje ? `${titulo}\n\n${mensaje}` : titulo);
    return;
  }
  Alert.alert(titulo, mensaje);
}

export function confirmar(
  titulo: string,
  mensaje: string,
  textoConfirmar: string,
  onConfirmar: () => void,
) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${titulo}\n\n${mensaje}`)) onConfirmar();
    return;
  }
  Alert.alert(titulo, mensaje, [
    { text: 'Cancelar', style: 'cancel' },
    { text: textoConfirmar, style: 'destructive', onPress: onConfirmar },
  ]);
}
