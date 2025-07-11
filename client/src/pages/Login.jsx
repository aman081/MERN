import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/UI/Button';

const Login = () => {
  const [type, setType] = useState('public'); // 'public' or 'admin'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleTypeSwitch = (t) => {
    setType(t);
    setForm({ name: '', email: '', password: '' });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    let credentials;
    if (type === 'admin') {
      credentials = { email: form.email, password: form.password };
    } else {
      credentials = { name: form.name, email: form.email, password: form.password };
    }
    const result = await login(credentials, type);
    setLoading(false);
    if (result.success) {
      if (type === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full"
      >
        <div className="flex justify-center mb-6 gap-2">
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${type === 'public' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
            onClick={() => handleTypeSwitch('public')}
          >
            Public Login
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${type === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
            onClick={() => handleTypeSwitch('admin')}
          >
            Admin Login
          </button>
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
          {type === 'admin' ? 'Admin Login' : 'Public Login'}
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          {type === 'admin' ? 'For event coordinators and admins' : 'For students and public users'}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'public' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="input"
                placeholder="Enter your name"
                required
                autoComplete="name"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="input"
              placeholder="Enter your email"
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="input"
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </div>
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          <Button type="submit" variant="primary" size="lg" className="w-full mt-2" loading={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login; 