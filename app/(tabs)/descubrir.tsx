import Ionicons from '@expo/vector-icons/Ionicons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { DiscoverCard } from '@/components/discover-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Radius, Spacing } from '@/constants/theme';
import { useMovies } from '@/contexts/MoviesContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ghibliAPelicula, GhibliFilm, obtenerPeliculasGhibli } from '@/services/ghibliApi';

export default function DescubrirScreen() {
  const { peliculas, agregarPelicula } = useMovies();
  const [films, setFilms] = useState<GhibliFilm[]>([]);
  const [estado, setEstado] = useState<'cargando' | 'listo' | 'error'>('cargando');
  const [busqueda, setBusqueda] = useState('');

  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  const cardBackground = useThemeColor({}, 'surface');
  const borderColor = useThemeColor({}, 'border');
  const accent = useThemeColor({}, 'accent');

  const cargar = useCallback(() => {
    setEstado('cargando');
    obtenerPeliculasGhibli()
      .then((datos) => {
        setFilms(datos);
        setEstado('listo');
      })
      .catch(() => setEstado('error'));
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const idsImportados = useMemo(
    () => new Set(peliculas.map((p) => p.origenId).filter(Boolean)),
    [peliculas]
  );

  const resultados = useMemo(
    () => films.filter((f) => f.title.toLowerCase().includes(busqueda.toLowerCase())),
    [films, busqueda]
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>
        Descubrir
      </ThemedText>
      <ThemedText type="caption" style={styles.subtitle}>
        Catálogo de Studio Ghibli, vía API pública (sin clave necesaria)
      </ThemedText>

      <View style={[styles.buscadorWrapper, { backgroundColor: cardBackground, borderColor }]}>
        <Ionicons name="search" size={18} color={iconColor} />
        <TextInput
          style={[styles.buscador, { color: textColor }]}
          placeholder="Buscar en el catálogo..."
          placeholderTextColor={iconColor}
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>

      {estado === 'cargando' && (
        <View style={styles.centro}>
          <ActivityIndicator color={accent} size="large" />
          <ThemedText type="caption" style={styles.centroTexto}>
            Cargando catálogo...
          </ThemedText>
        </View>
      )}

      {estado === 'error' && (
        <View style={styles.centro}>
          <Ionicons name="cloud-offline-outline" size={40} color={iconColor} />
          <ThemedText type="caption" style={styles.centroTexto}>
            No se pudo conectar con la API. Revisa tu conexión.
          </ThemedText>
          <Pressable style={[styles.reintentar, { borderColor: accent }]} onPress={cargar}>
            <Ionicons name="refresh" size={16} color={accent} />
            <ThemedText style={{ color: accent, fontWeight: '600' }}>Reintentar</ThemedText>
          </Pressable>
        </View>
      )}

      {estado === 'listo' && (
        <FlatList
          data={resultados}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <DiscoverCard
              film={item}
              enBiblioteca={idsImportados.has(item.id)}
              onImportar={() => agregarPelicula(ghibliAPelicula(item))}
            />
          )}
          ListEmptyComponent={
            <View style={styles.centro}>
              <Ionicons name="film-outline" size={40} color={iconColor} />
              <ThemedText type="caption">No se encontraron resultados.</ThemedText>
            </View>
          }
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  header: { paddingHorizontal: Spacing.xl },
  subtitle: { paddingHorizontal: Spacing.xl, marginBottom: Spacing.lg },
  buscadorWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
  },
  buscador: { flex: 1, fontSize: 16 },
  list: { paddingHorizontal: Spacing.xl, paddingBottom: 24, gap: Spacing.md },
  centro: { alignItems: 'center', marginTop: 60, gap: 10, paddingHorizontal: Spacing.xl },
  centroTexto: { textAlign: 'center' },
  reintentar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    marginTop: 4,
  },
});
