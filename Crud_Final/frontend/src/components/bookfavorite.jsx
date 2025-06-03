import React, { useState } from 'react';
import styles from '../styles/bookfav.module.css';
import { FaTimes, FaTrash, FaCheck } from 'react-icons/fa';

const BOOKFAV = ({ 
  book, 
  onRemove, 
  onMarkAsRead,
  isDeleting = false,
  isMarkingAsRead = false
}) => {
  const [showModal, setShowModal] = useState(false);
  const { title, image, author, first_publish_year } = book;

  const toggleModal = () => setShowModal(prev => !prev);

  const handleRemove = () => {
    onRemove(book.id);
    setShowModal(false);
  };

  const handleMarkAsRead = () => {
    onMarkAsRead(book);
    setShowModal(false);
  };

  return (
    <>
      <div className={styles.card} onClick={toggleModal}>
        <img 
          src={image || 'https://via.placeholder.com/300x400?text=No+Cover'} 
          alt={`Portada de ${title}`} 
          className={styles.cover} 
        />
        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.author}>{author || 'Autor desconocido'}</p>
        </div>
      </div>

      {showModal && (
        <div className={styles.modalOverlay} onClick={toggleModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button 
              className={styles.closeBtn} 
              onClick={toggleModal}
            >
              <FaTimes />
            </button>
            
            <div className={styles.modalContent}>
              <img 
                src={image || 'https://via.placeholder.com/300x400?text=No+Cover'} 
                alt={`Portada de ${title}`} 
                className={styles.modalCover} 
              />
              
              <div className={styles.bookInfo}>
                <h2 className={styles.modalTitle}>{title}</h2>
                <p className={styles.infoItem}><strong>Autor:</strong> {author || 'Desconocido'}</p>
                <p className={styles.infoItem}><strong>Año:</strong> {first_publish_year || 'N/A'}</p>
                
                <div className={styles.actionButtons}>
                  <button 
                    className={styles.readBtn}
                    onClick={handleMarkAsRead}
                    disabled={isMarkingAsRead}
                  >
                    <FaCheck /> {isMarkingAsRead ? 'Procesando...' : 'Marcar como leído'}
                  </button>
                  
                  <button 
                    className={styles.deleteBtn}
                    onClick={handleRemove}
                    disabled={isDeleting}
                  >
                    <FaTrash /> {isDeleting ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BOOKFAV;