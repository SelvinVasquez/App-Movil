import { router, useLocalSearchParams } from 'expo-router';

import { MovieForm, MovieFormValues } from '@/components/movie-form';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useMovies } from '@/contexts/MoviesContext';
import { useToast } from '@/contexts/ToastContext';

export default function EditarModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { peliculas, editarPelicula } = useMovies();
  const mostrarToast = useToast();
  const pelicula = peliculas.find((p) => p.id === id);

  if (!pelicula) {
    return (
      <ThemedView style={{ flex: 1, padding: 20 }}>
        <ThemedText>No se encontró la película.</ThemedText>
      </ThemedView>
    );
  }

  const guardar = async (valores: MovieFormValues) => {
    await editarPelicula(pelicula.id, {
      ...valores,
      calificacion: pelicula.calificacion,
      favorita: pelicula.favorita,
      vista: pelicula.vista,
    });
    router.back();
    mostrarToast('Cambios guardados');
  };

  return (
    <MovieForm
      encabezado="Editar película"
      subtitulo="Actualiza los datos de tu película."
      etiquetaBoton="Guardar cambios"
      valoresIniciales={pelicula}
      onSubmit={guardar}
    />
  );
}
