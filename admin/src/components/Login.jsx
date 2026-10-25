import React, { useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setStatus('Logging in, please wait...');
      const response = await axios.post(backendUrl + '/api/user/admin', { email, password });
      if (response.data.success) {
        setStatus('Admin login successful.');
        setToken(response.data.token);
        toast.success("Admin login successful");
      } else {
        setStatus('');
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      setStatus('');
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center w-full px-4'>
      <div className='bg-white shadow-md rounded-lg px-8 py-6 max-w-md w-full'>
        <h1 className='text-2xl font-bold mb-4 text-center'>Admin Panel</h1>
        <form onSubmit={onSubmitHandler}>
          <div className='mb-3 min-w-72'>
            <p className='text-sm font-medium text-gray-700 mb-2'>Email Address</p>
            <input 
              disabled={loading} 
              onChange={(e) => setEmail(e.target.value)} 
              value={email} 
              className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none disabled:bg-gray-100' 
              type="email" 
              placeholder='your@email.com' 
              required 
            />
          </div>
          <div className='mb-3 min-w-72'>
            <p className='text-sm font-medium text-gray-700 mb-2'>Password</p>
            <input 
              disabled={loading} 
              onChange={(e) => setPassword(e.target.value)} 
              value={password} 
              className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none disabled:bg-gray-100' 
              type="password" 
              placeholder='Enter your password' 
              required 
            />
          </div>
          {status && (
            <p className='mb-3 text-center text-sm text-green-700 bg-green-50 border border-green-200 rounded py-2 px-3'>
              {status}
            </p>
          )}
          <button 
            disabled={loading} 
            className='mt-2 w-full py-2.5 px-4 rounded-md text-white bg-black hover:bg-gray-800 disabled:opacity-60 flex items-center justify-center gap-2 transition-all' 
            type='submit'
          >
            {loading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Logging in...</span>
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
