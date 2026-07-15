export interface TourPlan {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  images: string[];
  price: number;
  priceRange: string;
  duration: string;
  location: string;
  category: string;
  includes: string[];
  excludes: string[];
  highlights: string[];
  rating: number;
  reviewCount: number;
  maxGuests: number;
  difficulty: "Fácil" | "Moderado" | "Avanzado";
  schedule: string;
  meeting: string;
  published?: boolean;
  order?: number;
  fecha_salida?: string;
  itinerary?: Array<{ title: string; description: string }>;
}

export interface TransportVehicle {
  id: string;
  name: string;
  description: string;
  capacity: string;
  priceFrom: number;
  priceRange: string;
  image: string;
  features: string[];
  bestFor: string;
}

export interface BedroomInfo {
  id: string;
  title: string;
  beds: string;
  image: string;
  order: number;
  active: boolean;
}

export interface Cabin {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  images: string[];
  pricePerNight: number;
  priceRange: string;
  location: string;
  capacity: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  highlights: string[];
  rules: string[];
  rating: number;
  reviewCount: number;
  coordinates: { lat: number; lng: number };
  checkIn: string;
  checkOut: string;
  cancellationPolicy: string;
  bedroomDetails?: BedroomInfo[];
  mapsUrl?: string;
  propertyType?: string;
  icsUrl?: string;
  published?: boolean;
  order?: number;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  location: string;
  text: string;
  rating: number;
  tripName: string;
}

export interface TripImage {
  id: string;
  url: string;
  caption: string;
}

// ─── Tour Plans ────────────────────────────────────────────────────────────────

