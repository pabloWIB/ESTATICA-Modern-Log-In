# Registro de cambios

Reorganización completa del proyecto, 2026-07-31. Todo el trabajo es local: no se
ejecutó ningún comando de git.

El proyecto es una app de Create React App, no un sitio de HTML plano, así que la
estructura destino se adaptó a las convenciones de React manteniendo la jerarquía
y las reglas de nombres del estándar.

---

## Fase 1 — Auditoría

- Se inventarió el proyecto entero en [`auditoria.md`](auditoria.md): archivos, imágenes,
  dependencias, rutas rotas y problemas de CSS, accesibilidad y SEO.
- Hallazgos principales: dos bloqueos de zoom que incumplen WCAG 1.4.4, CSS basado en
  `:nth-child`, cuatro rutas de icono inexistentes, cinco enlaces muertos, jQuery sin usar
  y un test heredado de CRA que fallaba.

## Fase 2 — Estructura

Estructura final:

```
public/{index.html, 404.html, manifest.json, robots.txt, sitemap.xml, og-image.jpg, favicon/}
src/{index.jsx, app.jsx, app.test.jsx, setupTests.js, components/, styles/, assets/icons/}
docs/{auditoria.md, cambios.md, screenshots/}
```

- `src/App.js` (un componente de 95 líneas) se dividió en seis componentes en
  `src/components/`: `scene-background`, `login-card`, `login-form`, `password-field`,
  `social-sign-in` y `site-footer`.
- `src/STYLES/` → `src/styles/`, con la hoja única partida en `base.css`, `layout.css`
  y `components.css`, importadas en ese orden desde `src/index.jsx`.
- `src/IMG/` → `src/assets/icons/`, con nombres semánticos:
  `visibility_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg` → `eye.svg`,
  `visibility_off_24dp_C7D2D6_FILL0_wght400_GRAD0_opsz24.svg` → `eye-off.svg`,
  `flat-color-icons_google.svg` → `google.svg`, `bi_facebook.svg` → `facebook.svg`,
  `akar-icons_github-fill.svg` → `github.svg`.
- Todos los archivos en minúsculas con guiones. **Única excepción: `src/setupTests.js`**,
  cuyo nombre está fijado por react-scripts (`resolveModule(resolveApp, 'src/setupTests')`);
  renombrarlo desactiva en silencio la configuración de Jest.
- Se verificó por script que las 27 rutas internas (HTML, manifest, imports de JS y CSS)
  resuelven a archivos reales en disco.

## Fase 3 — Higiene

Eliminado:

| Archivo | Motivo |
|---|---|
| `src/App.js`, `src/index.js` | Sustituidos por `app.jsx`, `index.jsx` y los componentes |
| `src/App.test.js` | Test por defecto de CRA que buscaba «learn react» y fallaba |
| `src/reportWebVitals.js` | Se llamaba sin callback: nunca medía nada |
| `src/STYLES/App.css`, `App.css.map` | Artefactos de build versionados |
| `src/STYLES/App.scss` | Fuente Sass sin `sass` en `package.json`: irrecompilable |
| `src/IMG/` (5 SVG) | Copiados a `src/assets/icons/` con nombres semánticos |
| `.htaccess` | Reescrituras de Apache para un sitio `.html`; esta SPA se despliega desde `build/` |
| `1.png` | Captura suelta en la raíz, sin referenciar; regenerada desde la app real |
| `public/Modern-Log-In.png` | 473 KB y 1024×1024 usados de favicon; sustituido por el set de `public/favicon/` |

Dependencias retiradas de `package.json`:

- `jquery` — cero apariciones en `src/`.
- `web-vitals` — solo la usaba el código muerto de `reportWebVitals.js`.
- `normalize.css` desde cdnjs — una petición externa bloqueante para un reset; ahora está
  en `base.css`.

Dependencias actualizadas (los tests fallaban o dejaban avisos con las versiones previas):

- `@testing-library/user-event` 13.5.0 → 14.6.1, para que las interacciones se envuelvan
  en `act()` con React 18.
- `@testing-library/react` 13.4.0 → 16.3.2 y `@testing-library/dom` 10.4.1, para eliminar
  el aviso de `ReactDOMTestUtils.act` deprecado.

