import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BOOKFAV from '../components/bookfavorite';
import HEADER from '../components/header';
import styles from '../styles/favorites.module.css';
import { Link } from 'react-router-dom';

const FAVORITES = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [markingAsReadId, setMarkingAsReadId] = useState(null);
  const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API}/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(response.data.favoritos || []);
    } catch (error) {
      console.error('Error al obtener favoritos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (bookId) => {
    setDeletingId(bookId);
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${API}/favorites/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(favorites.filter(book => book.id !== bookId));
    } catch (error) {
      console.error('Error al eliminar favorito:', error);
      alert(error.response?.data?.detail || 'Error al eliminar');
    } finally {
      setDeletingId(null);
    }
  };

  const handleMarkAsRead = async (book) => {
    setMarkingAsReadId(book.id);
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`${API}/books-read`, {
        name_book: book.title,
        author: book.author,
        image: book.image,
        key: book.key,
        read: true,
        finish_read: new Date().toISOString().split('T')[0]
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Libro marcado como leído');
      // Opcional: Eliminar de favoritos después de marcar como leído
      handleRemoveFavorite(book.id);
    } catch (error) {
      console.error('Error al marcar como leído:', error);
      alert(error.response?.data?.message || 'Error al marcar');
    } finally {
      setMarkingAsReadId(null);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Cargando favoritos...</div>;
  }

  if (favorites.length === 0) {
    return (
      <>
        <HEADER />
        <div className={styles.emptyState}>
          <h3>Aún no tienes favoritos</h3>
          <button className="btn btn-primary add-button" onClick={() => window.location.href = '/home'}>
            Explorar libros
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <HEADER />
      <div className={styles.container}>
        <div className={styles.grid}>
          {favorites.map(book => (
            <BOOKFAV
              key={book.id}
              book={book}
              onRemove={handleRemoveFavorite}
              onMarkAsRead={handleMarkAsRead}
              isDeleting={deletingId === book.id}
              isMarkingAsRead={markingAsReadId === book.id}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default FAVORITES;