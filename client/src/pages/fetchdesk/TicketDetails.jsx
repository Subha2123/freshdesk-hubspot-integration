import { useEffect, useState } from "react";
import { fetchConversations, fetchTickets } from "../../api/freshdesk";



const FreshdeskPrority = {
  1: { text: "Low", color: "border border-green-500 text-green-500" },
  2: { text: "Medium", color: "border border-yellow-500 text-yellow-500" },
  3: { text: "High", color: "border border-red-300 text-red-300" },
  4: { text: "Urgent", color: "border border-orange-400 text-orange-400" }
}
const FreshdeskStatus = {
  2: { text: "Open", color: "bg-blue-500" },
  3: { text: "Pending", color: "bg-yellow-400" },
  4: { text: "Resolved", color: "bg-green-500" },
  5: { text: "Closed", color: "bg-gray-400" },
  6: { text: "Waiting on Customer", color: "bg-yellow-500" },
  7: { text: "Waiting on Third Party", color: "bg-orange-500" }
}

export default function TicketDetails() {
  const [data, setData] = useState(null);
  const [tickets, setTickets] = useState(null)
  const [selectedTicket, setSelectedTicket] = useState(null)

  useEffect(() => {
    fetchTickets().then(setTickets);
  }, []);


  const fetchConversationsData = async (id) => {

    await fetchConversations(id).then((resp) => {
      setData(resp?.conversations)
      setSelectedTicket(resp?.ticket)
    }).catch(err => {
      console.error("errr", err)
      setData(null)
    })
  }

  if (!tickets) return <p>Loading...</p>;

  return (
    //   <div className="bg-white p-6 rounded-xl shadow">
    //     <CRMPanel crm={data.hubspot} />
    //   </div>


    <div className="flex h-screen p-4">
      <div className="w-2/4 border-r border-gray-200 overflow-y-auto p-4 bg-gray-50">
        <h2 className="text-lg font-bold mb-4">Tickets</h2>
        <div className="space-y-2">
          {tickets && tickets?.map((ticket) => (
            <>
              <div
                key={ticket.id}
                onClick={() => fetchConversationsData(ticket.id)}
                className={`p-3 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors ${selectedTicket?.id === ticket.id ? "bg-gray-300" : ""
                  }`}
              >
                <p className="font-medium text-black">{ticket.subject}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  <span
                    className={`text-xs px-2 py-1 rounded-lg ${FreshdeskPrority[ticket.priority].color}`}
                  >
                    {FreshdeskPrority[ticket.priority].text}
                  </span>
                  <span
                    className={`text-white text-xs px-2 py-1 rounded-lg ${FreshdeskStatus[ticket.status].color}`}
                  >
                    {FreshdeskStatus[ticket.status].text}
                  </span>
                </div>
              </div>
              <div className="border-b border-gray-300"></div>
            </>
          ))}
        </div>
      </div>

      <div className="w-full flex flex-col p-4">
        {selectedTicket ? (
          <>
            {/* Ticket Details */}
            <div className="mb-4">
              <h2 className="text-xl font-bold mb-2">{selectedTicket?.subject}</h2>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-700">
                    <p className="font-bold text-black">Message From</p>
                    <div className="mt-2">
                      <p>{selectedTicket.requester_name}</p>
                      <p className="text-blue-400">{selectedTicket.requester_email}</p>
                    </div>

                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">
                    <strong>Created:</strong> {new Date(selectedTicket.created_at).toLocaleString()}
                  </p>
                  <p className="text-gray-600 text-sm">
                    <strong>Due By:</strong> {new Date(selectedTicket.due_by).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-1">
                <span
                  className={`text-white text-xs px-2 py-1 rounded-full ${FreshdeskPrority[selectedTicket.priority]?.color}`}
                >
                  {FreshdeskPrority[selectedTicket.priority]?.text}
                </span>
                <span
                  className={`text-white text-xs px-2 py-1 rounded-full ${FreshdeskStatus[selectedTicket?.status]?.color}`}
                >
                  {FreshdeskStatus[selectedTicket.status]?.text}
                </span>
              </div>

            </div>

            {/* Conversation */}
            <div className="flex-1 overflow-y-auto space-y-4">
              {data && data?.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.conversation_type === "received" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`p-4 rounded-lg max-w-[70%] break-words shadow
                      ${msg.conversation_type === "received"
                        ? "bg-gray-100 text-gray-900 rounded-tl-none"
                        : "bg-gray-300 text-black rounded-tr-none"}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-semibold">{msg.user_name}</p>
                      {msg.is_private && (
                        <span className="text-xs text-red-500 ml-2 font-medium">
                          Private
                        </span>
                      )}
                    </div>
                    <p className="text-sm">{msg.body_text}</p>
                    <p
                      className={`text-xs pt-3 ${msg.conversation_type === "received" ? "text-gray-500" : "text-gray-700"
                        } text-right`}
                    >
                      {new Date(msg.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) :
          <div className="dflex m-auto justify-center items-center">
            <p className="text-gray-700 text-xl">Select a ticket to view conversation</p>
          </div>
        }
      </div>
    </div>
  );
}