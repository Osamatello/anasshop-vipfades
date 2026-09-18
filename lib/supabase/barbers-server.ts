import "server-only";

import { supabaseServer } from "./server";

export type ActiveBarber = {
    id: string;
    name: string;
};

export async function getActiveBarberById(
    barberId: string
): Promise<ActiveBarber | null> {
    const { data, error } = await supabaseServer
        .from("barbers")
        .select("id, name")
        .eq("id", barberId)
        .eq("is_active", true)
        .maybeSingle();

    if (error) {
        throw new Error(
            `Failed to fetch active barber: ${error.message}`
        );
    }

    return data;
}
