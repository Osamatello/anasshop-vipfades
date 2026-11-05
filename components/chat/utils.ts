export type AvailableDate = {
    label: string;
    value: string;
};

export function nextDays(numberOfDays: number): AvailableDate[] {
    const output: AvailableDate[] = [];

    const days = [
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat',
    ];

    const now = new Date();

    // Start from today, not tomorrow
    for (let index = 0; index <= numberOfDays + 5; index += 1) {
        const date = new Date(now);

        date.setDate(now.getDate() + index);

        const dayOfWeek = date.getDay();

        // Booking only Monday - Thursday
        if (dayOfWeek >= 1 && dayOfWeek <= 4) {
            const label = `${days[dayOfWeek]} ${date.getDate()}/${date.getMonth() + 1}`;

            const value = [
                date.getFullYear(),
                String(date.getMonth() + 1).padStart(2, '0'),
                String(date.getDate()).padStart(2, '0'),
            ].join('-');

            output.push({
                label,
                value,
            });

            if (output.length >= numberOfDays) {
                break;
            }
        }
    }

    return output;
}