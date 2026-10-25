import React, { useContext } from 'react';
import Hero from '../components/Hero';
import LatestCollection from '../components/LatestCollection';
import BestSeller from '../components/BestSeller';
import OurPolicy from '../components/OurPolicy';
import NewsletterBox from '../components/NewsletterBox';
import { ShopContext } from '../context/ShopContext';

const Home = () => {
  const { productsLoading } = useContext(ShopContext);

  return (
    <div>
      <Hero />
      {productsLoading ? (
        <div className='flex flex-col items-center justify-center py-20 gap-3'>
          <span className="inline-block w-8 h-8 border-3 border-gray-300 border-t-black rounded-full animate-spin"></span>
          <p className='text-gray-500 text-sm'>Loading products...</p>
        </div>
      ) : (
        <>
          <LatestCollection />
          <BestSeller />
        </>
      )}
      <OurPolicy />
      <NewsletterBox />
    </div>
  );
};

export default Home;