export const tourPlans: TourPlan[] = [
  {
    id: "plan-1",
    name: "Plan Manglar Mallorquín",
    slug: "plan-manglar-mallorquin",
    shortDescription:
      "Recorre los manglares de Mallorquín en kayak y descubre la fauna del ecosistema costero del Atlántico.",
    fullDescription:
      "Sumérgete en una experiencia única navegando por los canales del manglar de Mallorquín, uno de los ecosistemas más importantes de la costa caribe colombiana. Este plan incluye un recorrido guiado en kayak por los canales del manglar, donde podrás observar aves, cangrejos y otra fauna local en su hábitat natural. El guía te contará sobre la importancia ecológica del manglar y los esfuerzos de conservación. Disfruta de un refrigerio típico frente al mar y finaliza con tiempo libre en la playa de Mallorquín para relajarte y tomar fotografías.",
    images: [
      "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1468413253725-0d5181091126?w=800&h=600&fit=crop",
    ],
    price: 85000,
    priceRange: "$85.000 - $120.000 COP",
    duration: "Medio día (4 horas)",
    location: "Manglar de Mallorquín, Puerto Colombia",
    category: "Naturaleza",
    includes: [
      "Guía profesional bilingüe",
      "Equipo de kayak completo",
      "Refrigerio típico",
      "Seguro de accidentes",
      "Transporte ida y vuelta desde puntos de encuentro",
      "Charla de conservación ambiental",
    ],
    excludes: [
      "Gastos personales",
      "Fotografía profesional",
      "Comidas adicionales",
    ],
    highlights: [
      "Avistamiento de aves y fauna del manglar",
      "Navegación en kayak por canales naturales",
      "Playa de Mallorquín",
      "Refrigerio típico costeño",
    ],
    rating: 4.8,
    reviewCount: 124,
    maxGuests: 12,
    difficulty: "Fácil",
    schedule: "7:00 AM - 11:00 AM / 2:00 PM - 6:00 PM",
    meeting: "Parque principal de Puerto Colombia",
  },
  {
    id: "plan-2",
    name: "Plan Playa Blanca",
    slug: "plan-playa-blanca",
    shortDescription:
      "Disfruta de un día paradisíaco en Playa Blanca con transporte, comida y actividades acuáticas incluidas.",
    fullDescription:
      "Vive un día completo en una de las playas más hermosas del Caribe colombiano. Playa Blanca te espera con sus aguas cristalinas y arenas blancas. El plan incluye transporte cómodo desde Barranquilla, ingreso al sector premium de la playa, almuerzo típico costeño con opciones de pescado frito o pollo, y actividades acuáticas como snorkel y paddleboard. También tendrás acceso a zonas de descanso con camas y sombrillas. Un día perfecto para relajarte, nadar y disfrutar del Caribe.",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&h=600&fit=crop",
    ],
    price: 150000,
    priceRange: "$150.000 - $200.000 COP",
    duration: "Día completo (10 horas)",
    location: "Playa Blanca, Barú",
    category: "Playa",
    includes: [
      "Transporte ida y vuelta en bus climatizado",
      "Ingreso a zona premium de playa",
      "Almuerzo típico costeño",
      "Equipo de snorkel",
      "Paddleboard (30 min)",
      "Cama y sombrilla",
      "Seguro de viaje",
    ],
    excludes: [
      "Bebidas alcohólicas",
      "Gastos personales",
      "Fotos y videos profesionales",
      "Actividades no mencionadas",
    ],
    highlights: [
      "Aguas cristalinas del Caribe",
      "Almuerzo costeño incluido",
      "Snorkel y paddleboard",
      "Zona premium con camas y sombrillas",
    ],
    rating: 4.9,
    reviewCount: 287,
    maxGuests: 25,
    difficulty: "Fácil",
    schedule: "6:00 AM - 4:00 PM",
    meeting: "Centro Comercial Buenavista, Barranquilla",
  },
  {
    id: "plan-3",
    name: "Plan Senderismo Cerro de la Vieja",
    slug: "plan-senderismo-cerro-vieja",
    shortDescription:
      "Aventura de senderismo con vistas panorámicas del Atlántico desde el Cerro de la Vieja.",
    fullDescription:
      "Desafía tus sentidos con esta caminata ecológica hasta el Cerro de la Vieja, uno de los miradores naturales más impresionantes del departamento del Atlántico. Durante el recorrido, atravesarás bosques secos tropicales, observarás flora y fauna endémica, y llegarás a una cima con vistas 360° que abarcan desde la Sierra Nevada de Santa Marta hasta el mar Caribe. El plan incluye guía experto en senderismo, refrigerio energético, kit de primeros auxilios y certificado de participación. Ideal para amantes de la naturaleza y la aventura.",
    images: [
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&h=600&fit=crop",
    ],
    price: 95000,
    priceRange: "$95.000 - $130.000 COP",
    duration: "Medio día (5 horas)",
    location: "Cerro de la Vieja, Luruaco",
    category: "Aventura",
    includes: [
      "Guía de senderismo certificado",
      "Refrigerio energético",
      "Kit de primeros auxilios",
      "Seguro de accidentes",
      "Transporte desde punto de encuentro",
      "Certificado de participación",
    ],
    excludes: [
      "Calzado de senderizo (recomendado llevar propio)",
      "Gastos personales",
      "Fotografía profesional",
    ],
    highlights: [
      "Vista panorámica 360°",
      "Bosque seco tropical",
      "Avistamiento de fauna endémica",
      "Cerro a 350m sobre el nivel del mar",
    ],
    rating: 4.7,
    reviewCount: 89,
    maxGuests: 10,
    difficulty: "Moderado",
    schedule: "5:30 AM - 10:30 AM",
    meeting: "Parque principal de Luruaco",
  },
  {
    id: "plan-4",
    name: "Plan Tour Galápago del Atlántico",
    slug: "plan-tour-galapago-atlantico",
    shortDescription:
      "Visita el santuario de tortugas galápagos y aprende sobre conservación marina en el Atlántico.",
    fullDescription:
      "Conoce el fascinante mundo de las tortugas galápagos en este tour educativo y ecológico por el Atlántico. Visitarás el centro de conservación donde expertos biólogos te explicarán los programas de protección de estas especies milenarias. Podrás observar las tortugas en su entorno natural, aprender sobre su ciclo de vida y los esfuerzos para preservarlas. El tour también incluye un paseo en lancha por la bahía y tiempo para disfrutar de la playa cercana. Una experiencia perfecta para familias y amantes de la naturaleza.",
    images: [
      "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
    ],
    price: 110000,
    priceRange: "$110.000 - $160.000 COP",
    duration: "Medio día (5 horas)",
    location: "Bahía de Santa Verónica, Atlántico",
    category: "Ecoturismo",
    includes: [
      "Guía biólogo marino",
      "Visita al centro de conservación",
      "Paseo en lancha por la bahía",
      "Refrigerio ecológico",
      "Seguro de accidentes",
      "Material educativo",
      "Transporte desde punto de encuentro",
    ],
    excludes: [
      "Souvenirs y artesanías",
      "Gastos personales",
      "Fotografía profesional bajo el agua",
    ],
    highlights: [
      "Observación de tortugas galápagos",
      "Centro de conservación marino",
      "Paseo en lancha",
      "Educación ambiental",
    ],
    rating: 4.6,
    reviewCount: 56,
    maxGuests: 15,
    difficulty: "Fácil",
    schedule: "8:00 AM - 1:00 PM",
    meeting: "Plaza de Santa Verónica",
  },
  {
    id: "plan-5",
    name: "Plan Noche de Estrellas en la Costa",
    slug: "plan-noche-estrellas-costa",
    shortDescription:
      "Vive una noche mágica bajo las estrellas en la costa del Atlántico con cena y observación astronómica.",
    fullDescription:
      "Una experiencia inolvidable que combina la belleza del mar Caribe con la majestuosidad del cielo nocturno. Este plan incluye traslado al mirador costero, una cena gourmet frente al mar con mariscos frescos de la región, y una sesión de observación astronómica guiada con telescopios profesionales. Aprenderás sobre las constelaciones visibles desde el Caribe colombiano y las leyendas indígenas asociadas. Incluye barra libre de cócteles tropicales, música en vivo con sonidos del Caribe y una fogata en la playa. Romántico y educativo, perfecto para parejas y grupos pequeños.",
    images: [
      "https://images.unsplash.com/photo-1475274047050-1d0c55b0033b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&h=600&fit=crop",
    ],
    price: 180000,
    priceRange: "$180.000 - $250.000 COP",
    duration: "Noche completa (6 horas)",
    location: "Mirador Costero, Juan de Acosta",
    category: "Grupal",
    fecha_salida: "12 Jul",
    includes: [
      "Transporte ida y vuelta",
      "Cena gourmet frente al mar",
      "Barra libre de cócteles tropicales",
      "Observación astronómica con telescopios",
      "Guía astrónomo",
      "Música en vivo",
      "Fogata en la playa",
      "Seguro de accidentes",
    ],
    excludes: [
      "Vinos premium",
      "Souvenirs",
      "Fotografía profesional",
    ],
    highlights: [
      "Observación de estrellas con telescopio",
      "Cena gourmet de mariscos",
      "Fogata y música en vivo",
      "Mirador costero exclusivo",
    ],
    rating: 4.9,
    reviewCount: 67,
    maxGuests: 8,
    difficulty: "Fácil",
    schedule: "6:00 PM - 12:00 AM",
    meeting: "Hotel lobby zona norte, Barranquilla",
  },
  {
    id: "plan-6",
    name: "Plan Ruta del Bolívar Costero",
    slug: "plan-ruta-bolivar-costero",
    shortDescription:
      "Recorre los sitios históricos del litoral del Atlántico relacionados con la gesta libertadora.",
    fullDescription:
      "Viaja en el tiempo por la costa del Atlántico siguiendo los pasos del Libertador Simón Bolívar. Este tour cultural e histórico te lleva por los sitios más emblemáticos de la gesta independentista en el Caribe colombiano: el Museo Bolivariano, el antiguo puerto de Sabanilla, y las fortificaciones coloniales. Incluye almuerzo típico en restaurante histórico, guía historiador experto y material didáctico. Aprenderás sobre la importancia estratégica del Atlántico en la independencia de Colombia y disfrutarás de las vistas del mar Caribe desde perspectivas históricas únicas.",
    images: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1568702846914-96b305d2ced1?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=600&fit=crop",
    ],
    price: 75000,
    priceRange: "$75.000 - $100.000 COP",
    duration: "Medio día (4 horas)",
    location: "Zona histórica, Barranquilla y Sabanilla",
    category: "Cultural",
    includes: [
      "Guía historiador certificado",
      "Entradas a museos y sitios históricos",
      "Almuerzo típico",
      "Transporte entre sitios",
      "Material didáctico",
      "Seguro de viaje",
    ],
    excludes: [
      "Souvenirs y artesanías",
      "Gastos personales",
      "Propinas",
    ],
    highlights: [
      "Museo Bolivariano",
      "Puerto histórico de Sabanilla",
      "Fortificaciones coloniales",
      "Almuerzo en restaurante histórico",
    ],
    rating: 4.5,
    reviewCount: 43,
    maxGuests: 20,
    difficulty: "Fácil",
    schedule: "9:00 AM - 1:00 PM",
    meeting: "Museo Bolivariano, Barranquilla",
  },
  {
    id: "plan-7",
    name: "Magia del Eje Cafetero",
    slug: "magia-eje-cafetero",
    shortDescription: "Descubre la cultura cafetera, paisajes verdes y pueblos con encanto en un viaje inolvidable de 4 días.",
    fullDescription: "Un viaje de 4 días y 3 noches por el corazón de Colombia. Recorre el Valle de Cocora con sus imponentes palmas de cera, visita fincas cafeteras tradicionales donde aprenderás todo el proceso del café desde la semilla hasta la taza, y relájate en las aguas termales de Santa Rosa de Cabal. Incluye alojamiento en hacienda típica, alimentación completa y guías expertos de la región.",
    images: [
      "https://images.unsplash.com/photo-1622308644420-b30fbdf94f1c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1518182170546-076616fdcbdd?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1542385151-efd9000785a0?w=800&h=600&fit=crop",
    ],
    price: 1250000,
    priceRange: "$1.250.000 - $1.500.000 COP",
    duration: "4 días, 3 noches",
    location: "Eje Cafetero, Colombia",
    category: "Nacional",
    includes: ["Vuelos ida y vuelta", "Alojamiento 3 noches", "Desayunos y cenas", "Tour cafetero", "Entrada a termales"],
    excludes: ["Almuerzos", "Propinas", "Gastos personales"],
    highlights: ["Valle de Cocora", "Tour del Café", "Termales de Santa Rosa"],
    rating: 4.9,
    reviewCount: 156,
    maxGuests: 15,
    difficulty: "Fácil",
    schedule: "Salidas todos los jueves",
    meeting: "Aeropuerto El Dorado",
  },
  {
    id: "plan-8",
    name: "Aventura en Parque Tayrona",
    slug: "aventura-parque-tayrona",
    shortDescription: "Conecta con la selva y el mar en el espectacular Parque Nacional Natural Tayrona por 3 noches.",
    fullDescription: "Explora uno de los parques naturales más hermosos del mundo durante 4 días y 3 noches. Camina por senderos ecológicos rodeados de selva tropical hasta llegar a playas paradisíacas como Cabo San Juan y Arrecifes. Duerme en eco-habs con vista al mar y disfruta de la gastronomía local. Una experiencia perfecta para desconectar y llenarse de la energía de la Sierra Nevada.",
    images: [
      "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1620002093390-8d5926ec3fb4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1588616527056-b99b343dae81?w=800&h=600&fit=crop",
    ],
    price: 980000,
    priceRange: "$980.000 - $1.200.000 COP",
    duration: "4 días, 3 noches",
    location: "Santa Marta, Colombia",
    category: "Nacional",
    includes: ["Transporte terrestre", "Alojamiento en eco-habs", "Desayunos", "Entrada al Parque", "Seguro médico"],
    excludes: ["Almuerzos y cenas", "Gastos personales"],
    highlights: ["Cabo San Juan", "Senderismo guiado", "Playas vírgenes"],
    rating: 4.8,
    reviewCount: 210,
    maxGuests: 12,
    difficulty: "Moderado",
    schedule: "Salidas viernes y sábados",
    meeting: "Terminal de Transportes",
  },
  {
    id: "plan-9",
    name: "Paraíso en Punta Cana",
    slug: "paraiso-punta-cana",
    shortDescription: "Disfruta del Caribe al máximo con un plan todo incluido en las playas de Punta Cana.",
    fullDescription: "Relájate en las playas de arena blanca y aguas cristalinas de República Dominicana con este viaje de 5 días y 4 noches. Alójate en un resort 5 estrellas con sistema todo incluido (comidas y bebidas ilimitadas). Disfruta de shows nocturnos, deportes acuáticos no motorizados y acceso a piscinas exclusivas. El plan perfecto para descansar sin preocupaciones.",
    images: [
      "https://images.unsplash.com/photo-1543429776-2782fc8e1acd?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1582294406180-2c40b82bc0e3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1590419690008-905895e8fe0d?w=800&h=600&fit=crop",
    ],
    price: 3500000,
    priceRange: "$3.500.000 - $4.200.000 COP",
    duration: "5 días, 4 noches",
    location: "Punta Cana, Rep. Dominicana",
    category: "Internacional",
    includes: ["Vuelos directos", "Alojamiento Todo Incluido", "Traslados aeropuerto-hotel", "Seguro de viaje"],
    excludes: ["Tours opcionales", "Gastos personales"],
    highlights: ["Resort 5 estrellas", "Bebidas ilimitadas", "Playa privada"],
    rating: 4.9,
    reviewCount: 342,
    maxGuests: 30,
    difficulty: "Fácil",
    schedule: "Salidas diarias",
    meeting: "Aeropuerto Internacional",
  },
  {
    id: "plan-10",
    name: "Escape a San Andrés Islas",
    slug: "escape-san-andres",
    shortDescription: "Sumérgete en el mar de los 7 colores con este plan completo a la isla de San Andrés.",
    fullDescription: "Descubre la belleza del Caribe colombiano en este viaje internacionalmente reconocido de 4 días y 3 noches. Disfruta de las playas de arena blanca, recorre la isla en un carrito de golf, visita el Acuario y Johnny Cay. Incluye alojamiento en hotel frente al mar, alimentación y tours emblemáticos para vivir la isla al máximo.",
    images: [
      "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1580228373356-820875298a00?w=800&h=600&fit=crop",
    ],
    price: 1800000,
    priceRange: "$1.800.000 - $2.100.000 COP",
    duration: "4 días, 3 noches",
    location: "San Andrés Islas",
    category: "Internacional",
    includes: ["Vuelos", "Alojamiento con desayunos y cenas", "Tour al Acuario", "Vuelta a la isla"],
    excludes: ["Tarjeta de turismo", "Almuerzos"],
    highlights: ["Mar de 7 colores", "Johnny Cay", "Hoyo Soplador"],
    rating: 4.7,
    reviewCount: 421,
    maxGuests: 25,
    difficulty: "Fácil",
    schedule: "Salidas diarias",
    meeting: "Aeropuerto",
  },
  {
    id: "plan-11",
    name: "Aventura en Cancún",
    slug: "aventura-cancun",
    shortDescription: "Descubre la vibrante vida nocturna, zonas arqueológicas y playas espectaculares de Cancún.",
    fullDescription: "Un espectacular viaje de 6 días y 5 noches al corazón del Caribe mexicano. Hospédate en un excelente resort en la zona hotelera con sistema todo incluido. Opcionalmente podrás visitar Chichén Itzá, cenotes cristalinos o parques temáticos como Xcaret. Un destino vibrante que lo tiene todo: relax, fiesta y cultura milenaria.",
    images: [
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=800&h=600&fit=crop",
    ],
    price: 4200000,
    priceRange: "$4.200.000 - $5.500.000 COP",
    duration: "6 días, 5 noches",
    location: "Cancún, México",
    category: "Internacional",
    includes: ["Vuelos directos", "Hotel Todo Incluido", "Traslados", "Asistencia médica"],
    excludes: ["Tours arqueológicos", "Propinas"],
    highlights: ["Zona Hotelera", "Playas increíbles", "Vida nocturna"],
    rating: 4.9,
    reviewCount: 512,
    maxGuests: 40,
    difficulty: "Fácil",
    schedule: "Salidas diarias",
    meeting: "Aeropuerto Internacional",
  },
  {
    id: "plan-12",
    name: "Tour Grupal de las Islas",
    slug: "tour-islas-cartagena-tintipan",
    shortDescription: "Un viaje en grupo recorriendo las islas de Cartagena y Tintipán en un ambiente festivo.",
    fullDescription: "Únete a este increíble viaje grupal de un día completo explorando los archipiélagos más hermosos. Navegaremos en lancha rápida desde Cartagena hacia las Islas del Rosario y Tintipán. Habrá música, refrigerios, paradas estratégicas para hacer snorkel y un almuerzo isleño espectacular. Ideal para celebrar con amigos o conocer gente nueva.",
    images: [
      "https://images.unsplash.com/photo-1550953181-e28a50f75f92?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1580228373356-820875298a00?w=800&h=600&fit=crop",
    ],
    price: 320000,
    priceRange: "$320.000 - $380.000 COP",
    duration: "Día completo (10 horas)",
    location: "Cartagena / Tintipán",
    category: "Grupal",
    fecha_salida: "25 Mayo",
    includes: ["Transporte en lancha", "Almuerzo isleño", "Snorkel", "Guía animador"],
    excludes: ["Impuesto portuario", "Bebidas alcohólicas"],
    highlights: ["Islas del Rosario", "Tintipán", "Snorkel y fiesta"],
    rating: 4.8,
    reviewCount: 189,
    maxGuests: 40,
    difficulty: "Fácil",
    schedule: "7:00 AM - 5:00 PM",
    meeting: "Muelle de los Pegasos, Cartagena",
  },
  {
    id: "plan-13",
    name: "Expedición Grupal Sierra Limón",
    slug: "expedicion-sierra-limon",
    shortDescription: "Aventura grupal de un día descubriendo cascadas y senderos ocultos en Sierra Limón.",
    fullDescription: "Forma parte de esta expedición de un día pensada para grupos. Caminaremos por senderos ecológicos hasta llegar a las impresionantes cascadas de Sierra Limón. Un plan perfecto para team building o grupos de amigos que buscan aventura y naturaleza. Terminaremos con un almuerzo tradicional preparado por la comunidad local.",
    images: [
      "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop",
    ],
    price: 180000,
    priceRange: "$180.000 - $220.000 COP",
    duration: "Día completo (8 horas)",
    location: "Sierra Limón",
    category: "Grupal",
    fecha_salida: "18 Jun",
    includes: ["Transporte en bus", "Guía local", "Almuerzo tradicional", "Seguro de viaje"],
    excludes: ["Gastos personales"],
    highlights: ["Cascadas escondidas", "Senderismo", "Almuerzo comunitario"],
    rating: 4.6,
    reviewCount: 88,
    maxGuests: 35,
    difficulty: "Moderado",
    schedule: "6:00 AM - 4:00 PM",
    meeting: "Plaza Central",
  },
  {
    id: "plan-14",
    name: "Salto en Paracaidismo",
    slug: "tour-paracaidismo",
    shortDescription: "Siente la adrenalina extrema en una experiencia de paracaidismo tandem.",
    fullDescription: "Para los amantes de la adrenalina pura. Una experiencia corta pero inolvidable donde realizarás un salto en paracaídas tipo tandem junto a un instructor certificado. Disfruta de una caída libre a más de 200 km/h y luego planea suavemente admirando un paisaje inigualable desde el aire.",
    images: [
      "https://images.unsplash.com/photo-1520114757270-b1836a0fb494?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1521685360661-04ba71a06288?w=800&h=600&fit=crop",
    ],
    price: 650000,
    priceRange: "$650.000 - $800.000 COP",
    duration: "Tour corto (3 horas)",
    location: "Aeródromo local",
    category: "Tours",
    includes: ["Vuelo escénico", "Salto tandem", "Instructor certificado", "Seguro"],
    excludes: ["Fotos y video (opcional)", "Transporte al aeródromo"],
    highlights: ["Caída libre de 1 minuto", "Vuelo de 5 minutos en paracaídas"],
    rating: 4.9,
    reviewCount: 205,
    maxGuests: 2,
    difficulty: "Fácil",
    schedule: "Varios horarios disponibles",
    meeting: "Aeródromo",
  },
  {
    id: "plan-15",
    name: "Tour de Buceo en San Andrés",
    slug: "tour-buceo-san-andres",
    shortDescription: "Explora los increíbles arrecifes de coral en esta inmersión para principiantes.",
    fullDescription: "Descubre el maravilloso mundo submarino del mar de los siete colores en un tour corto de buceo. Diseñado especialmente para principiantes (no necesitas certificación). Incluye una clase teórica, práctica en aguas poco profundas y una inmersión guiada en el arrecife de coral, donde podrás ver peces tropicales, mantarrayas y vida marina colorida.",
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1582967177931-50e82c5f1cd3?w=800&h=600&fit=crop",
    ],
    price: 250000,
    priceRange: "$250.000 - $300.000 COP",
    duration: "Tour corto (4 horas)",
    location: "San Andrés Islas",
    category: "Tours",
    includes: ["Clase teórica y práctica", "Equipo completo de buceo", "1 inmersión guiada", "Instructor PADI"],
    excludes: ["Fotos submarinas", "Transporte al centro de buceo"],
    highlights: ["Arrecifes de coral", "Buceo seguro para novatos"],
    rating: 4.8,
    reviewCount: 310,
    maxGuests: 6,
    difficulty: "Moderado",
    schedule: "8:00 AM o 2:00 PM",
    meeting: "Centro de Buceo",
  },
  {
    id: "plan-16",
    name: "Eurotrip Clásico",
    slug: "eurotrip-clasico",
    shortDescription: "Recorre las capitales europeas más icónicas: Madrid, París y Roma en un circuito completo de 15 días.",
    fullDescription: "El viaje de tus sueños por el viejo continente. Descubre la historia imperial de Madrid, la magia y romance de la Ciudad de la Luz en París, y la majestuosidad de la Ciudad Eterna en Roma. Este circuito incluye pasajes de avión, hotelería de categoría superior, desayunos buffet, traslados en autobús de lujo y visitas guiadas con expertos locales en cada destino.",
    images: [
      "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=600&fit=crop",
    ],
    price: 6500000,
    priceRange: "$6.500.000 - $7.800.000 COP",
    duration: "15 días, 14 noches",
    location: "Madrid, París y Roma",
    category: "Circuito",
    includes: [
      "Tiquetes aéreos internacionales",
      "Alojamiento 14 noches en hoteles 4★",
      "Desayunos buffet diarios",
      "Visita con guía local en Madrid, París y Roma",
      "Traslados aeropuerto-hotel-aeropuerto",
      "Tarjeta de asistencia médica",
    ],
    excludes: [
      "Almuerzos y cenas no especificados",
      "Entradas a monumentos no descritos",
      "Gastos personales y propinas",
    ],
    highlights: [
      "Visita al Coliseo y Foro Romano",
      "Subida al segundo piso de la Torre Eiffel",
      "Tour por el Palacio Real de Madrid",
      "Crucero nocturno por el Río Sena",
    ],
    rating: 4.9,
    reviewCount: 148,
    maxGuests: 25,
    difficulty: "Fácil",
    schedule: "Salidas el primer sábado de cada mes",
    meeting: "Aeropuerto Internacional El Dorado, Bogotá",
    itinerary: [
      { title: "Llegada a Madrid", description: "Llegada al aeropuerto de Madrid-Barajas y traslado al hotel. Tarde libre para descansar o recorrer la Gran Vía." },
      { title: "Madrid Histórico", description: "Visita panorámica de la ciudad incluyendo Plaza Mayor, Palacio Real, Fuente de Cibeles y el Parque del Retiro." },
      { title: "Madrid a París", description: "Traslado al aeropuerto para tomar el vuelo interno hacia París. Llegada y traslado al hotel." },
      { title: "París: La Ciudad Luz", description: "Visita al Arco de Triunfo, los Campos Elíseos y subida al segundo piso de la imponente Torre Eiffel." },
      { title: "París y el Sena", description: "Mañana libre para recorrer Montmartre. Por la tarde, paseo en barco por el Río Sena y visita exterior del Louvre." },
      { title: "París a Venecia", description: "Vuelo directo hacia Venecia. Llegada, traslado en bote al hotel y caminata de bienvenida." },
      { title: "Venecia Romántica", description: "Paseo por la Plaza de San Marcos, el Palacio Ducal y el Puente de los Suspiros con paseo opcional en góndola." },
      { title: "Venecia a Florencia", description: "Viaje en tren de alta velocidad a Florencia. Tarde de visita a la Galería de la Academia y el Duomo." },
      { title: "Florencia a Roma", description: "Viaje por la Toscana hacia Roma. Llegada, check-in y cena tradicional en el barrio de Trastevere." },
      { title: "Roma Imperial", description: "Visita guiada con entrada preferente al Coliseo Romano, el Foro Romano y el Arco de Constantino." },
      { title: "Roma Cristiana", description: "Tour por los Museos Vaticanos, Capilla Sixtina de Miguel Ángel y la Basílica de San Pedro." },
      { title: "Roma (Día Libre)", description: "Día libre para ir de compras, probar helado tradicional o visitar la Fontana di Trevi." },
      { title: "Roma a Madrid", description: "Vuelo de regreso a Madrid. Alojamiento y cena especial de despedida con tapas españolas." },
      { title: "Madrid (Excursión a Toledo)", description: "Excursión de día completo a la ciudad medieval de Toledo. Retorno a Madrid por la noche." },
      { title: "Fin del viaje", description: "Traslado al aeropuerto internacional de Madrid para abordar el vuelo de regreso a Colombia." }
    ]
  },
  {
    id: "plan-17",
    name: "Japón Esencial",
    slug: "japon-esencial",
    shortDescription: "La combinación perfecta entre tradición milenaria y tecnología del futuro en Tokio, Kioto y Osaka.",
    fullDescription: "Embárcate en un fascinante circuito de 10 días por la tierra del sol naciente. Desde los rascacielos iluminados y templos antiguos de Tokio, hasta los serenos jardines zen de Kioto y la gastronomía callejera de Osaka, este viaje te mostrará la verdadera esencia de Japón. Viaja en el tren bala Shinkansen y alójate en un Ryokan tradicional con aguas termales (Onsen).",
    images: [
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&h=600&fit=crop",
    ],
    price: 8200000,
    priceRange: "$8.200.000 - $9.500.000 COP",
    duration: "10 días, 9 noches",
    location: "Tokio, Kioto y Osaka",
    category: "Circuito",
    includes: [
      "Tiquetes aéreos internacionales",
      "Pase de tren Japan Rail Pass (JR Pass)",
      "Alojamiento 8 noches en hotel + 1 noche en Ryokan",
      "Desayunos diarios y 1 cena tradicional Kaiseki",
      "Guía acompañante de habla hispana",
      "Entradas a todos los templos descritos",
    ],
    excludes: [
      "Almuerzos y cenas no descritos",
      "Seguro de viaje de cobertura médica extendida",
      "Propinas y gastos personales",
    ],
    highlights: [
      "Viaje en el Tren Bala Shinkansen",
      "Paseo por el bosque de bambú de Arashiyama",
      "Templo Senso-ji en Asakusa, Tokio",
      "Visita al santuario Fushimi Inari-Taisha",
    ],
    rating: 4.9,
    reviewCount: 94,
    maxGuests: 15,
    difficulty: "Moderado",
    schedule: "Salidas programadas en época de cerezos (Abril) y otoño (Octubre)",
    meeting: "Aeropuerto Internacional El Dorado, Bogotá",
    itinerary: [
      { title: "Llegada a Tokio", description: "Llegada al aeropuerto de Tokio (Narita o Haneda), bienvenida por nuestro guía y traslado al hotel en metro/tren." },
      { title: "Tokio Tradicional e Histórico", description: "Visita al templo más antiguo de Tokio, Senso-ji en Asakusa, paseo por la calle comercial Nakamise y el barrio electrónico de Akihabara." },
      { title: "Tokio Moderno y Shibuya", description: "Visita al Santuario Meiji en Harajuku, paseo por la calle Franklin y cruce de peatones de Shibuya con acceso al Shibuya Sky." },
      { title: "Tokio al Monte Fuji y Hakone", description: "Excursión a Hakone. Paseo en barco por el lago Ashi y teleférico con vistas al Monte Fuji. Noche en Ryokan tradicional con baño Onsen." },
      { title: "Hakone a Kioto (Tren Bala)", description: "Abordaremos el famoso tren bala Shinkansen con destino a Kioto. Llegada y paseo por el tradicional barrio de Gion." },
      { title: "Kioto Imperial", description: "Visita al Pabellón de Oro (Kinkaku-ji), el Castillo Nijo y caminata por el imponente bosque de bambú de Arashiyama." },
      { title: "Fushimi Inari y Excursión a Nara", description: "Visita al santuario de los miles de toriis rojos en Fushimi Inari. Por la tarde, viaje a Nara para ver el Gran Buda en el Templo Todai-ji." },
      { title: "Kioto a Osaka (Dotonbori)", description: "Traslado en tren local a Osaka. Visita al icónico Castillo de Osaka y caminata nocturna por el dinámico canal de Dotonbori." },
      { title: "Osaka (Día Libre o Hiroshima)", description: "Día libre para visitar Universal Studios Japan o excursión opcional en tren bala a Hiroshima y la isla de Miyajima." },
      { title: "Regreso a Tokio y Salida", description: "Retorno a Tokio en tren bala Shinkansen. Traslado al aeropuerto para tomar el vuelo de regreso a Colombia." }
    ]
  },
  {
    id: "plan-18",
    name: "Turquía y Dubái",
    slug: "turquia-dubai",
    shortDescription: "La magia de Estambul y los globos de Capadocia junto con el lujo futurista y los safaris de Dubái.",
    fullDescription: "Un circuito extraordinario de 12 días que une dos de los mundos más exóticos del planeta. Déjate cautivar por las mezquitas y bazares históricos de Estambul, sobrevuela en globo los paisajes lunares de Capadocia en Turquía y luego vuela hacia el desierto para vivir la modernidad, rascacielos y safaris de lujo en Dubái.",
    images: [
      "https://images.unsplash.com/photo-1527838832700-50592524df7e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&h=600&fit=crop",
    ],
    price: 5900000,
    priceRange: "$5.900.000 - $6.900.000 COP",
    duration: "12 días, 11 noches",
    location: "Estambul, Capadocia y Dubái",
    category: "Circuito",
    includes: [
      "Tiquetes de vuelo internacional y doméstico",
      "Alojamiento 11 noches en hoteles 4★ y 5★",
      "Desayunos diarios y cenas en Turquía",
      "Safari por el desierto de Dubái con cena BBQ",
      "Crucero privado por el Río Bósforo en Estambul",
      "Guías locales en español en ambos países",
    ],
    excludes: [
      "Vuelo en globo aerostático en Capadocia (opcional)",
      "Impuesto turístico de Dubái (Tourism Dirham)",
      "Almuerzos no especificados",
    ],
    highlights: [
      "Safari 4x4 por las dunas rojas de Dubái",
      "Visita a la Mezquita Azul y Santa Sofía en Estambul",
      "Paisajes de chimeneas de hadas en Capadocia",
      "Entrada a la plataforma del Burj Khalifa",
    ],
    rating: 4.8,
    reviewCount: 112,
    maxGuests: 20,
    difficulty: "Fácil",
    schedule: "Salidas grupales los días 15 de cada mes",
    meeting: "Aeropuerto Internacional El Dorado, Bogotá",
    itinerary: [
      { title: "Llegada a Estambul", description: "Recepción en el aeropuerto de Estambul y traslado privado al hotel. Tiempo libre para aclimatarse." },
      { title: "Estambul Clásico", description: "Visita de día completo a la Mezquita Azul, Santa Sofía, Hipódromo Romano, Palacio de Topkapi y el Gran Bazar." },
      { title: "Estambul y Bósforo", description: "Paseo en barco por el Canal del Bósforo. Por la tarde, traslado al aeropuerto para volar a Capadocia. Llegada y cena." },
      { title: "Vuelo en Globo y Capadocia Mágica", description: "Paseo opcional en globo al amanecer. Visita al Valle de Göreme, Uchisar, las chimeneas de hadas y taller de alfombras." },
      { title: "Capadocia Subterránea", description: "Visita a la ciudad subterránea de Kaymakli y caminata ecológica por el cañón del Valle de Ihlara. Cena en el hotel." },
      { title: "Turquía a Dubái", description: "Traslado al aeropuerto de Capadocia, vuelo de conexión en Estambul y vuelo internacional directo a Dubái. Llegada." },
      { title: "Dubái Moderno y Burj Khalifa", description: "Paseo por Dubai Marina, paradas de fotos frente al Burj Al Arab, el hotel Atlantis y ascenso al piso 124 del Burj Khalifa." },
      { title: "Safari por el Desierto", description: "Mañana libre para compras en Dubai Mall. Por la tarde, safari en camionetas 4x4 por el desierto con cena show en campamento beduino." },
      { title: "Excursión a Abu Dabi", description: "Viaje de día completo a Abu Dabi. Visita a la Gran Mezquita Sheikh Zayed y el palacio presidencial Qasr Al Watan." },
      { title: "Dubái Tradicional (Zocos)", description: "Cruce del canal en bote tradicional 'abra', paseo por los zocos de las especias y el oro. Tarde libre." },
      { title: "Día Libre en Dubái", description: "Día libre para disfrutar de la playa, visitar la isla artificial Palm Jumeirah o ir de compras de marcas de diseñador." },
      { title: "Regreso a Colombia", description: "Traslado al aeropuerto internacional de Dubái para tomar el vuelo de retorno a Colombia." }
    ]
  }
];

