import Layout from "../components/Layout";
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password1 !== password2) {
            setError("Passwords do not match");
            return;
        }

        const res = await fetch('http://localhost:8000/api/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password: password1 }),
        });

        if (res.ok) {
            router.push('/login');
        } else {
            const data = await res.json();
            setError(data.detail || "Something went wrong");
        }
    };

    return (
        <Layout>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-12 px-4">
                <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
                    <form onSubmit={handleSubmit} method="post">
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Name:</label>
                            <input 
                                type="text" 
                                id="username" 
                                name="username" 
                                required 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 p-2"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                required 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 p-2"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password1" className="block text-sm font-medium text-gray-700">Password:</label>
                            <input 
                                type="password" 
                                id="password1" 
                                name="password1" 
                                required 
                                value={password1} 
                                onChange={(e) => setPassword1(e.target.value)} 
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 p-2"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password2" className="block text-sm font-medium text-gray-700">Retype your Password:</label>
                            <input 
                                type="password" 
                                id="password2" 
                                name="password2" 
                                required 
                                value={password2} 
                                onChange={(e) => setPassword2(e.target.value)} 
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 p-2"
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="w-full bg-yellow-500 text-white rounded-md py-2 hover:bg-yellow-600 transition duration-200"
                        >
                            Sign Up
                        </button>
                    </form>
                    <p className="mt-4 text-center text-sm text-gray-600">
                        Already have an account? <Link href="/login" className="text-yellow-500 font-medium hover:underline">Login</Link>
                    </p>
                </div>
            </div>
        </Layout>
    );
}

export default Signup;
