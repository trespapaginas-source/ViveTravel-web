import type { SiteContentData } from "./content-types";

export const defaultSiteContent: SiteContentData = {
  hero: {
    brandLabel: "Vive Travel",
    title: "Viaja por el",
    titleHighlight: "mundo",
    subtitle:
      "Experiencias únicas diseñadas y respaldadas por Luisito el viajero y su equipo. Vuelos, alojamiento y diversión garantizada.",
    ctaPlans: "Ver planes turísticos",
    ctaCabins: "Personalizar mi viaje",
  },

  featuredPlans: {
    title: "Experiencias destacadas",
    subtitle: "Experiencias que conectan Colombia, desde la costa hasta el interior",
    priceLabel: "Desde",
    viewMore: "Ver más",
    viewAll: "Ver todas las experiencias",
  },

  carousel: {
    title: "Nuestros viajeros",
    subtitle: "Ya vivieron la experiencia",
    brandHover: "Vive Travel",
    stats: [
      { value: "500+", label: "Viajeros felices" },
      { value: "50+", label: "Experiencias realizadas" },
      { value: "4.8", label: "Calificación promedio" },
      { value: "12+", label: "Destinos en Colombia" },
    ],
  },

  testimonials: {
    title: "Lo que dicen nuestros viajeros",
    subtitle: "Historias reales de quienes ya viajaron con nosotros",
  },

  groupTrips: {
    label: "Viajes grupales",
    title: "Viaja en grupo y",
    titleHighlight: "paga menos",
    description:
      "Organiza tu viaje con amigos, familia o compañeros de trabajo. Tarifas especiales para grupos, itinerarios a tu medida y atención dedicada.",
    ctaQuote: "Solicitar cotización",
    ctaPlans: "Ver experiencias",
    benefits: [
      {
        title: "Descuentos grupales",
        description: "Hasta 20% de descuento para grupos desde 8 personas",
      },
      {
        title: "Itinerarios flexibles",
        description: "Fechas y horarios adaptados a tu grupo",
      },
      {
        title: "Experiencias compartidas",
        description: "Crea recuerdos con quienes más quieres",
      },
      {
        title: "Atención personalizada",
        description: "Coordinador dedicado para tu grupo",
      },
    ],
    stats: [
      { value: "20%", label: "Descuento máximo" },
      { value: "8+", label: "Personas mínimo" },
      { value: "24h", label: "Tiempo de respuesta" },
    ],
  },

  customTrips: {
    label: "Tu aventura, tu estilo",
    title: "Viajes",
    titleHighlight: "personalizados",
    description:
      "¿No encuentras lo que buscas? Nosotros te ayudamos a crear el viaje perfecto. Cuéntanos tu idea y la hacemos realidad en cualquier destino.",
    benefits: [
      {
        title: "Flexibilidad total",
        description: "Elige destinos, actividades y ritmo. Tú decides.",
      },
      {
        title: "Expertos locales",
        description: "Guías que conocen cada rincón de la costa y más allá.",
      },
      {
        title: "Sin intermediarios",
        description: "Tarifas directas y transparentes. Mejor precio garantizado.",
      },
    ],
    ctaTitle: "¿Listo para crear tu viaje ideal?",
    ctaDescription:
      "Cuéntanos qué experiencia buscas, cuántos días tienes y tu presupuesto. Nosotros nos encargamos del resto. ¡Es momento de viajar a tu manera!",
    ctaContact: "Contáctanos",
    ctaPlans: "Ver experiencias",
  },

  contact: {
    badge: "Contáctanos",
    title: "¿Listo para tu",
    titleHighlight: "próxima aventura",
    subtitle:
      "Estamos aquí para ayudarte a planear el viaje perfecto. Escríbenos y te responderemos pronto.",
    formTitle: "Envíanos un mensaje",
    whatsapp: "+57 320 934 4964",
    email: "info@vivetravel.co",
    location: "Barranquilla, Atlántico, Colombia",
    hours: "Lun - Sáb: 8:00 AM - 6:00 PM\nDom: 9:00 AM - 1:00 PM",
    instagramUrl: "#",
    facebookUrl: "#",
    whatsappUrl: "https://wa.me/573209344964",
    socialLabel: "Síguenos",
    chatTitle: "¿Prefieres chatear?",
    chatDescription: "Escríbenos por WhatsApp y recibe atención inmediata.",
    chatButton: "Chatear ahora",
  },

  policies: {
    badge: "Políticas",
    title: "Políticas de",
    titleHighlight: "Reserva y Cancelación",
    subtitle:
      "Conoce nuestras políticas antes de reservar. Compromiso con la transparencia y tu satisfacción.",
    bookingTitle: "Políticas de Reserva",
    bookingSubtitle: "Condiciones para realizar y gestionar tu reserva",
    cancellationTitle: "Políticas de Cancelación",
    cancellationSubtitle:
      "Condiciones para cancelaciones, reembolsos y casos especiales",
    footerText:
      "Si tienes preguntas sobre nuestras políticas, contáctanos. Estamos para ayudarte.",
    lastUpdate:
      "Última actualización: Enero 2025. Las políticas están sujetas a cambios sin previo aviso.",
    bookingPolicies: [
      {
        id: "booking-process",
        title: "Proceso de Reserva",
        content: `Para realizar una reserva con Vive Travel, sigue estos pasos:

1. Selecciona el plan turístico o alojamiento de tu preferencia a través de nuestro sitio web o contacto directo.
2. Completa el formulario de reserva con tus datos personales y los detalles del viaje.
3. Recibirás una cotización personalizada por correo electrónico o WhatsApp en un plazo máximo de 24 horas.
4. Una vez confirmes la cotización, se generará tu reserva provisional.
5. Realiza el pago inicial según las condiciones indicadas para confirmar tu reserva.

Las reservas provisionales tienen una vigencia de 48 horas. Si no se recibe el pago en este plazo, la reserva será cancelada automáticamente.`,
      },
      {
        id: "payments",
        title: "Pagos y Formas de Pago",
        content: `Aceptamos las siguientes formas de pago:

- Transferencia bancaria (Bancolombia, Davivienda, BBVA)
- PSE – Pagos Seguros en Línea
- Tarjetas de crédito y débito (Visa, Mastercard)
- Nequi y Daviplata
- Efectivo en nuestra oficina

**Plan de pagos diferido**
Para planes turísticos con valor superior a $1,000,000 COP, ofrecemos la opción de pago en cuotas: 40% al momento de la reserva, 30% a los 15 días y 30% restante 5 días antes del viaje.

Todos los precios incluyen IVA cuando aplica. Los precios están sujetos a cambio sin previo aviso hasta que la reserva sea confirmada.`,
      },
      {
        id: "confirmations",
        title: "Confirmación de Reserva",
        content: `Tu reserva será considerada **confirmada** cuando:

- Hayas recibido el correo electrónico de confirmación con el número de reserva asignado.
- Se haya recibido y verificado el pago inicial correspondiente.
- Se hayan enviado los documentos de viaje (itinerario, vouchers, información del alojamiento).

La confirmación suele realizarse en un plazo de 24 a 48 horas hábiles después de recibido el pago. Te recomendamos revisar todos los datos del itinerario y contactarnos de inmediato si encuentras alguna discrepancia.`,
      },
      {
        id: "modifications",
        title: "Modificaciones y Cambios",
        content: `Entendemos que los planes pueden cambiar. Puedes solicitar modificaciones a tu reserva bajo las siguientes condiciones:

- **Cambios de fecha:** Permitidos hasta 7 días antes del viaje, sujeto a disponibilidad. Pueden aplicarse tarifas diferenciales.
- **Cambio de plan:** Posible hasta 5 días antes del viaje, sujeto a disponibilidad y diferencia de precio.
- **Cambio de viajero:** Se permite cambiar el nombre del viajero hasta 3 días antes del viaje sin costo adicional.
- **Adición de servicios:** Puedes agregar servicios complementarios en cualquier momento, sujeto a disponibilidad.

Todas las modificaciones deben solicitarse por escrito (correo electrónico o WhatsApp) y serán confirmadas por nuestro equipo.`,
      },
      {
        id: "requirements",
        title: "Requisitos para Viajeros",
        content: `Es responsabilidad del viajero cumplir con los siguientes requisitos:

- **Documentación:** Cédula de ciudadanía o pasaporte vigente según el destino. Para menores de edad, registro civil y permiso de salida del país si aplica.
- **Salud:** Vacunas requeridas según el destino (consultar con anticipación). Seguro de viaje obligatorio para destinos internacionales.
- **Información médica:** Informar sobre condiciones médicas preexistentes, alergias o necesidades especiales al momento de la reserva.
- **Edad mínima:** Los menores de 18 años deben viajar acompañados por un adulto responsable o contar con autorización notariada.

Vive Travel no se hace responsable por la denegación de ingreso a destinos nacionales o internacionales por incumplimiento de requisitos documentales o de salud.`,
      },
    ],
    cancellationPolicies: [
      {
        id: "early-cancellation",
        title: "Cancelaciones Anticipadas",
        content: `Las cancelaciones realizadas con suficiente anticipación tendrán las siguientes condiciones de reembolso:

- **Más de 15 días antes del viaje:** Reembolso del 90% del valor pagado (se retiene 10% por gastos administrativos).
- **Entre 10 y 15 días antes del viaje:** Reembolso del 70% del valor pagado.
- **Entre 7 y 9 días antes del viaje:** Reembolso del 50% del valor pagado.

Los reembolsos se procesarán en un plazo de 5 a 10 días hábiles por el mismo medio de pago utilizado.`,
      },
      {
        id: "late-cancellation",
        title: "Cancelaciones Tardías",
        content: `Las cancelaciones realizadas con menos de 7 días de anticipación están sujetas a las siguientes condiciones:

- **Entre 3 y 6 días antes del viaje:** Reembolso del 25% del valor pagado.
- **Menos de 3 días antes del viaje:** No aplica reembolso.

Los gastos no reembolsables de proveedores (hoteles, transporte, actividades) serán descontados del monto a reembolsar en todos los casos. Te recomendamos contratar un seguro de cancelación al momento de reservar.`,
      },
      {
        id: "no-show",
        title: "No Show (No Presentación)",
        content: `Se considera **No Show** cuando el viajero no se presenta al servicio reservado sin haber realizado una cancelación previa.

- No aplica ningún tipo de reembolso en caso de No Show.
- No se permite la reprogramación del servicio sin costo.
- Los servicios no utilizados (comidas, excursiones, alojamiento) no serán reembolsables ni acumulables.

Si anticipas que no podrás asistir, te recomendamos cancelar o modificar tu reserva con la mayor antelación posible para minimizar pérdidas.`,
      },
      {
        id: "refunds",
        title: "Proceso de Reembolsos",
        content: `Los reembolsos siguen el siguiente proceso:

1. Solicitar el reembolso por escrito a info@vivetravel.co o por WhatsApp indicando el número de reserva.
2. Nuestro equipo verificará la solicitud y calculará el monto reembolsable según la política correspondiente.
3. Recibirás una confirmación por correo con el detalle del reembolso.
4. El reembolso se procesará en un plazo de 5 a 10 días hábiles.

- Los reembolsos se realizan por el mismo medio de pago original.
- Transferencias bancarias pueden tardar hasta 15 días hábiles en reflejarse.
- No se realizan reembolsos en efectivo en oficina para pagos electrónicos.`,
      },
      {
        id: "force-majeure",
        title: "Fuerza Mayor y Circunstancias Excepcionales",
        content: `En caso de eventos de fuerza mayor, se aplicarán las siguientes disposiciones:

Se consideran fuerza mayor: desastres naturales, epidemias, declaraciones de emergencia por autoridades gubernamentales, conflictos armados, huelgas generales, y eventos similares que imposibiliten la prestación del servicio.

- **Cancelación por Vive Travel:** Si cancelamos el viaje por fuerza mayor, ofreceremos reprogramación sin costo o reembolso del 100% del valor pagado.
- **Cancelación por el viajero por fuerza mayor:** Se evaluará caso por caso. Podrá aplicar reembolso parcial sujeto a los costos ya incurridos con proveedores.
- **Interrupción del viaje:** Si el viaje se interrumpe por fuerza mayor una vez iniciado, se reembolsará la parte proporcional de los servicios no utilizados, menos los costos no recuperables.

**Recomendación:** Siempre recomendamos adquirir un seguro de viaje que cubra cancelaciones por fuerza mayor.`,
      },
    ],
  },

  footer: {
    brandName: "Vive Travel",
    brandSub: "Colombia",
    description:
      "Planes turísticos para toda Colombia, con la costa Caribe como casa. Tu próxima aventura empieza aquí.",
    instagramUrl: "#",
    facebookUrl: "#",
    whatsappUrl: "https://wa.me/573209344964",
    exploreTitle: "Explorar",
    contactTitle: "Contacto",
    phone: "+57 320 934 4964",
    email: "info@vivetravel.co",
    location: "Barranquilla, Atlántico, Colombia",
    helpTitle: "¿Necesitas ayuda?",
    helpDescription:
      "Escríbenos por WhatsApp y te ayudamos a planear tu viaje.",
    chatButton: "Chatear ahora",
    copyright: "© {year} Vive Travel. Todos los derechos reservados.",
    madeWith: "Hecho en la costa Caribe, para toda Colombia",
  },

  navbar: {
    brandName: "Vive Travel",
    brandSub: "Colombia",
    navItems: [
      { key: "home", label: "Inicio" },
      { key: "plans", label: "Experiencias y viajes" },
      { key: "cabins", label: "Cabañas" },
      { key: "transports", label: "Transporte" },
      { key: "team", label: "Equipo" },
      { key: "contact", label: "Contacto" },
      { key: "policies", label: "Políticas" },
    ],
    ctaButton: "Reservar",
    ctaButtonMobile: "Reservar ahora",
  },

  plansList: {
    title: "Experiencias y viajes",
    subtitle:
      "Experiencias en la costa Caribe y destinos de toda Colombia. Playa, naturaleza, aventura y cultura.",
    emptyState: "No hay experiencias disponibles en esta categoría",
    viewAll: "Ver todas las experiencias",
  },

  cabinsList: {
    title: "Alojamientos",
    subtitle:
      "Cabañas y alojamientos en la costa Caribe. Frente al mar, en la naturaleza o en el corazón de la ciudad.",
    emptyTitle: "¿No encuentras lo que buscas?",
    emptyDescription:
      "Contáctanos y te ayudamos a encontrar el alojamiento ideal.",
    contactButton: "Contáctanos",
  },

  promotions: {
    sectionTitle: "Módulo Promocional",
    banners: [
      {
        id: 1,
        url: "/images/banner-san-andres.webp",
        alt: "Plan 2x1 San Andrés"
      },
      {
        id: 2,
        url: "/images/banner-punta-cana.webp",
        alt: "Escápate al paraíso Punta Cana"
      },
      {
        id: 3,
        url: "/images/banner-eje-cafetero.webp",
        alt: "Tour Eje Cafetero"
      }
    ],
    valueCards: [
      {
        id: 1,
        title: "Promos y medios de pago",
        description: "Cuotas con tarjetas de crédito, transferencias y facilidades de pago."
      },
      {
        id: 2,
        title: "Beneficios y promociones",
        description: "Acumula beneficios y aprovecha todas las promociones 2x1 activas."
      },
      {
        id: 3,
        title: "Mi agente Vive Travel",
        description: "Asesoría personalizada por WhatsApp o llamada con nuestros agentes."
      }
    ]
  },

  influencer: {
    name: "Luis Méndez",
    role: "Fundador y Viajero",
    quote: "Mi propósito no es solo venderte un viaje, sino asegurarme de que vivas la misma experiencia increíble que yo descubrí He recorrido cada uno de estos destinos para garantizarte calidad, seguridad y recuerdos inolvidables.",
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=1000&fit=crop&q=80",
    instagramUrl: "https://instagram.com/luismendez",
    instagramLabel: "Sigue mis viajes",
    statsLabel: "+500 viajeros felices",
  },

  team: {
    title: "Nuestro Equipo",
    subtitle: "Tres amigos, una pasión: conectar al mundo con la magia del Atlántico colombiano",
    description: "Lo que comenzó como un sueño entre tres amigos se convirtió en una agencia que transforma la manera de vivir el Caribe colombiano. Cada uno aporta su talento único para que tu experiencia sea extraordinaria.",
  },

  gallery: {
    title: "Explora destinos",
    titleHighlight: "nacionales",
    subtitle: "Descubre los mejores tours y experiencias en los destinos más emblemáticos del Caribe colombiano",
    destinations: [
      {
        id: "dest-baru",
        title: "Cartagena",
        subtitle: "Historia, cultura y encanto colonial",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&h=600&fit=crop&q=80",
      },
      {
        id: "dest-pasadias",
        title: "Santa Marta",
        subtitle: "Naturaleza viva donde la sierra abraza el mar",
        image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1400&h=600&fit=crop&q=80",
      },
      {
        id: "dest-rosario",
        title: "Quindío",
        subtitle: "La verdadera esencia y tradición cafetera",
        image: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=1400&h=600&fit=crop&q=80",
      },
      {
        id: "dest-bahia",
        title: "Más de Colombia",
        subtitle: "Descubre otras joyas y destinos inexplorados",
        image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1400&h=600&fit=crop&q=80",
      },
    ],
  },

  international: {
    title: "Explora destinos",
    titleHighlight: "internacionales",
    subtitle: "Descubre escapadas inolvidables fuera de Colombia",
    destinations: [
      {
        name: "Cancún",
        eyebrow: "Escapadas al Caribe mexicano",
        image: "https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=900&h=1125&fit=crop&q=80",
        description: "Escapadas espectaculares al Caribe mexicano. Disfruta de playas de arena blanca, una vibrante vida nocturna y fascinantes tours arqueológicos."
      },
      {
        name: "Punta Cana",
        eyebrow: "Playas, descanso y resorts",
        image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=900&h=1125&fit=crop&q=80",
        description: "El escape perfecto con todo incluido en República Dominicana. Relájate frente a aguas cristalinas con servicios premium y descanso total."
      },
      {
        name: "San Andrés",
        eyebrow: "Mar de siete colores",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&h=1125&fit=crop&q=80",
        description: "Descubre el mar de los siete colores en Colombia. Un destino caribeño lleno de vida, arrecifes de coral y hermosas playas tropicales."
      },
    ],
  },

  homeConfig: {
    order: [
      "hero",
      "promotions",
      "plans",
      "gallery",
      "international",
      "stats",
      "groups",
      "custom",
      "testimonials",
      "team"
    ],
    active: {
      hero: true,
      promotions: true,
      plans: true,
      gallery: true,
      international: true,
      stats: true,
      groups: true,
      custom: true,
      testimonials: true,
      team: true
    }
  },
  campaign: {
    active: false,
    bannerText: "¡Aprovecha nuestro descuento especial de temporada! Reserva ahora tu plan nacional con vuelos.",
    ctaText: "Ver ofertas",
    ctaUrl: "plans"
  },
  seo: {
    metaTitle: "Vive Travel | Agencia de Viajes y Turismo en Colombia",
    metaDescription: "Planes turísticos nacionales e internacionales diseñados por Luisito el viajero. Vuelos, alojamiento y experiencias inolvidables en un solo lugar.",
    openGraphImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=630&fit=crop&q=80"
  }
};
