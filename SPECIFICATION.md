# ESPECIFICACIÓN FUNCIONAL Y TÉCNICA DE LA INTERFAZ PÚBLICA (VIVE TRAVEL ESTÁTICO)

Este documento sirve como la especificación funcional definitiva y completa de la interfaz pública de la página web de la agencia de viajes **Vive Travel**. Su objetivo es detallar de forma exhaustiva cada componente, vista, interacción, comportamiento responsive y lógica de negocio para permitir la reconstrucción idéntica del sitio web en caso de pérdida total del código fuente.

---

## 1. ARQUITECTURA GENERAL DEL SITIO

### 1.1 Modelo de SPA (Single Page Application)
La aplicación web está estructurada como una **SPA** en Next.js. Toda la navegación principal ocurre de manera fluida y sin recargas de página mediante un enrutador interno basado en estados administrado globalmente por **Zustand** (`src/lib/store.ts`).

Adicionalmente, se cuenta con rutas físicas estáticas (`/planes`, `/planes/[id]`, `/cabanas`, `/contacto`, `/politicas`) que actúan como puntos de entrada de SEO. Estas páginas cargan e instancian el mismo layout y los componentes de visualización del enrutador interno para mantener una experiencia unificada y permitir enlaces profundos.

### 1.2 Mapa de Navegación y Vistas (`ViewType`)
El enrutador interno gestiona 10 vistas principales:
1.  **`home`**: Página de inicio con buscador integrado, secciones promocionales, galerías de destinos y opiniones de usuarios.
2.  **`plans`**: Catálogo completo de planes y experiencias turísticas con barra lateral de filtros avanzados.
3.  **`plan-detail`**: Ficha detallada de una experiencia seleccionada (itinerario, inclusiones, exclusiones, tarifas, reservas).
4.  **`cabins`**: Catálogo de alojamientos y cabañas de la agencia con filtros específicos.
5.  **`cabin-detail`**: Ficha detallada de un alojamiento (habitaciones, comodidades, mapa interactivo, reglas de la casa).
6.  **`contact`**: Formulario de consultas con validaciones dinámicas y datos físicos de contacto.
7.  **`policies`**: Sección informativa de políticas de reserva y cancelación con formato colapsable.
8.  **`favorites`**: Panel del usuario que lista las experiencias y cabañas marcadas como favoritas.
9.  **`team`**: Vista de presentación del equipo fundador de la agencia.

### 1.3 Relación entre Módulos y Flujo del Estado
El flujo de estado se centraliza en el hook `useNavigation`. La modificación del estado de navegación activa la recarga del componente correspondiente dentro del router de vistas (`ViewRouter` en `src/app/page.tsx`).

```
             ┌─────────────────────────────────────────┐
             │            Navbar & Footer              │
             │     (Controlan el cambio de vista)      │
             └────────────────────┬────────────────────┘
                                  │
                                  ▼
                    ┌───────────────────────────┐
                    │      Zustand Store        │
                    │   (useNavigation State)   │
                    └─────────────┬─────────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         ▼                        ▼                        ▼
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│    Home View    │      │   List Views    │      │  Detail Views   │
│ (Secciones      │      │ (Filtros,       │      │ (Galerías,      │
│  dinámicas)     │      │  Paginación)    │      │  WhatsApp CTA)  │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

---

## 2. LAYOUT PRINCIPAL

El layout envuelve todas las vistas y proporciona un marco estructural rígido con las siguientes secciones:

### 2.1 Top Bar (Barra Superior de Campaña)
*   **Posición**: Fija arriba del todo (`top-0`), con posición absoluta/relativa según el scroll.
*   **Visibilidad**: Se renderiza únicamente si la propiedad `active` del objeto `campaign` en `site-content.json` está establecida en `true`.
*   **Diseño**: Fondo de color naranja (`--color-sunset`: `#F27405`), texto blanco, alineación centrada. Contiene un texto promocional y un botón/enlace de acción.
*   **Comportamiento**: Altura fija de `40px`. En móviles oculta parte del texto para priorizar la legibilidad.

