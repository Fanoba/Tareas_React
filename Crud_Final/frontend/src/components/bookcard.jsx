// components/bookcard.jsx
import React from 'react';
import styles from '../styles/bookcard.module.css';
import { FaRegHeart, FaHeart } from 'react-icons/fa';

const BOOKCARD = ({ 
  book, 
  isFavorite, 
  onFavoriteClick, 
  onCardClick 
}) => {
  const { title, image } = book;

  return (
    <div className={styles.card} onClick={onCardClick}>
      <img 
        src={image || 'https://via.placeholder.com/300x400?text=No+Cover'} 
        alt={`Portada de ${title}`} 
        className={styles.cover} 
      />
      <button 
        className={styles.favoriteBtn} 
        onClick={(e) => {
          e.stopPropagation();
          onFavoriteClick();
        }}
        aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
      >
        {isFavorite ? <FaHeart color="#e63946" /> : <FaRegHeart />}
      </button>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
      </div>
    </div>
  );
};

export default BOOKCARD;
