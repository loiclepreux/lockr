type SkeletonProps = {
    className?: string;
};

export function Skeleton({ className = "" }: SkeletonProps) {
    return (
        <div
            className={`animate-pulse rounded-lg bg-white/5 ${className}`}
        />
    );
}

export function DocumentRowSkeleton() {
    return (
        <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-[#111318] px-4 py-3">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-2/5" />
                <Skeleton className="h-3 w-1/4" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
    );
}

export function CardSkeleton() {
    return (
        <div className="rounded-2xl border border-white/5 bg-[#111318] p-5 space-y-3">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-3 w-2/3" />
        </div>
    );
}

export function ChartSkeleton() {
    return (
        <div className="rounded-2xl border border-white/5 bg-[#111318] p-5 space-y-4">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-48 w-full" />
        </div>
    );
}
