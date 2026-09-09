import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import TrainerDashboard from './pages/TrainerDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import CreateTrainer from './pages/admin/CreateTrainer'
import CreateCoordinator from './pages/admin/CreateCoordinator'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";


function App() {
  return (
    <>
      <BrowserRouter>

        <Routes>

          <Route
            path="/"
            element={<Navigate to="/login" replace />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/trainer/dashboard"
            element={<TrainerDashboard />}
          />

          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />
          <Route
            path="/admin/create-trainer"
            element={<CreateTrainer />}
          />
          <Route
            path="/admin/create-coordinator"
            element={<CreateCoordinator />}
          />

        </Routes>

      </BrowserRouter>
    </>
  )
}

export default App