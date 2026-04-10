import { useState } from "react";
import FormLayout from "../../components/FormLayout";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../../api/auth";
import PasswordInput from "../../components/PasswordInput";

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
    if (res?.userId) {
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
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Your Name <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            name="name"
            placeholder="User name"
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required=""
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">Your Email <span className="text-red-500">*</span></label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required=""
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <PasswordInput form={form} setForm={setForm} />
        </div>
        <button
          type="submit"
          className="cursor-pointer w-full bg-blue-500 text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
          Sign up
        </button>
      </form>
      <p className="cursor-pointer text-sm font-light text-gray-500">
        Don’t have an account yet? <button onClick={() => {
          naviagte('/login')
        }} className="font-medium text-primary-600 hover:underline">Sign in</button>
      </p>
    </FormLayout>
  );
}
