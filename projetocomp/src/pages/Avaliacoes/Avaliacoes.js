import React from 'react';
import { Link } from 'react-router-dom';
import { useFetchDocuments } from '../../hooks/useFetchDocuments';
import MovieCardHorizontal from '../../components/MovieCardHorizontal'; 
import ReviewCard from '../../components/ReviewCard'; 
import styles from './Avaliacoes.module.css';
import { useTmdbRecommendations } from '../../hooks/useTmdbRecommendations.js';

const Avaliacoes = () => {
    const { recommendations, loading: loadingRecs, error: errorRecs, refresh: refreshRecs } = useTmdbRecommendations();
    const { documents: reviews, loading: loadingReviews, error: errorReviews } = useFetchDocuments("reviews");

    return (
        <div className={styles.dashboard}>
            {/* recomendações */}
            <section className={styles.recommendations_section}>
                <h1>Conheça novas histórias</h1>
                <button onClick={refreshRecs} className={styles.refresh_btn}>
                    Surpreenda-me!
                </button>
                
                {loadingRecs && <p className={styles.loading}>Carregando recomendações...</p>}
                {errorRecs && <p className={styles.error_message}>{errorRecs}</p>}
                
                <div className={styles.recommendations_list}>
                    {!loadingRecs && recommendations.length > 0 ? (
                        recommendations.map(movie => (
                            <MovieCardHorizontal 
                                key={movie.id} 
                                movie={movie} 
                            />
                        ))
                    ) : (
                         !loadingRecs && <p>Nenhuma recomendação encontrada.</p>
                    )}
                </div>
            </section>

            <hr className={styles.divider} />
            
            {/* reviews no firebase */}
            <section className={styles.reviews_section}>
                
                <div className={styles.reviews_header}>
                    <h2>Minhas reviews publicadas ({reviews ? reviews.length : 0})</h2>
                    <Link to="/posts/create" className={styles.new_review_btn}>
                        Nova Review
                    </Link>
                </div>

                {loadingReviews && <p className={styles.loading}>Carregando reviews...</p>}
                {errorReviews && <p className={styles.error_message}>{errorReviews}</p>}

                <div className={styles.reviews_list}>
                    {!loadingReviews && reviews && reviews.length > 0 ? (
                        reviews.map(review => (
                            <ReviewCard key={review.id} review={review} />
                        ))
                    ) : (
                        !loadingReviews && <p className={styles.no_reviews}>Nenhuma avaliação encontrada. Que tal criar uma?</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Avaliacoes;