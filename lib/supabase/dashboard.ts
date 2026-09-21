import "server-only";

import { supabaseServer } from "./server";

export async function getActiveServiceCount(): Promise<number> {
    const { count, error } = await supabaseServer
        .from("services")
        .select("id", {
            count: "exact",
            head: true,
        })
        .eq("is_active", true);

    if (error) {
        throw new Error(
            `Failed to count active services: ${error.message}`
        );
    }

    return count ?? 0;
}