### 2.2 Header / Navbar (Barra de Navegación)
*   **Posición**: Sticky debajo del Top Bar. Se fija arriba (`top-0` o `top-10` si la campaña está activa) con fondo de cristal difuminado (`backdrop-blur-md` y fondo blanco con opacidad del 80%).
*   **Alineación**: Contenedor centrado al máximo ancho (`max-w-7xl`), con espaciado horizontal (`px-4 sm:px-6 lg:px-8`).
*   **Estructura Visual**:
    *   **Izquierda**: Logo corporativo en SVG/PNG (`public/logo.svg`). Tamaño: `140px` de ancho en escritorio, `110px` en móvil.
    *   **Centro**: Links de navegación generados dinámicamente desde `site-content.json` (`Inicio`, `Experiencias y viajes`, `Cabañas`, `Equipo`, `Políticas`).
        *   *Estado activo*: Texto en color turquesa (`--color-ocean`: `#008B8B`) con una pequeña barra inferior de color turquesa de `2px` de altura.
        *   *Hover*: Transición suave hacia el color de marca con una duración de `200ms` (`duration-200`).
    *   **Derecha**:
        *   **Botón de Favoritos**: Ícono de Corazón (`Heart`) con un badge rojo que muestra el contador de favoritos en tiempo real. Al añadir un ícono, el corazón realiza una animación de pulso (`animate-ping` limitado a 1 ciclo).
        *   **Botón CTA ("Reservar")**: Botón con fondo turquesa (`bg-ocean`), texto blanco, bordes redondeados (`rounded-full`), tamaño de texto pequeño (`text-sm font-semibold`). Al hacer clic, navega a la sección de Contacto.
*   **Responsive**: En pantallas móviles/tablets (menores a `1024px`), el menú central se oculta y se muestra un botón tipo menú hamburguesa en la esquina derecha que despliega un panel lateral (`Sheet` de Shadcn UI) conteniendo los links de navegación verticalizados y el botón de contacto en tamaño expandido.

### 2.3 Footer (Pie de Página)
*   **Posición**: Siempre al final del contenedor principal (`mt-auto`).
*   **Diseño**: Fondo gris oscuro (`bg-[#111827]`), texto gris claro (`text-[#9CA3AF]`).
*   **Secciones**:
    1.  **Columna 1 (Marca)**: Logo negativo blanco (`public/logos/vive-travel-white.png`), breve descripción de la agencia y links a redes sociales (Instagram, Facebook, WhatsApp con íconos de Lucide).
    2.  **Columna 2 (Explorar)**: Enlaces rápidos a Inicio, Planes, Cabañas, Equipo y Políticas.
    3.  **Columna 3 (Contacto)**: Datos físicos de la empresa (Ubicación, Teléfono con enlace `tel:`, Correo electrónico con enlace `mailto:`).
    4.  **Columna 4 (Buzón de Ayuda)**: Tarjeta destacada con CTA de WhatsApp que dice "Chatear ahora".
*   **Barra de Derechos Autorales**: Ubicada en la base del Footer. Texto centrado en móvil y justificado a los lados en escritorio con el mensaje de copyright y el lema "Hecho en la costa Caribe, para toda Colombia". Separado por una línea sutil de color `--border` con opacidad reducida.

---

## 3. PÁGINAS Y VISTAS AL DETALLE

