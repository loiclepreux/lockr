export interface IUser {
    id: string;
    email: string;

    createdAt?: string;
    updatedAt?: string;

    profile?: {
        firstName?: string;
        lastName?: string;
        imgUrl?: string;
        phoneNumber?: number;
        address?: string;
    };
}
