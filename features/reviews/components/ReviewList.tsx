"use client";

import Image from "next/image";
import { AlertCircle, ArrowDownWideNarrow, MessageCircle, MessageCircleMore, RefreshCw, Send, ShieldCheck, Star, ThumbsDown, ThumbsUp } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { ReviewService } from "../services/review.service";
import type { Review, ReviewTarget } from "../types/review";

export function ReviewList({ target, targetId }: { target: ReviewTarget; targetId: string | number }) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [filter, setFilter] = useState<ReviewFilter>("ALL");

    const loadReviews = useCallback(async () => {
        setLoading(true);
        setError(false);
        try {
            const response = await ReviewService.getReviews(target, targetId);
            setReviews(response.content);
            setTotal(response.totalElements);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [target, targetId]);

    useEffect(() => {
        void loadReviews();
    }, [loadReviews]);

    const filteredReviews = filterReviews(reviews, filter);
    const averageRating = reviews.length
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0;
    const recommendationRate = reviews.length
        ? Math.round((reviews.filter((review) => review.rating >= 4).length / reviews.length) * 100)
        : 0;

    return (
        <section className="rounded-3xl border border-[#2a2825] bg-[#161513] p-5 sm:p-8">
            <div className="flex items-end justify-between gap-4">
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e8a33d]">Community feedback</p>
                    <h2 className="mt-2 text-xl font-semibold text-[#f5f4f1]">Reviews{total > 0 ? ` (${total})` : ""}</h2>
                </div>
            </div>

            {!loading && !error && (
                <div className="mt-6 flex flex-col gap-5 border-y border-[#2a2825] py-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
                    <ReviewMetrics averageRating={averageRating} total={total} recommendationRate={recommendationRate} />
                    <ReviewFilters value={filter} onChange={setFilter} />
                </div>
            )}

            {loading ? (
                <ReviewLoadingState />
            ) : error ? (
                <ReviewState
                    icon={<AlertCircle size={18} />}
                    eyebrow="Connection interrupted"
                    title="Reviews could not load"
                    description="The feedback feed is taking a moment. Try again without leaving this page."
                    action={<button type="button" onClick={() => void loadReviews()} className="inline-flex items-center gap-2 rounded-xl bg-[#e8a33d] px-3.5 py-2 text-xs font-semibold text-[#17130d] transition hover:bg-[#f1b75a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8a33d]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161513]"><RefreshCw size={14} />Try again</button>}
                />
            ) : reviews.length === 0 ? (
                <ReviewState
                    icon={<Star size={18} />}
                    eyebrow="A quiet page for now"
                    title="No reviews yet"
                    description="Reviews appear after completed services, so every note reflects a real StudioOS experience."
                    tone="empty"
                />
            ) : (
                filteredReviews.length > 0 ? (
                    <div className="mt-6 space-y-3">{filteredReviews.map((review) => <ReviewItem key={review.id} review={review} target={target} />)}</div>
                ) : (
                    <ReviewState
                        icon={<Star size={18} />}
                        eyebrow="No matching feedback"
                        title={`No ${filter === "HIGHEST" ? "top-rated" : `${filter}-star`} reviews yet`}
                        description="Try another filter to see more experiences from the StudioOS community."
                        tone="empty"
                    />
                )
            )}
        </section>
    );
}

type ReviewFilter = "ALL" | "5" | "4" | "3" | "HIGHEST";

function filterReviews(reviews: Review[], filter: ReviewFilter) {
    if (filter === "ALL") return reviews;
    if (filter === "HIGHEST") return [...reviews].sort((left, right) => right.rating - left.rating);
    return reviews.filter((review) => Math.round(review.rating) === Number(filter));
}

function ReviewMetrics({ averageRating, total, recommendationRate }: { averageRating: number; total: number; recommendationRate: number }) {
    return (
        <div className="grid flex-1 gap-1 sm:grid-cols-3">
            <div className="flex items-center gap-2 rounded-xl px-1 py-1">
                <Star size={17} className="fill-[#e8a33d] text-[#e8a33d]" />
                <div><p className="font-mono text-sm font-semibold text-[#f5f4f1]">{averageRating.toFixed(1)}</p><p className="text-[10px] text-[#6b685f]">Average rating</p></div>
            </div>
            <div className="flex items-center gap-2 rounded-xl px-1 py-1">
                <MessageCircleMore size={17} className="text-[#5eead4]" />
                <div><p className="font-mono text-sm font-semibold text-[#f5f4f1]">{total.toLocaleString()}</p><p className="text-[10px] text-[#6b685f]">Reviews</p></div>
            </div>
            <div className="flex items-center gap-2 rounded-xl px-1 py-1">
                <ThumbsUp size={17} className="text-emerald-400" />
                <div><p className="font-mono text-sm font-semibold text-[#f5f4f1]">{recommendationRate}%</p><p className="text-[10px] text-[#6b685f]">4+ star experiences</p></div>
            </div>
        </div>
    );
}

