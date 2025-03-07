import React, { useState, useCallback } from 'react';
import { ShowIncrement } from './ShowIncrement';

export const CallbackHook = () => {

    const [counter, setCounter] = useState(10);

    // Usamos useCallback para memorizar la función `incrementP`
    const incrementP = useCallback(() => {
        setCounter(counter + 1);
        console.log('Callback');
    }, [counter]); // La función solo se vuelve a crear si `counter` cambia

    return (
        <>
            <h1>useCallback Hook: {counter} </h1>
            <hr />
            <ShowIncrement increment={incrementP} />
        </>
    );
};
