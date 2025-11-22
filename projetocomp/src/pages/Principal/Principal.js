import styles from "./Principal.module.css";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axios from 'axios';

const API_KEY = 'da45a8526f15a6cca7c276cf12d40138'; 
const BASE_URL = 'https://api.themoviedb.org/3';

const Principal = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [currentSearchTerm, setCurrentSearchTerm] = useState("");

  const getMovies = useCallback(async (searchQuery = '') => {
    setLoading(true);
    setError(null);

    // Define a URL e os parâmetros baseados se há um termo de busca
    const url = searchQuery
      ? `${BASE_URL}/search/movie`
      : `${BASE_URL}/discover/movie`;

    try {
      const response = await axios.get(url, {
        params: {
          api_key: API_KEY,
          language: 'pt-BR',
          query: searchQuery, 
        },
      });

      setMovies(response.data.results);
      setLoading(false);
      setCurrentSearchTerm(searchQuery);

      if (searchQuery && response.data.results.length === 0) {
          setError(`Nenhum filme encontrado para "${searchQuery}".`);
      }

    } catch (err) {
      console.error("Erro ao buscar filmes:", err);
      setError("Não foi possível carregar os filmes. Tente novamente mais tarde.");
      setLoading(false);
    }
  }, []);

  // Carrega filmes populares na montagem
  useEffect(() => {
    getMovies();
  }, [getMovies]); 

  // Pesquisa
  const handleSubmit = (e) => {
    e.preventDefault();

    if (query.trim()) {
      getMovies(query.trim());
    } else {
      getMovies();
    }
  };

  return (
    <div className={styles.home}>
      <div className={styles.search_header}>
        <h1>
          {currentSearchTerm ? `Resultados da busca: "${currentSearchTerm}"` : "Filmes em Destaque"}
        </h1> 
        
        <form className={styles.search_form} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Busque por um filme..."
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
          <button className="btn btn-dark">Pesquisar</button>
        </form>
      </div>
      
      {/* Lista de Filmes*/}
      <div> 
        {error && <p className="error">{error}</p>}
        
        {!loading && !error && movies.length === 0 && (
            <div className={styles.noposts}>
              <p>Não foram encontrados filmes.</p>
              <Link to="/" onClick={() => getMovies()} className="btn btn-outline">
                Voltar aos destaques
              </Link>
            </div>
        )}
        
        {/* Renderização*/}
        {movies.length > 0 && (
          <ul className={styles.movie_list}> 
              {movies.map((movie) => 
                  <li key={movie.id} className={styles.movie_card}> 
                      {movie.poster_path && (
                          <img 
                              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} 
                              alt={movie.title}
                          />
                      )}
                      <h3 className={styles.title}>{movie.title}</h3>
                      <p className={styles.rating}>
                           {movie.vote_average.toFixed(1)}
                      </p>
                  </li>
              )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Principal;