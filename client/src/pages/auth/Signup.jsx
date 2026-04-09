import { useState } from "react";
import FormLayout from "../../components/FormLayout";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../../api/auth";

export default function Signup() {
  const naviagte = useNavigate()
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signupUser(form)
    if (res.ok) {
      naviagte('/login')
    }
  };

  return (

    <FormLayout>
      <h3 className="font-bold text-center text-gray-900">
        Create your account
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" action="#">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">Your Name</label>
          <input
            type="text"
            name="name"
            d="name"
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required=""
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">Your Name</label>
          <input
            type="email"
            name="email"
            d="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="name@company.com" required=""
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required=""
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
          Sign up
        </button>
      </form>
      <p className="text-sm font-light text-gray-500">
        Don’t have an account yet? <button onClick={() => {
          naviagte('/login')
        }} className="font-medium text-primary-600 hover:underline">Sign in</button>
      </p>
    </FormLayout>
  );
}
