import { api } from "../utils/axios-client";

export interface NotificationItem {
    notificationId: string;
    userId: string;
    isRead: boolean;
    createdAt: string;
    notification: {
        id: string;
        type: string;
        message: string;
        relatedId: string;
        relatedType: string;
        createdAt: string;
    };
}

export class NotificationsApi {
    static async findAll(): Promise<NotificationItem[]> {
        const { data } = await api.get("notifications");
        return data?.data ?? [];
    }

    static async markAsRead(notificationId: string): Promise<void> {
        await api.patch(`notifications/${notificationId}/read`);
    }

    static async markAllAsRead(): Promise<void> {
        await api.patch("notifications/read-all");
    }

    static async countUnread(): Promise<number> {
        const { data } = await api.get("notifications/count");
        return data?.data ?? 0;
    }
}
