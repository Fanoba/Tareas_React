import React, { useState } from 'react';
import { cifrar, descifrar } from '../cipher/cifrado';  // Asegúrate de que el nombre del archivo sea correcto
import 'bootstrap/dist/css/bootstrap.min.css';  // Importa Bootstrap para estilos

const FormularioCifrado = () => {
  const [texto, setTexto] = useState('');
  const [textoCifrado, setTextoCifrado] = useState('');
  const [textoDescifrado, setTextoDescifrado] = useState('');

  const handleCifrar = () => {
    const cifrado = cifrar(texto);
    setTextoCifrado(cifrado);
  };

  const handleDescifrar = () => {
    const descifrado = descifrar(textoCifrado);
    setTextoDescifrado(descifrado);
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4">
        <h2 className="text-center mb-4">Formulario de Cifrado y Descifrado</h2>

        <div className="mb-3">
          <label htmlFor="texto" className="form-label">Texto Plano</label>
          <input
            type="text"
            className="form-control"
            id="texto"
            placeholder="Introduce un texto"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}  // Actualiza el estado con el valor del input
          />
        </div>

        <div className="d-flex justify-content-center mb-3">
          <button className="btn btn-primary me-2 w-50" onClick={handleCifrar}>
            Cifrar
          </button>
        </div>

        {textoCifrado && (
          <div className="mt-3 p-3 bg-light rounded">
            <h5>Texto Cifrado:</h5>
            <p>{textoCifrado}</p> {/* Muestra el texto cifrado */}
          </div>
        )}

        <div className="d-flex justify-content-center mt-3">
          <button className="btn btn-secondary w-50" onClick={handleDescifrar}>
            Descifrar
          </button>
        </div>

        {textoDescifrado && (
          <div className="mt-3 p-3 bg-light rounded">
            <h5>Texto Original:</h5>
            <p>{textoDescifrado}</p> {/* Muestra el texto descifrado */}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormularioCifrado;
