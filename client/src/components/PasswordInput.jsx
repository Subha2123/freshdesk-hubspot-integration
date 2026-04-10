import { useState } from "react";


const Eye = () => (
    <svg
        width="16px"
        height="16px"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        className="bi bi-eye"
    >
        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
    </svg>
);

const EyeOff = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M20.707 20.707a1 1 0 0 0 0-1.414l-16-16a1 1 0 0 0-1.414 1.414L5.205 6.62C2.785 8.338 1.5 10.683 1.5 12c0 2.25 3.75 7.5 10.5 7.5 1.916 0 3.59-.423 5.006-1.08l2.287 2.287a1 1 0 0 0 1.414 0zm-5.228-3.814-1.774-1.774A4 4 0 0 1 8.38 9.794L6.644 8.058a9.332 9.332 0 0 0-1.09.84C4.28 10.034 3.5 11.417 3.5 12c0 .584.781 1.966 2.052 3.103C7.231 16.605 9.438 17.5 12 17.5c1.25 0 2.417-.213 3.48-.607zm4.841-.815C21.751 14.61 22.5 13.006 22.5 12c0-2.25-3.75-7.5-10.5-7.5-1.043 0-2.015.125-2.912.346l1.721 1.72c.388-.043.785-.066 1.191-.066 2.562 0 4.77.895 6.448 2.397 1.27 1.137 2.052 2.52 2.052 3.103 0 .51-.596 1.63-1.595 2.663l1.415 1.415z" fill="#000000" /></svg>
)

export default function PasswordInput({ form, setForm }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
                Password <span className="text-red-500">*</span>
            </label>

            <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10"
                    required
                    onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                    }
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                    {showPassword ? <EyeOff /> : <Eye />}
                </button>
            </div>
        </div>
    );
}