Otros:

- `.gitignore` ampliado con `.env`, `*.log`, `.vscode/`, `.idea/` y `Thumbs.db`.
- `package.json`: añadidos `description`, `keywords`, `license`, `author` y
  `homepage: "."`; retirado el script `eject`; añadido `test:ci`.
- **No se encontró ninguna credencial, token ni clave de API** en el árbol. La URL de la
  escena de Spline es un recurso público.
- Formato normalizado: 2 espacios, comillas dobles en HTML y JS, punto y coma, salto de
  línea final en cada archivo.

## Fase 4 — Imágenes

Sin inventar ni descargar ninguna. Todo se derivó de los dos PNG que ya existían.

| Origen | Resultado | Peso |
|---|---|---|
| `public/Modern-Log-In.png` (1024×1024, 473 KB) | `favicon/favicon-16.png` | 0,6 KB |
| » | `favicon/favicon-32.png` | 1,4 KB |
| » | `favicon/apple-touch-icon.png` (180) | 16,5 KB |
| » | `favicon/icon-192.png` | 18,6 KB |
| » | `favicon/icon-512.png` | 116,9 KB |
| Captura de la app ya reorganizada | `public/og-image.jpg` (1200×630) | 49,1 KB |
| » | `docs/screenshots/login.jpg` (1280×800) | 61,6 KB |

- Ninguna imagen supera los 200 KB, así que no hubo que convertir a WebP. Las dos capturas
  se guardaron en JPEG en lugar de WebP porque `og:image` necesita un formato que todos los
  rastreadores sociales acepten.
- Las capturas se regeneraron desde la interfaz reorganizada, no desde la vieja: la anterior
  mostraba enlaces que ya no existen.
- Los cinco SVG llevan `width` y `height` explícitos. Los iconos de proveedor van con
  `alt=""` porque el botón que los contiene ya lleva `aria-label`.
- `eye.svg` y `eye-off.svg` pasaron a `fill="currentColor"` y se cargan como componentes
  React; antes el icono de «ocultar» venía fijado a `#C7D2D6`, casi ilegible sobre el
  campo blanco.
- No hay imágenes bajo el fold, así que `loading="lazy"` no aplica a ninguna.

## Fase 5 — HTML, SEO y accesibilidad

- La tarjeta de login estaba dentro de un `<nav>`. Ahora la estructura es
  `<main>` › `<section aria-labelledby>` › `<form>`, más `<footer>`. Un solo `<h1>`,
  jerarquía `h1` → `h2` sin saltos.
- **Se retiró `maximum-scale=1.0, user-scalable=no`** del viewport y **se eliminó el
  `preventDefault()` sobre `Ctrl +`, `Ctrl -` y `Ctrl 0`** de `App.js`. Ambos impedían
  ampliar la página e incumplían WCAG 1.4.4. Era una función deliberada del proyecto
  original; se ha quitado a conciencia.
- Se eliminó la etiqueta `<meta name="viewport">` duplicada.
- `<head>` reescrito: `title` de 53 caracteres y `description` de 154, ambos únicos;
  `canonical`; Open Graph completo con `og:url`, `og:image` de 1200×630 y `og:image:alt`;
  Twitter card; `preconnect` y `dns-prefetch` a `prod.spline.design`.
- Los metadatos estaban en español con `<html lang="en">` y `og:locale` `es_ES`. Ahora todo
  está en inglés, igual que la interfaz.
- El JSON-LD era un `Organization` con logo y dominio inexistentes
  (`estatica-modern-log-in.vercel.app`). Se sustituyó por un `Person` con `sameAs` a GitHub,
  Fiverr y LinkedIn.
- `manifest.json` apuntaba a tres iconos inexistentes, uno con la extensión mal escrita
  (`favicon.co`). Reescrito contra los archivos reales.
- Se crearon `404.html` (con enlace de vuelta al inicio y estilos en línea, porque se sirve
  fuera del bundle) y `sitemap.xml`. `robots.txt` ahora declara el sitemap.
- Botón de mostrar/ocultar contraseña: era un `<div onClick>`, inalcanzable por teclado.
  Ahora es un `<button type="button">` con `aria-label` y `aria-pressed`.
