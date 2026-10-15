import Ionicons from '@expo/vector-icons/Ionicons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { DiscoverCard } from '@/components/discover-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Radius, Spacing } from '@/constants/theme';
import { useMovies } from '@/contexts/MoviesContext';
import { useToast } from '@/contexts/ToastContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { aviso } from '@/services/avisos';
import {
  buscarPeliculas,
  peliculasPopulares,
  TmdbPagina,
  TmdbPelicula,
  tmdbAPelicula,
  tmdbConfigurado,
} from '@/services/tmdbApi';
import { ApiError } from '@/services/api';

const traer = (n: number, texto: string) =>
  texto ? buscarPeliculas(texto, n) : peliculasPopulares(n);

export default function DescubrirScreen() {
  const { peliculas, agregarPelicula } = useMovies();
  const mostrarToast = useToast();
  const [films, setFilms] = useState<TmdbPelicula[]>([]);
  const [estado, setEstado] = useState<'cargando' | 'listo' | 'error'>(
    tmdbConfigurado ? 'cargando' : 'error'
  );
  const [busqueda, setBusqueda] = useState('');
  const [consulta, setConsulta] = useState('');
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [cargandoMas, setCargandoMas] = useState(false);

  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  const cardBackground = useThemeColor({}, 'surface');
  const borderColor = useThemeColor({}, 'border');
  const accent = useThemeColor({}, 'accent');

  // Espera 400 ms tras dejar de escribir antes de consultar TMDB.
  useEffect(() => {
    const t = setTimeout(() => {
      const texto = busqueda.trim();
      setConsulta((anterior) => {
        if (anterior !== texto) setEstado('cargando');
        return texto;
      });
    }, 400);
    return () => clearTimeout(t);
  }, [busqueda]);

  const aplicar = useCallback((n: number, datos: TmdbPagina) => {
    setTotalPaginas(Math.min(datos.total_pages, 500));
    setPagina(n);
    setFilms((prev) => {
      const base = n === 1 ? [] : prev;
      const vistos = new Set(base.map((f) => f.id));
      return [...base, ...datos.results.filter((f) => !vistos.has(f.id))];
    });
  }, []);

  const cargarPagina = useCallback(
    (n: number, texto: string) => traer(n, texto).then((datos) => aplicar(n, datos)),
    [aplicar]
  );

  const cargar = useCallback(() => {
    if (!tmdbConfigurado) {
      setEstado('error');
      return;
    }
    setEstado('cargando');
    cargarPagina(1, consulta)
      .then(() => setEstado('listo'))
      .catch(() => setEstado('error'));
  }, [cargarPagina, consulta]);

  useEffect(() => {
    if (!tmdbConfigurado) return;
    let activo = true;
    traer(1, consulta)
      .then((datos) => {
        if (!activo) return;
        aplicar(1, datos);
        setEstado('listo');
      })
      .catch(() => activo && setEstado('error'));
    return () => {
      activo = false;
    };
  }, [aplicar, consulta]);

  const cargarMas = () => {
    if (cargandoMas || estado !== 'listo' || pagina >= totalPaginas) return;
    setCargandoMas(true);
    cargarPagina(pagina + 1, consulta)
      .catch(() => {})
      .finally(() => setCargandoMas(false));
  };

  const idsImportados = useMemo(
    () => new Set(peliculas.map((p) => p.origenId).filter(Boolean)),
    [peliculas]
  );

  const importar = (film: TmdbPelicula) => {
    agregarPelicula(tmdbAPelicula(film))
      .then(() => mostrarToast(`“${film.title}” se agregó a tu biblioteca`))
      .catch((e) =>
        aviso(
          e instanceof ApiError ? 'No se agregó' : 'Error',
          e instanceof ApiError ? e.message : 'No se pudo importar la película.'
        )
      );
  };

  return (
    <ThemedView style={styles.container}>
      <Animated.View entering={FadeInDown.duration(500)}>
      <ThemedText type="title" style={styles.header}>
        Descubrir
      </ThemedText>
      <ThemedText type="caption" style={styles.subtitle}>
        Catálogo de miles de películas, vía TMDB
      </ThemedText>
      </Animated.View>

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
            {tmdbConfigurado
              ? 'No se pudo conectar con TMDB. Revisa tu conexión.'
              : 'Falta la clave de TMDB (EXPO_PUBLIC_TMDB_KEY).'}
          </ThemedText>
          <Pressable style={[styles.reintentar, { borderColor: accent }]} onPress={cargar}>
            <Ionicons name="refresh" size={16} color={accent} />
            <ThemedText style={{ color: accent, fontWeight: '600' }}>Reintentar</ThemedText>
          </Pressable>
        </View>
      )}

      {estado === 'listo' && (
        <FlatList
          data={films}
          keyExtractor={(item) => String(item.id)}
          onEndReached={cargarMas}
          onEndReachedThreshold={0.5}
          ListFooterComponent={cargandoMas ? <ActivityIndicator color={accent} /> : null}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <DiscoverCard
              index={index % 20}
              film={item}
              enBiblioteca={idsImportados.has(`tmdb-${item.id}`)}
              onImportar={() => importar(item)}
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
