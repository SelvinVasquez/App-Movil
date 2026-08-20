export interface Pelicula {
  id: string;
  titulo: string;
  año: number;
  genero: string;
  poster: string;
  calificacion: number; // de 0 a 10
  favorita: boolean;
  vista: boolean;
  sinopsis?: string;
  origenId?: string; // id externo si se importó desde una API, para evitar duplicados
}

export const peliculas: Pelicula[] = [
  {
    id: '1',
    titulo: 'Inception',
    año: 2010,
    genero: 'Ciencia ficción',
    poster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    calificacion: 8.8,
    favorita: true,
    vista: true,
    sinopsis:
      'Un ladrón que roba secretos corporativos mediante el uso de tecnología de sueños compartidos recibe la tarea inversa de plantar una idea en la mente de un director ejecutivo.',
  },
  {
    id: '2',
    titulo: 'Coco',
    año: 2017,
    genero: 'Animación',
    poster: 'https://image.tmdb.org/t/p/w500/gGEsBPAijhVUFoiNpgZXqRVWJt2.jpg',
    calificacion: 8.4,
    favorita: false,
    vista: true,
    sinopsis:
      'Aspirante a músico, Miguel se adentra en la Tierra de los Muertos para descubrir la verdadera historia detrás de la prohibición de la música en su familia.',
  },
  {
    id: '3',
    titulo: 'Breaking Bad',
    año: 2008,
    genero: 'Serie · Drama',
    poster: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
    calificacion: 9.5,
    favorita: true,
    vista: false,
    sinopsis:
      'Un profesor de química de instituto diagnosticado con cáncer terminal se asocia con un antiguo alumno para fabricar y vender metanfetamina.',
  },
  {
    id: '4',
    titulo: 'El Padrino',
    año: 1972,
    genero: 'Drama',
    poster: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    calificacion: 9.2,
    favorita: false,
    vista: false,
    sinopsis:
      'El patriarca envejecido de una dinastía del crimen organizado transfiere el control de su imperio clandestino a su reacio hijo.',
  },
  {
    id: '5',
    titulo: 'Interstellar',
    año: 2014,
    genero: 'Ciencia ficción',
    poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    calificacion: 8.6,
    favorita: false,
    vista: false,
    sinopsis:
      'Un equipo de exploradores viaja a través de un agujero de gusano en el espacio en un intento por garantizar la supervivencia de la humanidad.',
  },
  {
    id: '6',
    titulo: 'Toy Story',
    año: 1995,
    genero: 'Animación',
    poster: 'https://image.tmdb.org/t/p/w500/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg',
    calificacion: 8.3,
    favorita: false,
    vista: true,
    sinopsis:
      'Un vaquero de juguete teme perder su lugar favorito en el corazón de su dueño cuando llega un nuevo y moderno juguete espacial.',
  },
  {
    id: '7',
    titulo: 'Stranger Things',
    año: 2016,
    genero: 'Serie · Ciencia ficción',
    poster: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
    calificacion: 8.7,
    favorita: true,
    vista: false,
    sinopsis:
      'La desaparición de un niño destapa misterios sobrenaturales, experimentos secretos y una dimensión aterradora en un pequeño pueblo.',
  },
  {
    id: '8',
    titulo: 'Parásitos',
    año: 2019,
    genero: 'Drama',
    poster: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    calificacion: 8.5,
    favorita: false,
    vista: false,
    sinopsis:
      'La codicia y la discriminación de clases amenazan la relación simbiótica recién formada entre la adinerada familia Park y el clan Kim.',
  },
];