### 3.1 Página de Inicio (`home`)
*   **Objetivo**: Captar la atención del viajero, proveer un buscador de destinos y mostrar lo destacado.
*   **Componentes Clave**:
    1.  **Hero Section**:
        *   **Carrusel de Fondo**: Muestra imágenes espectaculares de destinos que transicionan automáticamente cada `5000ms`.
        *   **Textos Destacados**: Título principal con realce de color turquesa (ej. "Descubre la Magia de *Malambo*").
        *   **Buscador Integrado**: Caja de búsqueda flotante con pestañas para "Internacionales", "Nacionales", "Circuitos", "Pasadías", "Grupales" y "Alojamientos".
            *   *Campos del Buscador*: Campo de destino (con autocompletado inteligente de las ciudades principales: `Cartagena`, `Santa Marta`, `San Andrés Islas`, `Barranquilla`, `Eje Cafetero`, `Cancún`, `Punta Cana`), selector de fechas (mediante Popover con Calendario integrado), y selector de huéspedes (Adultos y Niños).
            *   *Acción*: Al hacer clic en "Buscar Experiences", redirecciona a la vista `plans` o `cabins` aplicando los filtros correspondientes de destino y fechas en el store.
    2.  **Módulo Promocional**: Carrusel interactivo que muestra banners publicitarios estáticos de promociones activas (ej. "Plan 2x1 San Andrés" o "Punta Cana Todo Incluido"). Acompañado de 3 tarjetas con beneficios clave (facilidades de pago, promociones activas y atención por asesores).
    3.  **Sección de Experiencias Destacadas**: Muestra una cuadrícula (`grid`) de las 3 tarjetas de planes turísticos con mejor calificación (`rating`). Incluye un botón para navegar a la lista completa de planes.
    4.  **Sección de Destinos Nacionales e Internacionales**: Colección de galerías de imágenes con hover animado (escala de imagen de `1.05x`) que representan zonas clave (Cartagena, Santa Marta, Cancún, Punta Cana).
    5.  **Carrusel de Testimonios**: Control táctil y autoplay que rota las opiniones de los viajeros, mostrando su avatar (iniciales de su nombre), estrellas de valoración (`1-5`), texto de opinión y destino visitado.
    6.  **Sección de Equipo**: Bloque corporativo con la foto y la historia de los 3 fundadores de la agencia.

### 3.2 Catálogo de Experiencias y Viajes (`plans`)
*   **Objetivo**: Permitir la búsqueda y filtrado de la oferta turística completa.
*   **Estructura Visual**:
    *   **Izquierda (Sidebar)**: Panel de filtros de escritorio con anchos de `280px` (`w-72`).
    *   **Centro/Derecha**: Barra de herramientas superior (`ListToolbar`) y rejilla de tarjetas de planes.
*   **Barra de Herramientas**:
    *   Muestra el total de resultados encontrados.
    *   **Modo de Visualización**: Conmutador de íconos (Grid de 3 columnas vs. Lista vertical).
    *   **Selector de Ordenamiento**: Ordenar por "Relevancia", "Precio: Bajo a Alto", "Precio: Alto a Bajo", o "Mejor Valorados".
*   **Paginación**: Ubicada en la base. Divide los resultados en páginas de 6 ítems (`ITEMS_PER_PAGE = 6`). Botones de página activa con fondo turquesa, y botones "Anterior" y "Siguiente" deshabilitados de forma inteligente.
*   **Responsive**: El panel de filtros lateral se oculta en móviles y tablets, y se activa a través de un botón flotante inferior o de cabecera que abre un diálogo deslizable vertical (`FilterMobileSheet`).

### 3.3 Detalle de Plan (`plan-detail`)
*   **Ruta dinámica**: `/planes/[id]`
*   **Estructura**:
    *   **Cabecera de Retorno**: Botón con ícono `ArrowLeft` que regresa a la vista anterior (`plans` o `favorites`) manteniendo los filtros aplicados en el store.
    *   **Sección de Título e Interacciones**: Muestra el nombre del plan, ubicación, categoría, y dos botones: "Favorito" (ícono de corazón) y "Compartir" (abre modal con enlace).
    *   **Galería Fotográfica**: Una imagen grande destacada a la izquierda (`2/3` de ancho) y dos pequeñas verticales a la derecha (`1/3` de ancho) con botón interactivo de visualización en pantalla completa (`Lightbox` integrado).
    *   **Ficha Técnica**: Iconos y textos de Duración, Dificultad, Capacidad Máxima y Horarios de Salida.
    *   **Itinerario**: Secciones colapsables paso a paso (Día 1, Día 2, etc.) que detallan las actividades planificadas con animaciones fluidas al abrirse.
    *   **Incluye / No Incluye**: Grid de dos columnas que contrapone lo que el plan ofrece (con íconos de check verde) y lo que no cubre (con íconos de X roja).
    *   **Caja de Reserva (Sticky Sidebar)**:
        *   Muestra el precio base por persona.
        *   Selector de cantidad de viajeros (botones de incrementar/decrementar con validación de límite de huéspedes).
        *   Popover con calendario para elegir la fecha de viaje.
        *   **Botón Principal ("Reservar por WhatsApp")**: Botón verde de WhatsApp con ícono de conversación. Al hacer clic, abre una pestaña hacia la API de WhatsApp (`https://wa.me/...`) con un mensaje estructurado automáticamente:
            *   *Mensaje de ejemplo:* `¡Hola Vive Travel! Estoy interesado en reservar el plan "Aventura en Cancún" para 2 personas el día 15/07/2026. ¿Tienen disponibilidad?`

