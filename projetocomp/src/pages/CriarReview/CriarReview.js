import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { db } from "../../firebase/config";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import styles from "./CriarReview.module.css"; 

const API_KEY = 'da45a8526f15a6cca7c276cf12d40138'; 
const BASE_URL = 'https://api.themoviedb.org/3';

// 
// Componente de Card de Filme
// 
const MovieCard = ({ movie, onClick }) => (
    <li 
        key={movie.id} 
        className={styles.movie_card} 
        onClick={() => onClick(movie)} 
        title={`Selecionar: ${movie.title}`}
    > 
        {movie.poster_path && (
            <img 
                src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} 
                alt={movie.title}
            />
        )}
        <h3 className={styles.title}> 
            {movie.title}
        </h3>
        <p className={styles.rating}>
            {movie.vote_average ? movie.vote_average.toFixed(1) : 'S/N'}
        </p>
    </li>
);

// 
// Componente Principal
// 
export default function CreateReview () {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [reviewContent, setReviewContent] = useState("");
    const [rating, setRating] = useState(""); 
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formMessage, setFormMessage] = useState(null); 

    // Função de Busca
    const searchMovies = useCallback(async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setLoading(true);
        setError(null);

        const url = `${BASE_URL}/search/movie`;

        try {
            const response = await axios.get(url, {
                params: {
                    api_key: API_KEY,
                    language: 'pt-BR',
                    query: query.trim(), 
                },
            });

            setSearchResults(response.data.results.slice(0, 5)); 
        } catch (err) {
            console.error("Erro ao buscar filmes:", err);
            setError("Não foi possível buscar filmes. Verifique sua conexão.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm) {
                searchMovies(searchTerm);
            } else {
                setSearchResults([]);
            }
        }, 500); 

        return () => clearTimeout(timeoutId);
    }, [searchTerm, searchMovies]);
    
    // 
    // Lógica do Formulário
    // 

    const handleMovieSelect = (movie) => {
        setSelectedMovie(movie);
        setSearchTerm(movie.title); // Preenche o campo de busca com o título
        setSearchResults([]); // Oculta a lista de resultados
    };

    // Envio da avaliação 
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormMessage(null); 

        if (!selectedMovie) {
            setFormMessage({ type: 'error', text: 'Por favor, selecione um filme para avaliar.' });
            return;
        }

        if (!reviewContent.trim()) {
            setFormMessage({ type: 'error', text: 'O campo de avaliação não pode estar vazio.' });
            return;
        }
        
        const numericRating = parseFloat(rating);

        if (isNaN(numericRating) || numericRating < 0 || numericRating > 10) {
            setFormMessage({ 
                type: 'error', 
                text: `Erro: A nota deve ser um número entre 0 e 10. Você digitou ${rating || 'vazio'}.` 
            });
            return;
        }

        const reviewData = {

            movieId: selectedMovie.id,
            movieTitle: selectedMovie.title,
            moviePoster: selectedMovie.poster_path,

            content: reviewContent.trim(),
            rating: numericRating, 
            
            createdAt: Timestamp.fromDate(new Date()),
        };

        // ENvio para o FireBase
        try {
            const docRef = await addDoc(collection(db, "reviews"), reviewData);
            setFormMessage({ 
                type: 'success', 
                text: `Avaliação de "${selectedMovie.title}" publicada com sucesso! ID: ${docRef.id}`
            });

            setSelectedMovie(null);
            setSearchTerm("");
            setReviewContent("");
            setRating("");

        } catch (error) {
            console.error("Erro ao publicar a avaliação: ", error);
            setFormMessage({ 
                type: 'error', 
                text: 'Não foi possível salvar a avaliação no Firebase. Tente novamente.' 
            });
        }
    };

    return(
      <div 
      className={styles.review_container} 
      style={selectedMovie ? { 
          backgroundImage: `url(https://image.tmdb.org/t/p/original${selectedMovie.poster_path})` 
      } : {}}
      >
            <h1> Eu assisti... </h1>
            <form onSubmit={handleSubmit} className={styles.review_form}>
                
                <label>
                    <span>Título da Avaliação (Buscar o Filme):</span>
                    <input 
                        type="text" 
                        placeholder="Selecione seu filme"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setSelectedMovie(null);
                        }}
                    />
                </label>
                
                {selectedMovie && (
                    <div className={styles.selected_movie}>
                        Filme Selecionado: **{selectedMovie.title}**
                        <button type="button" onClick={() => setSelectedMovie(null)} className={styles.deselect_btn}>
                            Mudar
                        </button>
                    </div>
                )}
                
                {!selectedMovie && searchTerm.length > 0 && !loading && searchResults.length > 0 && (
                    <div className={styles.search_results_dropdown}>
                        <p>Clique para selecionar:</p>
                        <ul className={styles.movie_list}>
                            {searchResults.map(movie => (
                                <MovieCard key={movie.id} movie={movie} onClick={handleMovieSelect} />
                            ))}
                        </ul>
                    </div>
                )}
                
                {loading && <p className={styles.loading}>Buscando filmes...</p>}
                {error && <p className={styles.error_message}>{error}</p>}
                
                <label>
                    <span>Sua Avaliação (Opinião):</span>
                    <textarea 
                        rows="8"
                        placeholder="Digite sua avaliação"
                        value={reviewContent}
                        onChange={(e) => setReviewContent(e.target.value)}
                    ></textarea>
                </label>
                
                <label>
                    <span>Nota (0 a 10):</span>
                    <input 
                        type="number" 
                        min="0" 
                        max="10"
                        step="0.1" 
                        placeholder="Ex: 8.5"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                    />
                </label>
                
                {formMessage && (
                    <p className={formMessage.type === 'error' ? styles.error_message : styles.success_message}>
                        {formMessage.text}
                    </p>
                )}
                
                <button type="submit" className={styles.publish_btn}>
                    Publicar Avaliação
                </button>
            </form>
        </div>
    );
}