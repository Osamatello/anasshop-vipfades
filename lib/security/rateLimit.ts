import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export const bookingRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "10 m"),
    prefix: "vipfades:booking",
});

export function getClientIdentifier(headers: Headers): string {
    const forwardedFor = headers.get("x-forwarded-for");

    if (forwardedFor) {
        return forwardedFor.split(",")[0].trim();
    }

    return (
        headers.get("x-real-ip")?.trim() ||
        "unknown"
    );
}