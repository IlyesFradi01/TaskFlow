import {
    useEffect,
    useState
} from "react";

import { Link } from "react-router-dom";

import api from "../services/api";

export default function PublicProjectsPage() {

    const [projects, setProjects] = useState([]);

    const [error, setError] = useState("");

    useEffect(() => {

        api.get("/api/public/projects")

            .then(({ data }) => {
                setProjects(data.projects);
            })

            .catch((error) => {
                setError(
                    error.response?.data?.message ||
                    "Could not load public projects"
                );
            });

    }, []);

    return (

        <div className="container-fluid page-wrap">

            <div className="page-heading">

                <div>

                    <span className="eyebrow">
                        COMMUNITY
                    </span>

                    <h1>Public projects</h1>

                    <p>
                        Read projects that their owners have chosen to share.
                    </p>

                </div>

            </div>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {projects.length === 0 ? (

                <div className="empty-state">
                    No public projects are available yet.
                </div>

            ) : (

                <div className="row g-3">

                    {projects.map((project) => (

                        <div
                            className="col-md-6 col-xl-4"
                            key={project._id}
                        >

                            <div className="project-card">

                                <span className="status-pill">
                                    {project.status}
                                </span>

                                <h5 className="mt-3">
                                    {project.title}
                                </h5>

                                <p className="text-muted">
                                    {project.description}
                                </p>

                                <small className="text-muted">
                                    By {project.owner?.name || "TaskFlow user"}
                                </small>

                                <div className="mt-3">

                                    <Link
                                        className="btn btn-sm btn-outline-primary"
                                        to={`/public/${project._id}`}
                                    >
                                        Read project
                                    </Link>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}