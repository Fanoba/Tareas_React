import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import SEARCHBAR from '../components/search_bar';
import styles from '../styles/home.module.css';
import HEADER from '../components/header'; 

const HOME = () => {
  const handleSearchResults = (results) => {
    console.log('Resultados de búsqueda:', results);
  };

  return (
    <>
    <HEADER />
      <div className={styles.backgroundAnimation}></div>
      
      <Container className={styles.container}>
        <Row className="justify-content-center">
          <Col md={10} className="text-center">
            <h1 className={styles.title}>Encuentra tus libros favoritos entre miles de títulos disponibles</h1>

            <div className={styles.searchContainer}>
              <SEARCHBAR onSearch={handleSearchResults} />
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default HOME;