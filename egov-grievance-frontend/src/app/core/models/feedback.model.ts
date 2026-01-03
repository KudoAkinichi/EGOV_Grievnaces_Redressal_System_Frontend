export interface Feedback {
  id: number;
  grievanceId: number;
  citizenId: number;
  rating: number; // 1-5
  comments: string;
  createdAt: string;
}

export interface CreateFeedbackRequest {
  grievanceId: number;
  citizenId: number;
  rating: number;
  comments: string;
}

export interface FeedbackStats {
  averageRating: number;
  totalFeedbacks: number;
  ratingDistribution: { [key: number]: number };
}
