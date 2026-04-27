export interface Booking {
  id: string;
  bookingNumber: string | null;
  clientId: string;
  providerId: string;
  jobId: string;
  serviceName: string;
  serviceDescription: string | null;
  preferredDate: string;
  preferredTime: string;
  scheduledAt: string | null;
  serviceLocation: string;
  locationAddress: string | null;
  locationLatitude: string;
  locationLongitude: string;
  locationDetails: string;
  contactPhone: string;
  contactEmail: string | null;
  serviceAmount: string;
  platformFee: string | null;
  taxAmount: string;
  totalAmount: string | null;
  paymentMethod: string | null;
  paymentStatus: string;
  paidAt: string | null;
  status: string;
  cancellationReason: string | null;
  cancelledBy: string | null;
  cancelledAt: string | null;
  message: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  job: {
    id: string;
    userId: string;
    categoryId: string;
    subCategoryId: string;
    title: string;
    slug: string;
    description: string;
    basePrice: string;
    priceType: string;
    includeService: string[];
    thumbnail: string;
    features: any | null;
    images: string[];
    videos: string[];
    serviceLocation: string | null;
    serviceRadius: string | null;
    status: string;
    views: number;
    clicks: number;
    totalBookings: number;
    averageRating: number | null;
    metaTitle: string | null;
    metaDescription: string | null;
    publishedAt: string | null;
    isPopuler: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
  client: {
    phone: string;
    firstName: string;
    lastName: string;
  };
  provider: {
    phone: string;
    firstName: string;
    lastName: string;
  };
}

export interface AllBookingsResponse {
  data: {
    success: boolean;
    message: string;
    data: {
      data: Booking[];
      pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    };
  };
  statusCode: number;
  timestamp: string;
  path: string;
}

export interface UserTotalBookingResponse {
  data: number;
  statusCode: number;
  timestamp: string;
  path: string;
}

export interface AllBookingsQuery {
  limit?: number;
  page?: number;
  status?: "PENDING" | "ACCEPTED" | "REJECTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "REFUNDED";
  search?: string;
  date?: string;
}