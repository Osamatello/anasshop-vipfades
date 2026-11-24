import "server-only";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
}

if (!supabaseSecretKey) {
    throw new Error("Missing SUPABASE_SECRET_KEY");
}

/**
 * Supabase sometimes rejects a valid key with PGRST303 "JWT issued at future"
 * (a clock difference on Supabase's side). The request was never run, so it is
 * safe to send it again after a short wait.
 */
async function fetchWithClockSkewRetry(
    input: RequestInfo | URL,
    init?: RequestInit
): Promise<Response> {
    const delaysMs = [400, 1200];

    for (let attempt = 0; ; attempt++) {
        const response = await fetch(input, init);

        if (response.status !== 401 || attempt >= delaysMs.length) {
            return response;
        }

        const body = await response.clone().text().catch(() => "");

        if (!body.includes("PGRST303")) {
            return response;
        }

        await new Promise((resolve) => setTimeout(resolve, delaysMs[attempt]));
    }
}

export const supabaseServer = createClient(
    supabaseUrl,
    supabaseSecretKey,
    {
        global: {
            fetch: fetchWithClockSkewRetry,
        },
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    }
);