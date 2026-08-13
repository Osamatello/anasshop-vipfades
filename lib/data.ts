export const BUSINESS = {
  name: "VIP FADES BY ANAS",
  tagline: "Premium Cuts. Saubere Fades.",
  description:
    "Präzises Barbering, moderner Style und ein Premium-Erlebnis in Koblenz.",
  address: "An der Moselbrücke 9, 56068 Koblenz",
  phone: "017663782674",
  phoneFormatted: "+49 176 63782674",
  instagram: "@vipfades.kob",
  instagramUrl: "https://instagram.com/vipfades.kob",
  hours: {
    days: "Montag bis Donnerstag",
    time: "10:00 bis 19:00",
    walkins: "Walk-ins willkommen",
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
    name: "Herrenhaarschnitt",
    price: 20,
    duration: 30,
    description: "Präziser Haarschnitt, abgestimmt auf deinen Style.",
  },
  {
    id: "beard",
    name: "Bart trimmen",
    price: 15,
    duration: 20,
    description: "Formen, Konturen und ein sauberes Bart-Finish.",
  },
  {
    id: "haircut-beard",
    name: "Haarschnitt + Bart",
    price: 35,
    duration: 40,
    description: "Das komplette Grooming-Erlebnis.",
  },
  {
    id: "eyebrows",
    name: "Augenbrauen",
    price: 7,
    duration: 10,
    description: "Saubere Form und präzise Konturen.",
  },
  {
    id: "facial",
    name: "Gesichtsreinigung",
    price: 20,
    description: "Tiefenreinigung für ein frisches Hautgefühl.",
  },
  {
    id: "hotwax",
    name: "Heißwachs",
    price: 10,
    duration: 10,
    description: "Glattes Finish mit warmer Wachsbehandlung.",
  },
  {
    id: "ears-nose",
    name: "Ohren & Nase",
    price: 5,
    description: "Schnelle und saubere Detailpflege.",
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
    title: "Head Barber & Gründer",
    specialty: "Fades, scharfe Konturen & Präzisions-Cuts",
  },
  {
    id: "abd",
    name: "Abd",
    title: "Senior Barber",
    specialty: "Klassische Cuts, Bartstyling & Styling",
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