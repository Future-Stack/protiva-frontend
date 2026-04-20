import { baseAPI } from "@/lib/baseAPI/baseAPI";
import { GetNotificationsResponse, ReadNotificationResponse } from "./notification.type";

const notificationAPI = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        getNotifications: build.query<GetNotificationsResponse, void>({
            query: () => ({
                url: "/api/v1/notification/get-my-ntg",
                method: "GET",
            }),
            providesTags: ["Notification"],
        }),

        readNotification: build.mutation<ReadNotificationResponse, string>({
            query: (id) => ({
                url: `/api/v1/notification/${id}/read`,
                method: "PATCH",
            }),
            invalidatesTags: ["Notification"],
        }),
    }),
});

export const {
    useGetNotificationsQuery,
    useReadNotificationMutation,
} = notificationAPI;
