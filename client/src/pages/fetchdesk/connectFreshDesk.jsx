import { useState } from "react";
import FormLayout from "../../components/FormLayout";
import { connectFreshdesk } from "../../api/freshdesk";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../customHooks/useAuth";

export default function ConnectFreshdesk() {
    const [form, setForm] = useState({ domain: "", apiKey: "" });
    const [error, setError] = useState("");
    const navigate=useNavigate()
    const {setExternalConnections} = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = connectFreshdesk(form)
            if (res) {
                alert("Freshdesk connected")
                navigate('/dashboard')
                setExternalConnections({freshdesk:res.connection})
            
            } else {
                const data = await res.json();
                setError(data.message || "Failed to connect Freshdesk");
            }
        } catch (err) {
            setError("Server error", err);
        }
    };

    return (
        <FormLayout>
            <h3 class="font-bold text-center text-gray-900 ">
                Connect Freshdesk      </h3>
            <form onSubmit={handleSubmit} class="space-y-4 md:space-y-6 mt-4" action="#">

                {error && <p className="text-red-500 mb-3">{error}</p>}
                <input
                    type="text"
                    placeholder="Freshdesk Domain"
                    value={form.domain}
                    onChange={(e) => setForm({ ...form, domain: e.target.value })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required=""

                />
                <div>
                    <label class="block mb-2 text-sm font-medium text-gray-900 ">API key</label>
                    <input
                        type="text"
                        name="apiKey"
                        placeholder="API Key"
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" 
                        required=""
                        onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
                    />
                </div>
                <button className="w-full bg-blue-500 text-white p-2 rounded cursor-pointer">
                    Connect
                </button>
            </form>
        </FormLayout>
    );
}
