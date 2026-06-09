export interface IUser {
    id: string;
    email: string;

    twoFactorEnabled?: boolean;

    createdAt?: string;
    updatedAt?: string;

    profile?: {
        firstName?: string;
        lastName?: string;
        imgUrl?: string;
        phoneNumber?: string;
        address?: string;
    };
}
