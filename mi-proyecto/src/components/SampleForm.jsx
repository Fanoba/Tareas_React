import { useState } from 'react';
import { Message } from './Message';

export const SampleForm = () => {
    const [formState, setFormState] = useState({
        Matricula: '',
        Nombre: '',
        ApellidoP: '',
        ApellidoM: '',
        Edad: 0,
        Carrera: ''
    });

    const [submitted, setSubmitted] = useState(false);

    const { Matricula, Nombre, ApellidoP, ApellidoM, Edad, Carrera } = formState;

    const onInputChange = ({ target }) => {
        const { name, value } = target;
        setFormState({
            ...formState,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault(); 
        setSubmitted(true); 
    };

    return (
        <>
            <h1>Formulario Simple</h1>
            <hr />
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Matrícula" 
                    name="Matricula"
                    value={Matricula}
                    onChange={onInputChange}
                    autoComplete="off"
                />

                <input 
                    type="text" 
                    className="form-control mt-2" 
                    placeholder="Nombre" 
                    name="Nombre"
                    value={Nombre}
                    onChange={onInputChange}
                    autoComplete="off"
                />

                <input 
                    type="text" 
                    className="form-control mt-2" 
                    placeholder="Apellido Paterno" 
                    name="ApellidoP"
                    value={ApellidoP}
                    onChange={onInputChange}
                    autoComplete="off"
                />

                <input 
                    type="text" 
                    className="form-control mt-2" 
                    placeholder="Apellido Materno" 
                    name="ApellidoM"
                    value={ApellidoM}
                    onChange={onInputChange}
                    autoComplete="off"
                />

                <input 
                    type="number" 
                    className="form-control mt-2" 
                    placeholder="Edad" 
                    name="Edad"
                    value={Edad}
                    onChange={onInputChange}
                    autoComplete="off"
                />

                <input 
                    type="text" 
                    className="form-control mt-2" 
                    placeholder="Carrera" 
                    name="Carrera"
                    value={Carrera}
                    onChange={onInputChange}
                    autoComplete="off"
                />

                <button type="submit">Enviar</button>
            </form>

        
            {submitted && (
                <div className="info-container">
                    <p>Matrícula: {Matricula}</p>
                    <p>Nombre: {Nombre}</p>
                    <p>Apellido Paterno: {ApellidoP}</p>
                    <p>Apellido Materno: {ApellidoM}</p>
                    <p>Edad: {Edad}</p>
                    <p>Carrera: {Carrera}</p>
                </div>
            )}

         
            
        </>
    );
};