import { useContext, useState } from "react";
import Layout from "../components/Layout";
import Link from 'next/link';
import { useRouter } from "next/router";
import { CartContext } from "../contexts/CartContext";
import { FaSignInAlt } from 'react-icons/fa';

function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null);
  const { cartCount, updateCartCount } = useContext(CartContext);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:8000/api/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('user', JSON.stringify(data));
      const cartRes = await fetch('http://localhost:8000/api/cart', {
        headers: {
          'Authorization': `token ${data.token}`,
        }
      });
      if (cartRes.ok) {
        const cartData = await cartRes.json();
        const cartCount = cartData.items.length;
        updateCartCount(cartCount);
      }
      router.push('/');
    } else {
      const data = await res.json();
      setError(data.detail || "Invalid credentials");
    }
  };






  return (
    <Layout>
      <div className="login-container max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <div className="text-center mb-4">
          <FaSignInAlt className="w-12 h-12 mx-auto text-yellow-500" />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Login</h2>
        <form onSubmit={handleSubmit} method="post">
          <div className="form-group mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div className="form-group mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <button type="submit" className="w-full py-2 px-4 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition duration-200">
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Don't have an account? <Link href="/signup" className="text-yellow-500 hover:underline">Sign up</Link>
        </p>
      </div>
    </Layout>


  );
}

export default Login;