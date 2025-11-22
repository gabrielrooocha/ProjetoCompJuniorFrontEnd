import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_KEY = 'da45a8526f15a6cca7c276cf12d40138'; 
const BASE_URL = 'https://api.themoviedb.org/3';

// Gêneros populares e seus IDs no TMDB
const GENRE_IDS = {
    Ação: 28,
    Aventura: 12,
    Comédia: 35,
    Drama: 18,
    Fantasia: 14,
    Terror: 27,
    Romance: 10749,
    Ficção: 878,
    Animação: 16,
    Documentário: 99
};

// converte o objeto em um array de ids para facilitar a seleção
const allGenreIds = Object.values(GENRE_IDS);

export const useTmdbRecommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchRecommendations = useCallback(async () => {
        setLoading(true);
        setError(null);
        setRecommendations([]);
        
        try {
            // ids de 7 generos aleatorios
            const shuffledGenres = allGenreIds.sort(() => 0.5 - Math.random());
            const selectedGenreIds = shuffledGenres.slice(0, 7);

            const fetchedMovies = [];
            
            // 2. Busca um filme popular para cada gênero
            for (const genreId of selectedGenreIds) {
                const response = await axios.get(`${BASE_URL}/discover/movie`, {
                    params: {
                        api_key: API_KEY,
                        language: 'pt-BR',
                        with_genres: genreId, // gênero
                        sort_by: 'popularity.desc', // populares
                        'vote_count.gte': 100, // relevância
                        page: Math.floor(Math.random() * 5) + 1 // diversificar
                    },
                });
                if (response.data.results.length > 0) {
                    const randomMovie = response.data.results[0];
                    fetchedMovies.push(randomMovie);
                }
            }

            setRecommendations(fetchedMovies);

        } catch (err) {
            console.error("Erro ao buscar recomendações:", err);
            setError("Não foi possível carregar as recomendações de filmes.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRecommendations();
    }, [fetchRecommendations]); 

    return { recommendations, loading, error, refresh: fetchRecommendations };
};