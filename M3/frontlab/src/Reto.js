import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  Alert,
  Spinner,
  Container,
} from "reactstrap";
import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const Tareas = () => {
  const [tareas, setTareas] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [form, setForm] = useState({ tarea: "", status: false });

  useEffect(() => {
    cargarTareas();
  }, []);

  const cargarTareas = async () => {
    setLoading(true);
    setAlert(null);
    try {
      const res = await axios.get("/tareas");
      setTareas(res.data);
    } catch (error) {
      setAlert({ type: "danger", message: "Error al cargar tareas." });
    }
    setLoading(false);
  };

  const toggleModalInsertar = () => {
    setModalInsertar(!modalInsertar);
    setForm({ tarea: "", status: false });
    setAlert(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const insertar = async () => {
    if (!form.tarea.trim()) {
      setAlert({ type: "danger", message: "Por favor ingresa una tarea." });
      return;
    }
    setLoading(true);
    setAlert(null);
    try {
      await axios.post("/tareas", form);
      await cargarTareas();
      setModalInsertar(false);
      setForm({ tarea: "", status: false });
      setAlert({ type: "success", message: "Tarea agregada con éxito." });
    } catch (error) {
      setAlert({
        type: "danger",
        message: "Error al insertar: " + (error.response?.data?.detail || error.message),
      });
    }
    setLoading(false);
  };

  const eliminarTarea = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta tarea?")) return;
    setLoading(true);
    setAlert(null);
    try {
      await axios.delete(`/tareas/${id}`);
      await cargarTareas();
      setAlert({ type: "success", message: "Tarea eliminada." });
    } catch (error) {
      setAlert({
        type: "danger",
        message: "Error al eliminar: " + (error.response?.data?.detail || error.message),
      });
    }
    setLoading(false);
  };

  const cambiarStatus = async (tarea) => {
    setLoading(true);
    setAlert(null);
    try {
      await axios.put(`/tareas/${tarea.id}`, {
        tarea: tarea.tarea,
        status: !tarea.status,
      });
      await cargarTareas();
    } catch (error) {
      setAlert({
        type: "danger",
        message: "Error al actualizar: " + (error.response?.data?.detail || error.message),
      });
    }
    setLoading(false);
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">Gestión de Tareas</h2>

      {alert && <Alert color={alert.type}>{alert.message}</Alert>}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button color="success" onClick={toggleModalInsertar}>
          + Agregar tarea
        </Button>
        <Button color="info" onClick={cargarTareas} disabled={loading}>
          {loading ? (
            <>
              <Spinner size="sm" /> Cargando...
            </>
          ) : (
            "Actualizar"
          )}
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead className="table-primary">
          <tr>
            <th>ID</th>
            <th>Tarea</th>
            <th>Status</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tareas.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                No hay tareas disponibles
              </td>
            </tr>
          ) : (
            tareas.map((tarea) => (
              <tr key={tarea.id}>
                <td>{tarea.id}</td>
                <td>{tarea.tarea}</td>
                <td>
                  <span
                    className={
                      tarea.status ? "badge bg-success" : "badge bg-warning text-dark"
                    }
                  >
                    {tarea.status ? "Completo" : "Pendiente"}
                  </span>
                </td>
                <td>
                  <Button
                    size="sm"
                    color={tarea.status ? "warning" : "success"}
                    onClick={() => cambiarStatus(tarea)}
                    className="me-2"
                  >
                    {tarea.status ? "Marcar pendiente" : "Marcar completada"}
                  </Button>
                  <Button size="sm" color="danger" onClick={() => eliminarTarea(tarea.id)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <Modal isOpen={modalInsertar} toggle={toggleModalInsertar} centered>
        <ModalHeader toggle={toggleModalInsertar}>Insertar Tarea</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="tareaInput">Tarea</Label>
            <Input
              id="tareaInput"
              type="text"
              name="tarea"
              placeholder="Describe tu tarea"
              onChange={handleChange}
              value={form.tarea}
            />
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                name="status"
                checked={form.status}
                onChange={handleChange}
              />{" "}
              Completada
            </Label>
          </FormGroup>
          {alert && alert.type === "danger" && (
            <Alert color="danger" className="mt-3">
              {alert.message}
            </Alert>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={insertar} disabled={loading}>
            {loading ? <Spinner size="sm" /> : "Insertar"}
          </Button>
          <Button color="secondary" onClick={toggleModalInsertar} disabled={loading}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default Tareas;
