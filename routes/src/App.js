import { Routes, Route } from 'react-router-dom';
import './App.css';
import Dash from './pages/Dash';
import Home from './pages/Home';
import Perfil from './pages/Perfil';
import { Layout } from './pages/Layout';
import { Login} from './pages/Login';
import { Footer } from './pages/Footer';


function App() {
  return (
    <div>
      <Layout/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Dash" element={<Dash />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Perfil" element={<Perfil />} />
      </Routes>
      <Footer></Footer>
    </div>
  );
}

export default App;