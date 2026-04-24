// On redéfinit les enums ici car Prisma n'est pas accessible côté front
export type PrivacyEnum = "public" | "private";

export type RoleEnum = "creator" | "moderator" | "user";

export interface IGroupMember {
    userId: string;
    role: RoleEnum;
    user: {
        id: string;
        email: string;
        profile: {
            firstName: string;
            lastName: string;
            imgUrl: string | null;
        } | null;
    };
}

export interface IGroup {
    id: string;
    name: string;
    description: string;
    category: string;
    privacy: PrivacyEnum;
    imgUrl: string | null;
    creatorId: string;
    createdAt: string;
    updatedAt: string;
    users: IGroupMember[];
}

export type CreateGroupData = {
    name: string;
    description: string;
    category: string;
    privacy: PrivacyEnum;
    imgUrl?: string;
};
