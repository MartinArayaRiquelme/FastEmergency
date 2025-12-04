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
    
    // VALIDACIÓN ESTRICTA: El usuario debe tener un albergueId
    if (usuario && usuario.rol === 'encargado_albergue' && usuario.albergueId) {
        setMiAlbergueId(usuario.albergueId);
        cargarSolicitudes(usuario.albergueId);
    } else {
        // Si entra un admin o alguien sin albergue, lo sacamos
        alert("⛔ ERROR DE CONFIGURACIÓN: Tu usuario no tiene un albergue asignado.");
        navigate('/');
    }
  }, [navigate]);

  const cargarSolicitudes = async (idAlb) => {
      try {
        // 👇 1. AGREGAMOS EL PASE VIP AQUÍ
        const res = await fetch(`https://leila-unpaced-exaltedly.ngrok-free.dev/api/postulaciones/albergue/${idAlb}`, {
            headers: {
                "ngrok-skip-browser-warning": "true"
            }
        });
        const data = await res.json();
        setSolicitudes(data);
      } catch (error) { console.error("Error cargando bandeja:", error); }
  };

  const procesar = async (id, accion) => {
      if(!confirm(`¿Estás seguro de ${accion === 'confirmar' ? 'ACEPTAR' : 'RECHAZAR'} a este voluntario?`)) return;
      
      try {
        // 👇 2. Y AQUÍ TAMBIÉN (Por si acaso)
        const res = await fetch(`https://leila-unpaced-exaltedly.ngrok-free.dev/api/postulaciones/confirmacion-final/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "ngrok-skip-browser-warning": "true"
            },
            body: JSON.stringify({ accion })
        });

        if (res.ok) {
            alert(`✅ Voluntario ${accion === 'confirmar' ? 'ACEPTADO' : 'RECHAZADO'} exitosamente.`);
            cargarSolicitudes(miAlbergueId); // Recargar la lista
        } else {
            alert("❌ Error al procesar la solicitud.");
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
                <div style={{ textAlign: 'center', padding: '40px', border: '3px dashed #222f3e', borderRadius: '10px', background: '#f8fafc' }}>
                    <h3>✅ Bandeja limpia en tu albergue.</h3>
                    <p>No tienes voluntarios pendientes de revisión documental.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {solicitudes.map(soli => (
                        <div key={soli._id} style={{ border: '3px solid #222f3e', padding: '20px', borderRadius: '10px', background: 'white', boxShadow: '5px 5px 0px #222f3e' }}>
                            <h2 style={{marginTop: 0, textTransform: 'uppercase'}}>{soli.usuarioId?.nombre || "Voluntario"}</h2>
                            <p><strong>Actividad:</strong> {soli.actividad}</p>
                            <p><strong>Horario:</strong> {soli.fecha} - {soli.horario}</p>
                            
                            {/* DOCUMENTOS */}
                            <div style={{ background: '#f0f9ff', padding: '15px', margin: '15px 0', borderRadius: '5px', border: '1px solid #bae6fd' }}>
                                <strong style={{display: 'block', marginBottom: '5px'}}>📂 Documentos para revisar:</strong>
                                {soli.documentos && soli.documentos.length > 0 ? (
                                    soli.documentos.map((doc, i) => (
                                        <a key={i} 
                                           href={`https://leila-unpaced-exaltedly.ngrok-free.dev/uploads/${doc}`} 
                                           target="_blank" 
                                           rel="noreferrer"
                                           // 👇 Header especial para descargar archivos (a veces necesario)
                                           style={{display: 'block', color: '#0284c7', textDecoration: 'underline', margin: '5px 0', fontWeight: 'bold'}}>
                                            📄 Ver Documento {i+1}
                                        </a>
                                    ))
                                ) : (
                                    <span style={{color: '#999'}}>No se adjuntaron documentos.</span>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <AnimatedButton onClick={() => procesar(soli._id, 'confirmar')} style={{ background: '#059669', flex: 1 }}>
                                    ✅ ACEPTAR VOLUNTARIO
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