import { getAvailableSlots } from "@/lib/services/availability";
import { getBarbers } from "@/lib/supabase/barbers";
import { getServices } from "@/lib/supabase/services";

export default async function TestSupabasePage() {
    const [barbers, services] = await Promise.all([
        getBarbers(),
        getServices(),
    ]);

    const anas = barbers.find((barber) => barber.slug === "anas");
    const haircut = services.find(
        (service) => service.slug === "mens-haircut"
    );

    if (!anas || !haircut) {
        return (
            <main className="p-10">
                <p>Missing barber or service.</p>
            </main>
        );
    }

    const slots = await getAvailableSlots(
        anas.id,
        haircut.id,
        "2026-08-10"
    );

    return (
        <main className="p-10">
            <h1 className="mb-6 text-3xl font-bold">
                Real Availability Test
            </h1>

            <p className="mb-2">Barber: {anas.name}</p>
            <p className="mb-2">Service: {haircut.name}</p>
            <p className="mb-4">Date: 2026-08-10</p>
            <p className="mb-4">Total available slots: {slots.length}</p>

            <pre>{JSON.stringify(slots, null, 2)}</pre>
        </main>
    );
}