import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from './PageTransition';
import AnimatedButton from './AnimatedButton';

function GestionSolicitudes() {
  const navigate = useNavigate();
  const [solicitudes, setSolicitudes] = useState([]);
  const [albergues, setAlbergues] = useState([]);
  
  // Estado para saber qué albergue seleccionó el coordinador en cada solicitud
  // Formato: { "id_solicitud_1": "id_albergue_A", "id_solicitud_2": "id_albergue_B" }
  const [destinosSeleccionados, setDestinosSeleccionados] = useState({});

  const cargarDatos = async () => {
    try {
      const resSoli = await fetch('http://localhost:3000/api/postulaciones/admin/pendientes');
      const dataSoli = await resSoli.json();
      setSolicitudes(dataSoli);

      const resAlb = await fetch('http://localhost:3000/api/albergues/estado');
      const dataAlb = await resAlb.json();
      setAlbergues(dataAlb);
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
    if (!usuario || usuario.rol !== 'coordinador') { navigate('/'); return; }
    cargarDatos();
  }, [navigate]);

  // Manejar el cambio del select (dropdown)
  const handleCambioDestino = (solicitudId, albergueId) => {
    setDestinosSeleccionados({ ...destinosSeleccionados, [solicitudId]: albergueId });
  };

const aprobar = async (soli) => {
    const destinoFinal = destinosSeleccionados[soli._id] || soli.alberguePreferido?._id;

    if (!destinoFinal) {
        alert("⚠️ ERROR: Selecciona un albergue de destino.");
        return;
    }

    if (!confirm("¿Confirmar asignación a este albergue?")) return;

    try {
        const response = await fetch(`http://localhost:3000/api/postulaciones/${soli._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                estado: 'aprobado',
                albergueAsignadoId: destinoFinal 
            })
        });
        
        // Leemos la respuesta con cuidado
        const data = await response.json();

        if(response.ok) {
            alert("✅ Asignación exitosa (Correo enviado).");
            cargarDatos();
        } else {
            // AQUÍ ESTABA EL DETALLE: Ahora leemos 'msg' O 'error'
            alert("❌ ERROR DEL SERVIDOR:\n" + (data.msg || data.error || "Error desconocido"));
        }
    } catch (error) { 
        console.error(error);
        alert("Error de conexión: Revisa si el Backend se cayó (mira la terminal)."); 
    }
  };

  const rechazar = async (id) => {
      if(!confirm("¿Rechazar solicitud?")) return;
      await fetch(`http://localhost:3000/api/postulaciones/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ estado: 'rechazado' })
      });
      cargarDatos();
  };

  return (
    <PageTransition>
      <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>PANEL DE COORDINACIÓN 🛡️</h1>

        {/* MONITOR DE CUPOS */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '40px' }}>
            {albergues.map(alb => (
                <div key={alb._id} style={{
                    flex: '1', minWidth: '200px', padding: '15px', border: '3px solid #222f3e', borderRadius: '8px',
                    background: alb.disponibles === 0 ? '#fee2e2' : '#d1fae5'
                }}>
                    <strong>{alb.nombre}</strong><br/>
                    <small>{alb.disponibles} Libres / {alb.capacidadMaxima} Total</small>
                </div>
            ))}
        </div>

        {/* LISTA DE SOLICITUDES */}
        <h3>📩 Pendientes ({solicitudes.length})</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {solicitudes.map(soli => {
                // Filtramos albergues que tengan la misma actividad para el dropdown
                const opcionesAlbergue = albergues.sort((a, b) => a.actividad.localeCompare(b.actividad));

                return (
                    <div key={soli._id} style={{ border: '2px solid #222f3e', borderRadius: '8px', padding: '20px', background: 'white' }}>
                        
                        <div style={{ marginBottom: '15px' }}>
                            <h4 style={{ margin: 0, textTransform: 'uppercase' }}>{soli.usuarioId?.nombre}</h4>
                            <p style={{ margin: '5px 0' }}>Actividad: <strong>{soli.actividad}</strong> | Fecha: {soli.fecha} ({soli.horario})</p>
                            
                            <div style={{ background: '#f3f4f6', padding: '10px', borderRadius: '5px', marginTop: '10px', borderLeft: '4px solid #feca57' }}>
                                Preferencia del usuario: <br/>
                                <strong>📍 {soli.alberguePreferido?.nombre || "Sin preferencia"}</strong> 
                                <span style={{fontSize: '0.8rem', color: '#6b7280'}}> ({soli.alberguePreferido?.ubicacion})</span>
                            </div>
                        </div>

                        {/* ZONA DE DECISIÓN */}
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', background: '#e5e7eb', padding: '10px', borderRadius: '8px' }}>
                            <span style={{fontWeight: 'bold'}}>Asignar a:</span>
                            
                            {/* DROPDOWN PARA CAMBIAR DESTINO */}
                            <select 
                                style={{ padding: '8px', borderRadius: '4px', flex: 1 }}
                                onChange={(e) => handleCambioDestino(soli._id, e.target.value)}
                                defaultValue={soli.alberguePreferido?._id}
                            >
                                {opcionesAlbergue.map(op => (
                                    <option key={op._id} value={op._id}>
                                        {op.nombre} (Cupos: {op.disponibles})
                                    </option>
                                ))}
                            </select>

                            <AnimatedButton onClick={() => aprobar(soli)} style={{ background: '#059669', fontSize: '0.8rem' }}>
                                ✅ CONFIRMAR
                            </AnimatedButton>
                            
                            <AnimatedButton onClick={() => rechazar(soli._id)} style={{ background: 'transparent', color: '#dc2626', border: '2px solid #dc2626', fontSize: '0.8rem' }}>
                                RECHAZAR
                            </AnimatedButton>
                        </div>
                    </div>
                )
            })}
        </div>

      </div>
    </PageTransition>
  );
}

export default GestionSolicitudes;