// ─── Cabins ────────────────────────────────────────────────────────────────────

export const cabins: Cabin[] = [
  {
    id: "cabin-1",
    name: "Cabaña Caribe Coral",
    slug: "cabana-caribe-coral",
    shortDescription:
      "Cabaña frente al mar con diseño caribeño, piscina privada y acceso directo a la playa.",
    fullDescription:
      "Disfruta de la auténtica experiencia caribeña en esta hermosa cabaña frente al mar. Diseñada con materiales locales y una decoración que fusiona lo rústico con lo moderno, la Cabaña Caribe Coral ofrece todo lo que necesitas para unas vacaciones perfectas. Cuenta con piscina privada con vista al mar, terraza con hamacas, cocina totalmente equipada y habitaciones con aire acondicionado. Despierta con el sonido de las olas y relájate en tu oasis privado en la costa del Atlántico.",
    images: [
      "https://images.unsplash.com/photo-1499793983394-e58f8b6a1109?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?w=800&h=600&fit=crop",
    ],
    pricePerNight: 280000,
    priceRange: "$280.000 - $380.000 COP / noche",
    location: "Santa Verónica, Atlántico",
    capacity: 6,
    bedrooms: 2,
    bathrooms: 2,
    amenities: [
      "Piscina privada",
      "Aire acondicionado",
      "Cocina equipada",
      "Terraza con hamacas",
      "Acceso directo a la playa",
      "WiFi gratuito",
      "Estacionamiento",
      "Parrilla/BBQ",
      "TV Smart 55\"",
      "Toallas de playa",
    ],
    highlights: [
      "Frente al mar",
      "Piscina privada",
      "Diseño caribeño auténtico",
      "Acceso directo a la playa",
    ],
    rules: [
      "No fiestas ni eventos",
      "No fumar dentro de la cabaña",
      "No mascotas",
      "Check-in: 3:00 PM, Check-out: 11:00 AM",
      "Máximo 6 huéspedes",
      "Silencio después de las 10:00 PM",
    ],
    rating: 4.9,
    reviewCount: 98,
    coordinates: { lat: 10.95, lng: -75.05 },
    checkIn: "3:00 PM",
    checkOut: "11:00 AM",
    cancellationPolicy: "Cancelación gratuita hasta 7 días antes del check-in",
    bedroomDetails: [
      {
        id: "bedroom-1",
        title: "Habitación Principal",
        beds: "1 cama King",
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
        order: 1,
        active: true,
      },
      {
        id: "bedroom-2",
        title: "Habitación Secundaria",
        beds: "2 camas individuales",
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
        order: 2,
        active: true,
      }
    ],
  },
  {
    id: "cabin-2",
    name: "Cabaña Manglar Eco-Lodge",
    slug: "cabana-manglar-eco-lodge",
    shortDescription:
      "Eco-cabaña rodeada de manglares con experiencia de turismo sostenible y naturaleza pura.",
    fullDescription:
      "Sumérgete en la naturaleza sin renunciar al confort en esta eco-cabaña ubicada en medio de un bosque de manglares restaurado. La Cabaña Manglar Eco-Lodge fue construida con materiales sostenibles y energía solar, ofreciendo una experiencia única de turismo responsable. Disfruta de un muelle privado para kayaks, observación de aves desde tu terraza, y ducha al aire libre con agua caliente solar. La cabaña tiene una cama king size con mosquitero, cocina básica y un ambiente de total desconexión. Ideal para parejas que buscan reconectarse con la naturaleza.",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800&h=600&fit=crop",
    ],
    pricePerNight: 195000,
    priceRange: "$195.000 - $250.000 COP / noche",
    location: "Manglar de Mallorquín, Puerto Colombia",
    capacity: 2,
    bedrooms: 1,
    bathrooms: 1,
    amenities: [
      "Energía solar",
      "Muelle privado para kayaks",
      "Terraza de observación",
      "Ducha al aire libre",
      "Cocina básica",
      "Mosquiteros",
      "Kayak incluido",
      "Binoculares para avistamiento",
      "Hamaca",
      "Agua caliente solar",
    ],
    highlights: [
      "100% sostenible",
      "Rodeada de manglares",
      "Muelle privado",
      "Observación de aves",
    ],
    rules: [
      "No fumar",
      "No mascotas",
      "Respetar la fauna local",
      "No música alta",
      "Check-in: 2:00 PM, Check-out: 12:00 PM",
      "Máximo 2 huéspedes",
    ],
    rating: 4.8,
    reviewCount: 67,
    coordinates: { lat: 10.99, lng: -74.96 },
    checkIn: "2:00 PM",
    checkOut: "12:00 PM",
    cancellationPolicy: "Cancelación gratuita hasta 5 días antes del check-in",
  },
  {
    id: "cabin-3",
    name: "Cabaña Sol y Arena Familiar",
    slug: "cabana-sol-arena-familiar",
    shortDescription:
      "Amplia cabaña familiar con 3 habitaciones, piscina compartida y zona de juegos infantiles.",
    fullDescription:
      "La cabaña perfecta para familias que buscan diversión y descanso. Con tres amplias habitaciones, sala de estar, cocina completa y una terraza gigante con vista al mar, esta cabaña tiene espacio de sobra para toda la familia. Los más pequeños disfrutarán del área de juegos infantiles y la piscina compartida del complejo, mientras los adultos relax en las hamacas o preparan una parrillada en la zona BBQ. Ubicada en un complejo residencial con seguridad 24/7, estacionamiento y acceso a la playa por sendero peatonal.",
    images: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
    ],
    pricePerNight: 350000,
    priceRange: "$350.000 - $450.000 COP / noche",
    location: "Playa Mendoza, Atlántico",
    capacity: 8,
    bedrooms: 3,
    bathrooms: 2,
    amenities: [
      "Piscina compartida",
      "Zona de juegos infantiles",
      "Cocina completa",
      "Aire acondicionado en todas las habitaciones",
      "Terraza con vista al mar",
      "Zona BBQ",
      "Seguridad 24/7",
      "Estacionamiento para 2 vehículos",
      "WiFi gratuito",
      "Lavadora",
    ],
    highlights: [
      "Ideal para familias",
      "3 habitaciones amplias",
      "Zona de juegos infantiles",
      "Seguridad 24/7",
    ],
    rules: [
      "No fiestas después de las 10:00 PM",
      "No fumar dentro de la cabaña",
      "Mascotas permitidas (máximo 1, bajo responsabilidad)",
      "Check-in: 3:00 PM, Check-out: 11:00 AM",
      "Máximo 8 huéspedes",
      "Respetar las normas del complejo",
    ],
    rating: 4.7,
    reviewCount: 134,
    coordinates: { lat: 10.92, lng: -75.12 },
    checkIn: "3:00 PM",
    checkOut: "11:00 AM",
    cancellationPolicy: "Cancelación gratuita hasta 10 días antes del check-in",
  },
  {
    id: "cabin-4",
    name: "Cabaña Brisa del Mar",
    slug: "cabana-brisa-del-mar",
    shortDescription:
      "Cabaña romántica para parejas con jacuzzi privado, decoración bohemia y atardeceres increíbles.",
    fullDescription:
      "Un refugio romántico diseñado para parejas que buscan escapar de la rutina. La Cabaña Brisa del Mar combina decoración bohemia chic con todas las comodidades modernas. Su pieza estrella es el jacuzzi privado en la terraza con vista al mar, perfecto para disfrutar de los atardeceres más hermosos del Caribe. La cabaña cuenta con una habitación principal con cama king size, baño con ducha de lluvia, cocina americana equipada y un espacio de lectura con hamaca. Incluye botella de vino de bienvenida y desayuno continental incluido.",
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop",
    ],
    pricePerNight: 320000,
    priceRange: "$320.000 - $420.000 COP / noche",
    location: "Juan de Acosta, Atlántico",
    capacity: 2,
    bedrooms: 1,
    bathrooms: 1,
    amenities: [
      "Jacuzzi privado en terraza",
      "Vino de bienvenida",
      "Desayuno continental incluido",
      "Cama king size",
      "Ducha de lluvia",
      "Cocina americana",
      "Hamaca de lectura",
      "Aire acondicionado",
      "WiFi gratuito",
      "Veladores y velas aromáticas",
    ],
    highlights: [
      "Jacuzzi privado con vista al mar",
      "Romántica y bohemia",
      "Desayuno incluido",
      "Atardeceres únicos",
    ],
    rules: [
      "Solo adultos (18+)",
      "No niños",
      "No mascotas",
      "No fiestas",
      "Check-in: 3:00 PM, Check-out: 12:00 PM",
      "Máximo 2 huéspedes",
    ],
    rating: 5.0,
    reviewCount: 45,
    coordinates: { lat: 10.82, lng: -75.05 },
    checkIn: "3:00 PM",
    checkOut: "12:00 PM",
    cancellationPolicy: "Cancelación gratuita hasta 5 días antes del check-in",
  },
  {
    id: "cabin-5",
    name: "Cabaña Palma Costeña",
    slug: "cabana-palma-costena",
    shortDescription:
      "Cabaña típica costeña con techo de palma, perfecta para una experiencia auténtica y económica.",
    fullDescription:
      "Vive la auténtica experiencia costeña en esta cabaña tradicional con techo de palma y paredes de madera. La Cabaña Palma Costeña te transporta a la esencia del Caribe colombiano, con su decoración artesanal, muebles de madera local y ambiente fresco y natural. Ubicada en un terreno amplio con palmeras y jardín tropical, ofrece sombra natural y brisa marina constante. Cuenta con lo esencial para una estadía cómoda: cama matrimonial, ventilador de techo, cocina al aire libre y ducha con agua fría/caliente. Ideal para viajeros que buscan autenticidad sin gastar de más.",
    images: [
      "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop",
    ],
    pricePerNight: 120000,
    priceRange: "$120.000 - $160.000 COP / noche",
    location: "Tubará, Atlántico",
    capacity: 4,
    bedrooms: 1,
    bathrooms: 1,
    amenities: [
      "Techo de palma tradicional",
      "Cocina al aire libre",
      "Jardín tropical",
      "Ventilador de techo",
      "Hamaca",
      "Estacionamiento",
      "Ducha con agua fría/caliente",
      "Cama matrimonial + 2 camas individuales",
      "Barbacoa",
      "Sillas de playa",
    ],
    highlights: [
      "Experiencia auténtica costeña",
      "Techo de palma tradicional",
      "Económica",
      "Jardín tropical privado",
    ],
    rules: [
      "No fiestas",
      "No fumar dentro de la cabaña",
      "Mascotas permitidas (previa autorización)",
      "Check-in: 2:00 PM, Check-out: 11:00 AM",
      "Máximo 4 huéspedes",
      "Cuidar los materiales naturales de la cabaña",
    ],
    rating: 4.4,
    reviewCount: 78,
    coordinates: { lat: 10.87, lng: -75.03 },
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    cancellationPolicy: "Cancelación gratuita hasta 3 días antes del check-in",
  },
];

