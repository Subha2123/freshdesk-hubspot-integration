import { logoutUser } from "../../api/auth";
import { useAuth } from "../../customHooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user , externalConnections } = useAuth();
  const navigate = useNavigate()
  const freshdeskConnected = externalConnections?.freshdesk?.apiKey;
  const hubspotConnected = externalConnections?.hubspot?.accessToken;

 async function handleLogout(){
  try {
    await logoutUser()
    navigate("/login")
  } catch (error) {
    console.error("Error while Logout",error.message)
  }
 }


  return (
    <div className="min-h-screen bg-gray-100 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl p-8">
        <header className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold">Welcome, {user?.name}</h3>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded cursor-pointer">
            Logout
          </button>
        </header>

        <section className="grid md:grid-cols-2 gap-6 mb-8">

          <div class="max-w-sm mx-auto bg-white rounded-2xl shadow-lg overflow-hidden min-w-md">
            <div class="h-32 flex items-center justify-center">
              <img src="/Freshdesk.svg" alt="Logo" class="w-20 h-20 object-contain" />
            </div>

            <div class="p-6 flex flex-col items-center space-y-4 gap-6">
              <h2 className="text-xl font-semibold mb-4">Freshdesk</h2>
              <p className="mb-4">
                Status:{" "}
                {freshdeskConnected ? (
                  <span className="text-green-600 font-medium">Connected</span>
                ) : (
                  <span className="text-red-600 font-medium">Not Connected</span>
                )}
              </p>
              {!freshdeskConnected && (
                <button
                  onClick={()=>{
                    navigate('/connect/freshdesk')
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-center"
                >
                </button>
              )}
            </div>
          </div>


          <div class="max-w-sm mx-auto bg-white rounded-2xl shadow-lg overflow-hidden  min-w-md">
            <div class="h-32 flex items-center justify-center">
              <img src="/HubSpot.svg" alt="Logo" class="w-20 h-20 object-contain" />
            </div>

            <div class="p-6 flex flex-col items-center space-y-4 gap-6">
              <h2 className="text-xl font-semibold mb-4">HubSpot</h2>
              <p className="mb-4">
                Status:{" "}
                {hubspotConnected ? (
                  <span className="text-green-600 font-medium">Connected</span>
                ) : (
                  <span className="text-red-600 font-medium">Not Connected</span>
                )}
              </p>
              {!hubspotConnected && (
                <a
                  href="/connect/freshdesk"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-center"
                >
                  Connect Hubspot
                </a>
              )}
            </div>
          </div>

        </section>

        <section className="grid md:grid-cols-2 gap-10 mb-8">
         
          <div className="flex items-center justify-center">
            <button
              disabled={!freshdeskConnected}
              onClick={() => {
                navigate('/tickets')
              }}
              className={`bg-green-500 cursor-pointer hover:bg-green-600  text-white px-4 py-2 rounded ${!freshdeskConnected ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              View Tickets
            </button>
            <button
              disabled={!freshdeskConnected}
              onClick={() => {
                navigate('/freshdesk/logs')
              }}
              className={`bg-gray-700 ml-4 cursor-pointer hover:bg-gray-800 text-white px-4 py-2 rounded ${!freshdeskConnected ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
             Show Webhook Logs
            </button>
          </div>
           <div className="flex items-center justify-center">
            <button
              disabled={!hubspotConnected}
              className={`bg-purple-500 cursor-pointer hover:bg-purple-600 text-white min-w-sm px-4 py-2 rounded ${!hubspotConnected ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              View CRM Info
            </button>
          </div>
        </section>


      </div>
    </div>
  );
}