### 3.4 Catálogo de Cabañas (`cabins`)
*   **Estructura**: Rejilla de visualización de cabañas similar al catálogo de planes, pero optimizada para alojamientos.
*   **Filtros Específicos**:
    *   Ubicaciones (ej. `Santa Verónica`, `Pradomar`).
    *   Rango de precios por noche.
    *   Capacidad máxima de huéspedes.
    *   Número de habitaciones.

### 3.5 Detalle de Cabaña (`cabin-detail`)
*   **Ruta dinámica**: `/cabanas/[id]`
*   **Características Clave**:
    *   **Galería Premium**: Visualizador de fotos optimizado con carrusel táctil en móviles.
    *   **Ficha de Habitaciones**: Desglose visual de camas por habitación (ej. "Habitación 1: 1 Cama King y 1 Cama Auxiliar").
    *   **Comodidades (Amenities)**: Rejilla de íconos representativos de servicios (WiFi, Piscina privada, Aire acondicionado, Frente al mar, Cocina equipada).
    *   **Mapa de Ubicación**: Renderiza un mapa interactivo (iframe seguro o marcador geográfico) en base a las coordenadas de latitud y longitud especificadas en el archivo JSON.
    *   **Reglas del Alojamiento**: Lista ordenada de restricciones (ej. "No se permiten fiestas", "Mascotas bajo solicitud", "Prohibido fumar").
    *   **Caja de Tarifa**: Muestra el precio por noche y calcula el total estimado según el rango de fechas elegido. Botón de reserva directa por WhatsApp con mensaje pre-rellenado indicando nombre de la cabaña, fecha de Check-in y Check-out.

### 3.6 Página de Contacto (`contact`)
*   **Objetivo**: Recepción de consultas personalizadas.
*   **Módulo Izquierdo**: Información de contacto con links interactivos de WhatsApp, correo electrónico y mapa físico.
*   **Formulario de Contacto (Derecha)**:
    *   *Campos*: Nombre, Email, Teléfono, Asunto (Selector), Mensaje, y Método de contacto preferido (WhatsApp / Email).
    *   *Validación*: Todos los campos son validados en tiempo real mediante **Zod** y **React Hook Form**. Si hay error, el campo se tiñe de color rojo (`border-destructive`) y se muestra un mensaje de advertencia debajo.
    *   *Simulación*: Al enviar, el botón cambia a estado de carga (`loading`) con un spinner giratorio durante `1500ms`, tras lo cual muestra un mensaje flotante de éxito (`Sonner Toast`) confirmando el envío y vaciando el formulario.

### 3.7 Políticas de Reserva (`policies`)
*   **Objetivo**: Mostrar condiciones de servicio, términos y cancelaciones.
*   **Diseño**: Secciones tipo acordeón colapsable (`Accordion` de Radix UI). Al hacer clic en un encabezado, este rota su ícono `Chevron` y expande el texto descriptivo con una transición suave de altura (`animate-accordion-down`).

---

## 4. ESPECIFICACIÓN DE COMPONENTES E INTERACCIONES

### 4.1 Botones (`Button`)
Todos los botones de la interfaz derivan de las siguientes variantes normalizadas:

