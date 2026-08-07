import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useMovies } from '@/contexts/MoviesContext';
import { useThemeColor } from '@/hooks/use-theme-color';

type Campo = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  icon: keyof typeof Ionicons.glyphMap;
  keyboardType?: 'default' | 'numeric';
  autoCapitalize?: 'none' | 'sentences';
};

export default function AgregarModal() {
  const { agregarPelicula } = useMovies();
  const [titulo, setTitulo] = useState('');
  const [año, setAño] = useState('');
  const [genero, setGenero] = useState('');
  const [poster, setPoster] = useState('');

  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  const cardBackground = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');

  const formCompleto = Boolean(titulo && año && genero && poster);

  const guardarPelicula = () => {
    if (!formCompleto) {
      Alert.alert('Faltan datos', 'Completa todos los campos antes de guardar.');
      return;
    }

    agregarPelicula({
      titulo,
      año: Number(año),
      genero,
      poster,
      calificacion: 0,
    });

    router.back();
  };

  const campos: Campo[] = [
    { label: 'Título', value: titulo, onChangeText: setTitulo, icon: 'film-outline' },
    { label: 'Año', value: año, onChangeText: setAño, icon: 'calendar-outline', keyboardType: 'numeric' },
    { label: 'Género', value: genero, onChangeText: setGenero, icon: 'pricetag-outline' },
    { label: 'URL del poster', value: poster, onChangeText: setPoster, icon: 'link-outline', autoCapitalize: 'none' },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <ThemedText type="title" style={styles.header}>
          Agregar película
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Completa los datos para añadirla a tus favoritas.
        </ThemedText>

        {poster.length > 0 ? (
          <Image source={{ uri: poster }} style={styles.preview} contentFit="cover" />
        ) : (
          <View style={[styles.previewPlaceholder, { backgroundColor: cardBackground, borderColor }]}>
            <Ionicons name="image-outline" size={32} color={iconColor} />
            <ThemedText style={styles.previewPlaceholderText}>Vista previa del poster</ThemedText>
          </View>
        )}

        {campos.map((campo) => (
          <View key={campo.label} style={styles.fieldGroup}>
            <ThemedText style={styles.label}>{campo.label}</ThemedText>
            <View style={[styles.inputWrapper, { backgroundColor: cardBackground, borderColor }]}>
              <Ionicons name={campo.icon} size={18} color={iconColor} />
              <TextInput
                style={[styles.input, { color: textColor }]}
                placeholder={campo.label}
                placeholderTextColor={iconColor}
                value={campo.value}
                onChangeText={campo.onChangeText}
                keyboardType={campo.keyboardType ?? 'default'}
                autoCapitalize={campo.autoCapitalize ?? 'sentences'}
              />
            </View>
          </View>
        ))}

        <Pressable
          style={[styles.boton, !formCompleto && styles.botonDeshabilitado]}
          onPress={guardarPelicula}
          disabled={!formCompleto}>
          <Ionicons name="checkmark-circle" size={20} color="#fff" />
          <ThemedText style={styles.botonTexto}>Guardar película</ThemedText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20, gap: 12, paddingBottom: 40 },
  header: { marginBottom: 4 },
  subtitle: { opacity: 0.6, marginBottom: 12 },
  preview: { width: '100%', height: 180, borderRadius: 12, marginBottom: 8 },
  previewPlaceholder: {
    height: 140,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 8,
  },
  previewPlaceholderText: { opacity: 0.5, fontSize: 13 },
  fieldGroup: { gap: 6 },
  label: { fontSize: 13, fontWeight: '600', opacity: 0.7 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  input: { flex: 1, fontSize: 16 },
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0a7ea4',
    padding: 14,
    borderRadius: 10,
    marginTop: 8,
  },
  botonDeshabilitado: { opacity: 0.4 },
  botonTexto: { color: '#fff', fontWeight: 'bold' },
});
