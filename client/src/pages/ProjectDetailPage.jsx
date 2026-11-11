import {
    useEffect,
    useState
} from "react";

import {
    Link,
    useParams
} from "react-router-dom";

import {
    useDispatch,
    useSelector
} from "react-redux";

import api from "../services/api";

import {
    createTask,
    deleteTask,
    updateTask
} from "../features/tasks/tasksSlice";

import TaskForm from "../components/TaskForm";

export default function ProjectDetailPage() {

    const { id } = useParams();

    const dispatch = useDispatch();

    const [project, setProject] = useState(null);

    const [tasks, setTasks] = useState([]);

    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [editing, setEditing] = useState(null);


    useEffect(() => {

        api.get(`/api/projects/${id}`)

            .then(({ data }) => {
                setProject(data.project);
                setTasks(data.tasks);
            })

            .catch((error) => {
                setError(
                    error.response?.data?.message ||
                    "Could not load project"
                );
            });

    }, [id]);


    const handleSubmit = async (values) => {

        const result = editing

            ? await dispatch(updateTask({
                id: editing._id,
                changes: {
                    title: values.title,
                    description: values.description,
                    status: values.status,
                    priority: values.priority,
                    dueDate: values.dueDate
                }
            }))

            : await dispatch(createTask({
                ...values,
                project: id
            }));

        if (result.meta.requestStatus === "fulfilled") {

            const refreshed = await api.get(`/api/projects/${id}`);

            setTasks(refreshed.data.tasks);

            setShowForm(false);

            setEditing(null);
        }
    };


    const handleStatusChange = async (task, status) => {

        const result = await dispatch(
            updateTask({
                id: task._id,
                changes: { status }
            })
        );

        if (result.meta.requestStatus === "fulfilled") {

            setTasks((oldTasks) =>
                oldTasks.map((item) =>
                    item._id === task._id
                        ? result.payload
                        : item
                )
            );
        }
    };


    const handleDelete = async (taskId) => {

        if (!window.confirm("Delete this task?")) {
            return;
        }

        const result = await dispatch(deleteTask(taskId));

        if (result.meta.requestStatus === "fulfilled") {

            setTasks((oldTasks) =>
                oldTasks.filter((task) => task._id !== taskId)
            );
        }
    };


    return (

        <div className="container-fluid page-wrap">

            <div className="mb-3">
                <Link
                    to="/projects"
                    className="text-decoration-none"
                >
                    ← Back to projects
                </Link>
            </div>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {!project ? (

                <p>Loading project...</p>

            ) : (

                <>

                    <div className="page-heading">

                        <div>

                            <span className="eyebrow">
                                {project.category}
                            </span>

                            <h1>{project.title}</h1>

                            <p>{project.description}</p>

                        </div>

                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                setEditing(null);
                                setShowForm(true);
                            }}
                        >
                            + Add task
                        </button>

                    </div>


                    {showForm && (

                        <div className="content-card mb-4">

                            <h5>
                                {editing ? "Edit task" : "New task"}
                            </h5>

                            <TaskForm
                                projects={[project]}
                                defaultProjectId={id}
                                initialValue={editing}
                                onSubmit={handleSubmit}
                                onCancel={() => {
                                    setShowForm(false);
                                    setEditing(null);
                                }}
                            />

                        </div>

                    )}


                    <div className="content-card">

                        <h5>
                            Project tasks ({tasks.length})
                        </h5>

                        {tasks.length === 0 ? (

                            <p className="text-muted mt-3">
                                No tasks in this project yet.
                            </p>

                        ) : (

                            <div className="table-responsive mt-3">

                                <table className="table align-middle">

                                    <thead>
                                        <tr>
                                            <th>Task</th>
                                            <th>Priority</th>
                                            <th>Status</th>
                                            <th>Due date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {tasks.map((task) => (

                                            <tr key={task._id}>

                                                <td>
                                                    <strong>{task.title}</strong>

                                                    <div className="small text-muted">
                                                        {task.description}
                                                    </div>
                                                </td>

                                                <td>{task.priority}</td>

                                                <td>

                                                    <select
                                                        className="form-select form-select-sm"
                                                        value={task.status}
                                                        onChange={(e) =>
                                                            handleStatusChange(
                                                                task,
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        <option>Todo</option>
                                                        <option>In Progress</option>
                                                        <option>Done</option>
                                                    </select>

                                                </td>

                                                <td>
                                                    {task.dueDate
                                                        ? new Date(
                                                            task.dueDate
                                                        ).toLocaleDateString()
                                                        : "—"}
                                                </td>

                                                <td>

                                                    <div className="d-flex gap-1">

                                                        <button
                                                            className="btn btn-sm btn-light"
                                                            onClick={() => {
                                                                setEditing(task);
                                                                setShowForm(true);
                                                            }}
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() =>
                                                                handleDelete(task._id)
                                                            }
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </>

            )}

        </div>
    );
}