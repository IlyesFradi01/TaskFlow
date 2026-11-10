import {
    Navigate,
    Outlet
} from "react-router-dom";

import { useSelector } from "react-redux";

export default function ProtectedRoute() {

    const {
        token,
        initialized
    } = useSelector((state) => state.auth);

    if (!initialized) {
        return (
            <div className="page-center">
                Checking session...
            </div>
        );
    }

    return token
        ? <Outlet />
        : <Navigate to="/login" replace />;
}