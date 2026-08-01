import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "../auth/PrivateRoute";
import AuthProvider from "../hooks/AuthContext";
import MainLayout from "../layouts/MainLayout";
import Landing from "../pages/Landing";
import Dashboard from "../dashboard/Dashboard";

export default function AppRouter() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Landing />} />

                    <Route element={
                        <PrivateRoute allowedRoles={['trainer', 'student']}>
                            <MainLayout />
                        </PrivateRoute>
                    }>
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}