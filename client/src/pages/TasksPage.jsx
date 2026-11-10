import {
    useEffect,
    useState
} from "react";

import {
    useDispatch,
    useSelector
} from "react-redux";

import {
    fetchProjects
} from "../features/projects/projectsSlice";

import {
    createTask,
    deleteTask,
    fetchTasks,
    updateTask
} from "../features/tasks/tasksSlice";

import TaskForm from "../components/TaskForm";

export default function TasksPage() {

    const dispatch = useDispatch();

    const projects = useSelector(
        (state) => state.projects.items
    );

    const {
        items,
        loading,
        error
    } = useSelector((state) => state.tasks);

    const [filter, setFilter] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [editing, setEditing] = useState(null);


    useEffect(() => {
        dispatch(fetchProjects());
    }, [dispatch]);


    useEffect(() => {
        dispatch(fetchTasks(filter || undefined));
    }, [dispatch, filter]);


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

            : await dispatch(createTask(values));

        if (result.meta.requestStatus === "fulfilled") {

            setShowForm(false);

            setEditing(null);

            dispatch(fetchTasks(filter || undefined));
        }
    };


    const handleDelete = (id) => {

        if (window.confirm("Delete this task?")) {
            dispatch(deleteTask(id));
        }
    };


    const handleStatusChange = (task, status) => {

        dispatch(
            updateTask({
                id: task._id,
                changes: { status }
            })
        );
    };


    return (

        <div className="container-fluid page-wrap">

            <div className="page-heading">

                <div>

                    <span className="eyebrow">
                        WORKSPACE
                    </span>

                    <h1>Tasks</h1>

                    <p>
                        Track priorities, progress, and deadlines.
                    </p>

                </div>

                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setEditing(null);
                        setShowForm(true);
                    }}
                >
                    + New task
                </button>

            </div>


            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}


            {showForm && (

                <div className="content-card mb-4">

                    <h5>
                        {editing ? "Edit task" : "Create a task"}
                    </h5>

                    <TaskForm
                        projects={projects}
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

                <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">

                    <h5 className="mb-0">
                        All tasks
                    </h5>

                    <select
                        className="form-select"
                        style={{ maxWidth: 240 }}
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >

                        <option value="">
                            All projects
                        </option>

                        {projects.map((project) => (

                            <option
                                key={project._id}
                                value={project._id}
                            >
                                {project.title}
                            </option>

                        ))}

                    </select>

                </div>


                {loading ? (

                    <p className="mt-3">
                        Loading tasks...
                    </p>

                ) : items.length === 0 ? (

                    <div className="empty-state">
                        No tasks found.
                    </div>

                ) : (

                    <div className="table-responsive mt-3">

                        <table className="table align-middle">

                            <thead>
                                <tr>
                                    <th>Task</th>
                                    <th>Project</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Due date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {items.map((task) => (

                                    <tr key={task._id}>

                                        <td>
                                            <strong>{task.title}</strong>

                                            <div className="small text-muted">
                                                {task.description}
                                            </div>
                                        </td>

                                        <td>
                                            {task.project?.title}
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
                                                        setEditing({
                                                            ...task,
                                                            project: task.project?._id
                                                        });

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

        </div>
    );
}