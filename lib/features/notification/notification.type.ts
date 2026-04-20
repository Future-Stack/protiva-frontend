export interface NotificationItem {
    id: string;
    userId: string;
    type: string;
    title: string;
    message: string;
    data: any | null;
    isRead: boolean;
    readAt: string | null;
    actionUrl: string | null;
    createdAt: string;
}

export interface GetNotificationsResponse {
    data: NotificationItem[];
    statusCode: number;
    timestamp: string;
    path: string;
}

export interface ReadNotificationResponse {
    statusCode: number;
    timestamp: string;
    path: string;
}
