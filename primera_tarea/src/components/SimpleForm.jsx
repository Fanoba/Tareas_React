import { useEffect, useState } from 'react';
import { Message } from './Message';

export const SimpleForm = () => {
    const [formState, setFormState] = useState({
        username: 'strider',
        email: 'fernando@google.com'
    });

    const { username, email } = formState;

    const onInputChange = ({ target }) => {
        const { name, value } = target;
        setFormState({
            ...formState,
            [name]: value
        });
    };

    useEffect(() => {
        console.log('useEffect inicial ejecutado');
    }, []);

    useEffect(() => {
        console.log('formState cambió:', formState);
    }, [formState]);

    useEffect(() => {
        console.log('email cambió:', email);
    }, [email]);

    return (
        <>
            <h1>Formulario Simple</h1>
            <hr />

            <form>
                <input 
                type="text" 
                className="form-control" 
                placeholder="Username" 
                name="username"
                value={username}
                onChange={onInputChange}
                autoComplete="off"
            />

            <input 
                type="email" 
                className="form-control mt-2" 
                placeholder="jorge@gmail.com" 
                name="email"
                value={email}
                onChange={onInputChange}
                autoComplete="off"
            />
        </form>

        {username === 'strider2' && <Message />}
    </>
    );
};