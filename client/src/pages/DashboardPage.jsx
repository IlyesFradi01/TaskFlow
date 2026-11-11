import {
    useEffect,
    useState
} from "react";

import { Link } from "react-router-dom";

import { useSelector } from "react-redux";

import api from "../services/api";

export default function DashboardPage() {

    const user = useSelector(
        (state) => state.auth.user
    );

    const [stats, setStats] = useState(null);

    const [error, setError] = useState("");

    useEffect(() => {

       api.get("/api/dashboard/stats")

            .then(({ data }) => {
                setStats(data.stats);
            })

            .catch((error) => {
                setError(
                    error.response?.data?.message ||
                    "Could not load dashboard"
                );
            });

    }, []);

    const cards = stats ? [

        ["Projects", stats.totalProjects, "Total projects"],

        ["Tasks", stats.totalTasks, "All tasks"],

        ["In progress", stats.inProgressTasks, "Tasks underway"],

        ["Completed", stats.completedTasks, "Finished tasks"],

        ["High priority", stats.highPriorityTasks, "Open high-priority tasks"],

        ["Overdue", stats.overdueTasks, "Past due date"]

    ] : [];

    return (

        <div className="container-fluid page-wrap">

            <div className="page-heading">

                <div>

                    <span className="eyebrow">
                        OVERVIEW
                    </span>

                    <h1>
                        Hello, {user?.name?.split(" ")[0] || "there"} 👋
                    </h1>

                    <p>
                        Here's what's happening with your workspace.
                    </p>

                </div>

                <Link
                    className="btn btn-primary"
                    to="/projects"
                >
                    View projects
                </Link>

            </div>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {!stats && !error && (
                <p>Loading dashboard...</p>
            )}

            <div className="row g-3">

                {cards.map(([label, value, description]) => (

                    <div
                        className="col-6 col-xl-4"
                        key={label}
                    >

                        <div className="stat-card">

                            <span>{label}</span>

                            <strong>{value}</strong>

                            <small>{description}</small>

                        </div>

                    </div>

                ))}

            </div>

            {stats && (

                <div className="content-card mt-4">

                    <h5>Task progress</h5>

                    <div
                        className="progress mt-3"
                        style={{ height: 12 }}
                    >

                        <div
                            className="progress-bar bg-success"
                            style={{
                                width: `${
                                    stats.totalTasks
                                        ? stats.completedTasks /
                                          stats.totalTasks * 100
                                        : 0
                                }%`
                            }}
                        />

                    </div>

                    <small className="text-muted mt-2 d-block">
                        {stats.completedTasks} of {stats.totalTasks} tasks completed
                    </small>

                </div>

            )}

        </div>
    );
}