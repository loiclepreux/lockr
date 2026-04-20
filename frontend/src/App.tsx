import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";

// Layout
import PublicLayout from "./components/layouts/PublicLayout";

// Auth guard
import PrivateRoute from "./components/auth/PrivateRoute";
import PrivateLayout from "./components/layouts/PrivateLayout";

// Pages publiques
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";

// Pages privées
import DashboardPage from "./pages/DashboardPage";
import DocumentsPage from "./pages/DocumentsPage";
import GroupPage from "./pages/GroupPage";
import MyAccount from "./pages/MyAccount";
import NotificationPage from "./pages/NotificationPage";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    {/* ====== ROUTES PUBLIQUES (LOC-103) ====== */}
                    <Route element={<PublicLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/signin" element={<Signin />} />
                    </Route>

                    {/* ====== ROUTES PRIVÉES (LOC-104) ====== */}
                    <Route element={<PrivateRoute />}>
                        <Route element={<PrivateLayout />}>
                            <Route
                                path="/dashboard"
                                element={<DashboardPage />}
                            />
                            <Route path="/groups" element={<GroupPage />} />
                            <Route
                                path="/documents"
                                element={<DocumentsPage />}
                            />
                            <Route path="/myAccount" element={<MyAccount />} />
                            <Route
                                path="/notifications"
                                element={<NotificationPage />}
                            />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;
