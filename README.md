============================================================
   🚑 FAST EMERGENCY - SISTEMA DE GESTIÓN DE VOLUNTARIADO
============================================================

Este proyecto contiene todo el código fuente, dependencias y 
configuraciones listas para ejecutar.

NOTAS IMPORTANTES:
1. Se incluyen las carpetas 'node_modules' para facilitar la ejecución.
2. Se incluye el archivo '.env' con las credenciales de base de datos.
3. Requiere tener MongoDB corriendo localmente.

------------------------------------------------------------
   INSTRUCCIONES DE INICIO RÁPIDO
------------------------------------------------------------

PASO 1: ENCENDER EL BACKEND (Servidor)
1. Abra una terminal en la carpeta "BackEnd".
2. Ejecute el siguiente comando:
   npm run dev
   
   (Si falla, intente con: node index.js)
   * Debería ver el mensaje: "Servidor backend corriendo en el puerto 3000"

PASO 2: ENCENDER EL FRONTEND (Página Web)
1. Abra otra terminal nueva en la carpeta "FrontEnd".
2. Ejecute el siguiente comando:
   npm run dev
3. Abra el link que aparece (ej: http://localhost:5173) en su navegador.

------------------------------------------------------------
   PASO 3: CARGAR DATOS DE PRUEBA (SEEDS)
------------------------------------------------------------
Si la base de datos está vacía, ejecute estas peticiones POST para 
crear los albergues y usuarios necesarios (en este orden):

1. Crear Albergues:
   [POST] http://localhost:3000/api/albergues/seed

2. Crear Usuarios:
   [POST] http://localhost:3000/api/usuarios/seed

------------------------------------------------------------
   SOLUCIÓN DE PROBLEMAS
------------------------------------------------------------
Si al ejecutar 'npm run dev' aparecen errores extraños (debido a que
se descargó en un sistema operativo diferente):

1. Borre la carpeta 'node_modules' dentro de BackEnd y FrontEnd.
2. Ejecute 'npm install' en ambas carpetas.
3. Vuelva a intentar 'npm run dev'.

============================================================
Autor: [Tu Nombre Aquí]
============================================================
