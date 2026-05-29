import { api } from "../utils/axios-client";

export class UserApi {
    static async updateUser(
        id: string,
        data: {
            email: string;
            phoneNumber?: string;
            address?: string;
        },
    ) {
        const response = await api.put(`user/${id}`, data);
        return response.data.data;
    }

    static async uploadPhoto(file: File) {
        const formData = new FormData();

        formData.append("file", file);

        const response = await api.post("user/me/photo", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data.data;
    }
}
