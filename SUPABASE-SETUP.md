# Supabase para YomanWeb

## 1. Configura las credenciales del frontend

Abre `assets/js/supabase-config.js` y confirma estos valores:

- `url`: `https://fvmluiespuxtxgqgfykj.supabase.co`
- `anonKey`: tu `anon key`

## 2. Ejecuta el SQL

En el SQL Editor de Supabase, ejecuta completo el archivo `supabase-schema.sql`.

Ese script crea o actualiza:

- La tabla `site_config`
- La tabla `leads`
- El bucket `yoman-media`
- El registro inicial con `id = 1`
- Las politicas para lectura publica de la landing
- Las politicas para editar contenido y ver leads solo con usuario autenticado
- Las politicas para subir imagenes y videos desde el dashboard

## 3. Crea el usuario administrador

Este usuario no se crea con el SQL del proyecto. Debes crearlo en:

- `Authentication`
- `Users`
- `Add user`

Usa exactamente estos datos:

- Email: `haroldoz18@outlook.com`
- Password: `abc123`

Nota:

- Esa contrasena es muy debil. Te recomiendo usarla solo para entrar la primera vez y luego cambiarla por una mas fuerte desde Supabase.

## 4. Flujo final

- `index.html` carga todo el contenido visible desde `site_config`
- `index.html` guarda formularios en `leads`
- `login.html` autentica con Supabase Auth
- `dashboard.html` te deja editar todos los textos, links, imagenes y videos de la landing actual
- `dashboard.html` tambien puede subir imagenes y videos a Supabase Storage sin pegar URL manual
- `dashboard.html` te muestra los leads guardados

## 5. Importante

Este proyecto es estatico. Por eso la `anon key` esta en el navegador y eso esta bien.

Nunca pongas la `service_role key` en estos archivos.
