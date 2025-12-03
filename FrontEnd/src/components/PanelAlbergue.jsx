import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedButton from './AnimatedButton';
import PageTransition from './PageTransition';

function PanelAlbergue() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [miAlbergueId, setMiAlbergueId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
    
    // VALIDACIÓN ESTRICTA: Romina debe tener un albergueId
    if (usuario && usuario.rol === 'encargado_albergue' && usuario.albergueId) {
        setMiAlbergueId(usuario.albergueId);
        cargarSolicitudes(usuario.albergueId);
    } else {
        alert("⛔ ERROR DE CONFIGURACIÓN: Tu usuario no tiene un albergue asignado. Contacta al soporte.");
        navigate('/');
    }
  }, [navigate]);

  const cargarSolicitudes = async (idAlb) => {
      try {
        // Petición específica al albergue de Romina
        const res = await fetch(`http://localhost:3000/api/postulaciones/albergue/${idAlb}`);
        const data = await res.json();
        setSolicitudes(data);
      } catch (error) { console.error(error); }
  };

  const procesar = async (id, accion) => {
      if(!confirm(`¿Estás seguro?`)) return;
      
      try {
        const res = await fetch(`http://localhost:3000/api/postulaciones/confirmacion-final/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ accion })
        });

        if (res.ok) {
            alert("✅ Listo. Voluntario notificado.");
            cargarSolicitudes(miAlbergueId);
        } else {
            alert("❌ Error.");
        }
      } catch (error) { alert("Error de conexión"); }
  };

  return (
    <PageTransition>
        <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', textTransform: 'uppercase', marginBottom: '30px' }}>
                📋 Revisión en Terreno
            </h1>

            {solicitudes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', border: '3px dashed #222f3e', borderRadius: '10px' }}>
                    <h3>✅ Bandeja limpia en tu albergue.</h3>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {solicitudes.map(soli => (
                        <div key={soli._id} style={{ border: '3px solid #222f3e', padding: '20px', borderRadius: '10px', background: 'white' }}>
                            <h2>{soli.usuarioId?.nombre}</h2>
                            <p><strong>Actividad:</strong> {soli.actividad}</p>
                            
                            {/* DOCUMENTOS */}
                            <div style={{ background: '#f0f9ff', padding: '10px', margin: '15px 0' }}>
                                <strong>📂 Archivos:</strong>
                                {soli.documentos.map((doc, i) => (
                                    <a key={i} href={`http://localhost:3000/uploads/${doc}`} target="_blank" style={{display: 'block', color: '#0284c7'}}>
                                        Ver Documento {i+1}
                                    </a>
                                ))}
                            </div>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <AnimatedButton onClick={() => procesar(soli._id, 'confirmar')} style={{ background: '#059669', flex: 1 }}>
                                    ✅ ACEPTAR
                                </AnimatedButton>
                                <AnimatedButton onClick={() => procesar(soli._id, 'rechazar')} style={{ background: 'transparent', color: '#dc2626', border: '3px solid #dc2626', flex: 1 }}>
                                    ❌ RECHAZAR
                                </AnimatedButton>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </PageTransition>
  );
}

export default PanelAlbergue;