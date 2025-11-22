// src/components/ReviewCard.js (MODIFICADO)
import React, { useState } from 'react';
import { db } from '../firebase/config';
import { doc, deleteDoc } from "firebase/firestore";
import { useUpdateDocument } from '../hooks/useUpdateDocument'; // Novo Hook

import styles from './ReviewCard.module.css';

const ReviewCard = ({ review }) => {
    const { updateDocument, response: updateResponse } = useUpdateDocument("reviews");
    
    const [isEditing, setIsEditing] = useState(false);
    const [newContent, setNewContent] = useState(review.content);
    const [newRating, setNewRating] = useState(review.rating);
    const [message, setMessage] = useState(null);

    // Função para deletar a avaliação
    const handleDelete = async () => {
        if (window.confirm(`Tem certeza que deseja deletar a avaliação de "${review.movieTitle}"?`)) {
            try {
                // Deleta o documento pelo ID e coleção 'reviews'
                await deleteDoc(doc(db, "reviews", review.id));
                setMessage({ type: 'success', text: "Avaliação deletada!" });
            } catch (error) {
                console.error("Erro ao deletar avaliação:", error);
                setMessage({ type: 'error', text: "Erro ao deletar avaliação." });
            }
        }
    };

    // Função para salvar as edições
    const handleSave = (e) => {
        e.preventDefault();
        setMessage(null);

        const numericRating = parseFloat(newRating);

        if (isNaN(numericRating) || numericRating < 0 || numericRating > 10) {
            setMessage({ type: 'error', text: 'A nota deve ser entre 0 e 10.' });
            return;
        }

        const dataToUpdate = {
            content: newContent.trim(),
            rating: numericRating,
        };

        // Chama o hook para atualizar no Firebase
        updateDocument(review.id, dataToUpdate);
    };

    // Atualiza o estado
    React.useEffect(() => {
        if (updateResponse.loading === false) {
            if (updateResponse.error) {
                setMessage({ type: 'error', text: `Erro ao atualizar: ${updateResponse.error}` });
            }
            else if (isEditing) { 
                setMessage({ type: 'success', text: "Avaliação atualizada com sucesso!" });
                setIsEditing(false); 
            }
        }
    }, [updateResponse, isEditing]);
    
    // Formata a data de criação
    const date = review.createdAt?.toDate ? review.createdAt.toDate().toLocaleDateString('pt-BR') : 'Data Indisponível';


    return (
        <div className={styles.review_card}>
            
            {/* Mensagem de feedback (sucesso/erro/loading) */}
            {message && (
                <p className={message.type === 'error' ? styles.error_message : styles.success_message}>
                    {message.text}
                </p>
            )}

            {/* HEADER COM POSTER E TÍTULO */}
            <div className={styles.header}>
                {review.moviePoster && (
                    <img 
                        src={`https://image.tmdb.org/t/p/w92${review.moviePoster}`} 
                        alt={review.movieTitle} 
                        className={styles.poster}
                    />
                )}
                <div className={styles.title_info}>
                    <h2>{review.movieTitle}</h2>
                    <p className={styles.date}>Avaliado em: {date}</p>
                </div>
            </div>

            {/* CONTEÚDO: MODO DE EDIÇÃO VS MODO DE VISUALIZAÇÃO */}
            <form onSubmit={handleSave}>
                <div className={styles.content}>
                    <label>
                        <span className={styles.label_text}>Nota (0 a 10):</span>
                        <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={isEditing ? newRating : review.rating.toFixed(1)}
                            onChange={(e) => setNewRating(e.target.value)}
                            readOnly={!isEditing}
                            className={isEditing ? styles.edit_input_rating : styles.rating_display}
                        />
                    </label>
                    <label>
                        <span className={styles.label_text}>Sua Avaliação:</span>
                        <textarea
                            rows="5"
                            value={isEditing ? newContent : review.content}
                            onChange={(e) => setNewContent(e.target.value)}
                            readOnly={!isEditing}
                            className={isEditing ? styles.edit_textarea : styles.review_text}
                        />
                    </label>
                </div>

                {/* AÇÕES */}
                <div className={styles.actions}>
                    {!isEditing ? (
                        <>
                            <button 
                                type="button" 
                                onClick={() => {
                                    setIsEditing(true);
                                    setMessage(null);
                                }} 
                                className={styles.edit_btn}
                            >
                                Editar
                            </button>
                            <button 
                                type="button" 
                                onClick={handleDelete} 
                                className={styles.delete_btn}
                                disabled={updateResponse.loading}
                            >
                                Deletar
                            </button>
                        </>
                    ) : (
                        <>
                            <button type="submit" className={styles.save_btn} disabled={updateResponse.loading}>
                                {updateResponse.loading ? "Salvando..." : "Salvar"}
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setIsEditing(false)} 
                                className={styles.cancel_btn}
                                disabled={updateResponse.loading}
                            >
                                Cancelar
                            </button>
                        </>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ReviewCard;