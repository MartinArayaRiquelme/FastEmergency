import { useState } from 'react';
import PageTransition from './PageTransition';
import AnimatedButton from './AnimatedButton'; // Reutilizamos tu botón genial

function Registro() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'usuario'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- VALIDACIÓN NUEVA ---
    // Convertimos a minúsculas para evitar errores si escriben @GMAIL.COM
    if (!formData.email.toLowerCase().endsWith('@gmail.com')) {
        alert('⚠️ SOLO ACEPTAMOS CORREOS GMAIL');
        return; // Detenemos la función aquí, no se envía nada al servidor
    }
    // ------------------------

    try {
      const response = await fetch('http://localhost:3000/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('✅ ¡BIENVENIDO AL EQUIPO!');
        // Opcional: Limpiar el formulario aquí
      } else {
        alert('❌ ERROR: Ese correo ya está registrado o hay un problema');
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión con el servidor');
    }
};

  // Estilos para los Inputs (Campos de texto)
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
    border: '3px solid #222f3e', // Borde grueso negro
    borderRadius: '8px',
    backgroundColor: '#f1f2f6',   // Gris muy clarito para que resalte del fondo blanco
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#222f3e',
    outline: 'none',
    boxShadow: 'inset 4px 4px 0px rgba(0,0,0,0.1)' // Sombra interna para dar profundidad
  };

  return (
    <PageTransition>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '90vh', // Centrado verticalmente
        padding: '20px' 
      }}>
        
        {/* LA TARJETA DEL FORMULARIO */}
        <div style={{
          width: '100%',
          maxWidth: '500px',
          backgroundColor: '#ffffff',
          border: '4px solid #222f3e', // Borde extra grueso
          borderRadius: '15px',
          padding: '40px',
          // Sombra dura desplazada (La firma del estilo brutalista)
          boxShadow: '10px 10px 0px 0px #222f3e', 
          position: 'relative'
        }}>
          
          {/* Elemento decorativo: "Chincheta" o cinta arriba */}
          <div style={{
            position: 'absolute',
            top: '-15px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#feca57', // Amarillo
            padding: '5px 20px',
            border: '3px solid #222f3e',
            fontWeight: 'bold',
            boxShadow: '3px 3px 0px 0px #222f3e'
          }}>
            NUEVO USUARIO
          </div>

          <h2 style={{ 
            textAlign: 'center', 
            fontSize: '2.5rem', 
            textTransform: 'uppercase', 
            margin: '20px 0 30px 0',
            lineHeight: '1'
          }}>
            Únete a la <br/> 
            <span style={{ color: '#ff6b6b', textDecoration: 'underline', textDecorationThickness: '5px' }}>Misión</span>
          </h2>

          <form onSubmit={handleSubmit}>
            <div>
                <label style={labelStyle}>Nombre Completo</label>
                <input 
                  name="nombre" 
                  placeholder="EJ: PEDRO PASCAL" 
                  onChange={handleChange} 
                  required 
                  style={inputStyle}
                />
            </div>
            
            <div>
                <label style={labelStyle}>Correo Electrónico</label>
                <input 
                  name="email" 
                  type="email" 
                  placeholder="usuario@ejemplo.com" 
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
                {/* Botón ancho completo */}
                <AnimatedButton 
                    type="submit" 
                    style={{ width: '100%', backgroundColor: '#ff6b6b' }}
                >
                    ¡CREAR CUENTA AHORA!
                </AnimatedButton>
            </div>
          </form>

        </div>
      </div>
    </PageTransition>
  );
}

export default Registro;