import { BrowserRouter, Routes, Route } from "react-router-dom";
import TicketsPage from "./pages/Tickets/TicketList";
// import TicketDetails from "./pages/TicketDetails";

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-100">
        
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md p-4">
          <h1 className="text-xl font-bold mb-6">Support Portal</h1>
          <ul className="space-y-3">
            <li className="text-blue-600 font-semibold">Tickets</li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<TicketsPage />} />
            <Route path="/tickets/:id" element={<TicketDetails />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
