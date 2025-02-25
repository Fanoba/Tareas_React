import { useState } from 'react';
import '../index.css';

export const AppCounter = () => {
  const [counter, setCounter] = useState(1); 

  return (
    <div>
      <h1>Counter: {counter}</h1>
      <button onClick={() => setCounter(counter + 1)}>Add 1</button>
      <button onClick={() => setCounter(0)}>Reset</button>
      <button onClick={() => setCounter(counter -1)}>Less 1</button>
    </div>
  )
}
