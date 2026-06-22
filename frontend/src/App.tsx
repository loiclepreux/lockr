import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router";
import { useAuthInit } from "./hooks/useAuthInit";
import "./index.css";

import PublicLayout from "./components/layouts/PublicLayout";
import PrivateRoute from "./components/auth/PrivateRoute";
import PrivateLayout from "./components/layouts/PrivateLayout";

// Pages publiques — chargées immédiatement (critiques pour le premier rendu)
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";

// Pages privées — lazy loaded (non critiques au premier rendu)
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const DocumentsPage = lazy(() => import("./pages/DocumentsPage"));
const GroupPage = lazy(() => import("./pages/GroupPage"));
const MyAccount = lazy(() => import("./pages/MyAccount"));
const NotificationPage = lazy(() => import("./pages/NotificationPage"));
const TrashPage = lazy(() => import("./pages/TrashPage"));

const queryClient = new QueryClient();

function PageLoader() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0b0f14]">
            <span className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
        </div>
    );
}

function App() {
    const { isLoading } = useAuthInit();
    if (isLoading) return <PageLoader />;
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        {/* ====== ROUTES PUBLIQUES ====== */}
                        <Route element={<PublicLayout />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/signin" element={<Signin />} />
                        </Route>

                        {/* ====== ROUTES PRIVÉES ====== */}
                        <Route element={<PrivateRoute />}>
                            <Route element={<PrivateLayout />}>
                                <Route path="/dashboard" element={<DashboardPage />} />
                                <Route path="/groups" element={<GroupPage />} />
                                <Route path="/documents" element={<DocumentsPage />} />
                                <Route path="/trash" element={<TrashPage />} />
                                <Route path="/myAccount" element={<MyAccount />} />
                                <Route path="/notifications" element={<NotificationPage />} />
                            </Route>
                        </Route>
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;
