import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from 'framer-motion';
import { LogIn, UserPlus, Lock, BookOpen } from 'lucide-react';

const AuthForm = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '', email: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }

      localStorage.setItem('token', data.token);
      onLogin(data.token);
    } catch (error) {
      setError(error.message || 'An unexpected error occurred');
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
      <div className="mb-10">
      <h1 className="text-4xl font-bold flex justify-center text-gray-800 flex items-center gap-2">
            <BookOpen className="text-purple-600 h-10 w-auto" />
            BookList Buddy
      </h1>
      </div>
        <Card className="border-0 shadow-lg bg-white backdrop-blur-lg bg-opacity-90">
          <CardHeader>
            <CardTitle className="text-2xl text-purple-600 flex items-center gap-2">
              <Lock />
              {isLogin ? 'Login' : 'Register'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4 bg-red-50 border-red-200">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <input
                type="text"
                placeholder="Username"
                className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
              />
            )}
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors shadow-md flex items-center justify-center gap-2"
              >
                {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                {isLogin ? 'Login' : 'Register'}
              </motion.button>
            </form>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="w-full text-center mt-4 text-purple-600 hover:text-purple-700"
            >
              {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
            </button>
          </CardContent>
        </Card>
        <footer className="mt-4 text-center text-gray-600">
          &copy; {(new Date().getFullYear())} BookList Buddy. All rights reserved.
        </footer>
      </motion.div>
    </div>
  );
};

export default AuthForm;