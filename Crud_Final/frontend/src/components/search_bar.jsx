import React, { useState } from 'react';
import { InputGroup, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/searchbar.module.css';

const SEARCHBAR = () => {
  const [query, setQuery] = useState('');
  const API= process.env.REACT_APP_API_URL || 'http://localhost:8000'
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);

    try {
      const res = await fetch(`${API}/buscar-libros?query=${encodeURIComponent(query)}`);
      const data = await res.json();

      navigate('/book-results', { state: { libros: data.resultados } });
    } catch (err) {
      console.error('Error al buscar libros:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className={styles.searchForm}>
      <InputGroup className={styles.searchGroup}>
        <Form.Control
          type="text"
          placeholder="Buscar libros por título."
          className={styles.searchInput}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Buscar libros"
        />
        <Button 
          variant="primary" 
          type="submit" 
          className={styles.searchButton}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className={styles.spinner} aria-hidden="true"></span>
              <span className="visually-hidden">Buscando...</span>
            </>
          ) : (
            <i className="bi bi-search"></i>
          )}
        </Button>
      </InputGroup>
    </Form>
  );
};

export default SEARCHBAR;
