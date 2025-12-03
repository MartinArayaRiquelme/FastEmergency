import { useEffect, useState } from 'react';
import PageTransition from './PageTransition';
import AnimatedButton from './AnimatedButton';
import { useNavigate } from 'react-router-dom';

function Buzon() {
  const [mensajes, setMensajes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarMensajes = async () => {
      const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
      if (!usuario) { navigate('/'); return; }

      try {
        const response = await fetch(`http://localhost:3000/api/postulaciones/${usuario._id}`);
        const data = await response.json();

        // FILTRO: Mostramos lo que ya no está en proceso (ni pendiente ni en revisión)
        // O sea: confirmada, rechazada u observada
        const respuestas = data.filter(p => 
            p.estado !== 'pendiente' && p.estado !== 'en_revision_albergue'
        );
        setMensajes(respuestas);
      } catch (error) {
        console.error(error);
      }
    };
    cargarMensajes();
  }, [navigate]);

  return (
    <PageTransition>
      <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
        
        <h1 style={{ textAlign: 'center', textTransform: 'uppercase', marginBottom: '40px' }}>
            📬 Tu Buzón de Mensajes
        </h1>

        {mensajes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', border: '3px dashed #222f3e', borderRadius: '10px', background: '#f8fafc' }}>
                <h3>📭 Nada por aquí...</h3>
                <p>Aún no has recibido la respuesta final a tus postulaciones.</p>
                <AnimatedButton onClick={() => navigate('/voluntariado')} style={{marginTop: '20px'}}>
                    Ir a Postular
                </AnimatedButton>
            </div>
        ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {mensajes.map(msg => {
                    // AQUÍ ESTABA EL ERROR: Ahora validamos con 'confirmada'
                    const esExito = msg.estado === 'confirmada';

                    return (
                        <div key={msg._id} style={{
                            border: '3px solid #222f3e',
                            borderRadius: '10px',
                            padding: '20px',
                            // Verde si es confirmada, Rojo si no
                            background: esExito ? '#ecfdf5' : '#fef2f2',
                            boxShadow: '8px 8px 0px 0px #222f3e',
                            position: 'relative'
                        }}>
                            {/* ETIQUETA SUPERIOR */}
                            <div style={{
                                position: 'absolute', top: '-15px', right: '20px',
                                background: esExito ? '#059669' : '#dc2626',
                                color: 'white', padding: '5px 15px', border: '2px solid #222f3e',
                                fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem'
                            }}>
                                {esExito ? '¡ACEPTADO EN ALBERGUE!' : 'SOLICITUD RECHAZADA'}
                            </div>

                            <h3 style={{ margin: '0 0 10px 0', textTransform: 'uppercase' }}>
                                {msg.actividad}
                            </h3>
                            
                            <p style={{ fontSize: '1.1rem', margin: '10px 0' }}>
                                📅 <strong>Fecha:</strong> {msg.fecha} ({msg.horario})
                            </p>

                            {esExito ? (
                                <div style={{ background: 'white', padding: '15px', border: '2px solid #059669', borderRadius: '8px' }}>
                                    <p style={{ margin: 0, color: '#059669', fontWeight: 'bold' }}>
                                        ✅ ¡Felicidades! El encargado del albergue te espera en:
                                    </p>
                                    <p style={{ fontSize: '1.2rem', margin: '5px 0', fontWeight: '900', textTransform: 'uppercase' }}>
                                        📍 {msg.albergueAsignado?.nombre || "Lugar por definir"}
                                    </p>
                                    <small>{msg.albergueAsignado?.ubicacion}</small>
                                </div>
                            ) : (
                                <div style={{ background: 'white', padding: '15px', border: '2px solid #dc2626', borderRadius: '8px' }}>
                                    <p style={{ margin: 0, color: '#dc2626', fontWeight: 'bold' }}>
                                        Lo sentimos.
                                    </p>
                                    <p>Tu solicitud no pudo ser confirmada en la etapa final. Te invitamos a intentar en otra fecha.</p>
                                </div>
                            )}

                        </div>
                    );
                })}
            </div>
        )}

      </div>
    </PageTransition>
  );
}

export default Buzon;