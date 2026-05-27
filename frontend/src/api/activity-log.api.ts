import { api } from "../utils/axios-client";

export class ActivityLogApi {
    static async getRecentActivities() {
        const response = await api.get("activitylog/recent");

        console.log("ACTIVITY LOG RESPONSE =>", response.data);

        return response.data?.data ?? [];
    }
}