import {
    useEffect,
    useState
} from "react";

import {
    Link,
    useParams
} from "react-router-dom";

import api from "../services/api";

export default function PublicProjectDetailPage() {

    const { id } = useParams();

    const [data, setData] = useState(null);

    const [error, setError] = useState("");

    useEffect(() => {

        api.get(`/public/projects/${id}`)

            .then((response) => {
                setData(response.data);
            })

            .catch((error) => {
                setError(
                    error.response?.data?.message ||
                    "Could not load project"
                );
            });

    }, [id]);

    return (

        <div className="container page-wrap">

            <Link to="/public">
                ← Public projects
            </Link>

            {error && (
                <div className="alert alert-danger mt-3">
                    {error}
                </div>
            )}

            {!data ? (

                <p className="mt-3">
                    Loading...
                </p>

            ) : (

                <div className="content-card mt-4">

                    <span className="status-pill">
                        {data.project.status}
                    </span>

                    <h1 className="mt-3">
                        {data.project.title}
                    </h1>

                    <p>
                        {data.project.description}
                    </p>

                    <small className="text-muted">
                        Shared by {data.project.owner?.name}
                    </small>

                    <hr />

                    <h5>Shared tasks</h5>

                    {data.tasks.length === 0 ? (

                        <p className="text-muted">
                            No tasks shared.
                        </p>

                    ) : (

                        data.tasks.map((task) => (

                            <div
                                className="public-task"
                                key={task._id}
                            >

                                <strong>{task.title}</strong>

                                <span>
                                    {task.status} · {task.priority}
                                </span>

                                <p className="text-muted mb-0">
                                    {task.description}
                                </p>

                            </div>

                        ))

                    )}

                </div>

            )}

        </div>
    );
}