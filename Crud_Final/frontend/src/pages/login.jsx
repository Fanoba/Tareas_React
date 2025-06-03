import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import axios from 'axios';

const LOGIN = () => {
  const API= process.env.REACT_APP_API_URL || 'http://localhost:8000'; 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    setLoading(true);
    event.preventDefault();
    try {
      const response = await axios.post(
      `${API}/login`,
        { email, password }
      );

      const { token } = response.data;
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/home");
    } catch (err) {
      console.error("Login error:", err);
      setError("Incorrect email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 2 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <motion.div
          style={{ width: '100%', maxWidth: '400px' }}
        >
          <Card className="p-4 shadow">
            <Card.Body>
              <h2 className="text-center mb-4">Iniciar Sesión</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Ingresa tu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <motion.div
                  whileHover={{ scale: 1}}
                  whileTap={{ scale: 0.99 }}
                >
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mt-3"
                    onClick={handleLogin}
                    disabled={loading}
                  >
                    {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </Button>
                </motion.div>
              </Form>
            </Card.Body>
          </Card>
        </motion.div>
      </Container>
    </motion.div>
  );
};

export default LOGIN;