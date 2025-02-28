import { useFetch } from '../hooks/useFetch';
import { useCounter } from '../hooks/useCounter';
import { Loading } from './Loading';
import { Card } from './Card';

export const CustomHook = () => {
    const { counter, decrement, increment } = useCounter(1);

    // API de Rick and Morty para obtener información del personaje
    const { data, hasError, isLoading } = useFetch(
        `https://rickandmortyapi.com/api/character/${counter}`
    );

    return (
        <>
            <h1>Información de Rick and Morty</h1>
            <hr />
            <h2>{data?.name}</h2>

            {isLoading ? (
                <Loading />
            ) : (
                <Card
                    id={counter}
                    name={data.name}
                    sprites={[data.image]} 
                />
            )}

            {/* Botones para navegar entre los personajes */}
            <button className='btn btn-primary' onClick={() => decrement()}>
                Anterior
            </button>
            <button className='btn btn-primary' onClick={() => increment()}>
                Siguiente
            </button>
        </>
    );
};
