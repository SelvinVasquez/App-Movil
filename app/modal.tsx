import { router } from 'expo-router';

import { MovieForm, MovieFormValues } from '@/components/movie-form';
import { useMovies } from '@/contexts/MoviesContext';

export default function AgregarModal() {
  const { agregarPelicula } = useMovies();

  const guardar = (valores: MovieFormValues) => {
    agregarPelicula({ ...valores, calificacion: 0 });
    router.back();
  };

  return (
    <MovieForm
      encabezado="Agregar película"
      subtitulo="Completa los datos para añadirla a tu biblioteca."
      etiquetaBoton="Guardar película"
      onSubmit={guardar}
    />
  );
}
