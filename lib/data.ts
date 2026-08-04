export const BUSINESS = {
  name: "VIP FADES BY ANAS",
  tagline: "Premium Cuts. Clean Fades.",
  description:
    "Precision barbering, modern style and a premium experience in Koblenz.",
  address: "An der Moselbrücke 9, 56068 Koblenz",
  phone: "017663782674",
  phoneFormatted: "+49 176 63782674",
  instagram: "@vipfades.kob",
  instagramUrl: "https://instagram.com/vipfades.kob",
  hours: {
    days: "Monday to Thursday",
    time: "10:00 to 19:00",
    walkins: "Walk-ins welcome",
  },
};

export type Service = {
  id: string;
  name: string;
  price: number;
  duration?: number;
  description: string;
};

export const SERVICES: Service[] = [
  {
    id: "haircut",
    name: "Men's Haircut",
    price: 20,
    duration: 30,
    description: "Precision cut tailored to your style.",
  },
  {
    id: "beard",
    name: "Beard Trim",
    price: 15,
    duration: 20,
    description: "Shape, line and refine your beard.",
  },
  {
    id: "haircut-beard",
    name: "Haircut + Beard",
    price: 35,
    duration: 40,
    description: "The full grooming experience.",
  },
  {
    id: "eyebrows",
    name: "Eyebrows",
    price: 7,
    duration: 10,
    description: "Clean arch and precise definition.",
  },
  {
    id: "facial",
    name: "Facial Cleansing",
    price: 20,
    description: "Deep cleanse for refreshed skin.",
  },
  {
    id: "hotwax",
    name: "Hot Wax",
    price: 10,
    duration: 10,
    description: "Smooth finish with warm wax treatment.",
  },
  {
    id: "ears-nose",
    name: "Ears & Nose",
    price: 5,
    description: "Quick and clean detailing.",
  },
];

export type Barber = {
  id: string;
  name: string;
  title: string;
  specialty: string;
};

export const BARBERS: Barber[] = [
  {
    id: "anas",
    name: "Anas",
    title: "Head Barber & Founder",
    specialty: "Fades, sharp lines & precision cuts",
  },
  {
    id: "abd",
    name: "Abd",
    title: "Senior Barber",
    specialty: "Classic cuts, beard sculpting & styling",
  },
];

export const TIME_SLOTS = [
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
];
