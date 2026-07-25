export interface Pelicula {
  id: string;
  titulo: string;
  año: number;
  genero: string;
  poster: string;
  calificacion: number; // de 0 a 10
}

export const peliculas: Pelicula[] = [
  {
    id: '1',
    titulo: 'Inception',
    año: 2010,
    genero: 'Ciencia ficción',
    poster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    calificacion: 8.8,
  },
  {
    id: '2',
    titulo: 'Coco',
    año: 2017,
    genero: 'Animación',
    poster: 'https://image.tmdb.org/t/p/w500/gGEsBPAijhVUFoiNpgZXqRVWJt2.jpg',
    calificacion: 8.4,
  },
  {
    id: '3',
    titulo: 'Breaking Bad',
    año: 2008,
    genero: 'Serie - Drama',
    poster: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
    calificacion: 9.5,
  },
];