import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

function Navbar() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  // Función para revisar si hay alguien logueado
  const chequearSesion = () => {
    const guardado = localStorage.getItem('usuarioLogueado');
    if (guardado) {
      setUsuario(JSON.parse(guardado));
    } else {
      setUsuario(null);
    }
  };

  useEffect(() => {
    chequearSesion(); // Chequear al cargar
    
    // Escuchar cambios (por si se loguea en otra pestaña o componente)
    window.addEventListener('storage', chequearSesion); 
    return () => window.removeEventListener('storage', chequearSesion);
  }, []);

  // Función para Cerrar Sesión
  const handleLogout = () => {
    localStorage.removeItem('usuarioLogueado'); // Borrar ticket
    setUsuario(null); // Limpiar estado
    alert("Has cerrado sesión");
    navigate('/');
  };

  // Estilos Base (Neo-Brutalismo)
  const btnStyle = {
    fontWeight: '800', 
    padding: '10px 20px', 
    border: '2px solid #222f3e',
    borderRadius: '6px', 
    fontSize: '0.9rem', 
    cursor: 'pointer',
    textTransform: 'uppercase', 
    marginLeft: '15px', 
    fontFamily: 'inherit',
    boxShadow: '3px 3px 0px 0px #222f3e'
  };

  return (
    <nav style={{
      padding: '20px 40px', 
      background: '#ffffff', 
      borderBottom: '4px solid #222f3e',
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      position: 'sticky', 
      top: 0, 
      zIndex: 100
    }}>
      
      {/* --- LOGO --- */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '24px', height: '24px', background: '#ff6b6b', border: '2px solid #222f3e', boxShadow: '3px 3px 0px 0px #222f3e' }}></div>
        <Link to="/" style={{ textDecoration: 'none' }}>
            <h2 style={{ margin: 0, textTransform: 'uppercase', fontSize: '1.5rem', color: '#222f3e', fontWeight: '900' }}>
            FastEmergency
            </h2>
        </Link>
      </div>
      
      {/* --- BOTONES Y MENÚ --- */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        
        {/* ENLACE AL VOLUNTARIADO (Visible para todos, validado por dentro) */}
        <Link to="/voluntariado" style={{ fontWeight: 'bold', marginRight: '10px', textDecoration: 'none', color: '#222f3e', textTransform: 'uppercase', borderBottom: '2px solid #feca57' }}>
            Zona Voluntarios
        </Link>
        
        {/* LOGICA CONDICIONAL: ¿ESTÁ LOGUEADO? */}
        {usuario ? (
          // --- SI ESTÁ LOGUEADO ---
          <>
            {/* SALUDO */}
            <span style={{ fontWeight: 'bold', marginLeft: '15px', color: '#059669', textTransform: 'uppercase' }}>
               HOLA, {usuario.nombre.split(' ')[0]}
            </span>

            {/* --- BOTÓN DE BUZÓN (NUEVO) --- */}
            <Link to="/buzon">
               <motion.button 
                 whileHover={{ translate: "0px -3px", boxShadow: "5px 5px 0px 0px #222f3e" }}
                 whileTap={{ translate: "2px 2px", boxShadow: "0px 0px 0px 0px #222f3e" }}
                 style={{ 
                    ...btnStyle, 
                    background: 'white', 
                    color: '#222f3e',
                    marginLeft: '10px',
                    padding: '8px 15px' 
                 }}
               >
                 📩 MENSAJES
               </motion.button>
            </Link>
            {/* ---------------------------- */}

            {/* BOTÓN ESPECIAL DE COORDINADOR (ADMIN) */}
            {usuario.rol === 'coordinador' && (
               <Link to="/gestion">
                  <motion.button 
                     whileHover={{ translate: "0px -3px", boxShadow: "5px 5px 0px 0px #222f3e" }}
                     whileTap={{ translate: "2px 2px", boxShadow: "0px 0px 0px 0px #222f3e" }}
                     style={{ 
                        ...btnStyle, 
                        background: '#222f3e', // Negro
                        color: '#feca57',      // Letras amarillas
                        borderColor: '#222f3e'
                     }}
                  >
                     ⚡ GESTIONAR
                  </motion.button>
               </Link>
            )}

            {/* --- NUEVO: BOTÓN PARA ENCARGADO DE ALBERGUE --- */}
            {usuario.rol === 'encargado_albergue' && (
               <Link to="/encargado">
                  <motion.button 
                     whileHover={{ translate: "0px -3px", boxShadow: "5px 5px 0px 0px #222f3e" }}
                     whileTap={{ translate: "2px 2px", boxShadow: "0px 0px 0px 0px #222f3e" }}
                     style={{ 
                        ...btnStyle, 
                        background: '#0284c7', // Azul
                        color: 'white',
                        borderColor: '#222f3e'
                     }}
                  >
                     📋 MI ALBERGUE
                  </motion.button>
               </Link>
            )}
            {/* ----------------------------------------------- */}

            {/* BOTÓN SALIR */}
            <motion.button 
              onClick={handleLogout}
              whileHover={{ translate: "0px -3px", boxShadow: "5px 5px 0px 0px #222f3e" }}
              whileTap={{ translate: "2px 2px", boxShadow: "0px 0px 0px 0px #222f3e" }}
              style={{ ...btnStyle, background: '#e5e7eb', color: '#222f3e' }}
            >
              Salir
            </motion.button>
          </>
        ) : (
          // --- NO ESTÁ LOGUEADO (Invitado) ---
          <>
            <Link to="/login">
               <motion.button 
                 whileHover={{ translate: "0px -3px", boxShadow: "5px 5px 0px 0px #222f3e" }}
                 whileTap={{ translate: "2px 2px", boxShadow: "0px 0px 0px 0px #222f3e" }}
                 style={{ ...btnStyle, background: 'white', color: '#222f3e' }}
               >
                 Ingresar
               </motion.button>
            </Link>

            <Link to="/registro">
               <motion.button 
                 whileHover={{ translate: "0px -3px", boxShadow: "5px 5px 0px 0px #222f3e" }}
                 whileTap={{ translate: "2px 2px", boxShadow: "0px 0px 0px 0px #222f3e" }}
                 style={{ ...btnStyle, background: '#feca57', color: 'black' }}
               >
                 Registrarse
               </motion.button>
            </Link>
          </>
        )}

      </div>
    </nav>
  );
}

export default Navbar;