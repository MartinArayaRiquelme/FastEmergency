import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from './PageTransition';
import PostulacionForm from './PostulacionForm'; // <--- Importamos el componente del calendario

function Voluntariado() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  // --- EL PORTERO (Validación de Seguridad) ---
  useEffect(() => {
    // 1. Buscamos si existe el ticket en el navegador
    const usuarioGuardado = localStorage.getItem('usuarioLogueado');

    if (!usuarioGuardado) {
      // 2. SI NO EXISTE: Alerta y patada al Login
      alert("🔒 ACCESO DENEGADO: Debes iniciar sesión para postularte.");
      navigate('/login');
    } else {
      // 3. SI EXISTE: Guardamos los datos para usarlos
      setUsuario(JSON.parse(usuarioGuardado));
    }
  }, [navigate]);

  // Si aún no carga el usuario, no mostramos nada
  if (!usuario) return null;

  return (
    <PageTransition>
      <div style={{ padding: '40px 20px', minHeight: '100vh' }}>
        
        {/* CABECERA DE LA PÁGINA */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ textTransform: 'uppercase', fontSize: '3rem', marginBottom: '20px' }}>
                Zona de Postulación
            </h1>
            
            {/* Tarjeta de saludo */}
            <div style={{ 
                background: '#d1fae5', // Verde suave
                border: '3px solid #222f3e', 
                padding: '15px 30px', 
                display: 'inline-block',
                boxShadow: '6px 6px 0px 0px #222f3e',
                borderRadius: '8px'
            }}>
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0, color: '#222f3e' }}>
                    👋 Hola, <span style={{ color: '#059669', textDecoration: 'underline' }}>{usuario.nombre}</span>. 
                    <br/>Selecciona tus turnos con total libertad.
                </p>
            </div>
        </div>

        {/* AQUÍ INSERTAMOS EL FORMULARIO DEL CALENDARIO */}
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <PostulacionForm />
        </div>

      </div>
    </PageTransition>
  );
}

export default Voluntariado;