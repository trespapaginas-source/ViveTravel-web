# Vive Travel

Sitio web público de **Vive Travel**, agencia de viajes y cabañas del Atlántico, Colombia.
Construido con Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 + shadcn/ui.

## Requisitos

- Node.js 20+ (probado con Node 24)
- npm 10+

## Instalación

```bash
npm install
```

## Variables de entorno

Copia `.env` (ya está gitignorado) con:

```env
NEXT_PUBLIC_SUPABASE_URL="https://<proyecto>.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<anon-key>"
```

> **Nota:** el cliente de Supabase está desconectado del código. Las variables solo se usan
> porque algunas imágenes del hero se sirven desde Supabase Storage (URLs públicas hardcoded
> en `src/components/home/hero-section.tsx`). Si migrás esas imágenes a `/public`, podés
> eliminar estas variables por completo.

## Scripts

| Script          | Descripción                                  |
| --------------- | -------------------------------------------- |
| `npm run dev`   | Servidor de desarrollo en `http://localhost:3000` |
| `npm run build` | Build de producción (output: standalone)     |
| `npm start`     | Sirve el build de producción                 |
| `npm run lint`  | ESLint                                       |

## Arquitectura

### Routing

El sitio funciona como **SPA con router interno basado en Zustand**
(`src/lib/store.ts` → `useNavigation`), que gestiona la vista activa sin recargas de página.

Adicionalmente existen **rutas físicas** (`/planes`, `/planes/[id]`, `/cabanas`,
`/cabanas/[id]`, `/contacto`, `/politicas`) como puntos de entrada para SEO y enlaces profundos;
estas cargan el mismo layout y delegan al router interno.

### Fuente de datos

Toda la data del catálogo (planes, cabañas, transportes, testimonios, configuración del
sitio) vive en **JSON estáticos** bajo `src/data/static/`. La capa de acceso es
`src/lib/api.ts`, que normaliza los registros (arrays serializados como string → objetos).

No hay base de datos en runtime.

### Estructura

```
src/
├── app/                      # Rutas Next.js (App Router)
│   ├── (public)/             # Rutas físicas para SEO
│   ├── layout.tsx            # Layout raíz + metadata + Providers
│   └── page.tsx              # Home + ViewRouter
├── components/
│   ├── home/                 # Secciones de la home (hero, planes, testimonios…)
│   ├── plans/ cabins/ transports/  # Vistas de catálogo y detalle
│   ├── layout/               # Navbar, Footer, StickySummaryBar
│   ├── shared/               # Galerías, filtros, paginación, diálogos
│   └── ui/                   # shadcn/ui
├── hooks/                    # use-mobile, use-prefetch-data, use-scroll-on-navigate…
├── lib/
│   ├── store.ts              # Estado de navegación (Zustand)
│   ├── api.ts                # Lectura/normalización de los JSON
│   ├── data.ts               # Tipos + data embebida (pastTripImages)
│   ├── favorites.ts          # Favoritos (localStorage)
│   ├── geolocation.ts        # Detección de ciudad del usuario
│   └── config.ts             # WHATSAPP_NUMBER y otras constantes
└── data/static/              # Catálogo en JSON (fuente de verdad)
```

### Comportamientos clave

- **Scroll al cambiar de vista:** manejado por `useScrollOnNavigate` (`src/hooks/`),
  no dentro del store, para mantenerlo compatible con SSR.
- **Prefetch:** `usePrefetchData` precarga planes y cabañas en segundo plano.
- **Favoritos:** persisten en `localStorage`.
- **CTA principal:** WhatsApp (`src/lib/config.ts` → `WHATSAPP_URL`).

## Personalización de contenido

Editá los archivos en `src/data/static/`:

- `plans.json` — experiencias y viajes
- `cabins.json` — cabañas y alojamientos
- `transports.json` — vehículos de transporte
- `testimonials.json` — opiniones de viajeros
- `hero-images.json` — imágenes del carrusel del hero
- `site-content.json` — config general (nav, footer, orden de secciones del home, campaña)

La especificación funcional completa está en [`SPECIFICATION.md`](./SPECIFICATION.md).

## Deploy

`next.config.ts` usa `output: "standalone"`, apto para Docker / Vercel / cualquier host
Node. En Vercel, conectá el repo y deployá sin configuración extra.
