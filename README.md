# Pendientes: lista de tareas

Aplicacion web sencilla para agregar, completar, filtrar y borrar tareas. Las tareas se guardan en el navegador (localStorage). Proyecto del reto de empaquetado, versionamiento y despliegue de una aplicacion web (UVEG).

Repositorio: https://github.com/leovargas18/tareas-app

## Estructura del proyecto

```
tareas-app/
├── index.html          Version original
├── css/styles.css      Estilos originales
├── js/app.js           Logica original
├── img/banner.png      Imagen original
├── server/tuapp.conf   Configuracion del Virtual Host de Apache
├── dist/               Version optimizada (la que se despliega)
│   ├── index.html
│   ├── css/styles.min.css
│   ├── js/app.min.js
│   └── img/banner.png
└── tareas-app.zip      Paquete comprimido de dist, listo para el servidor
```

## Proceso realizado

### 1. Preparacion de la aplicacion

- Se organizaron los archivos en las carpetas `/css`, `/js` e `/img`.
- Se minifico el CSS con `clean-css-cli`:
  `npx clean-css-cli -o dist/css/styles.min.css css/styles.css`
- Se minifico el JavaScript con `terser`:
  `npx terser js/app.js -c -m -o dist/js/app.min.js`
- Se comprimio la imagen `banner.png` con TinyPNG (de 45 KB a 28 KB).
- Se copio `index.html` a `dist/` y se actualizaron las rutas a `styles.min.css` y `app.min.js`.

### 2. Empaquetado

El contenido de `dist/` se comprimio en un archivo `.zip` con la herramienta `tar` de Windows:

```
tar -a -c -f tareas-app.zip -C dist .
tar -tf tareas-app.zip
```

El segundo comando verifica el contenido del paquete.

### 3. Versionamiento

- Se inicializo el repositorio con `git init` en la rama `main`.
- Se hicieron commits descriptivos por etapa:
  1. Aplicacion base (HTML, CSS, JS e imagen).
  2. Version optimizada en `dist`.
  3. Paquete comprimido `tareas-app.zip`.
  4. Documentacion en el README.
  5. Configuracion del servidor Apache.
- Se conecto el repositorio remoto y se subio con `git push -u origin main`.

### 4. Configuracion del servidor (Apache con XAMPP)

- Se instalo XAMPP (solo el modulo Apache) en `C:\xampp` y se inicio desde el panel de control, escuchando en el puerto 80.
- Se copio el contenido de `dist/` a la carpeta del servidor:
  `xcopy dist C:\xampp\sites\tuapp /E /I /Y`
- Se configuro un Virtual Host en `C:\xampp\apache\conf\extra\httpd-vhosts.conf` (copia en `server/tuapp.conf`):
  - Puerto: `80`.
  - Mapeo de directorio: el alias `/tuapp` apunta a `C:/xampp/sites/tuapp`.
  - Se desactivo el listado de directorios (`-Indexes`) y se permitio el acceso a esa carpeta (`Require all granted`).
- Se valido la sintaxis con `C:\xampp\apache\bin\httpd.exe -t` (resultado: `Syntax OK`) y se reinicio Apache.
- La aplicacion queda accesible en: http://localhost/tuapp

## Uso local

Abrir `dist/index.html` en el navegador, o desplegar el contenido de `dist/` en un servidor web (Apache o Nginx).
