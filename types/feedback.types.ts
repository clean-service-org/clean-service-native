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
