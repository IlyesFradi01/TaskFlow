import { useState } from "react";

import {
    Link,
    Navigate,
    useNavigate
} from "react-router-dom";

import {
    useDispatch,
    useSelector
} from "react-redux";

import {
    register
} from "../features/authSlice";

export default function RegisterPage() {

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const {
        token,
        loading,
        error
    } = useSelector((state) => state.auth);

    if (token) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleSubmit = async (e) => {

        e.preventDefault();

        const result = await dispatch(register(form));

        if (register.fulfilled.match(result)) {
            navigate("/dashboard");
        }
    };

    return (

        <div className="auth-page">

            <div className="auth-card">

                <div className="brand justify-content-center mb-4">
                    ◈ TaskFlow
                </div>

                <h1>Create your account</h1>

                <p className="text-muted">
                    Start organizing your projects.
                </p>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="form-stack"
                >

                    <label className="form-label">
                        Full name
                    </label>

                    <input
                        className="form-control"
                        required
                        value={form.name}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                name: e.target.value
                            })
                        }
                    />

                    <label className="form-label">
                        Email
                    </label>

                    <input
                        className="form-control"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                email: e.target.value
                            })
                        }
                    />

                    <label className="form-label">
                        Password (minimum 8 characters)
                    </label>

                    <input
                        className="form-control"
                        type="password"
                        minLength="8"
                        required
                        value={form.password}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                password: e.target.value
                            })
                        }
                    />

                    <button
                        className="btn btn-primary w-100 mt-2"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating account..."
                            : "Create account"}
                    </button>

                </form>

                <p className="text-center mt-4 mb-0">
                    Already registered?{" "}
                    <Link to="/login">
                        Sign in
                    </Link>
                </p>

            </div>

        </div>
    );
}