import { api } from "../utils/axios-client";

export class DashboardApi {
    static async getStats() {
        const response = await api.get("dashboard/stats");

        return response.data.data;
    }

    static async getMonthlyImports() {
        const response = await api.get("dashboard/monthly-imports");
        return response.data;
    }

    static async getDocumentsByType() {
        const response = await api.get("dashboard/documents-by-type");

        return response.data;
    }
}
