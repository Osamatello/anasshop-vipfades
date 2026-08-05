export type ValidationResult =
    | {
        valid: true;
        value: string;
    }
    | {
        valid: false;
        error: string;
    };

const NAME_PATTERN = /^[A-Za-zÀ-ÿ\u0600-\u06FF][A-Za-zÀ-ÿ\u0600-\u06FF\s'-]*[A-Za-zÀ-ÿ\u0600-\u06FF]$/;

export function normalizeCustomerName(name: string): string {
    return name
        .normalize('NFKC')
        .trim()
        .replace(/\s+/g, ' ');
}

export function validateCustomerName(name: unknown): ValidationResult {
    if (typeof name !== 'string') {
        return {
            valid: false,
            error: 'Please enter a valid name.',
        };
    }

    const normalizedName = normalizeCustomerName(name);

    if (normalizedName.length < 2 || normalizedName.length > 80) {
        return {
            valid: false,
            error: 'Please enter a name between 2 and 80 characters.',
        };
    }

    if (!NAME_PATTERN.test(normalizedName)) {
        return {
            valid: false,
            error:
                'Please enter a valid name using letters, spaces, apostrophes, or hyphens.',
        };
    }

    return {
        valid: true,
        value: normalizedName,
    };
}

export function normalizePhoneNumber(phone: string): string {
    const normalizedInput = phone.normalize('NFKC').trim();
    const hasLeadingPlus = normalizedInput.startsWith('+');
    const digitsOnly = normalizedInput.replace(/\D/g, '');

    return hasLeadingPlus ? `+${digitsOnly}` : digitsOnly;
}

export function validatePhoneNumber(phone: unknown): ValidationResult {
    if (typeof phone !== 'string') {
        return {
            valid: false,
            error: 'Please enter a valid local or international phone number.',
        };
    }

    const trimmedPhone = phone.normalize('NFKC').trim();

    if (!/^[+()\d\s.-]+$/.test(trimmedPhone)) {
        return {
            valid: false,
            error: 'Please enter a valid local or international phone number.',
        };
    }

    const normalizedPhone = normalizePhoneNumber(trimmedPhone);
    const digitsOnly = normalizedPhone.replace(/\D/g, '');

    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
        return {
            valid: false,
            error: 'Phone numbers must contain between 7 and 15 digits.',
        };
    }

    if (/^(\d)\1+$/.test(digitsOnly)) {
        return {
            valid: false,
            error: 'Please enter a valid local or international phone number.',
        };
    }

    if (normalizedPhone.startsWith('+') && digitsOnly.startsWith('0')) {
        return {
            valid: false,
            error:
                'International phone numbers must not start with 0 after the + sign.',
        };
    }

    return {
        valid: true,
        value: normalizedPhone,
    };
}