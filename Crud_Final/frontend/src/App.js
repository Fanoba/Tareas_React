import { Routes, Route } from 'react-router-dom';
import LOGIN from './pages/login';
import HOME from './pages/home';
import BOOKRESULTS from './pages/bookresults';
import FAVORITES from './pages/favorites';
import READ from './pages/read';
function App() {
  return (
    <>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LOGIN />} />
          <Route path="/home" element={<HOME />} />
          <Route path="/book-results" element={<BOOKRESULTS />} />
          <Route path="/favorites" element={<FAVORITES />} />
          <Route path="/read" element={<READ />} />

        </Routes>
      </div>
    </>
  );
}

export default App;