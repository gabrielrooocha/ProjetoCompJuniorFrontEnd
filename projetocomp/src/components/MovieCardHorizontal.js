// src/components/MovieCardHorizontal.js
import React from 'react';
import styles from './MovieCardHorizontal.module.css';

const MovieCardHorizontal = ({ movie }) => {
    // Encontra o nome do primeiro gênero (opcional)
    const genreNames = { 28: "Ação", 12: "Aventura", 35: "Comédia", 18: "Drama", 14: "Fantasia", 27: "Terror", 10749: "Romance", 878: "Ficção", 16: "Animação", 99: "Documentário" };
    const mainGenreId = movie.genre_ids?.[0];
    const mainGenre = mainGenreId ? genreNames[mainGenreId] : 'Geral';

    return (
        <div className={styles.movie_card}>
            {movie.poster_path ? (
                <img 
                    src={`https://image.tmdb.org/t/p/w154${movie.poster_path}`} 
                    alt={movie.title} 
                    className={styles.poster}
                />
            ) : (
                <div className={styles.no_poster}>Sem Pôster</div>
            )}
            <div className={styles.info}>
                <h3 className={styles.title}>{movie.title}</h3>
                <p className={styles.genre}>{mainGenre}</p>
                <p className={styles.rating}>⭐ {movie.vote_average.toFixed(1)}</p>
            </div>
        </div>
    );
};

export default MovieCardHorizontal;