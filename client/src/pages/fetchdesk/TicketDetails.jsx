import { useEffect, useState } from "react";
import { fetchConversations, fetchTickets, getContactsCRM } from "../../api/freshdesk";
import PageLoader from "../../components/PageLoader";
import TitleBackNaviagtion from "../../components/GoBack";



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

const LoaderCRM = () => (
  <button type="button" class="inline-flex items-center text-body bg-neutral-primary-soft">
    <svg aria-hidden="true" class="w-4 h-4 text-neutral-tertiary animate-spin fill-brand me-2" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
    </svg>
  </button>
)

export default function TicketDetails() {
  const [data, setData] = useState(null);
  const [tickets, setTickets] = useState(null)
  const [selectedTicket, setSelectedTicket] = useState(null)

  const [contactsCRM, setContactCRM] = useState(null)
  const [crmLoading, setCRMLoading] = useState(false)

  useEffect(() => {
    fetchTickets().then(setTickets);
  }, []);


  const fetchConversationsData = async (id) => {

    const resp = await fetchConversations(id)

    setData(resp?.conversations)
    setSelectedTicket(resp?.ticket)
    const email = resp?.ticket?.requester_email;
    await getCRMContactService(email)

  }

  const getCRMContactService = async (email) => {
    try {

      setCRMLoading(true)
      const res = await getContactsCRM(email)
      setContactCRM(res);
      setCRMLoading(false)
    } catch (err) {
      console.error(err);
    } finally {
      setCRMLoading(false)
    }
  }

  if (!tickets) {
  return (
    <div className="h-screen flex items-center justify-center">
      <PageLoader />
    </div>
  );
}


  return (

    <div className="flex h-screen p-4">
      <div className="w-2/4 max-w-96 border-r border-gray-200 overflow-y-auto p-4 bg-gray-50">
        <TitleBackNaviagtion label="Dashboard" current="Tickets" />
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

      {

        !selectedTicket ?
          <div className="dflex m-auto justify-center items-center">
            <p className="text-gray-400 text-xl">Select a ticket to view conversation</p>
          </div> :
          <div className="w-full max-w-xl flex flex-col p-4">
            {selectedTicket && (
              <>

                <div className="mb-4">
                  <h2 className="text-xl font-bold mb-2 shadow-sm p-4 rounded-lg">{selectedTicket?.subject}</h2>
                  <div className="flex justify-between items-center">
                    <div className="mt-6">
                      <p className="text-gray-700">
                        <p className="font-bold text-black">Message From</p>
                        <div className="mt-2">
                          <p>{selectedTicket.requester_name}</p>
                          <p className="text-blue-400">{selectedTicket.requester_email}</p>
                        </div>

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
                        className={`p-4 rounded-lg max-w-[70%] wrap-break-word shadow
                          ${msg.private
                            ? "bg-amber-50 border border-yellow-300 text-yellow-900"
                            : msg.conversation_type === "received"
                              ? "bg-gray-100 text-gray-900 rounded-tl-none"
                              : "bg-gray-300 text-black rounded-tr-none"
                          }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm font-semibold">
                            {msg.private ? "" : msg.user_name}
                          </p>

                          {msg.private && (
                            <span className="text-xs bg-yellow-300 text-yellow-900 px-2 py-0.5 rounded-full ml-2 font-medium">
                              Note
                            </span>
                          )}
                        </div>

                        <p className="text-sm">{msg.body_text}</p>

                        <p
                          className={`text-xs pt-3 text-right ${msg.is_private
                              ? "text-yellow-800"
                              : msg.conversation_type === "received"
                                ? "text-gray-500"
                                : "text-gray-700"
                            }`}
                        >
                          {new Date(msg.created_at).toLocaleString()}
                        </p>
                      </div>

                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
      }
      <div className="w-1/4 border-l border-gray-200  flex flex-col p-4 space-y-4">
        <div className="rounded-xl">
          <h4 className="text-lg font-bold mb-2">CRM Information {crmLoading && <LoaderCRM />}</h4>
          {contactsCRM && contactsCRM?.total !== 0 ? (
            <div className="space-y-1">
              <p className="text-base text-black">{contactsCRM.name}</p>
              <div className="mt-1">
                <p className="text-blue-400">{contactsCRM.email}</p>
              </div>
              <div className="mt-2 shadow rounded-lg p-4">
                <div className="flex justify-start gap-6 mt-2">
                  <p className="text-sm text-gray-700">Company</p>
                  <p className="ml-4 text-black border-b border-gray-300">{contactsCRM?.company}</p>
                </div>
                <div className="flex justify-start gap-6 mt-2">
                  <p className="text-sm text-gray-700">Contact</p>
                  <p className="ml-4 text-black border-b border-gray-300">{contactsCRM?.phone}</p>
                </div>
                <div className="flex justify-start gap-6 mt-2">
                  <p className="text-sm text-gray-700">Lifecycle Stage</p>
                  <p className="ml-4 text-black border-b border-gray-300">{contactsCRM.lifecycleStage}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No CRM data available</p>
          )}
        </div>

        <div className="border-b border-gray-300"></div>

        <div className="flex-1 overflow-y-auto">
          <h4 className="text-lg font-semibold mb-2 text-gray-800">
            Additional Ticket Info
          </h4>

          {selectedTicket ? (
            <div className="space-y-3">

              <div className="flex flex-col">
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  Created
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {new Date(selectedTicket.created_at).toLocaleString()}
                </span>

              </div>

              <div className="flex flex-col">
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  Due By
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {new Date(selectedTicket.due_by).toLocaleString()}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  Type
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {selectedTicket.type || "—"}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  Source
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {selectedTicket.source || "—"}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  Tags
                </span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedTicket.tags?.length ? (
                    selectedTicket.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm font-medium text-gray-900">—</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  Description
                </span>
                <span className="text-sm font-medium text-gray-900 leading-relaxed">
                  {selectedTicket.description || "—"}
                </span>
              </div>
            </div>
          ) : (
            <div className="">
              <p className="text-gray-400 text-sm">
                Select a ticket to see details
              </p>

            </div>
          )}
        </div>

      </div>

    </div>
  );
}


