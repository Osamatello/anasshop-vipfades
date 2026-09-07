import type { Barber } from "@/lib/data";

import type { BookingSelection } from "./selection";

export type Role = "bot" | "user";

export type BookingDraft = {
    /** One or more individual services, or exactly one VIP package. */
    selection?: BookingSelection;
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
    | "cancelEnterPhone"
    | "cancelPickBooking"
    | "cancelConfirm"
    | "done";