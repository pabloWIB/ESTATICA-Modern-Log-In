# Auditoría — Modern-Log-In

Fecha: 2026-07-31
Estado del proyecto en el momento de la auditoría (antes de reorganizar).

Stack detectado: **Create React App (react-scripts 5.0.1) + React 18.3.1**. No es un
sitio estático de HTML plano, así que la estructura destino se adapta a las convenciones
de React (`src/components`, `src/styles`, `src/assets`, `public/`) manteniendo la jerarquía
y las reglas de nombres del estándar.

---

## 1. Archivos HTML

| Archivo | `<title>` | `<h1>` | Propósito real | Estado |
|---|---|---|---|---|
| `public/index.html` | `Modern Log In` | — (lo inyecta React) | Plantilla HTML de CRA; monta `#root` | Metadatos incompletos y parcialmente rotos |

No existe `404.html`. No existe `sitemap.xml`.

## 2. JavaScript

| Archivo | ¿Se carga? | Observaciones |
|---|---|---|
| `src/index.js` | Sí | Punto de entrada. Llama a `reportWebVitals()` **sin argumento** → no hace nada |
| `src/App.js` | Sí | Componente único: toda la pantalla en un solo archivo (95 líneas) |
| `src/reportWebVitals.js` | Importado, inoperante | Código muerto: sin callback nunca mide nada |
| `src/setupTests.js` | Sí (solo en tests) | Correcto |
| `src/App.test.js` | Sí (solo en tests) | **El test falla**: busca el texto `learn react`, que no existe en la app |

## 3. CSS

| Archivo | ¿Se carga? | Observaciones |
|---|---|---|
| `src/STYLES/App.css` | Sí (`import` en `App.js`) | Artefacto compilado, versionado en el repo |
| `src/STYLES/App.scss` | No | Fuente Sass. **`sass` no está en `package.json`**: no hay forma de recompilarlo con `npm install` |
| `src/STYLES/App.css.map` | No | Source map de un build que el proyecto no sabe reproducir |

## 4. Imágenes

| Archivo | Ruta | Peso | Dimensiones | Formato | ¿Se usa? |
|---|---|---|---|---|---|
| `1.png` | raíz del repo | 837 KB | 2560×1600 | PNG | **No referenciada en ningún archivo**. Es una captura real de la pantalla de login |
| `Modern-Log-In.png` | `public/` | 473 KB | 1024×1024 | PNG | Sí: favicon, `og:image` y `twitter:image` |
| `akar-icons_github-fill.svg` | `src/IMG/` | 1,6 KB | 18×18 | SVG | Sí |
| `bi_facebook.svg` | `src/IMG/` | 790 B | 18×18 | SVG | Sí |
| `flat-color-icons_google.svg` | `src/IMG/` | 1,6 KB | 18×18 | SVG | Sí |
| `visibility_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg` | `src/IMG/` | 554 B | 24×24 | SVG | Sí |
| `visibility_off_24dp_C7D2D6_FILL0_wght400_GRAD0_opsz24.svg` | `src/IMG/` | 675 B | 24×24 | SVG | Sí |

Un PNG de 1024×1024 y 473 KB usado como favicon es entre 200 y 900 veces más grande de lo
necesario, y como `og:image` tiene la relación de aspecto equivocada (1:1 en lugar de ~1,91:1).

## 5. Dependencias externas

| Dependencia | Tipo | ¿Se usa? |
|---|---|---|
| `@splinetool/react-spline` 4.0.0 | npm | Sí: escena 3D de fondo |
| `https://prod.spline.design/BedHsbQnoGzxGCVf/scene.splinecode` | CDN en tiempo de ejecución | Sí. Sin `preconnect`, sin carga diferida, sin alternativa si falla |
| `normalize.css` 8.0.1 (cdnjs) | CDN en `<head>` | Sí, pero es una petición bloqueante externa para un reset de 2 KB |
| `jquery` 3.7.1 | npm | **No.** Cero apariciones en `src/` |
| `web-vitals` 2.1.4 | npm | Solo desde código muerto |
| `react`, `react-dom`, `react-scripts` | npm | Sí |
| `@testing-library/*` | npm | Sí (tests) |
| Tipografías web | — | Ninguna. Se usa la pila de fuentes del sistema |

## 6. Archivos basura y sobrantes

| Archivo | Motivo |
|---|---|
| `1.png` | Captura suelta en la raíz del repo, sin usar y con nombre no semántico |
| `src/STYLES/App.css.map` | Artefacto de build versionado |
| `.htaccess` | Reglas de reescritura de Apache para un sitio multipágina `.html`. Este proyecto es una SPA que se despliega en Vercel desde `build/`; el archivo nunca llega al servidor |

No hay `node_modules/`, `.bak`, `.DS_Store`, `Thumbs.db` ni duplicados con sufijo de versión.

## 7. Enlaces y rutas rotas

