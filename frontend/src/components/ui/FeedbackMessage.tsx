import type { FeedbackMessage } from "../../types/IFeedback";

export default function FeedbackMessage({
    type,
    message,
}: FeedbackMessage) {
    if (!message) return null;

    const styles =
        type === "success"
            ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
            : "bg-red-500/10 border border-red-500/20 text-red-400";

    return (
        <div className={`rounded-xl px-4 py-3 text-sm ${styles}`}>
            {message}
        </div>
    );
}