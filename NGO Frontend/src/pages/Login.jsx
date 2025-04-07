import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { motion } from "framer-motion";
import apiRequest from "../utils/apifile";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth(); // Change to use login function instead of updateUser

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      // Adjusting the endpoint path - removing potential duplicate 'api' prefix
      // If your backend expects '/auth/login' rather than '/api/auth/login'
      const res = await apiRequest.post(
        "/auth/login", // Remove leading slash to prevent path issues
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      //Save to local storage using context api to update the user state in the context
      login(res.data); // Use login instead of updateUser
      
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.response?.data?.error || 
        error.response?.data?.message ||
        "Invalid credentials. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="flex justify-center items-center py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-primary">Sign In</h1>
          <p className="text-gray-600 text-sm mt-2">
            Welcome back to NGO Animal Rescue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded text-sm">
              {error}
            </div>
          )}

          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="your@email.com"
            required
            containerClassName="mb-4"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            containerClassName="mb-4"
          />

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-primary hover:text-primary-dark"
              >
                Forgot password?
              </a>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={isLoading}
            className="py-2.5"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-primary hover:text-primary-dark"
            >
              Sign up
            </Link>
          </p>
        </div>
      </Card>
    </motion.div>
  );
};

export default Login;
