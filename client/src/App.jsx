import { useSelector, useDispatch } from 'react-redux';
import { Link, Route, Routes } from 'react-router-dom';
import { decrement, increment, reset } from './features/counter/counterSlice';

function HomePage() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <main className="container py-5">
      <section className="card shadow-sm border-0 rounded-4 p-4">
        <p className="text-uppercase text-primary fw-semibold mb-2">React + Redux</p>
        <h1 className="display-5 fw-bold mb-3">MERN app starter</h1>
        <p className="lead text-secondary mb-4">
          This frontend is ready for your dashboard, authentication flow, and API integrations.
        </p>

        <div className="d-flex gap-3 align-items-center mb-4">
          <button className="btn btn-outline-danger" onClick={() => dispatch(decrement())}>-</button>
          <span className="fs-2 fw-bold">{count}</span>
          <button className="btn btn-outline-success" onClick={() => dispatch(increment())}>+</button>
          <button className="btn btn-outline-secondary" onClick={() => dispatch(reset())}>Reset</button>
        </div>

        <nav className="d-flex gap-3">
          <Link to="/" className="btn btn-primary">Home</Link>
          <Link to="/about" className="btn btn-outline-primary">About</Link>
        </nav>
      </section>
    </main>
  );
}

function AboutPage() {
  return (
    <main className="container py-5">
      <div className="card shadow-sm border-0 rounded-4 p-4">
        <h2 className="mb-3">About this project</h2>
        <p className="mb-0 text-secondary">
          This app includes React, Redux Toolkit, React Router, Bootstrap, Axios, and icon support,
          so you can immediately start building your MERN stack features.
        </p>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  );
}