function ReviewFilters({ value, onChange }: { value: ReviewFilter; onChange: (value: ReviewFilter) => void }) {
    const filters: { value: ReviewFilter; label: string; icon?: typeof Star }[] = [
        { value: "ALL", label: "All reviews" },
        { value: "5", label: "5 stars", icon: Star },
        { value: "4", label: "4 stars", icon: Star },
        { value: "3", label: "3 stars", icon: Star },
        { value: "HIGHEST", label: "Top rated", icon: ArrowDownWideNarrow },
    ];

    return (
        <div className="flex shrink-0 flex-wrap items-center gap-2 lg:justify-end" aria-label="Review filters">
            <span className="mr-1 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6b685f]"><ArrowDownWideNarrow size={13} />Filter</span>
            {filters.map((filter) => {
                const Icon = filter.icon;
                return <button key={filter.value} type="button" onClick={() => onChange(filter.value)} className={`inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-[11px] font-medium transition ${value === filter.value ? "bg-[#e8a33d] text-[#161513]" : "border border-[#2a2825] bg-[#1c1a17] text-[#9a978f] hover:border-[#e8a33d]/30 hover:text-[#f5f4f1]"}`}>{Icon && <Icon size={12} className={filter.value === "HIGHEST" ? "" : "fill-current"} />}{filter.label}</button>;
            })}
        </div>
    );
}

function ReviewLoadingState() {
    return (
        <div role="status" aria-label="Loading reviews" className="mt-6 space-y-3">
            {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="rounded-2xl border border-[#2a2825] bg-[#1c1a17] p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 animate-pulse rounded-full bg-[#29251f]" />
                            <div className="space-y-2">
                                <div className="h-3 w-28 animate-pulse rounded-full bg-[#29251f]" />
                                <div className="h-2 w-20 animate-pulse rounded-full bg-[#24211d]" />
                            </div>
                        </div>
                        <div className="h-3 w-16 animate-pulse rounded-full bg-[#29251f]" />
                    </div>
                    <div className="mt-5 space-y-2">
                        <div className="h-2.5 w-full animate-pulse rounded-full bg-[#24211d]" />
                        <div className="h-2.5 w-3/5 animate-pulse rounded-full bg-[#24211d]" />
                    </div>
                </div>
            ))}
            <span className="sr-only">Loading reviews...</span>
        </div>
    );
}

