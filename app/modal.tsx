import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useMovies } from '@/contexts/MoviesContext';

export default function AgregarModal() {
  const { agregarPelicula } = useMovies();
  const [titulo, setTitulo] = useState('');
  const [año, setAño] = useState('');
  const [genero, setGenero] = useState('');
  const [poster, setPoster] = useState('');

  const guardarPelicula = () => {
    if (!titulo || !año || !genero || !poster) {
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

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>Agregar película</ThemedText>

      <TextInput
        style={styles.input}
        placeholder="Título"
        placeholderTextColor="#888"
        value={titulo}
        onChangeText={setTitulo}
      />
      <TextInput
        style={styles.input}
        placeholder="Año"
        placeholderTextColor="#888"
        value={año}
        onChangeText={setAño}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Género"
        placeholderTextColor="#888"
        value={genero}
        onChangeText={setGenero}
      />
      <TextInput
        style={styles.input}
        placeholder="URL del poster"
        placeholderTextColor="#888"
        value={poster}
        onChangeText={setPoster}
        autoCapitalize="none"
      />

      <Pressable style={styles.boton} onPress={guardarPelicula}>
        <ThemedText style={styles.botonTexto}>Guardar</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12 },
  header: { marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
  },
  boton: {
    backgroundColor: '#2f95dc',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  botonTexto: { color: '#fff', fontWeight: 'bold' },
});