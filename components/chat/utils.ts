export function nextDays(numberOfDays: number): string[] {
    const output: string[] = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();

    for (let index = 1; index <= numberOfDays + 4; index += 1) {
        const date = new Date(now);
        date.setDate(now.getDate() + index);

        const dayOfWeek = date.getDay();

        if (dayOfWeek >= 1 && dayOfWeek <= 4) {
            output.push(
                `${days[dayOfWeek]} ${date.getDate()}/${date.getMonth() + 1}`,
            );

            if (output.length >= numberOfDays) {
                break;
            }
        }
    }

    return output;
}