| Variante | Color de Fondo | Color de Texto | Hover State | Active/Click State |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Primary** | `--color-ocean` (`#008B8B`) | Blanco (`#FFFFFF`) | Opacidad reducida / `#03A6A6` | `#005C5C` (Escala 0.98x) |
| **Secondary** | Gris claro (`#F3F4F6`) | Negro (`#111827`) | Gris más oscuro (`#E5E7EB`) | Escala de click clásica |
| **Outline** | Transparente (borde `--border`) | `--color-ocean` | Fondo `--accent` | Efecto de pulsación |
| **Ghost** | Transparente | Color heredado | Fondo `--accent` | Transición suave |
| **WhatsApp**| Verde WhatsApp (`#25D366`) | Blanco (`#FFFFFF`) | `#20BA5A` | `#128C7E` con efecto de escala |

*   *Estado Deshabilitado (`disabled`)*: Opacidad fijada en `50%`, cursor no permitido (`cursor-not-allowed`), todas las interacciones de hover bloqueadas.
*   *Estado de Carga (`loading`)*: Muestra un ícono animado de Spinner (`Loader2` de Lucide con clase `animate-spin`) a la izquierda del texto y deshabilita el click.

### 4.2 Campos de Formulario (`Input`, `Textarea`, `Select`)
*   **Placeholder**: Texto gris claro con un tamaño de fuente de `14px`.
*   **Bordes**: Radio de borde amplio (`rounded-xl` / `12px`), color de borde neutro de contraste suave (`#E5E7EB`).
*   **Foco (`focus`)**: Al hacer click en el campo, el borde cambia al color de la marca (`--color-ocean`) y se proyecta una sombra perimetral difusa (`ring-2 ring-ocean/15`).
*   **Errores**: Borde de color rojo (`border-[#EF4444]`), ícono de advertencia opcional y mensaje en texto rojo pequeño debajo del campo.

### 4.3 Tarjeta de Cabaña (`CabinCard`)
*   **Estructura visual**: Caja rectangular vertical con bordes redondeados pronunciados (`rounded-3xl` / `24px`), borde sutil perimetral y sombra ligera (`shadow-[0_8px_30px_rgb(0,0,0,0.04)]`).
*   **Imagen**: Ocupa el `50%` superior de la tarjeta. Incluye un efecto de zoom en la foto al pasar el mouse por encima de la tarjeta.
*   **Botón Favoritos**: Ícono flotante de corazón en la esquina superior derecha con fondo blanco y efecto de cristal difuminado. Si la cabaña es favorita, el corazón es rojo sólido; de lo contrario, es transparente con borde gris.
*   **Cuerpo de la tarjeta**:
    *   *Línea 1*: Categoría / Ubicación en texto pequeño en mayúsculas (`text-xs font-bold tracking-wider text-muted-foreground`).
    *   *Línea 2*: Título en negrita destacado (`text-lg font-bold text-foreground`).
    *   *Línea 3 (Ficha técnica)*: Línea horizontal con íconos pequeños de:
        *   `Users` (Capacidad: ej. "8 Huéspedes")
        *   `BedDouble` (Habitaciones: ej. "3 Hab")
        *   `Bath` (Baños: ej. "2 Baños")
    *   *Línea 4 (Precio)*: Texto a la derecha con el valor destacado (ej. "$450.000 COP / noche").
    *   *Línea 5 (Descripción)*: Resumen corto de hasta dos líneas (`line-clamp-2`) para no alterar el tamaño de la tarjeta.
    *   *Línea 6 (Botones)*: Botón principal "Ver detalles" de ancho completo que cambia su fondo a turquesa en hover.

### 4.4 Tarjeta de Plan (`PlanCard`)
*   Mismo diseño y estructura de esquinas y sombras que la tarjeta de cabaña.
*   **Ficha técnica propia**: Muestra íconos de:
    *   `Clock` (Duración del viaje: ej. "3 días / 2 noches")
    *   `Compass` (Nivel de dificultad: "Fácil" / "Moderado" / "Avanzado")
*   **Precio**: Se indica el precio con un label de "Desde" y el valor monetario base (ej. "Desde $120.000 COP").
*   **Badge de Categoría**: Etiqueta flotante de color sobre la imagen que clasifica la experiencia (ej. "Playa", "Naturaleza", "Aventura", "Grupales").

---

## 5. DISEÑO VISUAL Y SISTEMA DE DISEÑO (DESIGN SYSTEM)

