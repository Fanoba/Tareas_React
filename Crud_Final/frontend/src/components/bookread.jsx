import React, { useState } from 'react';
import styles from '../styles/bookread.module.css';
import { FaTimes, FaPenAlt, FaCalendarAlt, FaEdit } from 'react-icons/fa';

const BOOKREAD = ({ 
  book, 
  onReviewSubmit,
  onReviewUpdate,
  existingReview = null,
  isLoadingReview = false
}) => {
  const [showModal, setShowModal] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { name_book: title, finish_read, read } = book;

  const toggleModal = () => {
    setShowModal(!showModal);
    if (!showModal && existingReview) {
      setReviewText(existingReview.comments);
      setIsEditing(false);
    } else {
      setReviewText('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (existingReview && !isEditing) {
      return; // No guardar si no está en modo edición
    }

    setIsSubmitting(true);

    try {
      if (existingReview && isEditing) {
        await onReviewUpdate(existingReview.id, reviewText);
      } else {
        await onReviewSubmit(book.id, reviewText);
      }

      setShowModal(false);
    } finally {
      setIsSubmitting(false);
      setIsEditing(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  return (
    <>
      <div className={styles.card} onClick={toggleModal}>
        <div className={styles.bookCover}>
          <div className={styles.bookSpine}></div>
          <div className={styles.bookFront}>
            <h3 className={styles.title}>{title}</h3>
            <div className={styles.dateBadge}>
              <FaCalendarAlt /> {finish_read}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className={styles.modalOverlay} onClick={toggleModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={toggleModal}>
              <FaTimes />
            </button>

            <div className={styles.modalHeader}>
              <div className={styles.modalBookCover}>
                <div className={styles.modalBookSpine}></div>
                <div className={styles.modalBookFront}>
                  <h2>{title}</h2>
                </div>
              </div>

              <div className={styles.bookMeta}>
                <p className={styles.metaItem}>
                  <strong>Fecha de lectura:</strong> {finish_read}
                </p>
                <p className={styles.metaItem}>
                  <strong>Estado:</strong> {read ? 'Leído' : 'En progreso'}
                </p>
              </div>
            </div>

            {/* Mostrar botón de editar solo si hay reseña y no estamos editando */}
            {isLoadingReview ? (
              <div className={styles.loading}>Cargando reseña...</div>
            ) : existingReview && !isEditing && (
              <div className={styles.reviewActions}>
                <p className={styles.reviewNotice}>
                  Ya escribiste una reseña para este libro.
                </p>
                <button
                  type="button"
                  className={styles.editBtn}
                  onClick={handleEditClick}
                >
                  <FaEdit /> Editar Reseña
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.reviewForm}>
              <label className={styles.formLabel}>Tu reseña:</label>
              <textarea
                placeholder="Comparte tus pensamientos sobre este libro..."
                rows="5"
                className={styles.textarea}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                disabled={(!!existingReview && !isEditing) || isLoadingReview}
              ></textarea>

              {/* Mostrar acciones solo si se está creando o editando */}
              {(!existingReview || isEditing) && (
                <div className={styles.modalActions}>
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={toggleModal}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={isSubmitting || !reviewText.trim()}
                  >
                    {isSubmitting ? 'Guardando...' : 'Guardar Reseña'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default BOOKREAD;
