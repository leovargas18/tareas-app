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
- Se conecto el repositorio remoto y se subio con `git push -u origin main`.

## Uso local

Abrir `dist/index.html` en el navegador, o desplegar el contenido de `dist/` en un servidor web (Apache o Nginx).
