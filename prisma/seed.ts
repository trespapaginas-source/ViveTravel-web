import { db } from "../src/lib/db";

const tourPlans = [
  {
    name: "Plan Manglar Mallorquín",
    slug: "plan-manglar-mallorquin",
    shortDescription: "Recorre los manglares de Mallorquín en kayak y descubre la fauna del ecosistema costero del Atlántico.",
    fullDescription: "Sumérgete en una experiencia única navegando por los canales del manglar de Mallorquín, uno de los ecosistemas más importantes de la costa caribe colombiana. Este plan incluye un recorrido guiado en kayak por los canales del manglar, donde podrás observar aves, cangrejos y otra fauna local en su hábitat natural. El guía te contará sobre la importancia ecológica del manglar y los esfuerzos de conservación. Disfruta de un refrigerio típico frente al mar y finaliza con tiempo libre en la playa de Mallorquín para relajarte y tomar fotografías.",
    images: JSON.stringify(["https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1468413253725-0d5181091126?w=800&h=600&fit=crop"]),
    price: 85000, priceRange: "$85.000 - $120.000 COP", duration: "Medio día (4 horas)",
    location: "Manglar de Mallorquín, Puerto Colombia", category: "Naturaleza",
    includes: JSON.stringify(["Guía profesional bilingüe","Equipo de kayak completo","Refrigerio típico","Seguro de accidentes","Transporte ida y vuelta desde puntos de encuentro","Charla de conservación ambiental"]),
    excludes: JSON.stringify(["Gastos personales","Fotografía profesional","Comidas adicionales"]),
    highlights: JSON.stringify(["Avistamiento de aves y fauna del manglar","Navegación en kayak por canales naturales","Playa de Mallorquín","Refrigerio típico costeño"]),
    rating: 4.8, reviewCount: 124, maxGuests: 12, difficulty: "Fácil",
    schedule: "7:00 AM - 11:00 AM / 2:00 PM - 6:00 PM", meeting: "Parque principal de Puerto Colombia", order: 1,
  },
  {
    name: "Plan Playa Blanca",
    slug: "plan-playa-blanca",
    shortDescription: "Disfruta de un día paradisíaco en Playa Blanca con transporte, comida y actividades acuáticas incluidas.",
    fullDescription: "Vive un día completo en una de las playas más hermosas del Caribe colombiano. Playa Blanca te espera con sus aguas cristalinas y arenas blancas. El plan incluye transporte cómodo desde Barranquilla, ingreso al sector premium de la playa, almuerzo típico costeño con opciones de pescado frito o pollo, y actividades acuáticas como snorkel y paddleboard. También tendrás acceso a zonas de descanso con camas y sombrillas. Un día perfecto para relajarte, nadar y disfrutar del Caribe.",
    images: JSON.stringify(["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&h=600&fit=crop"]),
    price: 150000, priceRange: "$150.000 - $200.000 COP", duration: "Día completo (10 horas)",
    location: "Playa Blanca, Barú", category: "Playa",
    includes: JSON.stringify(["Transporte ida y vuelta en bus climatizado","Ingreso a zona premium de playa","Almuerzo típico costeño","Equipo de snorkel","Paddleboard (30 min)","Cama y sombrilla","Seguro de viaje"]),
    excludes: JSON.stringify(["Bebidas alcohólicas","Gastos personales","Fotos y videos profesionales","Actividades no mencionadas"]),
    highlights: JSON.stringify(["Aguas cristalinas del Caribe","Almuerzo costeño incluido","Snorkel y paddleboard","Zona premium con camas y sombrillas"]),
    rating: 4.9, reviewCount: 287, maxGuests: 25, difficulty: "Fácil",
    schedule: "6:00 AM - 4:00 PM", meeting: "Centro Comercial Buenavista, Barranquilla", order: 2,
  },
  {
    name: "Plan Senderismo Cerro de la Vieja",
    slug: "plan-senderismo-cerro-vieja",
    shortDescription: "Aventura de senderismo con vistas panorámicas del Atlántico desde el Cerro de la Vieja.",
    fullDescription: "Desafía tus sentidos con esta caminata ecológica hasta el Cerro de la Vieja, uno de los miradores naturales más impresionantes del departamento del Atlántico. Durante el recorrido, atravesarás bosques secos tropicales, observarás flora y fauna endémica, y llegarás a una cima con vistas 360° que abarcan desde la Sierra Nevada de Santa Marta hasta el mar Caribe. El plan incluye guía experto en senderismo, refrigerio energético, kit de primeros auxilios y certificado de participación. Ideal para amantes de la naturaleza y la aventura.",
    images: JSON.stringify(["https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&h=600&fit=crop"]),
    price: 95000, priceRange: "$95.000 - $130.000 COP", duration: "Medio día (5 horas)",
    location: "Cerro de la Vieja, Luruaco", category: "Aventura",
    includes: JSON.stringify(["Guía de senderismo certificado","Refrigerio energético","Kit de primeros auxilios","Seguro de accidentes","Transporte desde punto de encuentro","Certificado de participación"]),
    excludes: JSON.stringify(["Calzado de senderizo (recomendado llevar propio)","Gastos personales","Fotografía profesional"]),
    highlights: JSON.stringify(["Vista panorámica 360°","Bosque seco tropical","Avistamiento de fauna endémica","Cerro a 350m sobre el nivel del mar"]),
    rating: 4.7, reviewCount: 89, maxGuests: 10, difficulty: "Moderado",
    schedule: "5:30 AM - 10:30 AM", meeting: "Parque principal de Luruaco", order: 3,
  },
  {
    name: "Plan Tour Galápago del Atlántico",
    slug: "plan-tour-galapago-atlantico",
    shortDescription: "Visita el santuario de tortugas galápagos y aprende sobre conservación marina en el Atlántico.",
    fullDescription: "Conoce el fascinante mundo de las tortugas galápagos en este tour educativo y ecológico por el Atlántico. Visitarás el centro de conservación donde expertos biólogos te explicarán los programas de protección de estas especies milenarias. Podrás observar las tortugas en su entorno natural, aprender sobre su ciclo de vida y los esfuerzos para preservarlas. El tour también incluye un paseo en lancha por la bahía y tiempo para disfrutar de la playa cercana. Una experiencia perfecta para familias y amantes de la naturaleza.",
    images: JSON.stringify(["https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop"]),
    price: 110000, priceRange: "$110.000 - $160.000 COP", duration: "Medio día (5 horas)",
    location: "Bahía de Santa Verónica, Atlántico", category: "Ecoturismo",
    includes: JSON.stringify(["Guía biólogo marino","Visita al centro de conservación","Paseo en lancha por la bahía","Refrigerio ecológico","Seguro de accidentes","Material educativo","Transporte desde punto de encuentro"]),
    excludes: JSON.stringify(["Souvenirs y artesanías","Gastos personales","Fotografía profesional bajo el agua"]),
    highlights: JSON.stringify(["Observación de tortugas galápagos","Centro de conservación marino","Paseo en lancha","Educación ambiental"]),
    rating: 4.6, reviewCount: 56, maxGuests: 15, difficulty: "Fácil",
    schedule: "8:00 AM - 1:00 PM", meeting: "Plaza de Santa Verónica", order: 4,
  },
  {
    name: "Plan Noche de Estrellas en la Costa",
    slug: "plan-noche-estrellas-costa",
    shortDescription: "Vive una noche mágica bajo las estrellas en la costa del Atlántico con cena y observación astronómica.",
    fullDescription: "Una experiencia inolvidable que combina la belleza del mar Caribe con la majestuosidad del cielo nocturno. Este plan incluye traslado al mirador costero, una cena gourmet frente al mar con mariscos frescos de la región, y una sesión de observación astronómica guiada con telescopios profesionales. Aprenderás sobre las constelaciones visibles desde el Caribe colombiano y las leyendas indígenas asociadas. Incluye barra libre de cócteles tropicales, música en vivo con sonidos del Caribe y una fogata en la playa. Romántico y educativo, perfecto para parejas y grupos pequeños.",
    images: JSON.stringify(["https://images.unsplash.com/photo-1475274047050-1d0c55b0033b?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&h=600&fit=crop"]),
    price: 180000, priceRange: "$180.000 - $250.000 COP", duration: "Noche completa (6 horas)",
    location: "Mirador Costero, Juan de Acosta", category: "Experiencia",
    includes: JSON.stringify(["Transporte ida y vuelta","Cena gourmet frente al mar","Barra libre de cócteles tropicales","Observación astronómica con telescopios","Guía astrónomo","Música en vivo","Fogata en la playa","Seguro de accidentes"]),
    excludes: JSON.stringify(["Vinos premium","Souvenirs","Fotografía profesional"]),
    highlights: JSON.stringify(["Observación de estrellas con telescopio","Cena gourmet de mariscos","Fogata y música en vivo","Mirador costero exclusivo"]),
    rating: 4.9, reviewCount: 67, maxGuests: 8, difficulty: "Fácil",
    schedule: "6:00 PM - 12:00 AM", meeting: "Hotel lobby zona norte, Barranquilla", order: 5,
  },
  {
    name: "Plan Ruta del Bolívar Costero",
    slug: "plan-ruta-bolivar-costero",
    shortDescription: "Recorre los sitios históricos del litoral del Atlántico relacionados con la gesta libertadora.",
    fullDescription: "Viaja en el tiempo por la costa del Atlántico siguiendo los pasos del Libertador Simón Bolívar. Este tour cultural e histórico te lleva por los sitios más emblemáticos de la gesta independentista en el Caribe colombiano: el Museo Bolivariano, el antiguo puerto de Sabanilla, y las fortificaciones coloniales. Incluye almuerzo típico en restaurante histórico, guía historiador experto y material didáctico. Aprenderás sobre la importancia estratégica del Atlántico en la independencia de Colombia y disfrutarás de las vistas del mar Caribe desde perspectivas históricas únicas.",
    images: JSON.stringify(["https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1568702846914-96b305d2ced1?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1466442929976-97f336a657be?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=600&fit=crop"]),
    price: 75000, priceRange: "$75.000 - $100.000 COP", duration: "Medio día (4 horas)",
    location: "Zona histórica, Barranquilla y Sabanilla", category: "Cultural",
    includes: JSON.stringify(["Guía historiador certificado","Entradas a museos y sitios históricos","Almuerzo típico","Transporte entre sitios","Material didáctico","Seguro de viaje"]),
    excludes: JSON.stringify(["Souvenirs y artesanías","Gastos personales","Propinas"]),
    highlights: JSON.stringify(["Museo Bolivariano","Puerto histórico de Sabanilla","Fortificaciones coloniales","Almuerzo en restaurante histórico"]),
    rating: 4.5, reviewCount: 43, maxGuests: 20, difficulty: "Fácil",
    schedule: "9:00 AM - 1:00 PM", meeting: "Museo Bolivariano, Barranquilla", order: 6,
  },
];

