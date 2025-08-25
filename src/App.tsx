// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login"; 
import Dashboard from "./pages/Dashboard";
import PendingApproval from "./components/PendingApproval"; // 👈 Thêm import
import ProtectedRoute from "./components/ProtectedRoute";
import AuthStatusHandler from "./components/AuthStatusHandler"; // 👈 Thêm import

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />  
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
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;