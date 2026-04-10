import { logoutUser } from "../../api/auth";
import { connectHubSpot } from "../../api/freshdesk";
import PageLoader from "../../components/PageLoader";
import { useAuth } from "../../customHooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, externalConnections, loading } = useAuth();
  const navigate = useNavigate()
  const freshdeskConnected = externalConnections?.freshdesk?.apiKey;
  const hubspotConnected = externalConnections?.hubspot?.accessToken;



  async function handleLogout() {
    try {
      1
      await logoutUser()
      navigate("/login")
    } catch (error) {
      console.error("Error while Logout", error.message)
    }
  }


  async function handleConnectHubspot(e) {
    e.preventDefault()
    try {
      const res = await connectHubSpot()
      window.location.href = res.authUrl;
    } catch (error) {
      console.error("Error while connect hubspot", error.message)
    }
  }




  return (
    <div className="min-h-screen bg-gray-100 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl p-8 mt-8">
        <header className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold">Welcome, {user?.name}</h3>
          <button onClick={handleLogout} className="border bg-red-100  border-red-300 text-red-600 hover:bg-red-200 px-4 py-1 rounded cursor-pointer">
            Logout
          </button>
        </header>

        {
          loading ? <PageLoader /> : <>
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
                      onClick={() => {
                        navigate('/connect/freshdesk')
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-center"
                    >
                      Connect FreshDesk
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
                      href="http://localhost:8000/api/connect/hubspot"
                      onClick={handleConnectHubspot}
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
                <a
                  disabled={!freshdeskConnected}
                  onClick={() => {
                    navigate('/freshdesk/logs')
                  }}
                  className={`bg-gray-700 ml-4 cursor-pointer hover:bg-gray-800 text-white px-4 py-2 rounded ${!freshdeskConnected ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                  Show Webhook Logs
                </a>
              </div>
              <div className="flex items-center justify-center">
                <button
                  disabled={!hubspotConnected}
                  className={`bg-purple-500 cursor-pointer hover:bg-purple-600 text-white min-w-sm px-4 py-2 rounded ${!hubspotConnected ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  onClick={() => {
                    navigate('/view/crm')
                  }}
                >
                  View CRM Info
                </button>
              </div>
            </section>
          </>
        }





      </div>
    </div>
  );
}