// ─── Testimonials ──────────────────────────────────────────────────────────────

export const testimonials: Testimonial[] = [
  {
    id: "t-1",
    name: "Carolina Mendoza",
    avatar: "CM",
    location: "Bogotá, Colombia",
    text: "El Plan Manglar Mallorquín fue una experiencia increíble. Los guías son muy conocedores y el paisaje es breathtaking. 100% recomendado para desconectar de la ciudad.",
    rating: 5,
    tripName: "Plan Manglar Mallorquín",
  },
  {
    id: "t-2",
    name: "Andrés Pérez",
    avatar: "AP",
    location: "Medellín, Colombia",
    text: "Fuimos con un grupo de amigos a Playa Blanca y todo fue perfecto. La organización, la comida, las actividades. Vive Travel nos hizo sentir como en casa lejos de casa.",
    rating: 5,
    tripName: "Plan Playa Blanca",
  },
  {
    id: "t-3",
    name: "María Fernanda López",
    avatar: "ML",
    location: "Barranquilla, Colombia",
    text: "La Cabaña Caribe Coral es un paraíso. Piscina privada frente al mar, no se puede pedir más. Ideal para una escapada romántica.",
    rating: 5,
    tripName: "Cabaña Caribe Coral",
  },
  {
    id: "t-4",
    name: "Diego Torres",
    avatar: "DT",
    location: "Cali, Colombia",
    text: "El senderismo al Cerro de la Vieja fue desafiante pero gratificante. Las vistas desde la cima son las mejores que he visto en el Atlántico. Guía excelente.",
    rating: 4,
    tripName: "Plan Senderismo Cerro de la Vieja",
  },
  {
    id: "t-5",
    name: "Laura Gutiérrez",
    avatar: "LG",
    location: "Bucaramanga, Colombia",
    text: "La noche de estrellas fue mágica. La cena, el telescopio, la fogata... todo estaba perfectamente organizado. Una experiencia que nunca olvidaré.",
    rating: 5,
    tripName: "Plan Noche de Estrellas en la Costa",
  },
  {
    id: "t-6",
    name: "Roberto Sánchez",
    avatar: "RS",
    location: "Cartagena, Colombia",
    text: "Nos quedamos en la Cabaña Brisa del Mar con mi esposa y fue la mejor decisión. El jacuzzi al atardecer es algo que todo mundo debería experimentar.",
    rating: 5,
    tripName: "Cabaña Brisa del Mar",
  },
];

