# Chronosense Experience — prototipo interactivo

Este paquete contiene un demostrador web estático para GitHub Pages.

## Publicar en el repositorio existente

1. Haz una copia de seguridad del repositorio.
2. Sube `index.html`, `styles.css`, `script.js` y la carpeta `assets/` a la raíz del repositorio.
3. Conserva la ruta `assets/chronosense-logo.png`.
4. Confirma los cambios en la rama `main`.
5. GitHub Pages debe estar configurado en `main` y `/ (root)`.

## Qué permite demostrar

- Navegación entre Overview y los cinco módulos.
- Añadir recuerdos, mensajes de legado y perfiles familiares.
- Filtrar recuerdos por tipo.
- Simular respuestas de Safety Band y N.O.A.
- Guardado local de datos de demostración mediante localStorage.

## Limitaciones importantes

- No hay backend, cuentas, autenticación, sincronización ni almacenamiento cloud real.
- Los datos añadidos permanecen solo en el navegador y no se comparten con familiares.
- Las funciones GPS, SOS y N.O.A. son simulaciones; no se conecta a dispositivos ni servicios de emergencia.
- No es un producto sanitario, diagnóstico ni servicio de cuidados.
- No introduzcas datos personales o médicos reales.

## Tecnología

HTML, CSS y JavaScript sin frameworks ni dependencias de compilación. Google Fonts se carga desde un servicio externo; el sistema utiliza fuentes de reserva si no hay conexión.
