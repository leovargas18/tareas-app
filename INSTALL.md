# INSTALL.md - Pendientes (tareas-app)

## Versiones utilizadas

| Componente                               | Versión    |
| ---------------------------------------- | ---------- |
| Sistema operativo                        | Windows 10 |
| Node.js                                  | 24.18.0    |
| npm                                      | 11.16.0    |
| MySQL Server                             | 8.0.45     |
| Express (framework)                      | 5.3.0      |
| mysql2 (conector)                        | 3.24.6     |
| express-validator (plugin de validación) | 7.3.2      |
| dotenv                                   | 18.0.8     |

## Pasos para reproducir la configuración

1. Clonar el repositorio e instalar dependencias:

```
git clone https://github.com/leovargas18/tareas-app.git
cd tareas-app
npm install
```

2. Crear la base de datos y las tablas con el script de inicialización
   (desde MySQL Workbench: File > Open SQL Script > `db/init.sql` y ejecutar).

3. Crear un usuario de MySQL con permisos limitados a la base `pendientes`:

```sql
CREATE USER 'pendientes_app'@'localhost' IDENTIFIED BY '<tu_contraseña>';
GRANT SELECT, INSERT, UPDATE, DELETE ON pendientes.* TO 'pendientes_app'@'localhost';
FLUSH PRIVILEGES;
```

4. Crear un archivo `.env` en la raíz (no se sube a Git):

```
DB_HOST=localhost
DB_USER=pendientes_app
DB_PASSWORD=<tu_contraseña>
DB_NAME=pendientes
PORT=3000
```

5. Iniciar la API:

```
npm start
```

6. Verificar la conexión abriendo http://127.0.0.1:3000/api/salud
   (debe responder `"estado":"ok"`).

## Plugin adicional

express-validator valida los datos recibidos (título obligatorio de máximo
150 caracteres, identificadores numéricos y valores booleanos) antes de
guardarlos en la base de datos.
