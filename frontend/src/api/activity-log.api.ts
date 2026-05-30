import { api } from "../utils/axios-client";

export class ActivityLogApi {
    // Dashboard
    static async getRecentActivities() {
        const response = await api.get("activitylog/recent");

        return response.data?.data ?? [];
    }

    // Historique complet
    static async getHistory() {
        const response = await api.get("activitylog");

        return response.data?.data ?? [];
    }
}