| Ubicación | Referencia | Problema |
|---|---|---|
| `public/manifest.json` | `%PUBLIC_URL%/IMG/FAVICON/favicon.co` | El archivo no existe. Además la extensión está mal escrita (`.co` en vez de `.ico`) |
| `public/manifest.json` | `%PUBLIC_URL%/IMG/FAVICON/apple-icon-180x180.png` | El archivo no existe |
| `public/manifest.json` | `%PUBLIC_URL%/IMG/FAVICON/ms-icon-310x310.png` | El archivo no existe |
| `public/index.html` (JSON-LD) | `https://estatica-modern-log-in.vercel.app/IMG/FAVICON/android-icon-36x36.png` | El archivo no existe y el dominio no es el del proyecto |
| `public/index.html` (JSON-LD) | `https://estatica-modern-log-in.vercel.app/` | Dominio obsoleto. El sitio vive en `https://modernlogin.wib.digital` |
| `src/App.js` línea 73 | `<a href="#">Forgot Password?</a>` | Enlace a ninguna parte |
| `src/App.js` líneas 79, 82, 85 | `<a href="">` ×3 (Google, Facebook, GitHub) | `href` vacío: recarga la página. No hay proveedor de autenticación conectado |
| `src/App.js` línea 89 | `<span>Register for free</span>` | Parece un enlace, no es interactivo, no lleva a ninguna parte |

Ninguna imagen rota. Ningún `<link>` ni `<script>` apunta a un archivo local inexistente.

## 8. Problemas de HTML, SEO y accesibilidad

| Severidad | Problema |
|---|---|
| Alta | La tarjeta de login está dentro de un `<nav>`. No hay `<main>`. `<header>` contiene solo la escena decorativa |
| Alta | `user-scalable=no, maximum-scale=1.0` en el viewport: impide el zoom táctil (incumple WCAG 1.4.4) |
| Alta | `App.js` intercepta `Ctrl +`, `Ctrl -` y `Ctrl 0` con `preventDefault()`: impide el zoom del navegador (incumple WCAG 1.4.4) |
| Media | Etiqueta `<meta name="viewport">` duplicada, con valores distintos |
| Media | `<html lang="en">` pero `description` y `og:description` están en español y `og:locale` es `es_ES` |
| Media | Falta `<link rel="canonical">` |
| Media | `og:url` ausente |
| Media | `alt="Option 1"`, `alt="Option 2"`, `alt="Option 3"` en los iconos sociales: no describen nada |
| Media | El botón de mostrar/ocultar contraseña es un `<div>` con `onClick`: no es accesible por teclado ni tiene rol |
| Media | Sin estado de foco visible en ningún elemento interactivo (`all: unset` lo elimina) |
| Baja | El texto de la línea final es de 10 px |
| Baja | `robots.txt` no referencia ningún sitemap |

## 9. Problemas de CSS

| Problema | Detalle |
|---|---|
| Selectores posicionales | Toda la hoja se apoya en `> :nth-child(1..5)`. Reordenar un elemento del JSX rompe los estilos sin aviso |
| Selectores profundos | `body nav form > :nth-child(1) > label > div .hiddenIcons > div img` — 8 niveles |
| Regla muerta | `.forgotPassword { display: none }` sobre un `<div>` vacío que solo existe para eso |
| Declaración pisada | `background: red` seguido inmediatamente de `background: rgba(...)` en la misma regla |
| Sin sistema de diseño | Cero variables. Valores mágicos: `28.46px`, `7.11px`, `2.13px`, `4.5px`, `17px` |
| `all: unset` masivo | Aplicado a `h1, h2, h3, p, a, span, label` y a los `input`: elimina el foco, los estados nativos y la semántica visual |
| Sin responsive | Ni una sola media query. `padding: 40px 80px` fijo en la tarjeta |
| Sin estados | No hay `:focus`, `:active` ni `:disabled` en ningún elemento |

## 10. HTML duplicado entre páginas

No aplica: hay una sola página.

## 11. Contenido de relleno del template

| Ubicación | Contenido |
|---|---|
| `src/App.test.js` | Test por defecto de CRA (`renders learn react link`) |
| `public/manifest.json` | `theme_color` `#000000` frente a `theme-color` `#ffffff` del HTML: valores por defecto contradictorios |
| `public/robots.txt` | Archivo por defecto de CRA |

No hay «Lorem ipsum» ni texto de plantilla en la interfaz.

## 12. Credenciales

Búsqueda de tokens, claves y secretos en todo el árbol: **ninguno encontrado**. La URL de la
escena de Spline es un recurso público, no una credencial.

---

## Responsive medido (antes)

| Ancho | Resultado |
|---|---|
| 360 px | La tarjeta mide ~440 px por el `padding: 40px 80px` fijo → **scroll horizontal** |
| 768 px | Correcto |
| 1024 px | Correcto |
| 1440 px | Correcto |

## Resumen en 5 líneas

1. Es una pantalla de login hecha en React (CRA) con una escena 3D de Spline de fondo y un
   conmutador de visibilidad de contraseña; no tiene backend ni autenticación real.
2. Funciona y se ve bien en escritorio, pero por dentro está sin terminar: un solo componente
   de 95 líneas, CSS compilado versionado y una fuente Sass que el proyecto no puede recompilar.
3. Lo más grave son dos bloqueos de zoom deliberados —`user-scalable=no` y el `preventDefault`
   sobre `Ctrl +/-/0`— que incumplen WCAG 1.4.4 y son inaceptables en un proyecto de portafolio.
4. Le sigue el CSS basado en `:nth-child`: cualquier cambio de orden en el JSX rompe los
   estilos en silencio, y no hay ni una media query, así que a 360 px hay scroll horizontal.
5. Además hay cuatro rutas de icono que apuntan a archivos inexistentes, cinco enlaces que no
   llevan a ninguna parte, jQuery instalado sin usarse y un test heredado de CRA que falla.
