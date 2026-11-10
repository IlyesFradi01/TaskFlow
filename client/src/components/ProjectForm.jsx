import {
    useEffect,
    useState
} from "react";

const emptyForm = {
    title: "",
    description: "",
    category: "General",
    status: "Active",
    isPublic: false
};

export default function ProjectForm({
    initialValue,
    onSubmit,
    onCancel
}) {

    const [form, setForm] = useState(
        initialValue || emptyForm
    );

    useEffect(() => {
        setForm(initialValue || emptyForm);
    }, [initialValue]);

    const handleChange = (e) => {

        const {
            name,
            value,
            type,
            checked
        } = e.target;

        setForm((current) => ({
            ...current,

            [name]: type === "checkbox"
                ? checked
                : value
        }));
    };

    const handleSubmit = (e) => {

        e.preventDefault();

        onSubmit(form);

        if (!initialValue) {
            setForm(emptyForm);
        }
    };

    return (

        <form
            onSubmit={handleSubmit}
            className="form-stack"
        >

            <label className="form-label">
                Project title
            </label>

            <input
                className="form-control"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                maxLength="120"
            />

            <label className="form-label">
                Description
            </label>

            <textarea
                className="form-control"
                name="description"
                rows="3"
                value={form.description}
                onChange={handleChange}
            />

            <label className="form-label">
                Category
            </label>

            <input
                className="form-control"
                name="category"
                value={form.category}
                onChange={handleChange}
            />

            <label className="form-label">
                Status
            </label>

            <select
                className="form-select"
                name="status"
                value={form.status}
                onChange={handleChange}
            >
                <option>Active</option>
                <option>Completed</option>
            </select>

            <div className="form-check mt-2">

                <input
                    className="form-check-input"
                    type="checkbox"
                    name="isPublic"
                    id="isPublic"
                    checked={!!form.isPublic}
                    onChange={handleChange}
                />

                <label
                    className="form-check-label"
                    htmlFor="isPublic"
                >
                    Make this project publicly readable
                </label>

            </div>

            <div className="d-flex gap-2 mt-3">

                <button
                    className="btn btn-primary"
                    type="submit"
                >
                    {initialValue
                        ? "Save changes"
                        : "Create project"}
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