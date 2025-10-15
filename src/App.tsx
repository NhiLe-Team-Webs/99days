import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import PendingApproval from "./components/PendingApproval";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthStatusHandler from "./components/AuthStatusHandler";
import Gratitude from "./pages/Gratitude";
import Homework from "./pages/Homework";
import Progress from "./pages/Progress";
import Workouts from "./pages/Workouts";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/pending-approval" element={<PendingApproval />} />
      <Route path="/auth-status" element={<AuthStatusHandler />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gratitude"
        element={
          <ProtectedRoute>
            <Gratitude />
          </ProtectedRoute>
        }
      />
      <Route
        path="/homework"
        element={
          <ProtectedRoute>
            <Homework />
          </ProtectedRoute>
        }
      />
      <Route
        path="/progress"
        element={
          <ProtectedRoute>
            <Progress />
          </ProtectedRoute>
        }
      />
      <Route
        path="/workouts"
        element={
          <ProtectedRoute>
            <Workouts />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
