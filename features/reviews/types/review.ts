export type ReviewTarget = "ARTIST" | "PRODUCER" | "STUDIO";
export type ReviewReaction = "LIKE" | "DISLIKE";

export type ReviewInteraction = {
    reviewType: ReviewTarget;
    reviewId: string;
    currentReaction?: ReviewReaction;
    likes: number;
    dislikes: number;
    comments: number;
};

export type Review = {
    id: string;
    reviewerId: number;
    reviewerName?: string;
    reviewerUsername?: string;
    reviewerRole?: string;
    reviewerAvatar?: string;
    bookingId?: string;
    rating: number;
    review?: string;
    likes: number;
    comments: number;
    dislikes: number;
    createdAt: string;
};

export type ReviewComment = {
    id: string;
    body: string;
    userName?: string;
    username?: string;
    avatar?: string;
    createdAt: string;
};

export type ReviewPage = {
    content: Review[];
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
};
