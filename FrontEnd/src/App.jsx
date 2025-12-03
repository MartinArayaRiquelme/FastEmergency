import { Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar.jsx';  
import Home from './components/Home.jsx';      
import Registro from './components/Registro.jsx'; 
import Login from './components/Login.jsx';
import Voluntariado from './components/Voluntariado.jsx';
import GestionSolicitudes from './components/GestionSolicitudes.jsx';
import Buzon from './components/Buzon.jsx';
import PanelAlbergue from './components/PanelAlbergue.jsx';
function App() {
  return (
    <div>
      {/* La Navbar siempre se ve, por eso va fuera de Routes */}
      <Navbar />
      
      {/* Aquí definimos qué contenido cambia según la URL */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />  {/* <--- Agregar ruta */}
        <Route path="/voluntariado" element={<Voluntariado />} />
        <Route path="/gestion" element={<GestionSolicitudes />} />
        <Route path="/buzon" element={<Buzon />} />
        <Route path="/encargado" element={<PanelAlbergue />} />
      </Routes>
    </div>
  );
}

export default App;