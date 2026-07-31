import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "../auth/PrivateRoute";
import AuthProvider from "../hooks/AuthContext";
import MainLayout from "../layouts/MainLayout";

export default function AppRouter() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<div>Landing</div>} />

                    <Route element={
                        <PrivateRoute allowedRoles={['trainer', 'student']}>
                            <MainLayout />
                        </PrivateRoute>
                    }>
                        <Route path="/dashboard" element={<div>Dashboard</div>} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}