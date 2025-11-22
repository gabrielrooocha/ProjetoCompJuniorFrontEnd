import { useState, useCallback } from 'react';
import axios from 'axios';

// Acessa a chave do .env
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const API_BASE_URL = 'https://api.themoviedb.org/3';

export const useTmdbSearch = () => {
    // armazenar a lista de filmes
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // buscar filmes
    const getMovies = useCallback(async () => {
        setLoading(true);
        setError(null);
        setMovies([]); 
        const url = `${API_BASE_URL}/discover/movie`; 

        try {
            const response = await axios.get(url, {
                params: {
                    api_key: API_KEY, 
                    language: 'pt-BR'
                }
            });
            
            // armazena
            setMovies(response.data.results);
            console.log("Filmes carregados:", response.data.results);

        } catch (err) {
            console.error("Erro ao buscar filmes:", err);
            setError("Não foi possível carregar os filmes.");
            
        } finally {
            setLoading(false);
        }
    }, []);
    return {
        movies,
        loading,
        error,
        getMovies
    };
};
