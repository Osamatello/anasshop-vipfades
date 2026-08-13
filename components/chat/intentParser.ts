export type TimeOfDay = 'morning' | 'afternoon' | 'evening';

export type SlotPreference = 'first' | 'last';

export type Weekday =
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday';

export type SpecificDate = {
    day: number;
    month: number;
    year?: number;
};

export type SmallTalkIntent =
    | 'greeting'
    | 'howAreYou'
    | 'thanks'
    | 'goodbye';

export type ChangeIntent =
    | 'barber'
    | 'service'
    | 'date'
    | 'time';

export type ParsedBookingIntent = {
    wantsBooking: boolean;
    barberName?: string;
    serviceName?: string;
    relativeDate?: 'today' | 'tomorrow';
    specificDate?: SpecificDate;
    weekday?: Weekday;
    timeOfDay?: TimeOfDay;
    slotPreference?: SlotPreference;
    smallTalk?: SmallTalkIntent;
    changeIntent?: ChangeIntent;
};

type ParserCatalog = {
    barbers: {
        name: string;
    }[];
    services: {
        name: string;
    }[];
};

const normalizeText = (value: string) =>
    value
        .toLowerCase()
        .replace(/['’]/g, '')
        .replace(/\+/g, ' plus ')
        .replace(/[^a-z0-9äöüß]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

const findBarber = (
    normalizedInput: string,
    barbers: ParserCatalog['barbers'],
) => {
    return barbers.find((barber) =>
        normalizedInput.includes(normalizeText(barber.name)),
    );
};

const findService = (
    normalizedInput: string,
    services: ParserCatalog['services'],
) => {
    const directMatch = services.find((service) =>
        normalizedInput.includes(normalizeText(service.name)),
    );

    if (directMatch) {
        return directMatch;
    }

    const wantsHaircut =
        normalizedInput.includes('haarschnitt') ||
        normalizedInput.includes('haare schneiden') ||
        normalizedInput.includes('haircut') ||
        normalizedInput.includes('hair cut');

    const wantsBeard =
        normalizedInput.includes('bart') ||
        normalizedInput.includes('beard');

    if (wantsHaircut && !wantsBeard) {
        return services.find((service) => {
            const normalizedName = normalizeText(service.name);

            return (
                normalizedName.includes('haarschnitt') &&
                !normalizedName.includes('bart')
            );
        });
    }

    if (wantsBeard && !wantsHaircut) {
        return services.find((service) => {
            const normalizedName = normalizeText(service.name);

            return (
                normalizedName.includes('bart') &&
                !normalizedName.includes('haarschnitt')
            );
        });
    }

    if (wantsHaircut && wantsBeard) {
        return services.find((service) => {
            const normalizedName = normalizeText(service.name);

            return (
                normalizedName.includes('haarschnitt') &&
                normalizedName.includes('bart')
            );
        });
    }

    return undefined;
};

const findRelativeDate = (
    normalizedInput: string,
): ParsedBookingIntent['relativeDate'] => {
    if (
        normalizedInput.includes('morgen') ||
        normalizedInput.includes('tomorrow')
    ) {
        return 'tomorrow';
    }

    if (
        normalizedInput.includes('heute') ||
        normalizedInput.includes('today')
    ) {
        return 'today';
    }

    return undefined;
};

const findSpecificDate = (
    input: string,
): ParsedBookingIntent['specificDate'] => {
    const match = input.match(
        /\b(\d{1,2})[./-](\d{1,2})(?:[./-](\d{2,4}))?\b/,
    );

    if (!match) {
        return undefined;
    }

    const day = Number(match[1]);
    const month = Number(match[2]);

    let year = match[3]
        ? Number(match[3])
        : undefined;

    if (year !== undefined && year < 100) {
        year += 2000;
    }

    if (
        day < 1 ||
        day > 31 ||
        month < 1 ||
        month > 12
    ) {
        return undefined;
    }

    return {
        day,
        month,
        year,
    };
};

const findWeekday = (
    normalizedInput: string,
): ParsedBookingIntent['weekday'] => {
    const weekdays: {
        value: Weekday;
        labels: string[];
    }[] = [
            { value: 'monday', labels: ['montag', 'monday'] },
            { value: 'tuesday', labels: ['dienstag', 'tuesday'] },
            { value: 'wednesday', labels: ['mittwoch', 'wednesday'] },
            { value: 'thursday', labels: ['donnerstag', 'thursday'] },
            { value: 'friday', labels: ['freitag', 'friday'] },
            { value: 'saturday', labels: ['samstag', 'saturday'] },
            { value: 'sunday', labels: ['sonntag', 'sunday'] },
        ];

    return weekdays.find(({ labels }) =>
        labels.some((label) =>
            normalizedInput.includes(label),
        ),
    )?.value;
};

const findTimeOfDay = (
    normalizedInput: string,
): ParsedBookingIntent['timeOfDay'] => {
    if (
        normalizedInput.includes('morgen') ||
        normalizedInput.includes('vormittag') ||
        normalizedInput.includes('morning')
    ) {
        return 'morning';
    }

    if (
        normalizedInput.includes('nachmittag') ||
        normalizedInput.includes('afternoon')
    ) {
        return 'afternoon';
    }

    if (
        normalizedInput.includes('abend') ||
        normalizedInput.includes('heute abend') ||
        normalizedInput.includes('evening') ||
        normalizedInput.includes('tonight')
    ) {
        return 'evening';
    }

    return undefined;
};

const findSlotPreference = (
    normalizedInput: string,
): ParsedBookingIntent['slotPreference'] => {
    if (
        normalizedInput.includes('letzter termin') ||
        normalizedInput.includes('spätester termin') ||
        normalizedInput.includes('spaetester termin') ||
        normalizedInput.includes('letzter slot') ||
        normalizedInput.includes('last appointment') ||
        normalizedInput.includes('latest appointment') ||
        normalizedInput.includes('last slot') ||
        normalizedInput.includes('latest slot') ||
        normalizedInput.includes('final appointment')
    ) {
        return 'last';
    }

    if (
        normalizedInput.includes('erster termin') ||
        normalizedInput.includes('frühester termin') ||
        normalizedInput.includes('fruehester termin') ||
        normalizedInput.includes('erster slot') ||
        normalizedInput.includes('first appointment') ||
        normalizedInput.includes('earliest appointment') ||
        normalizedInput.includes('first slot') ||
        normalizedInput.includes('earliest slot')
    ) {
        return 'first';
    }

    return undefined;
};

const findChangeIntent = (
    normalizedInput: string,
    hasBarber: boolean,
    hasService: boolean,
    hasDate: boolean,
    hasTime: boolean,
): ParsedBookingIntent['changeIntent'] => {
    const hasChangeLanguage =
        normalizedInput.includes('ändern') ||
        normalizedInput.includes('aendern') ||
        normalizedInput.includes('wechseln') ||
        normalizedInput.includes('stattdessen') ||
        normalizedInput.includes('doch') ||
        normalizedInput.includes('lieber') ||
        normalizedInput.includes('anders') ||
        normalizedInput.includes('change') ||
        normalizedInput.includes('switch') ||
        normalizedInput.includes('instead') ||
        normalizedInput.includes('actually') ||
        normalizedInput.includes('rather') ||
        normalizedInput.includes('make it') ||
        normalizedInput.includes('what about') ||
        normalizedInput.includes('how about') ||
        normalizedInput.includes('different');

    if (!hasChangeLanguage) {
        return undefined;
    }

    if (hasBarber) return 'barber';
    if (hasService) return 'service';
    if (hasDate) return 'date';
    if (hasTime) return 'time';

    return undefined;
};

const findSmallTalk = (
    normalizedInput: string,
): ParsedBookingIntent['smallTalk'] => {
    if (
        normalizedInput.includes('wie geht es dir') ||
        normalizedInput.includes('wie gehts') ||
        normalizedInput.includes('alles gut') ||
        normalizedInput.includes('how are you') ||
        normalizedInput.includes('howre you') ||
        normalizedInput.includes('how you doing') ||
        normalizedInput.includes('how are u')
    ) {
        return 'howAreYou';
    }

    if (
        normalizedInput === 'danke' ||
        normalizedInput === 'dankeschön' ||
        normalizedInput === 'dankeschoen' ||
        normalizedInput === 'vielen dank' ||
        normalizedInput === 'thanks' ||
        normalizedInput === 'thank you' ||
        normalizedInput === 'thank u' ||
        normalizedInput.includes('thanks a lot') ||
        normalizedInput.includes('thank you very much')
    ) {
        return 'thanks';
    }

    if (
        normalizedInput === 'tschüss' ||
        normalizedInput === 'tschuess' ||
        normalizedInput === 'ciao' ||
        normalizedInput === 'bis später' ||
        normalizedInput === 'bis spaeter' ||
        normalizedInput === 'bye' ||
        normalizedInput === 'goodbye' ||
        normalizedInput === 'see you' ||
        normalizedInput === 'see you later'
    ) {
        return 'goodbye';
    }

    if (
        normalizedInput === 'hi' ||
        normalizedInput === 'hallo' ||
        normalizedInput === 'hey' ||
        normalizedInput === 'guten morgen' ||
        normalizedInput === 'guten tag' ||
        normalizedInput === 'guten abend' ||
        normalizedInput === 'hello' ||
        normalizedInput === 'good morning' ||
        normalizedInput === 'good afternoon' ||
        normalizedInput === 'good evening' ||
        normalizedInput.startsWith('hi ') ||
        normalizedInput.startsWith('hallo ') ||
        normalizedInput.startsWith('hey ') ||
        normalizedInput.startsWith('hello ')
    ) {
        return 'greeting';
    }

    return undefined;
};

export function parseBookingIntent(
    input: string,
    catalog: ParserCatalog,
): ParsedBookingIntent {
    const normalizedInput = normalizeText(input);

    const barber = findBarber(
        normalizedInput,
        catalog.barbers,
    );

    const service = findService(
        normalizedInput,
        catalog.services,
    );

    const relativeDate =
        findRelativeDate(normalizedInput);

    const specificDate =
        findSpecificDate(input);

    const weekday =
        findWeekday(normalizedInput);

    const timeOfDay =
        findTimeOfDay(normalizedInput);

    const slotPreference =
        findSlotPreference(normalizedInput);

    const smallTalk =
        findSmallTalk(normalizedInput);

    const changeIntent =
        findChangeIntent(
            normalizedInput,
            Boolean(barber),
            Boolean(service),
            Boolean(relativeDate || specificDate || weekday),
            Boolean(timeOfDay || slotPreference),
        );

    const wantsBooking =
        normalizedInput.includes('buchen') ||
        normalizedInput.includes('buchung') ||
        normalizedInput.includes('termin') ||
        normalizedInput.includes('reservieren') ||
        normalizedInput.includes('book') ||
        normalizedInput.includes('booking') ||
        normalizedInput.includes('appointment') ||
        normalizedInput.includes('reserve') ||
        Boolean(barber) ||
        Boolean(service) ||
        Boolean(relativeDate) ||
        Boolean(specificDate) ||
        Boolean(weekday) ||
        Boolean(slotPreference);

    return {
        wantsBooking,
        barberName: barber?.name,
        serviceName: service?.name,
        relativeDate,
        specificDate,
        weekday,
        timeOfDay,
        slotPreference,
        smallTalk,
        changeIntent,
    };
}