### 5.1 Tipografía
El sitio utiliza la fuente sans-serif moderna del sistema (ej. **Geist Sans** o **Inter**), configurada con los siguientes parámetros de jerarquía:

| Elemento | Tamaño en Escritorio | Tamaño en Móvil | Peso de Fuente | Espaciado / Tracking | Color de Texto |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **H1 (Título Hero)** | `48px` (`text-5xl`) | `30px` (`text-3xl`) | Negrita (`font-bold` / 700) | `-0.02em` | `#111827` (Fondo claro) / Blanco |
| **H2 (Secciones)** | `36px` (`text-4xl`) | `24px` (`text-2xl`) | Negrita (`font-bold` / 700) | `-0.01em` | `#111827` |
| **H3 (Tarjetas/Bloques)**| `20px` (`text-xl`) | `18px` (`text-lg`) | Seminegrita (`font-semibold` / 600) | normal | `#111827` / `--color-ocean` |
| **Párrafos** | `16px` (`text-base`) | `14px` (`text-sm`) | Normal (`font-normal` / 400) | normal | `#374151` (`text-gray-700`) |
| **Labels / Etiquetas** | `14px` (`text-sm`) | `12px` (`text-xs`) | Seminegrita (`font-semibold` / 600) | normal | `#111827` / `#6B7280` |
| **Captions / Leyendas**| `12px` (`text-xs`) | `11px` | Normal (`font-normal` / 400) | `0.05em` (Caps) | `#6B7280` |

### 5.2 Iconografía (Lucide Icons)
El proyecto utiliza íconos vectoriales coherentes de la biblioteca **Lucide**:
*   `MapPin`: Representación de locación geográfica de planes y cabañas.
*   `Clock`: Duración estimada o plazos de reservas.
*   `Users`: Capacidad de alojamiento o grupos de turistas.
*   `BedDouble`: Indicador de habitaciones y camas.
*   `Search`: Acciones de inicio de consulta o barra buscadora.
*   `Heart`: Indicador de favoritos en navbar y tarjetas.
*   `Compass`: Categoría de viajes, tours y nivel de dificultad.
*   `ChevronDown` / `ChevronUp`: Acordeones de políticas y dropdowns del menú.
*   `ArrowLeft`: Retornos a vistas anteriores.
*   `Share2`: Abre diálogo de compartir.

---

## 6. LÓGICA DE INTERACCIONES Y COMPORTAMIENTO

### 6.1 Lógica de Filtros
El catálogo aplica filtros instantáneos y reactivos sobre la base de datos JSON importada localmente:
1.  **Filtros Multi-selección (Checkbox)**: El usuario puede marcar múltiples categorías o ubicaciones. La lógica interna realiza una búsqueda inclusiva (OR) entre los elementos del mismo tipo y exclusiva (AND) entre diferentes tipos de filtros (ej: Categoría = "Playa" AND Ubicación = "Santa Marta").
2.  **Slider de Rangos de Precio**: Slider deslizante con dos tiradores que definen el precio mínimo y máximo. El listado se actualiza en tiempo real al arrastrar.
3.  **Estado de catálogos vacíos**: Si al cruzar los filtros no se encuentran registros, la interfaz remueve la rejilla y muestra una sección informativa con un ícono ilustrativo, un título ("No se encontraron resultados") y un botón destacado para limpiar filtros ("Restablecer filtros") que devuelve los estados a su valor por defecto.

### 6.2 Lógica de Favoritos (Local Storage)
*   **Persistencia**: El listado de favoritos se almacena de forma persistente en el navegador del usuario utilizando `localStorage`.
*   **Acción**: Al pulsar el botón de corazón de una tarjeta, la función `toggleFavorite(id)` añade o remueve el identificador del arreglo de favoritos.
*   **Contador del Navbar**: El total de favoritos se lee reactivamente. Al cambiar, el badge del navbar realiza una animación de escala y pulso para llamar la atención del usuario.

