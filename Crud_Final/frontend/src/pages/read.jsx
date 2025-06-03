import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BOOKREAD from '../components/bookread';
import HEADER from '../components/header';
import styles from '../styles/read.module.css';
import { Link } from 'react-router-dom';

const READ = () => {
  const [booksRead, setBooksRead] = useState([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const [booksResponse, reviewsResponse] = await Promise.all([
          axios.get(`${API}/books-read`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API}/reviews`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        setBooksRead(booksResponse.data.libros_leidos || []);
        setTotalBooks(booksResponse.data.total || 0);
        setReviews(reviewsResponse.data.reviews || []);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API]);

  const handleReviewSubmit = async (bookId, reviewText) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        `${API}/reviews`,
        {
          book_read_id: bookId,
          comments: reviewText
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Actualizar lista de reseñas
      setReviews([...reviews, response.data]);
      
      return response.data;
    } catch (error) {
      console.error('Error al guardar reseña:', error);
      throw error;
    }
  };

  const handleReviewUpdate = async (reviewId, reviewText) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put(
        `${API}/reviews/${reviewId}`,
        {
          comments: reviewText
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Actualizar lista de reseñas
      setReviews(reviews.map(review => 
        review.id === reviewId ? response.data : review
      ));
      
      return response.data;
    } catch (error) {
      console.error('Error al actualizar reseña:', error);
      throw error;
    }
  };

  const getReviewForBook = (bookId) => {
    return reviews.find(review => review.book_read_id === bookId);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Cargando tus libros leídos...</p>
      </div>
    );
  }

  if (booksRead.length === 0) {
    return (
      <>
        <HEADER />
        <div className={styles.emptyState}>
          <div className={styles.emptyIllustration}></div>
          <h3 className={styles.emptyTitle}>Aún no has leído ningún libro</h3>
          <p className={styles.emptyText}>
            Comienza a leer libros y aquí aparecerán tus progresos.
          </p>
          <Link to="/home" className={styles.emptyAction}>
            Explorar libros
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <HEADER />
      <div className={styles.readContainer}>
        <div className={styles.header}>
          <h2 className={styles.title}>Tus libros leídos</h2>
          <p className={styles.subtitle}>
            {totalBooks} {totalBooks === 1 ? 'libro leído' : 'libros leídos'}
          </p>
        </div>
        
        <div className={styles.booksGrid}>
          {booksRead.map((book) => (
            <BOOKREAD 
              key={book.id}
              book={book}
              onReviewSubmit={handleReviewSubmit}
              onReviewUpdate={handleReviewUpdate}
              existingReview={getReviewForBook(book.id)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default READ;