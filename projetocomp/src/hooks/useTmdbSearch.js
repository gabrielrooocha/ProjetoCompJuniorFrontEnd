import { useState, useCallback } from 'react';
import axios from 'axios';

// Acessa a chave do .env
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const API_BASE_URL = 'https://api.themoviedb.org/3';

export const useTmdbSearch = () => {
    // 1. Estado para armazenar a lista de filmes
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 2. Função para buscar os filmes (usando useCallback para otimização)
    const getMovies = useCallback(async () => {
        setLoading(true);
        setError(null);
        setMovies([]); // Limpa filmes antigos

        // A URL completa e o objeto de configuração (params)
        const url = `${API_BASE_URL}/discover/movie`; 

        try {
            const response = await axios.get(url, {
                params: {
                    api_key: API_KEY, // Usa a chave da variável de ambiente
                    language: 'pt-BR'
                }
            });
            
            // 3. Armazena os resultados no estado
            setMovies(response.data.results);
            console.log("Filmes carregados:", response.data.results);

        } catch (err) {
            console.error("Erro ao buscar filmes:", err);
            setError("Não foi possível carregar os filmes.");
            
        } finally {
            setLoading(false);
        }
    }, []); // Array de dependências vazio

    // 4. Um hook deve retornar dados e funções
    return {
        movies,
        loading,
        error,
        getMovies
    };
};


    /*const searchMovie = useCallback(async (query) => {
        if (!query || query.length < 2) {
            setSuggestions([]);
            return;
        }

        setSearchLoading(true);
        setSearchError(null);
        
        try {
            const url = `${API_BASE_URL}/search/multi`; // 'multi' busca filme e série
            
            const response = await axios.get(url, {
                params: {
                    api_key: API_KEY,
                    query: query,
                    language: 'pt-BR'
                }
            });

            // Filtra e limita as sugestões a 5 resultados relevantes
            const filteredResults = response.data.results
                .filter(item => (item.media_type === 'movie' || item.media_type === 'tv'))
                .slice(0, 5);
                
            setSuggestions(filteredResults);

        } catch (error) {
            console.error("Erro na busca TMDb:", error);
            setSearchError("Não foi possível buscar filmes ou séries. Tente novamente mais tarde.");
            setSuggestions([]);
        } finally {
            setSearchLoading(false);
        }
    }, []);

    return { searchMovie, suggestions, searchLoading, searchError, setSuggestions };
};*/