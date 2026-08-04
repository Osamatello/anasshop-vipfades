import { supabase } from "./client";

export type BusinessHours = {
    id: string;
    day_of_week: number;
    open_time: string;
    close_time: string;
    is_open: boolean;
};

export async function getBusinessHoursByDay(
    dayOfWeek: number
): Promise<BusinessHours | null> {
    const { data, error } = await supabase
        .from("business_hours")
        .select("id, day_of_week, open_time, close_time, is_open")
        .eq("day_of_week", dayOfWeek)
        .maybeSingle();

    if (error) {
        throw new Error(`Failed to fetch business hours: ${error.message}`);
    }

    return data;
}