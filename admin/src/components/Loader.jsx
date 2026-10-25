import React from 'react';

const Loader = ({ label = 'Loading...' }) => {
  return (
    <div className='flex flex-col items-center justify-center py-12 gap-3'>
      <span className='inline-block w-7 h-7 border-2 border-gray-300 border-t-black rounded-full animate-spin'></span>
      <p className='text-gray-500 text-sm'>{label}</p>
    </div>
  );
};

export default Loader;
