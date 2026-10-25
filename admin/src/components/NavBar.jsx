import React from 'react';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';

const NavBar = ({ setToken }) => {
  const handleLogout = (event) => {
    event.preventDefault();
    event.stopPropagation();
    localStorage.removeItem('adminToken');
    setToken('');
    toast.success("Admin logged out");
  };

  return (
    <div className='relative z-50 flex items-center py-2 px-[4%] justify-between bg-white border-b'>
      <img className='w-[max(10%,80px)]' src={assets.logo} alt="Logo" />
      <button 
        type="button"
        onClick={handleLogout} 
        className='relative z-50 bg-gray-700 hover:bg-black transition-colors text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm cursor-pointer'
      >
        Logout
      </button>
    </div>
  );
};

export default NavBar;
