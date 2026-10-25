import React, { lazy, Suspense, useEffect, useState } from 'react';
import NavBar from './components/NavBar';
import Sidebar from './components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getBackendUrl } from './utils/backendUrl';

export const backendUrl = getBackendUrl();
export const currency = '$';

const Add = lazy(() => import('./pages/Add'));
const List = lazy(() => import('./pages/List'));
const Orders = lazy(() => import('./pages/Orders'));

const getStoredAdminToken = () => {
  return localStorage.getItem('adminToken') || '';
};

const App = () => {
  const [token, setToken] = useState(getStoredAdminToken());

  useEffect(() => {
    if (token) {
      localStorage.setItem('adminToken', token);
    } else {
      localStorage.removeItem('adminToken');
    }
  }, [token]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer position="bottom-right" />
      {!token ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <NavBar setToken={setToken} />
          <hr />
          <div className="flex w-full">
            <Sidebar />
            <div className="flex-1 mx-8 my-8 text-gray-700 text-base">
              <Suspense fallback={<div className="py-12 text-sm text-gray-500">Loading admin page...</div>}>
                <Routes>
                  <Route path="/" element={<Add token={token} />} />
                  <Route path="/add" element={<Add token={token} />} />
                  <Route path="/list" element={<List token={token} />} />
                  <Route path="/order" element={<Orders token={token} />} />
                  <Route path="/orders" element={<Orders token={token} />} />
                </Routes>
              </Suspense>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
