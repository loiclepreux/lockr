import { Suspense } from "react";
import HeroBanner from "../components/dashboard/HeroBanner";
import ParetoChart from "../components/dashboard/ParetoChart";
import PieChart from "../components/dashboard/PieChart";
import RecentActivities from "../components/dashboard/RecentActivities";
import { CardSkeleton, ChartSkeleton } from "../components/ui/Skeleton";

export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
            <header>
                <Suspense fallback={<CardSkeleton />}>
                    <HeroBanner />
                </Suspense>
            </header>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Suspense fallback={<ChartSkeleton />}>
                    <ParetoChart />
                </Suspense>
                <Suspense fallback={<ChartSkeleton />}>
                    <PieChart />
                </Suspense>
            </div>

            <Suspense fallback={<ChartSkeleton />}>
                <RecentActivities />
            </Suspense>
        </div>
    );
}
