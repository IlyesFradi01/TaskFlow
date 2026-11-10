import {
    useEffect,
    useState
} from "react";

import {
    useDispatch,
    useSelector
} from "react-redux";

import {
    createProject,
    deleteProject,
    fetchProjects,
    updateProject
} from "../features/projects/projectsSlice";

import ProjectForm from "../components/ProjectForm";

import { Link } from "react-router-dom";

export default function ProjectsPage() {

    const dispatch = useDispatch();

    const {
        items,
        loading,
        error
    } = useSelector((state) => state.projects);

    const [editing, setEditing] = useState(null);

    const [showForm, setShowForm] = useState(false);


    useEffect(() => {
        dispatch(fetchProjects());
    }, [dispatch]);


    const handleSubmit = async (values) => {

        const result = editing

            ? await dispatch(updateProject({
                id: editing._id,
                changes: values
            }))

            : await dispatch(createProject(values));

        if (result.meta.requestStatus === "fulfilled") {
            setShowForm(false);
            setEditing(null);
        }
    };


    const handleEdit = (project) => {
        setEditing(project);
        setShowForm(true);
    };


    const handleDelete = (id) => {

        if (window.confirm(
            "Delete this project and all its tasks?"
        )) {
            dispatch(deleteProject(id));
        }
    };


    return (

        <div className="container-fluid page-wrap">

            <div className="page-heading">

                <div>

                    <span className="eyebrow">
                        WORKSPACE
                    </span>

                    <h1>Projects</h1>

                    <p>
                        Organize your work into focused projects.
                    </p>

                </div>

                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setEditing(null);
                        setShowForm(true);
                    }}
                >
                    + New project
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
                        {editing ? "Edit project" : "Create a project"}
                    </h5>

                    <ProjectForm
                        initialValue={editing}
                        onSubmit={handleSubmit}
                        onCancel={() => {
                            setShowForm(false);
                            setEditing(null);
                        }}
                    />

                </div>

            )}

            {loading ? (

                <p>Loading projects...</p>

            ) : items.length === 0 ? (

                <div className="empty-state">
                    No projects yet. Create your first project to get started.
                </div>

            ) : (

                <div className="row g-3">

                    {items.map((project) => (

                        <div
                            className="col-md-6 col-xl-4"
                            key={project._id}
                        >

                            <div className="project-card">

                                <div className="d-flex justify-content-between align-items-start">

                                    <span className={`status-pill ${
                                        project.status === "Completed"
                                            ? "done"
                                            : ""
                                    }`}>
                                        {project.status}
                                    </span>

                                    <span className="text-muted small">
                                        {project.isPublic ? "Public" : "Private"}
                                    </span>

                                </div>

                                <h5 className="mt-3">
                                    {project.title}
                                </h5>

                                <p className="text-muted project-description">
                                    {project.description ||
                                        "No description provided."}
                                </p>

                                <div className="small text-muted mb-3">
                                    {project.category}
                                </div>

                                <div className="d-flex gap-2 flex-wrap">

                                    <Link
                                        className="btn btn-sm btn-outline-primary"
                                        to={`/projects/${project._id}`}
                                    >
                                        Open
                                    </Link>

                                    <button
                                        className="btn btn-sm btn-light"
                                        onClick={() => handleEdit(project)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDelete(project._id)}
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}