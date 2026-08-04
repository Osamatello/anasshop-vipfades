import { supabase } from "./client";

export type BookingService = {
    id: string;
    name: string;
    slug: string;
    price: number;
    duration_minutes: number;
    description: string | null;
    is_active: boolean;
};

export async function getServices(): Promise<BookingService[]> {
    const { data, error } = await supabase
        .from("services")
        .select(
            "id, name, slug, price, duration_minutes, description, is_active"
        )
        .eq("is_active", true)
        .order("price", { ascending: true });

    if (error) {
        throw new Error(`Failed to fetch services: ${error.message}`);
    }

    return data ?? [];
}

export async function getServiceById(
    serviceId: string
): Promise<BookingService | null> {
    const { data, error } = await supabase
        .from("services")
        .select(
            "id, name, slug, price, duration_minutes, description, is_active"
        )
        .eq("id", serviceId)
        .eq("is_active", true)
        .maybeSingle();

    if (error) {
        throw new Error(`Failed to fetch service: ${error.message}`);
    }

    return data;
}