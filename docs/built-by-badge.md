# "Built by Ignacio Amat" Badge

A small footer attribution badge that creates a passive referral channel from live client websites to `ignacioamatweb.com`.

## Why

Every website delivered to a client becomes a passive lead source. A visitor who likes the site sees the attribution, clicks, and arrives at the freelance service site already pre-qualified ("I want something like this").

UTM tracking makes it possible to measure which client sites send the most referrals.

---

## Astro Component (for Astro-based client projects)

```astro
import BuiltByBadge from "@/components/BuiltByBadge.astro";

<!-- Minimal (default) — inherits colour, very subtle -->
<BuiltByBadge lang="es" />

<!-- Pill variant — works on any background colour -->
<BuiltByBadge lang="en" style="pill" />
```

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `lang` | `"es" \| "en"` | `"es"` | Badge text language |
| `style` | `"minimal" \| "pill"` | `"minimal"` | Visual variant |
| `class` | `string` | `""` | Extra Tailwind classes |

---

## Plain HTML Snippet (any stack — copy-paste ready)

### Spanish · Minimal

```html
<!-- Desarrollado por Ignacio Amat — ignacioamatweb.com -->
<a href="https://www.ignacioamatweb.com/?utm_source=client-site&utm_medium=badge&utm_campaign=built-by"
   target="_blank"
   rel="noopener noreferrer"
   aria-label="Sitio web diseñado y desarrollado por Ignacio Amat"
   style="display:inline-flex;align-items:center;gap:5px;font-size:11px;letter-spacing:0.02em;color:inherit;opacity:0.4;text-decoration:none;font-family:inherit;transition:opacity 150ms ease;"
   onmouseover="this.style.opacity='0.7'"
   onmouseout="this.style.opacity='0.4'">
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
  Diseñado y desarrollado por Ignacio Amat
</a>
```

### English · Minimal

```html
<!-- Built by Ignacio Amat — ignacioamatweb.com -->
<a href="https://www.ignacioamatweb.com/?utm_source=client-site&utm_medium=badge&utm_campaign=built-by"
   target="_blank"
   rel="noopener noreferrer"
   aria-label="Website designed and developed by Ignacio Amat"
   style="display:inline-flex;align-items:center;gap:5px;font-size:11px;letter-spacing:0.02em;color:inherit;opacity:0.4;text-decoration:none;font-family:inherit;transition:opacity 150ms ease;"
   onmouseover="this.style.opacity='0.7'"
   onmouseout="this.style.opacity='0.4'">
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
  Designed and developed by Ignacio Amat
</a>
```

### Pill variant (works on dark and coloured footers)

```html
<a href="https://www.ignacioamatweb.com/?utm_source=client-site&utm_medium=badge&utm_campaign=built-by"
   target="_blank"
   rel="noopener noreferrer"
   aria-label="Sitio web diseñado y desarrollado por Ignacio Amat"
   style="display:inline-flex;align-items:center;gap:5px;font-size:11px;letter-spacing:0.02em;color:inherit;opacity:0.55;text-decoration:none;font-family:inherit;transition:opacity 150ms ease;padding:5px 10px;border-radius:999px;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.05);"
   onmouseover="this.style.opacity='0.85'"
   onmouseout="this.style.opacity='0.55'">
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
  Diseñado y desarrollado por Ignacio Amat
</a>
```

---

## Typical placement — client site footer

```html
<footer>
  <div class="footer-bottom">
    <p>© 2025 NombreEmpresa. Todos los derechos reservados.</p>

    <!-- Built-by badge -->
    <a href="https://www.ignacioamatweb.com/..." ...>
      Diseñado y desarrollado por Ignacio Amat
    </a>
  </div>
</footer>
```

On light footers use the **minimal** variant.
On dark or gradient footers use the **pill** variant.

---

## UTM tracking

All badge links use:

```
utm_source=client-site
utm_medium=badge
utm_campaign=built-by
```

To track which client site drives the most referrals, add `utm_content` with the client domain:

```
https://www.ignacioamatweb.com/?utm_source=client-site&utm_medium=badge&utm_campaign=built-by&utm_content=restaurante-ejemplo-com
```

In GA4 on `ignacioamatweb.com`, filter sessions by `Source = client-site` and `Medium = badge` to see badge-driven traffic and conversions.

---

## Notes

- **Do not use `rel="nofollow"`** — this is a genuine attribution link; the link equity from client sites benefits `ignacioamatweb.com`'s SEO
- The badge inherits the client site's font, so it blends naturally without imposing a brand conflict
- Keep opacity low (0.4–0.55 default) so it is clearly secondary to the client's own branding
