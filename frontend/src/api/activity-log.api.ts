import { api } from "../utils/axios-client";

export class ActivityLogApi {
    static async getRecentActivities() {
        const response = await api.get("activitylog/recent");

        return response.data?.data ?? [];
    }
}