function ReviewState({
    icon,
    eyebrow,
    title,
    description,
    action,
    tone = "error",
}: {
    icon: React.ReactNode;
    eyebrow: string;
    title: string;
    description: string;
    action?: React.ReactNode;
    tone?: "error" | "empty";
}) {
    const empty = tone === "empty";

    return (
        <div className="relative mt-6 overflow-hidden rounded-2xl border border-[#2a2825] bg-[#1c1a17] px-5 py-6 sm:px-7 sm:py-7">
            <div aria-hidden="true" className={`absolute -right-12 -top-16 h-36 w-36 rounded-full blur-3xl ${empty ? "bg-[#e8a33d]/10" : "bg-red-400/5"}`} />
            <div className="relative flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                    <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${empty ? "border-[#e8a33d]/25 bg-[#e8a33d]/10 text-[#e8a33d]" : "border-red-300/20 bg-red-300/10 text-red-300"}`}>
                        {icon}
                    </span>
                    <div>
                        <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${empty ? "text-[#e8a33d]" : "text-red-300"}`}>{eyebrow}</p>
                        <h3 className="mt-1 text-sm font-semibold text-[#f5f4f1]">{title}</h3>
                        <p className="mt-1 max-w-xl text-xs leading-5 text-[#938e84]">{description}</p>
                    </div>
                </div>
                {action}
            </div>
            {empty && <div className="relative mt-5 flex items-center gap-2 border-t border-[#2a2825] pt-4 text-[11px] text-[#777168]"><ShieldCheck size={14} className="text-[#e8a33d]" />Authentic feedback from completed StudioOS services</div>}
        </div>
    );
}

function ReviewItem({ review, target }: { review: Review; target: ReviewTarget }) {
    const [counts, setCounts] = useState({ likes: review.likes, dislikes: review.dislikes, comments: review.comments });
    const [reaction, setReaction] = useState<"LIKE" | "DISLIKE">();
    const [commentOpen, setCommentOpen] = useState(false);
    const [comment, setComment] = useState("");
    const [busy, setBusy] = useState(false);
    const avatar = review.reviewerAvatar || "/images/avatar.png";
    const date = new Date(review.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

    async function handleReaction(nextReaction: "LIKE" | "DISLIKE") {
        if (busy) return;
        setBusy(true);
        try {
            const result = reaction === nextReaction
                ? await ReviewService.clearReaction(target, review.id)
                : await ReviewService.react(target, review.id, nextReaction);
            setCounts(result);
            setReaction(result.currentReaction);
        } catch {
            toast.error("Sign in to react", { description: "You need an account to like or dislike a review." });
        } finally {
            setBusy(false);
        }
    }

    async function handleComment() {
        const body = comment.trim();
        if (!body || body.length > 1000 || busy) return;
        setBusy(true);
        try {
            await ReviewService.addComment(target, review.id, body);
            setCounts((current) => ({ ...current, comments: current.comments + 1 }));
            setComment("");
            setCommentOpen(false);
            toast.success("Comment added");
        } catch {
            toast.error("Could not add comment", { description: "Sign in and try again." });
        } finally {
            setBusy(false);
        }
    }

    return (
        <article className="rounded-2xl border border-[#2a2825] bg-[#1c1a17] p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/10"><Image src={avatar} alt="" fill sizes="40px" unoptimized className="object-cover" /></div>
                    <div className="min-w-0"><p className="truncate text-sm font-semibold text-[#f5f4f1]">{review.reviewerName || "StudioOS member"}</p><p className="truncate text-[10px] text-[#777168]">{review.reviewerUsername ? `@${review.reviewerUsername}` : review.reviewerRole || "Verified customer"} · {date}</p></div>
                </div>
                <div className="flex shrink-0 items-center gap-0.5" aria-label={`${review.rating} out of 5 stars`}>{Array.from({ length: Math.round(review.rating) }).map((_, index) => <Star key={index} size={13} className="fill-[#e8a33d] text-[#e8a33d]" />)}</div>
            </div>
            {review.review && <p className="mt-4 text-sm leading-6 text-[#c4c1b8]">{review.review}</p>}
            <div className="mt-4 flex items-center gap-2 text-[10px] text-[#777168]">
                <button type="button" disabled={busy} onClick={() => void handleReaction("LIKE")} className={`inline-flex items-center gap-1 rounded-full px-2 py-1 transition hover:bg-[#29251f] ${reaction === "LIKE" ? "text-[#e8a33d]" : ""}`}><ThumbsUp size={13} />{counts.likes}</button>
                <button type="button" disabled={busy} onClick={() => void handleReaction("DISLIKE")} className={`inline-flex items-center gap-1 rounded-full px-2 py-1 transition hover:bg-[#29251f] ${reaction === "DISLIKE" ? "text-[#e8a33d]" : ""}`}><ThumbsDown size={13} />{counts.dislikes}</button>
                <button type="button" onClick={() => setCommentOpen((open) => !open)} className="inline-flex items-center gap-1 rounded-full px-2 py-1 transition hover:bg-[#29251f]"><MessageCircle size={13} />{counts.comments}</button>
            </div>
            {commentOpen && <div className="mt-3 flex gap-2"><input value={comment} maxLength={1000} onChange={(event) => setComment(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void handleComment(); }} placeholder="Add a respectful comment" className="min-w-0 flex-1 rounded-xl border border-[#2a2825] bg-[#161513] px-3 py-2 text-xs text-[#f5f4f1] outline-none placeholder:text-[#6b685f] focus:border-[#e8a33d]/50" /><button type="button" disabled={!comment.trim() || busy} onClick={() => void handleComment()} className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#e8a33d] px-3 text-[#17130d] disabled:opacity-50"><Send size={14} /></button></div>}
        </article>
    );
}
