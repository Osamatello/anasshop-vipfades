import {
    Calendar,
    Clock,
    Tag,
    UserRound,
    CalendarX,
} from 'lucide-react';

export const QUICK_ACTIONS = [
    {
        label: 'Termin buchen',
        value: 'book',
        icon: Calendar,
    },
    {
        label: 'Preise ansehen',
        value: 'prices',
        icon: Tag,
    },
    {
        label: 'Verfügbarkeit prüfen',
        value: 'availability',
        icon: Clock,
    },
    {
        label: 'Barber wählen',
        value: 'barber',
        icon: UserRound,
    },
    {
        label: 'Termin stornieren',
        value: 'cancel',
        icon: CalendarX,
    },
];