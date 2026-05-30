import { api } from "../utils/axios-client";

export type AccessRequestStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export class AccessRequestsApi {
    static async findAll() {
        const response = await api.get("access-requests");
        return response.data.data;
    }

    static async updateStatus(
        id: string,
        status: Exclude<AccessRequestStatus, "PENDING">,
    ) {
        const response = await api.put(`access-requests/${id}`, {
            status,
        });

        return response.data.data;
    }
}