// ─── Hero Carousel Images ─────────────────────────────────────────────────────

export const heroImages = [
  {
    id: "h-1",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&h=900&fit=crop",
    caption: "Playas del Caribe Colombiano",
  },
  {
    id: "h-2",
    url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1600&h=900&fit=crop",
    caption: "Atardeceres mágicos en el Atlántico",
  },
  {
    id: "h-3",
    url: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=1600&h=900&fit=crop",
    caption: "Cabañas frente al mar",
  },
  {
    id: "h-4",
    url: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1600&h=900&fit=crop",
    caption: "Aventura y naturaleza",
  },
];

// ─── Past Trip Images (Social Proof) ──────────────────────────────────────────

export const pastTripImages: TripImage[] = [
  {
    id: "pt-1",
    url: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=400&h=400&fit=crop",
    caption: "Grupo en Playa Blanca - Enero 2024",
  },
  {
    id: "pt-2",
    url: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=400&h=400&fit=crop",
    caption: "Kayak en el Manglar - Febrero 2024",
  },
  {
    id: "pt-3",
    url: "https://images.unsplash.com/photo-1528164344705-47542687000d?w=400&h=400&fit=crop",
    caption: "Noche de Estrellas - Marzo 2024",
  },
  {
    id: "pt-4",
    url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=400&fit=crop",
    caption: "Senderismo Cerro de la Vieja - Abril 2024",
  },
  {
    id: "pt-5",
    url: "https://images.unsplash.com/photo-1504150558240-0b4fd8946624?w=400&h=400&fit=crop",
    caption: "Familia en Cabaña Sol y Arena - Mayo 2024",
  },
  {
    id: "pt-6",
    url: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=400&h=400&fit=crop",
    caption: "Tour Galápago - Junio 2024",
  },
  {
    id: "pt-7",
    url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&h=400&fit=crop",
    caption: "Ruta del Bolívar - Julio 2024",
  },
  {
    id: "pt-8",
    url: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=400&h=400&fit=crop",
    caption: "Pareja en Cabaña Brisa del Mar - Agosto 2024",
  },
];
