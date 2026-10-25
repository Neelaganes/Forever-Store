import React, { useState, useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const isLogin = currentState === 'Login';
      setStatus(isLogin ? 'Logging in, please wait...' : 'Creating your account, please wait...');
      if (!isLogin) {
        const response = await axios.post(backendUrl + '/api/user/register', { name, email, password });
        if (response.data.success) {
          setStatus('Sign up successful. Redirecting...');
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          toast.success("Account created successfully!");
        } else {
          setStatus('');
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(backendUrl + '/api/user/login', { email, password });
        if (response.data.success) {
          setStatus('Login successful. Redirecting...');
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          toast.success("Logged in successfully!");
        } else {
          setStatus('');
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      setStatus('');
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  return (
    <div>
      <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
        <div className='inline-flex items-center gap-2 mb-2 mt-10'>
          <p className='prata-regular text-3xl'>{currentState}</p>
          <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
        </div>
        {currentState === 'Login' ? '' : (
          <input 
            disabled={loading}
            onChange={(e) => setName(e.target.value)} 
            value={name} 
            type="text" 
            className='w-full px-3 py-2 border border-gray-800 disabled:bg-gray-100' 
            placeholder='Name' 
            required 
          />
        )}
        <input 
          disabled={loading}
          onChange={(e) => setEmail(e.target.value)} 
          value={email} 
          type="email" 
          className='w-full px-3 py-2 border border-gray-800 disabled:bg-gray-100' 
          placeholder='Email' 
          required 
        />
        <input 
          disabled={loading}
          onChange={(e) => setPassword(e.target.value)} 
          value={password} 
          type="password" 
          className='w-full px-3 py-2 border border-gray-800 disabled:bg-gray-100' 
          placeholder='Password' 
          required 
        />
        <div className='w-full flex justify-between text-sm mt-[-8px]'>
          <p className='cursor-pointer text-gray-500 hover:text-black'>Forgot your password?</p>
          {
            currentState === 'Login'
              ? <p onClick={() => !loading && setCurrentState('Sign Up')} className='cursor-pointer text-gray-700 hover:underline'>Create account</p>
              : <p onClick={() => !loading && setCurrentState('Login')} className='cursor-pointer text-gray-700 hover:underline'>Login Here</p>
          }
        </div>
        {status && (
          <p className='w-full text-center text-sm text-green-700 bg-green-50 border border-green-200 rounded py-2 px-3'>
            {status}
          </p>
        )}
        <button 
          disabled={loading} 
          className='bg-black text-white font-light px-8 py-2.5 mt-4 disabled:opacity-60 flex items-center justify-center gap-2 transition-all'
        >
          {loading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>{currentState === 'Login' ? 'Logging in...' : 'Signing Up...'}</span>
            </>
          ) : (
            currentState === 'Login' ? 'Login' : 'Sign Up'
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;
