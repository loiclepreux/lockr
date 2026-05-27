import { api } from "../utils/axios-client";

export class DashboardApi {
    static async getStats() {
        const response = await api.get("dashboard/stats");

        return response.data.data;
    }
}