- Se añadió una región `aria-live="polite"` única para los mensajes de resultado.
- Contraste: todos los pares de color quedan por encima de 4,5:1 (blanco sobre la tarjeta
  ≈9,7:1; texto atenuado ≈6,8:1; blanco sobre el botón ≈13:1).

## Fase 6 — CSS y sistema de diseño

- Se extrajeron a `:root` 34 variables de color, espaciado, tipografía, radios, sombra,
  transición y tamaños. La paleta se derivó de los valores que ya usaba el sitio
  (`#650000`, `#ac0000`, `rgba(193,88,88,…)`, `#bcbec0`): no se inventó ninguna.
- Escala de espaciado 4/8/16/24/32/48/64/96. Desaparecen los valores mágicos `28.46px`,
  `7.11px`, `2.13px`, `4.5px` y `17px`.
- Escala tipográfica de cinco pasos (12/14/16/20/24 px). Una sola familia, la pila del
  sistema: no se carga ninguna fuente web.
- Se eliminaron los selectores posicionales `> :nth-child(1..5)` de los que dependía toda
  la hoja, y las cadenas de hasta 8 niveles. Ningún selector pasa ahora de 3.
- Se eliminaron el `all: unset` masivo sobre `h1, h2, h3, p, a, span, label`, la regla
  muerta `.forgotPassword { display: none }` y el `background: red` pisado en la línea
  siguiente por otro `background`.
- Orden dentro de cada archivo: variables → reset → base → layout → componentes → media
  queries. Cero `!important` salvo el bloque de `prefers-reduced-motion`, donde es el
  patrón estándar.

## Fase 7 — Responsive

- Mobile-first, media queries con `min-width`.
- Solo hay puntos de ruptura en 480px y 768px porque son los únicos donde cambia algo
  (padding de página y de tarjeta). A 1024px y 1440px no cambia nada: la tarjeta mantiene
  su ancho máximo de 400px. No se añadieron media queries vacías.
- Verificado sin scroll horizontal a 320, 360, 480, 768, 1024, 1440 y 1920px, comprobando
  `document.documentElement.scrollWidth > window.innerWidth` en cada ancho.
- **Corregido un desbordamiento de 2px a 320px**: el ancho intrínseco de un `<input>`
  (atributo `size`, 20 caracteres por defecto) marcaba un mínimo por debajo del cual la
  tarjeta no podía encoger. Resuelto con `width: 0` sobre `.field__input`, que sigue
  creciendo por `flex-grow`.
- Todas las áreas táctiles miden 44×44px o más, verificado por script en los seis anchos.
- No hay menú móvil que probar: el sitio es una sola pantalla sin navegación. Tampoco hay
  tablas ni bloques de código.

## Fase 8 — UX / UI

- La tarjeta declara qué es en la primera lectura: «Interface demo. The form validates in
  the browser, but there is no authentication backend behind it.»
- Un CTA principal por pantalla, «Sign in», con comportamiento real.
- Estados completos en todo elemento interactivo: `:hover`, `:focus-visible`, `:active`,
  `:disabled` y `:focus-within` en los campos. Transiciones de 180ms.
- **El formulario ya no finge funcionar.** Valida de verdad (formato de email, mínimo de 8
  caracteres), muestra el error concreto bajo cada campo, marca `aria-invalid`, mueve el
  foco al primer campo inválido y, cuando todo es válido, dice explícitamente que no se ha
  enviado nada porque no hay backend. No se simula latencia ni un envío que no ocurre.
- Los tres botones sociales eran `<a href="">`, que recargaban la página. Ahora son
  `<button type="button">` que informan de que ese proveedor no está conectado.
- Longitud de línea limitada a 65ch en los bloques de texto.
- Sin gradientes decorativos ni animaciones gratuitas; la única sombra es la de elevación
  de la tarjeta.

## Fase 9 — JavaScript

