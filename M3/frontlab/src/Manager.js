import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Button, Container, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import axios from 'axios';

// Configura la URL base de tu API FastAPI
const API_BASE_URL = "http://127.0.0.1:8000";

class Manager extends React.Component {
    state = {
        data: [],
        modalActualizar: false,
        modalInsertar: false,
        form: {
            id: "",
            nombre: "",
            empresa: "",
            proyecto: "",
            rol: "",
        },
    };

    // Cargar datos al montar el componente
    componentDidMount() {
        this.cargarEmpleados();
    }

    cargarEmpleados = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/empleados`);
            this.setState({ data: response.data });
        } catch (error) {
            console.error("Error al cargar empleados:", error);
        }
    };

    mostrarModalActualizar = (dato) => {
        this.setState({
            form: dato,
            modalActualizar: true,
        });
    };

    cerrarModalActualizar = () => {
        this.setState({ modalActualizar: false });
    };

    mostrarModalInsertar = () => {
        this.setState({
            form: {
                id: "",
                nombre: "",
                empresa: "",
                proyecto: "",
                rol: "",
            },
            modalInsertar: true,
        });
    };

    cerrarModalInsertar = () => {
        this.setState({ modalInsertar: false });
    };

    editar = async (dato) => {
        try {
            await axios.put(`${API_BASE_URL}/empleados/${dato.id}`, dato);
            this.cargarEmpleados();
            this.setState({ modalActualizar: false });
        } catch (error) {
            console.error("Error al editar empleado:", error);
        }
    };

    eliminar = async (dato) => {
        const opcion = window.confirm(`¿Estás seguro que deseas eliminar al empleado ${dato.nombre}?`);
        if (opcion) {
            try {
                await axios.delete(`${API_BASE_URL}/empleados/${dato.id}`);
                this.cargarEmpleados();
                this.setState({ modalActualizar: false });
            } catch (error) {
                console.error("Error al eliminar empleado:", error);
            }
        }
    };

    insertar = async () => {
        try {
            await axios.post(`${API_BASE_URL}/empleados/`, this.state.form);
            this.cargarEmpleados();
            this.setState({ modalInsertar: false });
        } catch (error) {
            console.error("Error al insertar empleado:", error);
        }
    };

    handleChange = (e) => {
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value,
            },
        });
    };

    render() {
        return (
            <>
                <Container>
                    <br />
                    <Button color="success" onClick={this.mostrarModalInsertar}>Crear</Button>
                    <br />
                    <br />
                    <Table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Empresa</th>
                                <th>Proyecto</th>
                                <th>Rol</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data.map((dato) => (
                                <tr key={dato.id}>
                                    <td>{dato.id}</td>
                                    <td>{dato.nombre}</td>
                                    <td>{dato.empresa}</td>
                                    <td>{dato.proyecto}</td>
                                    <td>{dato.rol}</td>
                                    <td>
                                        <Button color="primary" onClick={() => this.mostrarModalActualizar(dato)}>
                                            Editar
                                        </Button>{" "}
                                        <Button color="danger" onClick={() => this.eliminar(dato)}>
                                            Eliminar
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Container>

                <Modal isOpen={this.state.modalInsertar}>
                    <ModalHeader>
                        <div><h3>Insertar Empleado</h3></div>
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <label>Nombre: </label>
                            <input
                                className="form-control"
                                name="nombre"
                                type="text"
                                onChange={this.handleChange}
                                value={this.state.form.nombre}
                            />
                        </FormGroup>
                        <FormGroup>
                            <label>Empresa: </label>
                            <input
                                className="form-control"
                                name="empresa"
                                type="text"
                                onChange={this.handleChange}
                                value={this.state.form.empresa}
                            />
                        </FormGroup>
                        <FormGroup>
                            <label>Proyecto: </label>
                            <input
                                className="form-control"
                                name="proyecto"
                                type="text"
                                onChange={this.handleChange}
                                value={this.state.form.proyecto}
                            />
                        </FormGroup>
                        <FormGroup>
                            <label>Rol: </label>
                            <input
                                className="form-control"
                                name="rol"
                                type="text"
                                onChange={this.handleChange}
                                value={this.state.form.rol}
                            />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.insertar}>
                            Insertar
                        </Button>
                        <Button color="danger" onClick={this.cerrarModalInsertar}>
                            Cancelar
                        </Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.modalActualizar}>
                    <ModalHeader>
                        <div><h3>Editar Empleado</h3></div>
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <label>ID:</label>
                            <input
                                className="form-control"
                                readOnly
                                type="text"
                                value={this.state.form.id}
                            />
                        </FormGroup>
                        <FormGroup>
                            <label>Nombre:</label>
                            <input
                                className="form-control"
                                name="nombre"
                                type="text"
                                onChange={this.handleChange}
                                value={this.state.form.nombre}
                            />
                        </FormGroup>
                        <FormGroup>
                            <label>Empresa:</label>
                            <input
                                className="form-control"
                                name="empresa"
                                type="text"
                                onChange={this.handleChange}
                                value={this.state.form.empresa}
                            />
                        </FormGroup>
                        <FormGroup>
                            <label>Proyecto:</label>
                            <input
                                className="form-control"
                                name="proyecto"
                                type="text"
                                onChange={this.handleChange}
                                value={this.state.form.proyecto}
                            />
                        </FormGroup>
                        <FormGroup>
                            <label>Rol:</label>
                            <input
                                className="form-control"
                                name="rol"
                                type="text"
                                onChange={this.handleChange}
                                value={this.state.form.rol}
                            />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => this.editar(this.state.form)}>
                            Guardar
                        </Button>
                        <Button color="danger" onClick={this.cerrarModalActualizar}>
                            Cancelar
                        </Button>
                    </ModalFooter>
                </Modal>
            </>
        );
    }
}

export default Manager;