export interface Testimonial {
  id: string;
  name: string;
  avatar?: string;
  location: string;
  text: string;
  rating: number;
  tripName?: string;
}

export const testimonials: Testimonial[] = [
  {
    "id": "8c2f42f9-ccc3-4cc5-88d7-24d4aea3b339",
    "name": "Carolina Mendoza",
    "avatar": "CM",
    "location": "Bogotá, Colombia",
    "text": "El Plan Manglar Mallorquín fue una experiencia increíble. Los guías son muy conocedores y el paisaje es breathtaking. 100% recomendado para desconectar de la ciudad.",
    "rating": 5,
    "tripName": "Plan Manglar Mallorquín"
  },
  {
    "id": "2f04d729-42d0-4d75-afee-695506f9d045",
    "name": "Andrés Pérez",
    "avatar": "AP",
    "location": "Medellín, Colombia",
    "text": "Fuimos con un grupo de amigos a Playa Blanca y todo fue perfecto. La organización, la comida, las actividades. Vive Travel nos hizo sentir como en casa lejos de casa.",
    "rating": 5,
    "tripName": "Plan Playa Blanca"
  },
  {
    "id": "a156ffbc-34ef-43ba-89b6-a7f287f88943",
    "name": "María Fernanda López",
    "avatar": "ML",
    "location": "Barranquilla, Colombia",
    "text": "La Cabaña Caribe Coral es un paraíso. Piscina privada frente al mar, no se puede pedir más. Ideal para una escapada romántica.",
    "rating": 5,
    "tripName": "Cabaña Caribe Coral"
  },
  {
    "id": "35927ceb-b39c-4035-9136-5995079704e8",
    "name": "Diego Torres",
    "avatar": "DT",
    "location": "Cali, Colombia",
    "text": "El senderismo al Cerro de la Vieja fue desafiante pero gratificante. Las vistas desde la cima son las mejores que he visto en el Atlántico. Guía excelente.",
    "rating": 4,
    "tripName": "Plan Senderismo Cerro de la Vieja"
  },
  {
    "id": "95d06c65-97a7-41c7-80db-78e10512eedc",
    "name": "Laura Gutiérrez",
    "avatar": "LG",
    "location": "Bucaramanga, Colombia",
    "text": "La noche de estrellas fue mágica. La cena, el telescopio, la fogata... todo estaba perfectamente organizado. Una experiencia que nunca olvidará.",
    "rating": 5,
    "tripName": "Plan Noche de Estrellas en la Costa"
  },
  {
    "id": "26fe51b5-c283-4ed6-82c5-4f4d2de153e6",
    "name": "Roberto Sánchez",
    "avatar": "RS",
    "location": "Cartagena, Colombia",
    "text": "Nos quedamos en la Cabaña Brisa del Mar con mi esposa y fue la mejor decisión. El jacuzzi al atardecer es algo que todo mundo debería experimentar.",
    "rating": 5,
    "tripName": "Cabaña Brisa del Mar"
  }
];
