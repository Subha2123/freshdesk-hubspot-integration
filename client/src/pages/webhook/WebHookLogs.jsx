import React from "react";
import { useState, useEffect } from "react";
import { fetchWebHookLogs } from "../../api/freshdesk";
import TitleBackNaviagtion from "../../components/GoBack";


export default function WebhookLogs() {

    const [webhookLogs, setWebHookLogs] = useState([])

    async function fetchLogs() {
        await fetchWebHookLogs().then(setWebHookLogs)
    }

    useEffect(() => {
        fetchLogs()
    }, [])

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <TitleBackNaviagtion label="Dashboard" current="Webhook Logs" />
            <div className="overflow-x-auto shadow-lg rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 overflow-y-auto">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Ticket ID</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Event Type</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Priority</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Subject</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Created At</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {webhookLogs.map((log) => (
                            <tr key={log._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.ticket_id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.event_type}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {log.ticket_status || "-"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {log.ticket_priority || "-"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.subject || "-"}</td>
                                <td
                                    className="px-6 py-4 text-sm text-gray-900"
                                    dangerouslySetInnerHTML={{ __html: log.description || "-" }}
                                />
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(log.createdAt).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