const cabins = [
  {
    name: "Cabaña Caribe Coral", slug: "cabana-caribe-coral",
    shortDescription: "Cabaña frente al mar con diseño caribeño, piscina privada y acceso directo a la playa.",
    fullDescription: "Disfruta de la auténtica experiencia caribeña en esta hermosa cabaña frente al mar. Diseñada con materiales locales y una decoración que fusiona lo rústico con lo moderno, la Cabaña Caribe Coral ofrece todo lo que necesitas para unas vacaciones perfectas. Cuenta con piscina privada con vista al mar, terraza con hamacas, cocina totalmente equipada y habitaciones con aire acondicionado. Despierta con el sonido de las olas y relájate en tu oasis privado en la costa del Atlántico.",
    images: JSON.stringify(["https://images.unsplash.com/photo-1499793983394-e58f8b6a1109?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?w=800&h=600&fit=crop"]),
    pricePerNight: 280000, priceRange: "$280.000 - $380.000 COP / noche", location: "Santa Verónica, Atlántico",
    capacity: 6, bedrooms: 2, bathrooms: 2,
    amenities: JSON.stringify(["Piscina privada","Aire acondicionado","Cocina equipada","Terraza con hamacas","Acceso directo a la playa","WiFi gratuito","Estacionamiento","Parrilla/BBQ","TV Smart 55\"","Toallas de playa"]),
    highlights: JSON.stringify(["Frente al mar","Piscina privada","Diseño caribeño auténtico","Acceso directo a la playa"]),
    rules: JSON.stringify(["No fiestas ni eventos","No fumar dentro de la cabaña","No mascotas","Check-in: 3:00 PM, Check-out: 11:00 AM","Máximo 6 huéspedes","Silencio después de las 10:00 PM"]),
    rating: 4.9, reviewCount: 98, lat: 10.95, lng: -75.05, checkIn: "3:00 PM", checkOut: "11:00 AM",
    cancellationPolicy: "Cancelación gratuita hasta 7 días antes del check-in", order: 1,
  },
  {
    name: "Cabaña Manglar Eco-Lodge", slug: "cabana-manglar-eco-lodge",
    shortDescription: "Eco-cabaña rodeada de manglares con experiencia de turismo sostenible y naturaleza pura.",
    fullDescription: "Sumérgete en la naturaleza sin renunciar al confort en esta eco-cabaña ubicada en medio de un bosque de manglares restaurado. La Cabaña Manglar Eco-Lodge fue construida con materiales sostenibles y energía solar, ofreciendo una experiencia única de turismo responsable. Disfruta de un muelle privado para kayaks, observación de aves desde tu terraza, y ducha al aire libre con agua caliente solar. La cabaña tiene una cama king size con mosquitero, cocina básica y un ambiente de total desconexión. Ideal para parejas que buscan reconectarse con la naturaleza.",
    images: JSON.stringify(["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800&h=600&fit=crop"]),
    pricePerNight: 195000, priceRange: "$195.000 - $250.000 COP / noche", location: "Manglar de Mallorquín, Puerto Colombia",
    capacity: 2, bedrooms: 1, bathrooms: 1,
    amenities: JSON.stringify(["Energía solar","Muelle privado para kayaks","Terraza de observación","Ducha al aire libre","Cocina básica","Mosquiteros","Kayak incluido","Binoculares para avistamiento","Hamaca","Agua caliente solar"]),
    highlights: JSON.stringify(["100% sostenible","Rodeada de manglares","Muelle privado","Observación de aves"]),
    rules: JSON.stringify(["No fumar","No mascotas","Respetar la fauna local","No música alta","Check-in: 2:00 PM, Check-out: 12:00 PM","Máximo 2 huéspedes"]),
    rating: 4.8, reviewCount: 67, lat: 10.99, lng: -74.96, checkIn: "2:00 PM", checkOut: "12:00 PM",
    cancellationPolicy: "Cancelación gratuita hasta 5 días antes del check-in", order: 2,
  },
  {
    name: "Cabaña Sol y Arena Familiar", slug: "cabana-sol-arena-familiar",
    shortDescription: "Amplia cabaña familiar con 3 habitaciones, piscina compartida y zona de juegos infantiles.",
    fullDescription: "La cabaña perfecta para familias que buscan diversión y descanso. Con tres amplias habitaciones, sala de estar, cocina completa y una terraza gigante con vista al mar, esta cabaña tiene espacio de sobra para toda la familia. Los más pequeños disfrutarán del área de juegos infantiles y la piscina compartida del complejo, mientras los adultos relax en las hamacas o preparan una parrillada en la zona BBQ. Ubicada en un complejo residencial con seguridad 24/7, estacionamiento y acceso a la playa por sendero peatonal.",
    images: JSON.stringify(["https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop"]),
    pricePerNight: 350000, priceRange: "$350.000 - $450.000 COP / noche", location: "Playa Mendoza, Atlántico",
    capacity: 8, bedrooms: 3, bathrooms: 2,
    amenities: JSON.stringify(["Piscina compartida","Zona de juegos infantiles","Cocina completa","Aire acondicionado en todas las habitaciones","Terraza con vista al mar","Zona BBQ","Seguridad 24/7","Estacionamiento para 2 vehículos","WiFi gratuito","Lavadora"]),
    highlights: JSON.stringify(["Ideal para familias","3 habitaciones amplias","Zona de juegos infantiles","Seguridad 24/7"]),
    rules: JSON.stringify(["No fiestas después de las 10:00 PM","No fumar dentro de la cabaña","Mascotas permitidas (máximo 1, bajo responsabilidad)","Check-in: 3:00 PM, Check-out: 11:00 AM","Máximo 8 huéspedes","Respetar las normas del complejo"]),
    rating: 4.7, reviewCount: 134, lat: 10.92, lng: -75.12, checkIn: "3:00 PM", checkOut: "11:00 AM",
    cancellationPolicy: "Cancelación gratuita hasta 10 días antes del check-in", order: 3,
  },
  {
    name: "Cabaña Brisa del Mar", slug: "cabana-brisa-del-mar",
    shortDescription: "Cabaña romántica para parejas con jacuzzi privado, decoración bohemia y atardeceres increíbles.",
    fullDescription: "Un refugio romántico diseñado para parejas que buscan escapar de la rutina. La Cabaña Brisa del Mar combina decoración bohemia chic con todas las comodidades modernas. Su pieza estrella es el jacuzzi privado en la terraza con vista al mar, perfecto para disfrutar de los atardeceres más hermosos del Caribe. La cabaña cuenta con una habitación principal con cama king size, baño con ducha de lluvia, cocina americana equipada y un espacio de lectura con hamaca. Incluye botella de vino de bienvenida y desayuno continental incluido.",
    images: JSON.stringify(["https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop"]),
    pricePerNight: 320000, priceRange: "$320.000 - $420.000 COP / noche", location: "Juan de Acosta, Atlántico",
    capacity: 2, bedrooms: 1, bathrooms: 1,
    amenities: JSON.stringify(["Jacuzzi privado en terraza","Vino de bienvenida","Desayuno continental incluido","Cama king size","Ducha de lluvia","Cocina americana","Hamaca de lectura","Aire acondicionado","WiFi gratuito","Veladores y velas aromáticas"]),
    highlights: JSON.stringify(["Jacuzzi privado con vista al mar","Romántica y bohemia","Desayuno incluido","Atardeceres únicos"]),
    rules: JSON.stringify(["Solo adultos (18+)","No niños","No mascotas","No fiestas","Check-in: 3:00 PM, Check-out: 12:00 PM","Máximo 2 huéspedes"]),
    rating: 5.0, reviewCount: 45, lat: 10.82, lng: -75.05, checkIn: "3:00 PM", checkOut: "12:00 PM",
    cancellationPolicy: "Cancelación gratuita hasta 5 días antes del check-in", order: 4,
  },
  {
    name: "Cabaña Palma Costeña", slug: "cabana-palma-costena",
    shortDescription: "Cabaña típica costeña con techo de palma, perfecta para una experiencia auténtica y económica.",
    fullDescription: "Vive la auténtica experiencia costeña en esta cabaña tradicional con techo de palma y paredes de madera. La Cabaña Palma Costeña te transporta a la esencia del Caribe colombiano, con su decoración artesanal, muebles de madera local y ambiente fresco y natural. Ubicada en un terreno amplio con palmeras y jardín tropical, ofrece sombra natural y brisa marina constante. Cuenta con lo esencial para una estadía cómoda: cama matrimonial, ventilador de techo, cocina al aire libre y ducha con agua fría/caliente. Ideal para viajeros que buscan autenticidad sin gastar de más.",
    images: JSON.stringify(["https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop"]),
    pricePerNight: 120000, priceRange: "$120.000 - $160.000 COP / noche", location: "Tubará, Atlántico",
    capacity: 4, bedrooms: 1, bathrooms: 1,
    amenities: JSON.stringify(["Techo de palma tradicional","Cocina al aire libre","Jardín tropical","Ventilador de techo","Hamaca","Estacionamiento","Ducha con agua fría/caliente","Cama matrimonial + 2 camas individuales","Barbacoa","Sillas de playa"]),
    highlights: JSON.stringify(["Experiencia auténtica costeña","Techo de palma tradicional","Económica","Jardín tropical privado"]),
    rules: JSON.stringify(["No fiestas","No fumar dentro de la cabaña","Mascotas permitidas (previa autorización)","Check-in: 2:00 PM, Check-out: 11:00 AM","Máximo 4 huéspedes","Cuidar los materiales naturales de la cabaña"]),
    rating: 4.4, reviewCount: 78, lat: 10.87, lng: -75.03, checkIn: "2:00 PM", checkOut: "11:00 AM",
    cancellationPolicy: "Cancelación gratuita hasta 3 días antes del check-in", order: 5,
  },
];

async function main() {
  console.log("Seeding database...");

  // Seed TourPlans
  for (const plan of tourPlans) {
    await db.tourPlan.upsert({
      where: { slug: plan.slug },
      update: plan,
      create: plan,
    });
  }
  console.log(`✅ Seeded ${tourPlans.length} tour plans`);

  // Seed Cabins
  for (const cabin of cabins) {
    await db.cabin.upsert({
      where: { slug: cabin.slug },
      update: cabin,
      create: cabin,
    });
  }
  console.log(`✅ Seeded ${cabins.length} cabins`);

  console.log("🎉 Seed complete!");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
