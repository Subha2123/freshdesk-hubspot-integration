import { useEffect, useState } from "react";
import { getHubspotConnectMetaData } from "../api/freshdesk";
import TitleBackNaviagtion from "./GoBack";

export default function CRMPanel() {
  const [crmData, setCrmData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getCrmMetaData = async () => {
    try {
      setLoading(true);
      const res = await getHubspotConnectMetaData();
      setCrmData(res);
    } catch (error) {
      console.error("Error while connect hubspot", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCrmMetaData();
  }, []);

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200 p-4">
      <div className="p-4 border-b border-gray-200">
        <TitleBackNaviagtion label="Dashboard" current="CRM Overview" />
      </div>
      <div className="p-4 space-y-5 overflow-y-auto flex-1">

        {loading && (
          <p className="text-sm text-gray-400">Loading CRM data...</p>
        )}
        {!loading && !crmData && (
          <p className="text-sm text-gray-400">
            No CRM connected
          </p>
        )}
        {crmData && (
          <>
            <div className="bg-gray-50 p-3 rounded-lg space-y-2">
              <p className="text-xs text-gray-500">Account</p>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Portal</span>
                <span className="font-medium">{crmData.account.portalId}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Plan</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs">
                  {crmData.account.plan}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Region</span>
                <span>{crmData.account.region}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gray-100 p-3 rounded-lg text-center">
                <p className="text-xs text-gray-500">Contacts</p>
                <p className="font-bold text-lg">
                  {crmData.stats.totalContacts}
                </p>
              </div>

              <div className="bg-gray-100 p-3 rounded-lg text-center">
                <p className="text-xs text-gray-500">Companies</p>
                <p className="font-bold text-lg">
                  {crmData.stats.totalCompanies || 0}
                </p>
              </div>

              <div className="bg-gray-100 p-3 rounded-lg text-center">
                <p className="text-xs text-gray-500">Deals</p>
                <p className="font-bold text-lg">
                  {crmData.stats.totalDeals || 0}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">
                Recent Contacts
              </p>

              {crmData.contactsPreview?.length > 0 ? (
                <div className="space-y-2">
                  {crmData.contactsPreview.map((c) => (
                    <div
                      key={c.id}
                      className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                    >
                      <p className="text-sm font-medium text-gray-800">
                        {c.name || "No Name"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {c.email}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">
                  No contacts found
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
