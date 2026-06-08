import { useQuery } from "@tanstack/react-query";
import { ActivityLogApi } from "../api/activity-log.api";

export const useGroupHistory = (groupId: string | null) => {
    return useQuery({
        queryKey: ["activitylog", "group", groupId],
        queryFn: () => ActivityLogApi.getGroupHistory(groupId as string),
        enabled: !!groupId,
    });
};
