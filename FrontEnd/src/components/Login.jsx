import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate sirve para redirigir
import PageTransition from './PageTransition';
import AnimatedButton from './AnimatedButton';

function Login() {
  const navigate = useNavigate(); // Hook para movernos de página
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Enviamos los datos al Backend para verificar
      const response = await fetch('http://localhost:3000/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // --- AQUÍ ESTÁ LA MAGIA DEL TICKET ---
        
        // A. Guardamos al usuario en la "cajita" del navegador
        localStorage.setItem('usuarioLogueado', JSON.stringify(data.usuario));
        
        // B. Lanzamos un evento para que el NavBar se entere inmediatamente que entramos
        window.dispatchEvent(new Event("storage"));

        // C. Saludamos y redirigimos
        alert(`👋 ¡Hola de nuevo, ${data.usuario.nombre}!`);
        navigate('/'); 
        
        // -------------------------------------
      } else {
        alert('❌ Error: ' + data.msg);
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión. Revisa si tu servidor (backend) está corriendo.');
    }
  };

  // --- ESTILOS NEO-BRUTALISTAS ---
  const labelStyle = { 
    display: 'block', 
    fontWeight: '800', 
    marginBottom: '5px', 
    textTransform: 'uppercase', 
    fontSize: '0.9rem',
    letterSpacing: '1px'
  };

  const inputStyle = { 
    width: '100%', 
    padding: '15px', 
    marginBottom: '20px', 
    border: '3px solid #222f3e', 
    borderRadius: '8px', 
    backgroundColor: '#f1f2f6', 
    fontSize: '1rem', 
    fontWeight: 'bold', 
    color: '#222f3e', 
    outline: 'none', 
    boxShadow: 'inset 4px 4px 0px rgba(0,0,0,0.1)' // Sombra interna
  };

  return (
    <PageTransition>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh', 
        padding: '20px' 
      }}>
        
        <div style={{
          width: '100%', 
          maxWidth: '450px', 
          backgroundColor: '#ffffff',
          border: '4px solid #222f3e', 
          borderRadius: '15px', 
          padding: '40px',
          boxShadow: '10px 10px 0px 0px #222f3e', // Sombra dura externa
          position: 'relative'
        }}>
          
          {/* Etiqueta decorativa arriba */}
          <div style={{
            position: 'absolute', 
            top: '-15px', 
            left: '50%', 
            transform: 'translateX(-50%)',
            background: '#ff6b6b', 
            padding: '5px 20px', 
            border: '3px solid #222f3e', 
            fontWeight: 'bold', 
            boxShadow: '3px 3px 0px 0px #222f3e', 
            color: 'white'
          }}>
            ACCESO VOLUNTARIOS
          </div>

          <h2 style={{ 
            textAlign: 'center', 
            fontSize: '2rem', 
            textTransform: 'uppercase', 
            margin: '20px 0 30px 0', 
            lineHeight: '1' 
          }}>
            Identifícate <br/> 
            <span style={{ color: '#feca57', textDecoration: 'underline', textDecorationThickness: '5px' }}>Ahora</span>
          </h2>

          <form onSubmit={handleSubmit}>
            <div>
                <label style={labelStyle}>Correo Electrónico</label>
                <input 
                  name="email" 
                  type="email" 
                  placeholder="tu@email.com" 
                  onChange={handleChange} 
                  required 
                  style={inputStyle} 
                />
            </div>
            
            <div>
                <label style={labelStyle}>Contraseña</label>
                <input 
                  name="password" 
                  type="password" 
                  placeholder="••••••••" 
                  onChange={handleChange} 
                  required 
                  style={inputStyle} 
                />
            </div>

            <div style={{ marginTop: '10px' }}>
                <AnimatedButton 
                    type="submit" 
                    style={{ width: '100%', backgroundColor: '#222f3e', color: 'white' }}
                >
                    ENTRAR AL SISTEMA
                </AnimatedButton>
            </div>
          </form>
          
          <p style={{textAlign: 'center', marginTop: '20px', fontWeight: 'bold'}}>
            ¿No tienes cuenta? <Link to="/registro" style={{color: '#ff6b6b', textDecoration: 'underline'}}>Regístrate aquí</Link>
          </p>

        </div>
      </div>
    </PageTransition>
  );
}

export default Login;