import {
    useEffect,
    useState
} from "react";

const emptyForm = {
    title: "",
    description: "",
    status: "Todo",
    priority: "Medium",
    dueDate: "",
    project: ""
};

export default function TaskForm({
    projects,
    initialValue,
    defaultProjectId,
    onSubmit,
    onCancel
}) {

    const [form, setForm] = useState({
        ...emptyForm,
        project: defaultProjectId || ""
    });

    useEffect(() => {

        setForm({
            ...emptyForm,

            project: defaultProjectId || "",

            ...(initialValue || {}),

            project:
                initialValue?.project?._id ||
                initialValue?.project ||
                defaultProjectId ||
                "",

            dueDate: initialValue?.dueDate
                ? new Date(initialValue.dueDate)
                    .toISOString()
                    .slice(0, 10)
                : ""
        });

    }, [initialValue, defaultProjectId]);

    const handleChange = (e) => {

        setForm((current) => ({
            ...current,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = (e) => {

        e.preventDefault();

        onSubmit({
            ...form,
            dueDate: form.dueDate || null
        });

        if (!initialValue) {
            setForm({
                ...emptyForm,
                project: defaultProjectId || ""
            });
        }
    };

    return (

        <form
            onSubmit={handleSubmit}
            className="form-stack"
        >

            <label className="form-label">
                Task title
            </label>

            <input
                className="form-control"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
            />

            <label className="form-label">
                Description
            </label>

            <textarea
                className="form-control"
                rows="2"
                name="description"
                value={form.description}
                onChange={handleChange}
            />

            <label className="form-label">
                Project
            </label>

            <select
                className="form-select"
                name="project"
                value={form.project}
                onChange={handleChange}
                required
            >
                <option value="">
                    Choose a project
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

            <div className="row g-2">

                <div className="col-sm-4">

                    <label className="form-label">
                        Status
                    </label>

                    <select
                        className="form-select"
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                    >
                        <option>Todo</option>
                        <option>In Progress</option>
                        <option>Done</option>
                    </select>

                </div>

                <div className="col-sm-4">

                    <label className="form-label">
                        Priority
                    </label>

                    <select
                        className="form-select"
                        name="priority"
                        value={form.priority}
                        onChange={handleChange}
                    >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                    </select>

                </div>

                <div className="col-sm-4">

                    <label className="form-label">
                        Due date
                    </label>

                    <input
                        className="form-control"
                        type="date"
                        name="dueDate"
                        value={form.dueDate}
                        onChange={handleChange}
                    />

                </div>

            </div>

            <div className="d-flex gap-2 mt-3">

                <button
                    className="btn btn-primary"
                    type="submit"
                >
                    {initialValue
                        ? "Save changes"
                        : "Create task"}
                </button>

                {onCancel && (
                    <button
                        className="btn btn-light"
                        type="button"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                )}

            </div>

        </form>
    );
}