import { useNavigate } from 'react-router-dom'; // <--- Importamos el gancho para navegar
import PageTransition from './PageTransition';
import AnimatedButton from './AnimatedButton';

function Home() {
  const navigate = useNavigate();

  // Función inteligente para el botón
  const handleUnirse = () => {
    // Revisamos si existe la "tarjeta de acceso" en el navegador
    const usuarioLogueado = localStorage.getItem('usuarioLogueado');

    if (usuarioLogueado) {
      // SI YA ESTÁ DENTRO: Directo a la zona de trabajo
      navigate('/voluntariado');
    } else {
      // SI ES NUEVO: A crear cuenta
      navigate('/registro');
    }
  };

  return (
    <PageTransition>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '80vh',
        textAlign: 'center',
        padding: '20px'
      }}>
        {/* Etiqueta decorativa */}
        <span style={{ 
            background: '#feca57', 
            padding: '5px 15px', 
            border: '2px solid #222f3e', 
            fontWeight: 'bold', 
            marginBottom: '20px',
            boxShadow: '3px 3px 0px 0px #222f3e'
        }}>
            BETA v1.0
        </span>

        <h1 style={{ 
            fontSize: '3.5rem', 
            marginBottom: '20px', 
            lineHeight: '1.1',
            textTransform: 'uppercase'
        }}>
          Gestión de Crisis <br/>
          <span style={{ color: '#ff6b6b', textDecoration: 'underline', textDecorationThickness: '4px' }}>Sin Esperas</span>
        </h1>
        
        <p style={{ maxWidth: '600px', fontSize: '1.2rem', fontWeight: '500', marginBottom: '40px' }}>
          Plataforma centralizada para coordinación de voluntarios y alertas en tiempo real.
        </p>

        <div style={{ display: 'flex', gap: '20px' }}>
            {/* EL CAMBIO ESTÁ AQUÍ: Quitamos el <Link> y usamos onClick */}
            <AnimatedButton onClick={handleUnirse}>
                ¡QUIERO AYUDAR!
            </AnimatedButton>
        </div>
      </div>
    </PageTransition>
  );
}

export default Home;