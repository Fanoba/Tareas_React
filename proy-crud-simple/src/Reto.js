// src/components/Reto.jsx
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Button, Container, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter, Progress } from "reactstrap";

const dataInicial = [
  { id: 1, nombre: "Jorge Carranza", empresa: "Tec", proyecto: "Proyecto 1", rol: "Desarrollador", porcentaje: 50, estatus: "En Progreso" },
  { id: 2, nombre: "Ramon Velez", empresa: "Banorte", proyecto: "Proyecto 2", rol: "Desarrollador", porcentaje: 70, estatus: "En Progreso" },
  { id: 3, nombre: "Hugo Sanchez", empresa: "Real Madrid", proyecto: "Proyecto 3", rol: "Desarrollador", porcentaje: 100, estatus: "Finalizado" },
  { id: 4, nombre: "Rafael Marquez", empresa: "Barcelona", proyecto: "Proyecto 4", rol: "Desarrollador", porcentaje: 30, estatus: "En Progreso" },
  { id: 5, nombre: "Sergio Perez", empresa: "Oracle Red Bull Racing", proyecto: "Proyecto 5", rol: "Desarrollador", porcentaje: 80, estatus: "En Progreso" },
];

class Reto extends React.Component {
  state = {
    data: dataInicial,
    modalActualizar: false,
    modalInsertar: false,
    form: {
      id: "",
      nombre: "",
      empresa: "",
      proyecto: "",
      rol: "",
      porcentaje: 0,
      estatus: ""
    },
  };

  mostrarModalActualizar = (dato) => this.setState({ form: dato, modalActualizar: true });
  cerrarModalActualizar = () => this.setState({ modalActualizar: false });
  mostrarModalInsertar = () => this.setState({ modalInsertar: true });
  cerrarModalInsertar = () => this.setState({ modalInsertar: false });

  editar = (dato) => {
    const dataActualizada = this.state.data.map(registro => registro.id === dato.id ? dato : registro);
    this.setState({ data: dataActualizada, modalActualizar: false });
  };

  eliminar = (dato) => {
    if (window.confirm(`¿Seguro de eliminar el elemento ${dato.id}?`)) {
      const nuevaLista = this.state.data.filter(registro => registro.id !== dato.id);
      this.setState({ data: nuevaLista, modalActualizar: false });
    }
  };

  insertar = () => {
    const nuevoDato = { ...this.state.form, id: this.state.data.length + 1 };
    this.setState(prevState => ({
      data: [...prevState.data, nuevoDato],
      modalInsertar: false
    }));
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      form: { ...prevState.form, [name]: name === "porcentaje" ? parseInt(value) : value }
    }));
  };

  render() {
    return (
      <Container>
        <h2 className="mb-4 text-center">Lab 1</h2>
        <Button color="success" className="mb-3" onClick={this.mostrarModalInsertar}>Crear</Button>
        <Table striped hover className="rounded">
          <thead className="table-dark text-center">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Empresa</th>
              <th>Proyecto</th>
              <th>Rol</th>
              <th>Progreso (%)</th>
              <th>Estatus</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map((dato) => (
              <tr key={dato.id} className="text-center align-middle">
                <td>{dato.id}</td>
                <td>{dato.nombre}</td>
                <td>{dato.empresa}</td>
                <td>{dato.proyecto}</td>
                <td>{dato.rol}</td>
                <td className="w-25">
                  <Progress value={dato.porcentaje} className="mb-2">{dato.porcentaje}%</Progress>
                </td>
                <td>{dato.estatus}</td>
                <td>
                  <Button color="primary" size="sm" onClick={() => this.mostrarModalActualizar(dato)}>Editar</Button>{" "}
                  <Button color="danger" size="sm" onClick={() => this.eliminar(dato)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Modal Insertar */}
        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader><h4>Insertar Nuevo Registro</h4></ModalHeader>
          <ModalBody>
            {['nombre', 'empresa', 'proyecto', 'rol', 'estatus'].map(field => (
              <FormGroup key={field}>
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                <input className="form-control" name={field} onChange={this.handleChange} />
              </FormGroup>
            ))}
            <FormGroup>
              <label>Porcentaje:</label>
              <input type="number" className="form-control" name="porcentaje" min="0" max="100" onChange={this.handleChange} />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.insertar}>Insertar</Button>
            <Button color="secondary" onClick={this.cerrarModalInsertar}>Cancelar</Button>
          </ModalFooter>
        </Modal>

        {/* Modal Actualizar */}
        <Modal isOpen={this.state.modalActualizar}>
          <ModalHeader><h4>Editar Registro</h4></ModalHeader>
          <ModalBody>
            <FormGroup>
              <label>ID:</label>
              <input className="form-control" readOnly value={this.state.form.id} />
            </FormGroup>
            {['nombre', 'empresa', 'proyecto', 'rol', 'estatus'].map(field => (
              <FormGroup key={field}>
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                <input className="form-control" name={field} onChange={this.handleChange} value={this.state.form[field]} />
              </FormGroup>
            ))}
            <FormGroup>
              <label>Porcentaje:</label>
              <input type="number" className="form-control" name="porcentaje" min="0" max="100" onChange={this.handleChange} value={this.state.form.porcentaje} />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => this.editar(this.state.form)}>Actualizar</Button>
            <Button color="secondary" onClick={this.cerrarModalActualizar}>Cancelar</Button>
          </ModalFooter>
        </Modal>
      </Container>
    );
  }
}

export default Reto;