export interface Feedback {
  id: string;
  bookingId: string;
  helperRating: number;
  title: string;
  description: string;
  customerAvatar: string | null;
  customerName: string;
  createdAt: string;
}

export interface CustomerFeedback {
  id: string;
  bookingId: string;
  title: string;
  description: string;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerFeedbackResponse {
  statusCode: string;
  message: string;
  data: {
    totalItems: number;
    currentPage: number;
    nextPage: number | null;
    previousPage: number | null;
    totalPages: number;
    results: CustomerFeedback[];
  };
}

export interface FeedbackResponse {
  statusCode: string;
  message: string;
  data: {
    totalItems: number;
    currentPage: number;
    nextPage: number | null;
    previousPage: number | null;
    totalPages: number;
    results: Feedback[];
  };
}

