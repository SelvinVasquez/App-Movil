import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Radius, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface MovieFormValues {
  titulo: string;
  año: number;
  genero: string;
  poster: string;
  sinopsis: string;
}

type Campo = {
  key: 'titulo' | 'año' | 'genero' | 'poster' | 'sinopsis';
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  keyboardType?: 'default' | 'numeric';
  autoCapitalize?: 'none' | 'sentences';
  multiline?: boolean;
};

const CAMPOS: Campo[] = [
  { key: 'titulo', label: 'Título', icon: 'film-outline' },
  { key: 'año', label: 'Año', icon: 'calendar-outline', keyboardType: 'numeric' },
  { key: 'genero', label: 'Género', icon: 'pricetag-outline' },
  { key: 'poster', label: 'URL del poster', icon: 'link-outline', autoCapitalize: 'none' },
  { key: 'sinopsis', label: 'Sinopsis (opcional)', icon: 'document-text-outline', multiline: true },
];

export function MovieForm({
  encabezado,
  subtitulo,
  valoresIniciales,
  etiquetaBoton,
  onSubmit,
}: {
  encabezado: string;
  subtitulo: string;
  valoresIniciales?: Partial<MovieFormValues>;
  etiquetaBoton: string;
  onSubmit: (valores: MovieFormValues) => void;
}) {
  const [titulo, setTitulo] = useState(valoresIniciales?.titulo ?? '');
  const [año, setAño] = useState(valoresIniciales?.año ? String(valoresIniciales.año) : '');
  const [genero, setGenero] = useState(valoresIniciales?.genero ?? '');
  const [poster, setPoster] = useState(valoresIniciales?.poster ?? '');
  const [sinopsis, setSinopsis] = useState(valoresIniciales?.sinopsis ?? '');

  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  const cardBackground = useThemeColor({}, 'surface');
  const borderColor = useThemeColor({}, 'border');
  const accent = useThemeColor({}, 'accent');

  const valores: Record<Campo['key'], string> = { titulo, año, genero, poster, sinopsis };
  const setters: Record<Campo['key'], (v: string) => void> = {
    titulo: setTitulo,
    año: setAño,
    genero: setGenero,
    poster: setPoster,
    sinopsis: setSinopsis,
  };

  const formCompleto = Boolean(titulo && año && genero && poster);

  const confirmar = () => {
    if (!formCompleto) {
      Alert.alert('Faltan datos', 'Completa título, año, género y poster antes de guardar.');
      return;
    }
    onSubmit({ titulo, año: Number(año), genero, poster, sinopsis });
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <ThemedText type="title" style={styles.header}>
          {encabezado}
        </ThemedText>
        <ThemedText type="caption" style={styles.subtitle}>
          {subtitulo}
        </ThemedText>

        {poster.length > 0 ? (
          <Image source={{ uri: poster }} style={styles.preview} contentFit="cover" />
        ) : (
          <View style={[styles.previewPlaceholder, { backgroundColor: cardBackground, borderColor }]}>
            <Ionicons name="image-outline" size={32} color={iconColor} />
            <ThemedText type="caption">Vista previa del poster</ThemedText>
          </View>
        )}

        {CAMPOS.map((campo) => (
          <View key={campo.key} style={styles.fieldGroup}>
            <ThemedText style={styles.label}>{campo.label}</ThemedText>
            <View
              style={[
                styles.inputWrapper,
                campo.multiline && styles.inputWrapperMultiline,
                { backgroundColor: cardBackground, borderColor },
              ]}>
              <Ionicons
                name={campo.icon}
                size={18}
                color={iconColor}
                style={campo.multiline ? styles.iconMultiline : undefined}
              />
              <TextInput
                style={[styles.input, campo.multiline && styles.inputMultiline, { color: textColor }]}
                placeholder={campo.label}
                placeholderTextColor={iconColor}
                value={valores[campo.key]}
                onChangeText={setters[campo.key]}
                keyboardType={campo.keyboardType ?? 'default'}
                autoCapitalize={campo.autoCapitalize ?? 'sentences'}
                multiline={campo.multiline}
                textAlignVertical={campo.multiline ? 'top' : 'center'}
              />
            </View>
          </View>
        ))}

        <Pressable
          style={[styles.boton, { backgroundColor: accent }, !formCompleto && styles.botonDeshabilitado]}
          onPress={confirmar}
          disabled={!formCompleto}>
          <Ionicons name="checkmark-circle" size={20} color="#151718" />
          <ThemedText style={styles.botonTexto}>{etiquetaBoton}</ThemedText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: Spacing.xl, gap: Spacing.md, paddingBottom: 40 },
  header: { marginBottom: 4 },
  subtitle: { marginBottom: Spacing.sm },
  preview: { width: '100%', height: 180, borderRadius: Radius.lg, marginBottom: Spacing.xs },
  previewPlaceholder: {
    height: 140,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: Spacing.xs,
  },
  fieldGroup: { gap: 6 },
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
  inputWrapperMultiline: { alignItems: 'flex-start' },
  iconMultiline: { marginTop: 2 },
  input: { flex: 1, fontSize: 16 },
  inputMultiline: { minHeight: 80 },
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: Radius.md - 2,
    marginTop: Spacing.sm,
  },
  botonDeshabilitado: { opacity: 0.4 },
  botonTexto: { color: '#151718', fontWeight: 'bold' },
});
