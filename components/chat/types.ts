import type { Barber, Service } from "@/lib/data";

export type Role = "bot" | "user";

export type BookingDraft = {
    service?: Service;
    barber?: Barber;
    date?: string;
    time?: string;
    name?: string;
    phone?: string;
};

export type Msg = {
    id: number;
    role: Role;
    text: string;
    chips?: string[];
    options?: {
        label: string;
        value: string;
        sub?: string;
    }[];
    booking?: BookingDraft;
};

export type Step =
    | "welcome"
    | "menu"
    | "pickService"
    | "pickBarber"
    | "pickBarberPre"
    | "pickDate"
    | "pickTime"
    | "enterName"
    | "enterPhone"
    | "confirm"
    | "done";