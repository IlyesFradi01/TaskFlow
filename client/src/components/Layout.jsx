import {
    NavLink,
    Outlet,
    useNavigate
} from "react-router-dom";

import {
    useDispatch,
    useSelector
} from "react-redux";

import {
    logout
} from "../features/authSlice";

import {
    FiLayers,
    FiGrid,
    FiCheckSquare,
    FiLogOut,
    FiGlobe
} from "react-icons/fi";

export default function Layout() {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const user = useSelector(
        (state) => state.auth.user
    );

    const handleLogout = () => {
        dispatch(logout());

        navigate("/login");
    };

    return (

        <div className="app-shell">

            <aside className="sidebar">

                <div className="brand">
                    <span className="brand-mark">
                        <FiLayers />
                    </span>

                    TaskFlow
                </div>

                <div className="sidebar-label">
                    WORKSPACE
                </div>

                <NavLink to="/dashboard">
                    <FiGrid /> Dashboard
                </NavLink>

                <NavLink to="/projects">
                    <FiLayers /> Projects
                </NavLink>

                <NavLink to="/tasks">
                    <FiCheckSquare /> Tasks
                </NavLink>

                <NavLink to="/public">
                    <FiGlobe /> Public directory
                </NavLink>

                <div className="sidebar-bottom">

                    <div className="user-mini">

                        <div className="avatar">
                            {user?.name?.[0]?.toUpperCase() || "U"}
                        </div>

                        <div>
                            <strong>{user?.name}</strong>

                            <small>{user?.email}</small>
                        </div>

                    </div>

                    <button
                        className="btn btn-outline-secondary btn-sm w-100 mt-3"
                        onClick={handleLogout}
                    >
                        <FiLogOut /> Sign out
                    </button>

                </div>

            </aside>

            <main className="main-content">
                <Outlet />
            </main>

        </div>
    );
}