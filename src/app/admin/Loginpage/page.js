"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import axios from 'axios';
import { Mail, Lock } from 'lucide-react';

export default function Home() {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.post('http://localhost:5005/api/login', user, { withCredentials: true });
      console.log("Successfully posted the data", response.data);

      const token = response.data.token; 
      console.log(token);

      
        const role = response.data.role;
        console.log(role);
        if (role === 'admin') {
          router.push('/admin/Dasboard');
        } else {
           console.log("no tokens available");
        }

      setUser({
        email: '',
        password: '',
      });
    } catch (err) {
      setErrorMessage('Login failed. Please check your credentials.');
      console.log('Login error: ', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-300">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold text-center text-green-600">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && <div className="text-red-600 text-center">{errorMessage}</div>}
          <div className="relative">
            <label className="block mb-2 text-sm font-medium text-gray-600">Email</label>
            <div className="flex items-center border-2 border-green-200 rounded-lg">
              <Mail className="ml-3 text-green-500" size={20} />
              <input 
                type="email"
                name="email"
                placeholder="Enter your email"
                value={user.email}
                onChange={handleChange}
                className="w-full p-3 pl-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
            </div>
          </div>

          <div className="relative">
            <label className="block mb-2 text-sm font-medium text-gray-600">Password</label>
            <div className="flex items-center border-2 border-green-200 rounded-lg">
              <Lock className="ml-3 text-green-500" size={20} />
              <input 
                type="password"
                name="password"
                placeholder="Enter your password"
                value={user.password}
                onChange={handleChange}
                className="w-full p-3 pl-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}