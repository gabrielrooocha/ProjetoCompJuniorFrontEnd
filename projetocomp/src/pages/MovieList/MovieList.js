// src/components/MovieList.js

import axios from 'axios';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'; 
import styles from "./MovieList.module.css";

export default function MovieList () {
    const [movies, setMovies] = useState([]);
    const navigate = useNavigate(); 
    
    useEffect(() => {
        getMovies();
    }, []); 

    const getMovies = () => {
        axios({
            method: 'get',
            url: 'https://api.themoviedb.org/3/discover/movie',
            params: {
                api_key: 'da45a8526f15a6cca7c276cf12d40138',
                language: 'pt-BR'
            }
        }).then(response => {
            setMovies(response.data.results);
        })
        .catch(err => console.error("Erro ao buscar filmes:", err));
    }

    const handleMovieClick = (movie) => {
        navigate(`/posts/create?movieId=${movie.id}`);
    };


    if (movies.length === 0) {
        return <p>Carregando filmes...</p>;
    }
    
    return(
        <ul className={styles.movie_list}> 
            {movies.map((movie) => 
                <li 
                    key={movie.id} 
                    className={styles.movie_card}
                    onClick={() => handleMovieClick(movie)} 
                > 
                    
                    {movie.poster_path && (
                        <img 
                            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} 
                            alt={movie.title}
                        />
                    )}

                    <div className={styles.description_overlay}>
                        <h3 className={styles.title_overlay}>{movie.title}</h3>
                        <p className={styles.overview}>
                            {movie.overview || "Descrição não disponível."}
                        </p>
                    </div>

                    <div className={styles.info_rodape}>
                        <h3 className={styles.title}> 
                            {movie.title}
                        </h3>
                        
                        <p className={styles.rating}>
                            {movie.vote_average.toFixed(1)}
                        </p>
                    </div>
                </li>
            )}
        </ul>
    )
}