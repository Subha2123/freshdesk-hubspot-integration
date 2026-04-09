import { BrowserRouter, Routes, Route } from "react-router-dom";
import TicketDetails from "./pages/fetchdesk/TicketDetails";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Signin";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Dashboard from "./pages/dashboard/Dashboard";
import { AuthProvider } from "./provider/AuthContext";
import PrivateRoute from "./provider/PrivateRoute";
import ConnectFreshdesk from "./pages/fetchdesk/connectFreshDesk";
import WebhookLogs from "./pages/webhook/WebHookLogs";

function App() {

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/tickets"
            element={
              <PrivateRoute>
                <TicketDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/tickets/:id"
            element={
              <PrivateRoute>
                <TicketDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/connect/freshdesk"
            element={
              <PrivateRoute>
                <ConnectFreshdesk />
              </PrivateRoute>
            }
          />
          <Route
            path="/freshdesk/logs"
            element={
                <WebhookLogs />
            }
          />
          
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