### 6.3 Buscador de Destinos (Fuzzy Search & Autocomplete)
*   El campo de destino escucha el tecleo del usuario (`onChange`).
*   Muestra una ventana desplegable con sugerencias de las ciudades principales si el texto ingresado coincide parcialmente con alguna de ellas (ignora mayúsculas y acentos).
*   Al seleccionar una sugerencia del listado, el texto se inserta en el campo y se enfoca el selector de fechas.

### 6.4 Modales (Diálogos Flotantes)
*   **Share Dialog (Compartir)**: Se despliega al hacer clic en el botón de compartir. Muestra el título del plan, un campo de solo lectura con el enlace corto de la página actual y un botón de "Copiar enlace". Al copiar, el botón cambia temporalmente su texto a "¡Copiado!" con un check verde por `2000ms`.
*   **Animación de Apertura**: Fondo oscuro con desenfoque de fondo (`bg-black/50 backdrop-blur-sm`) que entra con un fade-in suave, y la ventana modal escala de `95%` a `100%` en un lapso de `150ms`.

### 6.5 Carruseles (Embla Carousel)
*   **Comportamiento**: Rotación fluida con soporte de arrastre manual (drag) y swipe en dispositivos móviles táctiles.
*   **Autoplay**: Intervalo de transición de `4000ms` a `5000ms` según el carrusel. La rotación se pausa temporalmente si el cursor del mouse está sobre el componente (`pauseOnHover`).
*   **Botones de Navegación**: Flechas flotantes en los extremos izquierdo y derecho que cambian su opacidad a `100%` en hover y se ocultan en pantallas móviles pequeñas.

---

## 7. COMPORTAMIENTO RESPONSIVE (LAYOUT ADAPTATIVO)

La interfaz utiliza puntos de corte estándar de Tailwind CSS para adaptar la cuadrícula y tamaños:

### 7.1 Rejillas (Grids Adaptativos)
*   **Tarjetas de Planes/Cabañas**:
    *   `Desktop` (`>= 1024px`): Rejilla de 3 columnas (`grid-cols-3`) o barra lateral de filtros + 2 columnas de tarjetas.
    *   `Tablet` (`>= 768px` y `< 1024px`): Rejilla de 2 columnas (`grid-cols-2`).
    *   `Mobile` (`< 768px`): 1 columna de ancho completo (`grid-cols-1`).
*   **Galería Detalle de Plan**:
    *   `Desktop`: Vista dividida 2/3 y 1/3.
    *   `Mobile`: Carrusel horizontal único con scroll lateral para deslizar fotos.

### 7.2 Menú y Cabecera
*   `Desktop`: Links textuales de navegación visibles en el centro del header.
*   `Mobile`: Los links se consolidan en el menú hamburguesa desplegable lateral con un área táctil mínima de click de `44px x 44px` para accesibilidad móvil.

---

## 8. SEO Y ACCESIBILIDAD (A11Y)

### 8.1 Estructura SEO
*   **Títulos de Página**: Cada página y vista dinámica actualiza el título del documento mediante metadatos específicos (ej. "Aventura en Cancún | Vive Travel").
*   **Meta Descripciones**: Descripciones enfocadas al marketing de viajes en el Atlántico y el Caribe.
*   **Jerarquía de Títulos (Headings)**:
    *   Un único elemento `<h1>` en la vista actual (generalmente en el título principal del Hero o del catálogo).
    *   Subsecciones e informativos organizados de manera descendente (`<h2>` para títulos de bloques, `<h3>` para nombres de tarjetas).

### 8.2 Accesibilidad (A11y)
*   **Navegación por Teclado**: Los elementos interactivos (botones, acordeones, campos y enlaces) cuentan con estados de enfoque claros (`outline-none focus-visible:ring-2`) y se puede navegar secuencialmente con la tecla `Tab`.
*   **Contraste de Color**: Todo el texto mantiene una relación de contraste mínima de `4.5:1` sobre su fondo correspondiente para asegurar la lectura por personas con dificultades visuales.
*   **Etiquetas de Accesibilidad**: Los botones que solo contienen íconos (ej. botón de cerrar en el diálogo o botón de favoritos) incluyen atributos `aria-label` descriptivos (ej. `aria-label="Cerrar modal"`, `aria-label="Agregar a favoritos"`).
