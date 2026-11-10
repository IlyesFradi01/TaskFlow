import { useState } from "react";

import {Link,Navigate,useNavigate} from "react-router-dom";

import {
    useDispatch,
    useSelector
} from "react-redux";

import { login } from "../features/authSlice";

export default function LoginPage() {

    const [form, setForm] = useState({
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

        const result = await dispatch(login(form));

        if (login.fulfilled.match(result)) {
            navigate("/dashboard");
        }
    };

    return (

        <div className="auth-page">

            <div className="auth-card">

                <div className="brand justify-content-center mb-4">
                    ◈ TaskFlow
                </div>

                <h1>Welcome back</h1>

                <p className="text-muted">
                    Sign in to manage your work.
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
                        Password
                    </label>

                    <input
                        className="form-control"
                        type="password"
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
                        {loading ? "Signing in..." : "Sign in"}
                    </button>

                </form>

                <p className="text-center mt-4 mb-0">
                    No account?{" "}
                    <Link to="/register">
                        Create one
                    </Link>
                </p>

            </div>

        </div>
    );
}