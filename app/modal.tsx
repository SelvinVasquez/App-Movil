import { router } from 'expo-router';

import { MovieForm, MovieFormValues } from '@/components/movie-form';
import { useMovies } from '@/contexts/MoviesContext';
import { useToast } from '@/contexts/ToastContext';

export default function AgregarModal() {
  const { agregarPelicula } = useMovies();
  const mostrarToast = useToast();

  const guardar = async (valores: MovieFormValues) => {
    await agregarPelicula({ ...valores, calificacion: 0 });
    router.back();
    mostrarToast(`“${valores.titulo}” se agregó a tu biblioteca`);
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
