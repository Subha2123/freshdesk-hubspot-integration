import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormLayout from "../../components/FormLayout";
import { GoogleLogin } from '@react-oauth/google';
import { googleLogin, signinUser } from "../../api/auth";
import { useAuth } from "../../customHooks/useAuth";


export default function Login() {
  const navigate = useNavigate()
  const { setUser } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });


  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const tokenId = credentialResponse.credential;
      const res = await googleLogin(tokenId)
      if (res?.token) {
        setUser(res.user); 
        navigate("/dashboard")
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      console.error("Google login failed:", err.message);
    }
  };

  const handleError = () => {
    console.error("Login Failed");
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signinUser(form)
    if (res?.token) {
      setUser(res.user);
      navigate("/dashboard")

    } else {
      alert("Invalid credentials");
    }
  };

  function handleNavigateSignup() {
    navigate('/signup')
  }

  return (
    <FormLayout>
      <h3 className="font-bold text-center text-gray-900 ">
        Welcome back
      </h3>
      <p className="text-sm font-light text-gray-500 ">
        Don’t have an account yet? <button onClick={handleNavigateSignup} className="font-medium text-primary-600 hover:underline">Sign up</button>
      </p>
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 mt-4" action="#">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 ">Email</label>
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
          className="w-full cursor-pointer bg-blue-500 text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
          Sign in
        </button>

        <div className="flex items-center my-4">
          <hr className="grow border-gray-300" />
          <span className="px-2 text-gray-400 text-sm">OR</span>
          <hr className="grow border-gray-300" />
        </div>

        <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleError} />
      </form>
    </FormLayout>
  );
}
