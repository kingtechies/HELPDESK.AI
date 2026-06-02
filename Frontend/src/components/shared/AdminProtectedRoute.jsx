import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

/**
 * AdminProtectedRoute Component
 * Restricts access to routes to only users with the 'admin' role.
 */
const AdminProtectedRoute = () => {
    const { user, profile, loading } = useAuthStore();

    if (loading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-white">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
            </div>
        );
    }

    // Check if the user is authenticated from Supabase
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If we have a user but no profile yet, wait for the database fetch
    if (!profile) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-[#050508]">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
            </div>
        );
    }

    // Check if the user's profile role is 'admin' or 'super_admin'
    // Enforce role — fail closed: explicitly deny instead of silently redirecting
    if (profile.role !== "admin" && profile.role !== "super_admin") {
        return (
            <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#050508] text-white">
                <div className="text-6xl font-bold text-red-500 mb-4">403</div>
                <h1 className="text-2xl font-semibold mb-2">Access Denied</h1>
                <p className="text-gray-400 mb-6">You do not have permission to access the admin portal.</p>
                <a href="/" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors">
                    Return Home
                </a>
            </div>
        );
    }

    // Enforce active status for admins (Master Admin approval)
    if (profile.status === "rejected") {
        return <Navigate to="/not-approved" replace />;
    } else if (profile.status !== "active") {
        return <Navigate to="/admin-lobby" replace />;
    }

    // Authorised and active: render the protected layout
    return <Outlet />;
};

export default AdminProtectedRoute;
