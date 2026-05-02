import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const ProtectedRoute = ({ children }) => {
	const initialized = useAuthStore((state) => state.initialized);
	const user = useAuthStore((state) => state.user);
	const location = useLocation();

	if (!initialized) {
		return (
			<div className="flex h-full items-center justify-center bg-paper p-6">
				<div className="rounded-lg border border-line bg-panel px-5 py-4 text-sm font-bold text-muted">
					Checking session...
				</div>
			</div>
		);
	}

	if (!user) {
		return <Navigate to="/auth" replace state={{ from: location }} />;
	}

	return children;
};

export default ProtectedRoute;
