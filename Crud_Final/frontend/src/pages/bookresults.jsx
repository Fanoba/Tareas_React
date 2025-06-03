// pages/bookresults.jsx
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import BOOKCARD from '../components/bookcard';
import HEADER from '../components/header';
import styles from '../styles/bookresults.module.css';
import { FaTimes } from 'react-icons/fa';

const BOOKRESULTS = () => {
  const location = useLocation();
  const { libros = [], query = '' } = location.state || {};
  const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  const [favorites, setFavorites] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [reviewText, setReviewText] = useState('');

  const handleFavorite = async (book) => {
    const { title, author, first_publish_year, image, key } = book;
    const token = localStorage.getItem('authToken');

    try {
      await axios.post(`${API}/favorites`, {
        title,
        author,
        first_publish_year,
        image,
        key
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setFavorites([...favorites, key]);
    } catch (error) {
      if (error.response?.status === 409) {
        alert("Este libro ya está en tus favoritos.");
        setFavorites([...favorites, key]);
      } else {
        console.error('Error al agregar a favoritos:', error);
      }
    }
  };

  const handleOpenModal = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBook(null);
    setReviewText('');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');

    try {
      await axios.post(`${API}/reviews`, {
        comments: reviewText,
        book_read_id: selectedBook.id || 1 // Ajusta esto según el modelo
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert('Reseña enviada con éxito');
      handleCloseModal();
    } catch (error) {
      console.error('Error al enviar reseña:', error);
    }
  };

  return (
    <>
      <HEADER />
      <div className={styles.resultsContainer}>
        <div className="container">
          <div className={styles.searchInfo}>
            <h2 className={styles.title}>Resultados de búsqueda</h2>
            {libros.length > 0 && (
              <span className={styles.resultsCount}>
                {libros.length} {libros.length === 1 ? 'resultado' : 'resultados'}
                {query && ` para "${query}"`}
              </span>
            )}
          </div>

          {libros.length > 0 ? (
            <div className={styles.booksGrid}>
              {libros.map((libro, index) => (
                <div 
                  className={styles.bookCardWrapper}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  key={libro.key || index}
                >
                  <BOOKCARD 
                    book={libro}
                    isFavorite={favorites.includes(libro.key)}
                    onFavoriteClick={() => handleFavorite(libro)}
                    onCardClick={() => handleOpenModal(libro)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noResults}>
              <h3 className={styles.noResultsTitle}>No se encontraron resultados</h3>
              <p className={styles.noResultsText}>
                {query 
                  ? `No encontramos libros que coincidan con "${query}". Intenta con otros términos.`
                  : 'Realiza una búsqueda para encontrar libros.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {showModal && selectedBook && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={handleCloseModal}>
              <FaTimes />
            </button>
            <h2>{selectedBook.title}</h2>
            <p><strong>Autor:</strong> {selectedBook.author || 'Desconocido'}</p>
            <p><strong>Año de publicación:</strong> {selectedBook.first_publish_year || 'N/A'}</p>

            <form onSubmit={handleSubmitReview}>
              <textarea 
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Escribe tu reseña aquí..."
                required
                rows={4}
                style={{ width: '100%', marginTop: '1rem' }}
              />
              <button type="submit" className="btn btn-primary mt-2">Enviar reseña</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default BOOKRESULTS;
