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

/**
 * Fetch one service by its stable slug, WITHOUT filtering on is_active, so the
 * caller can tell "row missing" apart from "row deactivated". Used to resolve
 * the real database row for a VIP package at booking-write time.
 */
export async function getServiceBySlug(
    slug: string
): Promise<BookingService | null> {
    const { data, error } = await supabase
        .from("services")
        .select(
            "id, name, slug, price, duration_minutes, description, is_active"
        )
        .eq("slug", slug)
        .maybeSingle();

    if (error) {
        throw new Error(`Failed to fetch service by slug: ${error.message}`);
    }

    return data;
}

/**
 * Fetch several active services at once. Used by the authoritative server-side
 * appointment-selection resolver so the required duration / price of a
 * multi-service booking is computed from trusted database values rather than
 * anything the client sends. Inactive or unknown ids are simply absent from the
 * result (the caller decides how to reject them).
 */
export async function getServicesByIds(
    serviceIds: string[]
): Promise<BookingService[]> {
    if (serviceIds.length === 0) {
        return [];
    }

    const { data, error } = await supabase
        .from("services")
        .select(
            "id, name, slug, price, duration_minutes, description, is_active"
        )
        .in("id", serviceIds)
        .eq("is_active", true);

    if (error) {
        throw new Error(`Failed to fetch services: ${error.message}`);
    }

    return data ?? [];
}