// src/hooks/useHistory.ts

import { useQuery } from "@tanstack/react-query";
import { getGroupHistory } from "../api/history.api";

export const useGroupHistory = (groupId: string) => {
    return useQuery({
        queryKey: ["history", groupId], // clé unique par groupe dans le cache
        queryFn: () => getGroupHistory(groupId),
    });
};
