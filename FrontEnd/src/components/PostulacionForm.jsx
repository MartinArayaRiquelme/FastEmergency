import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import AnimatedButton from './AnimatedButton';
import '../CalendarStyles.css'; 

function PostulacionForm() {
  // --- ESTADOS ---
  const [actividad, setActividad] = useState('');
  const [albergues, setAlbergues] = useState([]); 
  const [albergueElegido, setAlbergueElegido] = useState(''); 
  const [fecha, setFecha] = useState(new Date());
  const [turnosElegidos, setTurnosElegidos] = useState([]); 
  const [historialPrevio, setHistorialPrevio] = useState([]); 
  
  // NUEVO ESTADO PARA ARCHIVOS
  const [archivos, setArchivos] = useState(null);

  // --- ESTADOS PARA EL CARRUSEL ---
  const [paginaActual, setPaginaActual] = useState(0);
  const itemsPorPagina = 2; 

  const actividades = ["Remoción de Escombros", "Acopio y Logística", "Primeros Auxilios", "Cocina Solidaria"];
  const horarios = ["09:00 - 13:00 (Mañana)", "14:00 - 18:00 (Tarde)", "19:00 - 23:00 (Noche)"];

  // 1. CARGAR DATOS
  useEffect(() => {
    const inicializar = async () => {
      const usuarioData = JSON.parse(localStorage.getItem('usuarioLogueado'));
      
      try {
        const resAlb = await fetch('http://localhost:3000/api/albergues/estado');
        const dataAlb = await resAlb.json();
        setAlbergues(dataAlb);
      } catch (e) { console.error(e); }

      if (usuarioData && usuarioData._id) {
        try {
          const resHist = await fetch(`http://localhost:3000/api/postulaciones/${usuarioData._id}`);
          const dataHist = await resHist.json();
          setHistorialPrevio(dataHist); 
        } catch (e) { console.error(e); }
      }
    };
    inicializar();
  }, []);

  // --- LÓGICA DEL CARRUSEL ---
  const alberguesFiltrados = albergues.filter(alb => alb.actividad === actividad);
  const alberguesVisibles = alberguesFiltrados.slice(
      paginaActual * itemsPorPagina, 
      (paginaActual + 1) * itemsPorPagina
  );

  const siguientePagina = () => {
      if ((paginaActual + 1) * itemsPorPagina < alberguesFiltrados.length) {
          setPaginaActual(paginaActual + 1);
      }
  };

  const anteriorPagina = () => {
      if (paginaActual > 0) {
          setPaginaActual(paginaActual - 1);
      }
  };

  const seleccionarActividad = (act) => {
      setActividad(act);
      setAlbergueElegido('');
      setPaginaActual(0);
  };
  // ---------------------------

  // 2. AGREGAR TURNO
  const agregarTurno = (horario) => {
    if (!actividad) { alert("⚠️ 1. Selecciona una actividad."); return; }
    if (!albergueElegido) { alert("⚠️ 2. Selecciona tu albergue preferido."); return; }

    if (historialPrevio.some(t => t.estado === 'pendiente' || t.estado === 'en_revision_albergue')) {
        alert("⛔ Tienes una solicitud en proceso. Espera la respuesta final.");
        return;
    }

    const fechaFormateada = format(fecha, 'dd/MM/yyyy');
    
    if (turnosElegidos.some(t => t.fecha === fechaFormateada && t.horario === horario)) {
        alert("⚠️ Ya agregaste este turno.");
        return;
    }

    const nombreAlbergue = albergues.find(a => a._id === albergueElegido)?.nombre;

    const nuevoTurno = {
        id: Date.now(),
        actividad,
        albergueId: albergueElegido, 
        nombreAlbergue,
        fecha: fechaFormateada,
        horario
    };

    setTurnosElegidos([...turnosElegidos, nuevoTurno]);
  };

  const eliminarTurno = (id) => setTurnosElegidos(turnosElegidos.filter(t => t.id !== id));

  // 3. ENVIAR POSTULACIÓN CON ARCHIVOS (FORMDATA)
  const enviarPostulacion = async () => {
      if (turnosElegidos.length === 0) { alert("Selecciona turnos."); return; }

      const usuarioData = JSON.parse(localStorage.getItem('usuarioLogueado'));

      // --- CREACIÓN DEL PAQUETE FORMDATA ---
      const formData = new FormData();
      formData.append('usuarioId', usuarioData._id);

      // Convertimos el array de objetos a String JSON para enviarlo dentro del FormData
      const turnosParaEnviar = turnosElegidos.map(t => ({
          actividad: t.actividad,
          alberguePreferido: t.albergueId,
          fecha: t.fecha,
          horario: t.horario
      }));
      formData.append('turnos', JSON.stringify(turnosParaEnviar));

      // Adjuntamos los archivos uno por uno
      if (archivos) {
          for (let i = 0; i < archivos.length; i++) {
              formData.append('archivos', archivos[i]);
          }
      }
      // -------------------------------------

      try {
        const response = await fetch('http://localhost:3000/api/postulaciones', {
            method: 'POST',
            // NOTA: NO agregamos 'Content-Type': 'application/json'
            // El navegador detecta que es FormData y pone el 'multipart/form-data' solo.
            body: formData 
        });

        if (response.ok) {
            alert("✅ ¡Solicitud enviada! Se revisarán tus documentos.");
            setTurnosElegidos([]); 
            setArchivos(null);
            window.location.reload(); 
        } else {
            alert("❌ Error al guardar.");
        }
      } catch (error) { alert("Error de conexión"); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center' }}>
      
      {/* 1. ACTIVIDAD */}
      <div style={{ width: '100%', textAlign: 'center' }}>
        <h3 style={{ textTransform: 'uppercase', marginBottom: '15px' }}>1. ¿En qué quieres ayudar?</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {actividades.map(act => (
                <button
                    key={act}
                    onClick={() => seleccionarActividad(act)}
                    style={{
                        padding: '10px 15px', border: '3px solid #222f3e', fontWeight: 'bold', cursor: 'pointer',
                        background: actividad === act ? '#222f3e' : 'white',
                        color: actividad === act ? 'white' : '#222f3e',
                    }}
                >
                    {act}
                </button>
            ))}
        </div>
      </div>

      {/* 2. CARRUSEL DE ALBERGUES */}
      {actividad && (
          <div style={{ width: '100%', maxWidth: '700px', textAlign: 'center' }}>
            <h3 style={{ textTransform: 'uppercase', marginBottom: '15px' }}>2. Elige tu sede preferida</h3>
            
            {alberguesFiltrados.length === 0 ? (
                <p style={{fontStyle: 'italic'}}>No hay albergues registrados para esta actividad.</p>
            ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <button 
                        onClick={anteriorPagina} disabled={paginaActual === 0}
                        style={{ background: '#feca57', border: '2px solid #222f3e', fontWeight: '900', fontSize: '1.5rem', cursor: 'pointer', padding: '10px 15px', opacity: paginaActual === 0 ? 0.3 : 1 }}
                    > &lt; </button>

                    <div style={{ display: 'flex', gap: '15px', flex: 1, justifyContent: 'center' }}>
                        {alberguesVisibles.map(alb => {
                            const estaLleno = alb.disponibles === 0;
                            return (
                                <div 
                                    key={alb._id}
                                    onClick={() => !estaLleno && setAlbergueElegido(alb._id)} 
                                    style={{
                                        flex: 1, maxWidth: '250px',
                                        border: albergueElegido === alb._id ? '4px solid #059669' : '3px solid #222f3e',
                                        background: estaLleno ? '#f3f4f6' : (albergueElegido === alb._id ? '#d1fae5' : 'white'),
                                        padding: '15px', borderRadius: '8px', 
                                        cursor: estaLleno ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.2s',
                                        opacity: estaLleno ? 0.6 : 1
                                    }}
                                >
                                    <h4 style={{margin: '0 0 5px 0'}}>{alb.nombre}</h4>
                                    <small style={{display: 'block', marginBottom: '10px'}}>{alb.ubicacion}</small>
                                    {estaLleno ? <div style={{background: '#dc2626', color: 'white', fontWeight: 'bold', padding: '5px', fontSize: '0.8rem'}}>⛔ LLENO</div> : <div style={{color: '#059669', fontWeight: 'bold', fontSize: '0.9rem'}}>✅ {alb.disponibles} Libres</div>}
                                </div>
                            );
                        })}
                    </div>

                    <button 
                        onClick={siguientePagina} disabled={(paginaActual + 1) * itemsPorPagina >= alberguesFiltrados.length}
                        style={{ background: '#feca57', border: '2px solid #222f3e', fontWeight: '900', fontSize: '1.5rem', cursor: 'pointer', padding: '10px 15px', opacity: (paginaActual + 1) * itemsPorPagina >= alberguesFiltrados.length ? 0.3 : 1 }}
                    > &gt; </button>
                </div>
            )}
          </div>
      )}

      {/* 3. SUBIDA DE DOCUMENTOS (NUEVO) */}
      <div style={{ width: '100%', maxWidth: '600px', textAlign: 'center', border: '2px dashed #222f3e', padding: '20px', background: '#f8fafc' }}>
         <h3 style={{ textTransform: 'uppercase', margin: 0 }}>📂 Subir Certificados</h3>
         <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '15px'}}>Sube aquí tu certificado de antecedentes, primeros auxilios o licencia de conducir.</p>
         <input 
            type="file" 
            multiple 
            onChange={(e) => setArchivos(e.target.files)}
            style={{ 
                padding: '10px', 
                border: '2px solid #222f3e', 
                width: '100%', 
                background: 'white',
                cursor: 'pointer'
            }}
         />
      </div>

      {/* 4. CALENDARIO Y TURNOS */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', justifyContent: 'center', width: '100%' }}>
          <div style={{ flex: '1', minWidth: '300px', maxWidth: '400px' }}>
             <Calendar onChange={setFecha} value={fecha} locale="es-ES" minDate={new Date()} />
          </div>

          <div style={{ flex: '1', minWidth: '300px', maxWidth: '400px' }}>
            <h3 style={{ textTransform: 'uppercase', textAlign: 'center' }}>Selecciona Turno</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {horarios.map(hora => (
                    <AnimatedButton 
                        key={hora} 
                        onClick={() => agregarTurno(hora)}
                        style={{ background: '#feca57', color: 'black', width: '100%' }}
                    >
                        AGREGAR: {hora}
                    </AnimatedButton>
                ))}
            </div>

            <div style={{ marginTop: '20px', padding: '15px', border: '2px dashed #222f3e', background: '#f8fafc' }}>
                <strong>Tus Postulaciones:</strong>
                <ul style={{ paddingLeft: '20px' }}>
                    {turnosElegidos.map(t => (
                        <li key={t.id}>
                            {t.fecha} - {t.horario.split('(')[0]} <br/>
                            <span style={{color: '#059669', fontSize: '0.9rem'}}>📍 {t.nombreAlbergue}</span> 
                            <button onClick={() => eliminarTurno(t.id)} style={{marginLeft: '10px', border: 'none', background: 'transparent', cursor: 'pointer'}}>🗑️</button>
                        </li>
                    ))}
                </ul>
            </div>
          </div>
      </div>

      {/* BOTÓN FINAL */}
      <div style={{ width: '100%', marginTop: '20px' }}>
         <AnimatedButton onClick={enviarPostulacion} style={{ width: '100%', background: '#ff6b6b' }}>
             ENVIAR SOLICITUD
         </AnimatedButton>
      </div>
    </div>
  );
}

export default PostulacionForm;