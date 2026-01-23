
import { Creator, ServiceType } from './types';

export const PLATFORM_FEE_PERCENTAGE = 0.25;

export const MOCK_JSON_CREATORS = [
  {
    "id": 1,
    "name": "Valentina",
    "age": 21,
    "whatsapp": "5592988123456",
    "location": "Ponta Negra, Manaus",
    "verified": true,
    "description": "A loira dos seus sonhos, pronta para realizar seus desejos mais íntimos em Manaus. Sou educada, discreta e adoro proporcionar momentos inesquecíveis.",
    "stats": { "height": "1.68m", "weight": "55kg", "type": "Loira" },
    "services": ["Oral", "G-String", "GFE", "Massagem"],
    "rates": { "hour": 350, "overnight": 1400 },
    "photos": [
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1000&auto=format&fit=crop"
    ]
  },
  {
    "id": 2,
    "name": "Isabella",
    "age": 24,
    "whatsapp": "5592988223344",
    "location": "Adrianópolis, Manaus",
    "verified": true,
    "description": "Morena iluminada, elegante e extremamente envolvente. Se você busca uma companhia de classe e com pegada, me chame agora.",
    "stats": { "height": "1.72m", "weight": "60kg", "type": "Morena" },
    "services": ["Fetiche", "Dominação", "Dupla", "Jantar"],
    "rates": { "hour": 500, "overnight": 2000 },
    "photos": [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512413911163-384013401768?q=80&w=1000&auto=format&fit=crop"
    ]
  },
  {
    "id": 3,
    "name": "Gabriela",
    "age": 28,
    "whatsapp": "5592988334455",
    "location": "Vieiralves, Manaus",
    "verified": true,
    "description": "Ruiva natural e decidida. Experiência premium para quem não aceita menos que o melhor. Atendo com total carinho e atenção.",
    "stats": { "height": "1.65m", "weight": "58kg", "type": "Ruiva" },
    "services": ["Massagem", "Oral", "Anal", "Fantasias"],
    "rates": { "hour": 400, "overnight": 1600 },
    "photos": [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1534751511112-0d1197818df1?q=80&w=1000&auto=format&fit=crop"
    ]
  },
  {
    "id": 4,
    "name": "Julia",
    "age": 19,
    "whatsapp": "5592988445566",
    "location": "Parque 10, Manaus",
    "verified": false,
    "description": "Novinha tatuada com carinha de anjo e mente perigosa. Vamos brincar? Faço o estilo namoradinha safada.",
    "stats": { "height": "1.60m", "weight": "50kg", "type": "Tatuada" },
    "services": ["Beijo na boca", "Inversão", "Oral", "Fio terra"],
    "rates": { "hour": 250, "overnight": 1000 },
    "photos": [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop"
    ]
  },
  {
    "id": 5,
    "name": "Beatriz",
    "age": 22,
    "whatsapp": "5592988556677",
    "location": "Alvorada, Manaus",
    "verified": true,
    "description": "Magra, definida e viciada em prazer. Atendo com total discrição em local próprio. Sou muito ativa e adoro explorar.",
    "stats": { "height": "1.70m", "weight": "54kg", "type": "Atlética" },
    "services": ["Fetiche", "Espanhola", "69", "Chuva de Prata"],
    "rates": { "hour": 300, "overnight": 1200 },
    "photos": [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520333789090-1afc82db536a?q=80&w=1000&auto=format&fit=crop"
    ]
  },
  {
    "id": 6,
    "name": "Mariana",
    "age": 31,
    "whatsapp": "5592988667788",
    "location": "Dom Pedro, Manaus",
    "verified": true,
    "description": "Madura, siliconada e cheia de curvas. O porto seguro para sua fantasia. Atendo com calma e sem pressa.",
    "stats": { "height": "1.69m", "weight": "65kg", "type": "Curvilínea" },
    "services": ["Duplex", "Grelinho de Ouro", "Anal", "Pompoarismo"],
    "rates": { "hour": 450, "overnight": 1800 },
    "photos": [
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1491349174775-aaafddd81942?q=80&w=1000&auto=format&fit=crop"
    ]
  },
  {
    "id": 7,
    "name": "Larissa",
    "age": 25,
    "whatsapp": "5592988778899",
    "location": "Tarumã, Manaus",
    "verified": true,
    "description": "Morena de pele canela, cheirosinha e muito carinhosa. Estilo namoradinha dedicado ao seu prazer.",
    "stats": { "height": "1.63m", "weight": "56kg", "type": "Morena" },
    "services": ["Beijo na boca", "Cunnilingus", "Oral", "GFE"],
    "rates": { "hour": 320, "overnight": 1300 },
    "photos": [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542103749-8ef59b94f47e?q=80&w=1000&auto=format&fit=crop"
    ]
  },
  {
    "id": 8,
    "name": "Fernanda",
    "age": 29,
    "whatsapp": "5592988889900",
    "location": "Aleixo, Manaus",
    "verified": false,
    "description": "Executiva de dia, sua melhor companhia à noite. Elegância e fogo. Vamos marcar um café ou algo mais picante.",
    "stats": { "height": "1.74m", "weight": "62kg", "type": "Elegante" },
    "services": ["Jantar", "Eventos", "Oral", "Fantasias"],
    "rates": { "hour": 600, "overnight": 2500 },
    "photos": [
      "https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?q=80&w=1000&auto=format&fit=crop"
    ]
  },
  {
    "id": 9,
    "name": "Camila",
    "age": 23,
    "whatsapp": "5592988990011",
    "location": "Flores, Manaus",
    "verified": true,
    "description": "Fitness e cheia de energia. Topo qualquer parada para te deixar louco. Meu corpo é meu templo e meu prazer é sua satisfação.",
    "stats": { "height": "1.67m", "weight": "59kg", "type": "Fitness" },
    "services": ["Massagem", "69", "Chuveirada", "Oral"],
    "rates": { "hour": 380, "overnight": 1500 },
    "photos": [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1481824429379-07aa5e5b0739?q=80&w=1000&auto=format&fit=crop"
    ]
  },
  {
    "id": 10,
    "name": "Amanda",
    "age": 35,
    "whatsapp": "5592988001122",
    "location": "Japiim, Manaus",
    "verified": true,
    "description": "Experiente e sem tabus. Faço tudo o que você imaginar e um pouco mais. Se você quer prazer sem limites, me chame.",
    "stats": { "height": "1.66m", "weight": "68kg", "type": "Madura" },
    "services": ["Inversão", "Fetiche", "Anal", "Pompoarismo"],
    "rates": { "hour": 400, "overnight": 1600 },
    "photos": [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop"
    ]
  }
];

export const MOCK_CREATORS: Creator[] = MOCK_JSON_CREATORS.map(item => ({
  id: String(item.id),
  name: item.name,
  age: item.age,
  whatsapp: item.whatsapp,
  description: item.description,
  photos: item.photos,
  services: item.services,
  rates: item.rates,
  gender: 'Mulher',
  location_city: item.location.split(',')[0],
  online: true,
  avatar: item.photos[0],
  verified: item.verified,
  ratingCount: Math.floor(Math.random() * 20) + 10,
  baseRate: item.rates.hour
}));

export const SERVICE_PRICES = {
  [ServiceType.VIDEO_CALL]: 100,
  [ServiceType.DIGITAL_CONTENT]: 50,
  [ServiceType.RESERVED_TIME]: 300,
  [ServiceType.TIP]: 20
};
