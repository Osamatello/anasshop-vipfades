import { supabase } from "./client";

export type Barber = {
    id: string;
    name: string;
    slug: string;
    image_url: string | null;
    is_active: boolean;
};

export async function getBarbers(): Promise<Barber[]> {
    const { data, error } = await supabase
        .from("barbers")
        .select("id, name, slug, image_url, is_active")
        .eq("is_active", true)
        .order("name", { ascending: true });

    if (error) {
        throw new Error(`Failed to fetch barbers: ${error.message}`);
    }

    return data ?? [];
}