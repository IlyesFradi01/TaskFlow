import { useEffect } from "react";

import {
    BrowserRouter,
    Navigate,
    Route,
    Routes
} from "react-router-dom";

import {
    useDispatch,
    useSelector
} from "react-redux";

import { loadMe } from "./features/authSlice";

import ProtectedRoute from "./components/ProtectedRoute";

import Layout from "./components/Layout";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import TasksPage from "./pages/TasksPage";
import PublicProjectsPage from "./pages/PublicProjectsPage";
import PublicProjectDetailPage from "./pages/PublicProjectDetailPage";


function AppRoutes() {

    const dispatch = useDispatch();

    const {
        token,
        initialized
    } = useSelector((state) => state.auth);


    // Validate the saved token when the application starts
    useEffect(() => {

        if (token) {
            dispatch(loadMe());
        }

    }, [dispatch]);


    // Wait until the saved session has been checked
    if (!initialized) {

        return (
            <div className="page-center">
                Loading TaskFlow...
            </div>
        );
    }


    return (

        <Routes>

            {/* Authentication */}

            <Route
                path="/login"
                element={<LoginPage />}
            />

            <Route
                path="/register"
                element={<RegisterPage />}
            />


            {/* Public pages */}

            <Route
                path="/public"
                element={<PublicProjectsPage />}
            />

            <Route
                path="/public/:id"
                element={<PublicProjectDetailPage />}
            />


            {/* Protected pages */}

            <Route element={<ProtectedRoute />}>

                <Route element={<Layout />}>

                    <Route
                        path="/dashboard"
                        element={<DashboardPage />}
                    />

                    <Route
                        path="/projects"
                        element={<ProjectsPage />}
                    />

                    <Route
                        path="/projects/:id"
                        element={<ProjectDetailPage />}
                    />

                    <Route
                        path="/tasks"
                        element={<TasksPage />}
                    />

                </Route>

            </Route>


            {/* Default route */}

            <Route
                path="*"
                element={
                    <Navigate
                        to={token ? "/dashboard" : "/login"}
                        replace
                    />
                }
            />

        </Routes>
    );
}


export default function App() {

    return (

        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>

    );
}