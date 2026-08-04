import {
    Calendar,
    Clock,
    Tag,
    UserRound,
} from 'lucide-react';

export const QUICK_ACTIONS = [
    {
        label: 'Book an appointment',
        value: 'book',
        icon: Calendar,
    },
    {
        label: 'View prices',
        value: 'prices',
        icon: Tag,
    },
    {
        label: 'Check availability',
        value: 'availability',
        icon: Clock,
    },
    {
        label: 'Choose a barber',
        value: 'barber',
        icon: UserRound,
    },
];