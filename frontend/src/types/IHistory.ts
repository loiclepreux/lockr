export type ActivityAction =
    | "CREATE_DOCUMENT"
    | "UPDATE_DOCUMENT"
    | "DELETE_DOCUMENT"
    | "RESTORE_DOCUMENT"
    | "PERMANENT_DELETE_DOCUMENT"
    | "SHARE_DOCUMENT"
    | "REVOKE_SHARE"
    | "ADD_DOC_IN_GROUP"
    | "REMOVE_DOC_IN_GROUP"
    | "ADD_USER_IN_GROUP"
    | "REMOVE_USER_IN_GROUP"
    | "CREATE_GROUP"
    | "UPDATE_GROUP"
    | "DELETE_GROUP";

export interface IHistory {
    id: string;
    userId: string;
    groupId: string | null;
    actionType: ActivityAction;
    targetType: string;
    targetId: string;
    log: string;
    createdAt: string;
    updatedAt: string;
    user?: {
        id: string;
        email: string;
        profile?: {
            firstName?: string;
            lastName?: string;
        } | null;
    };
}
