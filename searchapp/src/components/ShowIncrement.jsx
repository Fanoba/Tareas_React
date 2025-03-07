import React from 'react';

export const ShowIncrement = React.memo(({ increment }) => {
    console.log('Cargar Componente');
    return (
        <button className='btn btn-primary' onClick={ () => increment() }>
            Incrementar
        </button>
    );
});
