import { useState } from "react"
import api from "../api/axios"
import { Link, useNavigate } from "react-router"
import { useAuth } from "../context/AuthContext"


const Register = () => {
const [formData, setFormData] = useState({email:'',name:'',password:'', confirmPassword:''});
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);
const login = useAuth();
const navigate = useNavigate();

const handleChange = (e)=>{
    setFormData({...formData, [e.target.name]:e.target.value});
}

const handleSubmit = async(e)=>{
    e.preventDefault();
    setError('');

    if(formData.password !== formData.confirmPassword){
        return setError("Passwords not matching");
    }
    if(formData.password<6){
        return setError("Password is less than 6 letters");
    }
    setLoading(true);
    try {
        const response = await api.post("/auth/register", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        login(response.data.user, response.data.token);
        navigate("/dashboard")
    } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
    }finally{
        setLoading(false);
    }
}




  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            create account
          </h1>
          <p className="text-gray-500 mt-2">
            Start managing your task
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter your name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your great name"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="youremail@email.com"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Passowrd
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-lg transition"
          >
            {loading ? "Account creating..." : "Register"}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Already account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Login 
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register