- Un solo punto de entrada, `src/index.jsx`; el resto en módulos bajo `components/`.
- No había jQuery en el código pese a estar instalado: se retiró la dependencia.
- Cero variables globales y cero `var`. Todo `const`/`let` y componentes de función.
- `src/index.jsx` comprueba que `#root` existe antes de montar; `login-form.jsx` comprueba
  el elemento antes de enfocarlo; `scene-background.jsx` comprueba que `matchMedia` y
  `addEventListener` existen, con respaldo a la API antigua de Safari.
- Se eliminó el código que nunca se ejecutaba: `reportWebVitals.js` y el `<div>` vacío que
  solo servía para ser ocultado por CSS.
- Consola limpia en producción salvo un aviso de `THREE.WebGLProgram` sobre optimización de
  shaders, emitido desde dentro del runtime de Spline. No es corregible desde este código.

## Fase 10 — Rendimiento

- El runtime de Spline se separó en su propio chunk con `React.lazy` y se carga después de
  que el formulario sea interactivo. Se omite por completo con `prefers-reduced-motion`.
- El fondo de rejilla y resplandor se dibuja en CSS, así que la página nunca aparece en
  negro mientras la escena descarga, ni si el CDN falla.
- `React.lazy` con `.catch()` y un error boundary evitan que un fallo de la escena tumbe el
  formulario.
- `preconnect` y `dns-prefetch` a `prod.spline.design`. Los scripts van con `defer` por
  defecto en el build de CRA.
- Se eliminó la petición externa a normalize.css.
- No se cargan fuentes web, así que `font-display: swap` no aplica.
- Carga total en primera visita, medida sobre el build servido por HTTP: **≈604 KB**
  (documento 1,2 KB + `main.js` 48,7 KB + CSS 2,4 KB + iconos ≈22 KB + chunk de Spline
  522,9 KB + escena 6,4 KB). Por debajo del objetivo de 1 MB, y solo ≈52 KB bloquean la
  interactividad del formulario.

## Fase 11 — QA

| Comprobación | Resultado |
|---|---|
| Enlaces del footer llevan a destino real | Sí: `wib.digital` y `fiverr.com/pablonietop` |
| Cada ruta de imagen corresponde a un archivo en disco | Sí, 27 referencias verificadas por script |
| Cada `<link>` y `<script>` apunta a un archivo existente | Sí |
| Cero errores en consola | Sí sobre HTTP, en `/` y en `/404.html` |
| Sin scroll horizontal a 360/768/1024/1440 | Sí, y también a 320, 480 y 1920 |
| Menú móvil | No aplica: sin navegación |
| El formulario valida y responde | Sí, 7 tests en verde |
| Sin «Lorem ipsum», «TODO» ni texto de plantilla | Sí, verificado por grep |
| Sin imágenes rotas | Sí |
| Title y description únicos por página | Sí: 53/154 en `index.html`, 51/152 en `404.html` |
| `404.html` con enlace de vuelta al inicio | Sí |
| Sin credenciales en el código | Sí |

Suite de tests reescrita: `src/app.test.jsx` cubre encabezado y campos, envío vacío,
email malformado, contraseña corta, envío válido, conmutador de contraseña en ambos
sentidos y botón social. 7 tests, todos en verde, sin avisos en consola.

## Fase 12 — Documentación

- `README.md` actualizado, no reescrito: se conservó su estructura y su tono, y se
  corrigieron el stack (fuera Sass, jQuery y web-vitals), el árbol del proyecto, la tabla
  de scripts y la sección de tests. Se añadieron la captura real, la tabla de rendimiento
  medida y el bloque «Hire me».
- `docs/auditoria.md` y este `docs/cambios.md` creados.

## Fase 13 — Deploy

- `npm run build` compila sin errores.
- Verificado sirviendo `build/` con `npx serve`: consola limpia, todos los recursos en 200.
- Verificado abriendo `build/index.html` directamente por `file://`: la app renderiza
  completa y la escena carga. Con este protocolo Chrome bloquea la lectura de
  `manifest.json` por CORS y registra dos errores; es una restricción de `file://`, no del
  proyecto. Sobre HTTP no aparecen.
- `homepage: "."` en `package.json` para que el build emita rutas relativas.
- Sin rutas absolutas de la máquina en el código ni en el build.
- No se creó ningún archivo de configuración de hosting: no se indicó destino.
- No se ejecutó ningún despliegue.
