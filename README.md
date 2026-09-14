# Hábitos

Web app personal para llevar seguimiento de hábitos diarios. Todos los datos
se guardan **solo en tu dispositivo** (IndexedDB, vía Dexie.js) — no hay
backend ni base de datos remota.

## Stack

- **React + Vite** — interfaz y build
- **Dexie.js** (IndexedDB) — almacenamiento local
- **Tailwind CSS** — estilos
- **vite-plugin-pwa** — instalable y funciona offline
- **GitHub Pages + GitHub Actions** — hosting y deploy automático

## Empezar en local

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`.

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub y sube este proyecto:
   ```bash
   git init
   git add .
   git commit -m "Primer commit"
   git branch -M main
   git remote add origin https://github.com/habitracker-ui/habitracker.git
   git push -u origin main
   ```

2. **Importante:** abre `vite.config.js` y cambia la constante `REPO_NAME`
   por el nombre exacto de tu repositorio (debe coincidir con lo que aparece
   en la URL de GitHub).

3. En tu repo de GitHub, ve a **Settings → Pages** y en "Build and
   deployment" selecciona **GitHub Actions** como fuente.

4. Cada vez que hagas `git push` a `main`, el workflow en
   `.github/workflows/deploy.yml` construye el proyecto y lo publica
   automáticamente en `https://github.com/habitracker-ui/habitracker.git`.

## Notas sobre los datos

- Los hábitos y el historial viven en el navegador del dispositivo que uses.
  Si cambias de navegador, de dispositivo, o borras los datos del sitio,
  el historial se pierde.
- Como es una PWA, puedes "instalar" la app desde el navegador (menú →
  "Instalar app" o "Agregar a pantalla de inicio") y funcionará offline.
- Si más adelante quieres respaldar o mover tus datos entre dispositivos,
  el siguiente paso natural es agregar un botón de exportar/importar JSON
  (sin necesidad de servidor).

## Íconos de la PWA

Faltan `public/icon-192.png` y `public/icon-512.png` (192×192 y 512×512 px).
Agrega tus propios íconos con esos nombres antes de publicar para que la
app se instale con buen ícono.
