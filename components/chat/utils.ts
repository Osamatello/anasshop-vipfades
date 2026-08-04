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

    for (let index = 1; index <= numberOfDays + 4; index += 1) {
        const date = new Date(now);

        date.setDate(now.getDate() + index);

        const dayOfWeek = date.getDay();

        if (dayOfWeek >= 1 && dayOfWeek <= 4) {
            const label = `${days[dayOfWeek]} ${date.getDate()}/${date.getMonth() + 1}`;

            const value = date.toISOString().split('T')[0];

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