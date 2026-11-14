# Chronosense Experience — prototipo interactivo

Demostrador web estático para GitHub Pages. Presenta una posible experiencia integrada de memoria personal, coordinación familiar, legado y protección conectada.

## Publicación

1. Conserva una copia de seguridad del repositorio antes de sustituir archivos.
2. Los archivos de la aplicación están en la raíz: `index.html`, `styles.css`, `script.js` y `README.md`.
3. Conserva la ruta `assets/chronosense-logo.png`.
4. GitHub Pages debe estar configurado en la rama `main` y `/ (root)`.

## Funciones demostrativas

- Navegación entre el resumen y los cinco módulos.
- Añadir recuerdos, mensajes de legado y perfiles familiares.
- Filtrar recuerdos por tipo y mostrar recuentos calculados a partir de los datos guardados.
- Relacionar ilustrativamente un contexto de N.O.A. con recuerdos locales mediante palabras clave. No es IA.
- Simular respuestas de Smart Safety Band y N.O.A.
- Guardar los datos de demostración en `localStorage` del navegador.
- Exportar los datos locales a un archivo JSON y restablecer los datos de ejemplo.

## Limitaciones y privacidad

- No hay backend, cuentas, autenticación, sincronización ni almacenamiento cloud real.
- Los datos añadidos permanecen únicamente en el navegador y no se comparten con familiares.
- La exportación JSON se descarga en el dispositivo; no es una copia de seguridad remota.
- No se guardan fotografías, audio ni vídeo. Los tipos de recuerdo son etiquetas descriptivas.
- Las funciones GPS, SOS y N.O.A. son simulaciones; no se conecta a dispositivos ni servicios de emergencia.
- Family Cloud muestra roles de ejemplo, pero no aplica permisos técnicos reales.
- No es un producto sanitario, diagnóstico ni servicio de cuidados.
- No introduzcas datos personales, fotografías, grabaciones ni información médica real.

## Tecnología

HTML, CSS y JavaScript sin frameworks ni dependencias de compilación. Google Fonts se carga desde un servicio externo; existen fuentes de reserva si no hay conexión.
