export const USER_TYPES = {
    CUSTOMER: 'customer',
    OFFICER: 'officer'
} as const;

export type UserType = typeof USER_TYPES[keyof typeof USER_TYPES];

export const VALID_USER_TYPES: UserType[] = [
    USER_TYPES.CUSTOMER,
    USER_TYPES.OFFICER
];

