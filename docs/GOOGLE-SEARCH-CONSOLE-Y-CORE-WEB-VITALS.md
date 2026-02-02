# Guía: Google Search Console y Core Web Vitals (PageSpeed Insights)

Esta guía explica paso a paso qué hacer en **Google Search Console** y cómo revisar y mejorar **Core Web Vitals** con **PageSpeed Insights**.

---

## Parte 1: Google Search Console

### 1. Añadir la propiedad (si aún no está)

1. Entra en [Google Search Console](https://search.google.com/search-console).
2. Si es la primera vez:
   - Pulsa **Añadir propiedad**.
   - Elige **Dominio** (recomendado: `ignathedev.com`) o **Prefijo de URL** (ej. `https://www.ignathedev.com`).
3. **Verificación**:
   - **Dominio**: Añade el registro TXT que te indica en el DNS de tu proveedor (donde está el dominio).
   - **Prefijo de URL**: Puedes usar:
     - Archivo HTML en el sitio.
     - Meta tag en `<head>` (si usas Astro/SEO, suele ser sencillo).
     - Google Analytics (si ya lo tienes).
     - Google Tag Manager.
4. Espera a que el estado pase a **Propiedad verificada**.

### 2. Enviar el Sitemap

1. En el menú izquierdo: **Sitemaps** (o **Mapas del sitio**).
2. En “Añadir un sitemap nuevo” escribe:  
   `sitemap-index.xml`  
   (o la URL completa si tu sitio la expone así: `https://www.ignathedev.com/sitemap-index.xml`).
3. Pulsa **Enviar**.
4. Estado esperado: “Correcto” o “Éxito”. Si hay errores, revisa que la URL del sitemap sea accesible en el navegador.

### 3. Revisar cobertura (indexación)

1. Menú izquierdo: **Pages** (antes “Cobertura” / “Indexación”) o **Índice** > **Páginas**.
2. Revisa:
   - **Páginas válidas**: son las que Google tiene indexadas.
   - **Páginas con advertencias** o **Excluidas**: revisa el motivo (por ejemplo “Crawled - currently not indexed”).
3. Para que una URL concreta se indexe antes:
   - Usa **Inspección de URLs** (barra superior).
   - Pega la URL, pulsa Enter y luego **Solicitar indexación** (si está disponible).

### 4. Comprobar hreflang (sitio en ES y EN)

1. **Inspección de URLs**.
2. Inspecciona la versión en español (ej. `https://www.ignathedev.com/`) y la inglesa (ej. `https://www.ignathedev.com/en/`).
3. En el informe, busca la sección de **Enlaces alternativos** (o “Alternate links”).
4. Verifica que aparezcan las URLs alternativas con `hreflang` correctas (es, en, x-default).

### 5. Revisar enlaces y experiencia en la búsqueda

1. **Enlaces**: Menú **Enlaces** para ver enlaces internos y externos.
2. **Experiencia**: Menú **Experiencia** (o “Core Web Vitals” dentro de Search Console) para ver métricas de experiencia en dispositivos móviles y escritorio.

### 6. Tareas recomendadas (resumen)

| Acción                          | Dónde en Search Console  |
| ------------------------------- | ------------------------ |
| Verificar propiedad             | Ajustes > Propiedad      |
| Enviar sitemap                  | Sitemaps                 |
| Ver páginas indexadas           | Pages / Índice > Páginas |
| Solicitar indexación de una URL | Inspección de URLs       |
| Revisar hreflang                | Inspección de URLs       |
| Revisar Core Web Vitals         | Experiencia              |

---

## Parte 2: Core Web Vitals con PageSpeed Insights

### 1. Qué son los Core Web Vitals

- **LCP (Largest Contentful Paint)**: Carga del contenido principal. Objetivo: &lt; 2,5 s.
- **INP (Interaction to Next Paint)** / **FID**: Capacidad de respuesta al hacer clic. Objetivo: &lt; 200 ms.
- **CLS (Cumulative Layout Shift)**: Estabilidad visual (que no se muevan elementos). Objetivo: &lt; 0,1.

PageSpeed Insights mide estas métricas en **móvil** y **escritorio** y las clasifica en Bueno / Necesita mejora / Malo.

### 2. Analizar la página

1. Entra en [PageSpeed Insights](https://pagespeed.web.dev/).
2. Escribe la URL a analizar, por ejemplo:
   - `https://www.ignathedev.com/`
   - `https://www.ignathedev.com/en/`
3. Pulsa **Analizar**.
4. Espera a que termine el análisis (datos de campo “real users” pueden tardar un poco).

### 3. Leer el informe

1. **Métricas principales** (arriba):
   - LCP, INP (o FID), CLS.
   - Color verde = Bueno; naranja = Necesita mejora; rojo = Malo.
2. **Oportunidades** y **Diagnósticos**:
   - “Oportunidades”: mejoras que suelen tener más impacto (ej. imágenes, JavaScript, fuentes).
   - “Diagnósticos”: información adicional (caché, recursos bloqueantes, etc.).

### 4. Mejoras típicas según el problema

| Problema         | Acción recomendada                                                                                                                                                                                                                       |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **LCP alto**     | Optimizar imagen principal (tamaño, formato WebP, lazy load solo bajo el pliegue). Reducir JS/CSS bloqueantes. Usar preload para recursos críticos (ej. fuentes, imagen LCP).                                                            |
| **INP/FID alto** | Reducir trabajo en el hilo principal: menos JS pesado al cargar, código dividido (code splitting), diferir scripts no críticos.                                                                                                          |
| **CLS alto**     | Dar `width` y `height` a imágenes (o ratio). Reservar espacio para anuncios/embeds. Evitar insertar contenido arriba del pliegue después de cargar. Usar fuentes con `font-display: optional` o `swap` y reservar espacio si hace falta. |

### 5. Comprobar en móvil y escritorio

1. En PageSpeed Insights, revisa las pestañas **Móvil** y **Escritorio**.
2. Prioriza **Móvil**: Google indexa en modo móvil por defecto.
3. Si una métrica está en verde en escritorio y en rojo en móvil, enfoca las optimizaciones en móvil (menos ancho de banda, CPU más limitada).

### 6. Relación con Search Console

1. En Search Console, menú **Experiencia** > **Core Web Vitals**.
2. Ahí ves qué URLs tienen problemas según datos **reales** de usuarios (RUM).
3. PageSpeed Insights usa datos de **laboratorio** (entorno controlado).
4. Si en Search Console salen URLs “con problemas”, analízalas una por una en PageSpeed Insights para ver la causa y aplicar las mejoras de la tabla anterior.

### 7. Checklist rápido después de cambios

- [ ] Volver a analizar en PageSpeed Insights la homepage y una página interior (ES y EN).
- [ ] Comprobar que LCP, INP y CLS estén en verde o al menos “Necesita mejora” con tendencia a verde.
- [ ] Revisar “Oportunidades” y aplicar al menos las de alto impacto.
- [ ] Pasadas 24–48 h, revisar en Search Console > Experiencia si mejoran los datos de Core Web Vitals.

---

## Resumen de orden recomendado

1. **Search Console**: Verificar propiedad → Enviar sitemap → Revisar indexación y hreflang.
2. **PageSpeed Insights**: Analizar homepage (móvil y escritorio) → Corregir LCP, INP, CLS según el informe.
3. **Search Console**: Revisar Experiencia / Core Web Vitals y, si hay URLs problemáticas, analizarlas en PageSpeed y optimizar.
4. Repetir análisis tras cada cambio importante en rendimiento o estructura del sitio.

Si quieres, en el siguiente paso podemos bajar al detalle de tu proyecto (Astro, Vercel, imágenes) y concretar qué tocar en código y en configuración para LCP, INP y CLS.
