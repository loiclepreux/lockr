export interface IGroupMember {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

export interface IGroup {
    id: string;
    name: string;
    description: string;
    membersCount: number;
    members: IGroupMember[];
}

// Ce que le frontend envoie au serveur pour créer un groupe :
// pas d'id (généré par le serveur), et les membres sans id non plus
export type CreateGroupData = {
    name: string;
    description: string;
    members: Omit<IGroupMember, "id">[]; // 👈 membres sans id, c'est normal ici
};
