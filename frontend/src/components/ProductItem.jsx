import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import { assets } from '../assets/ui';

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext); 

  // Ensure `image` is handled safely whether array or string
  const productImage = (Array.isArray(image) && image.length > 0) 
    ? image[0] 
    : (typeof image === 'string' && image ? image : assets.hero_img);

  return (
    <Link className='text-gray-700 cursor-pointer' to={id ? `/product/${id}` : '#'}>
      <div className='overflow-hidden'>
        <img loading="lazy" decoding="async" className='hover:scale-110 transition ease-in-out w-full h-auto object-cover' src={productImage} alt={name || "Product"} />
      </div>
      <p className='pt-3 pb-1 text-sm'>{name || "No Name"}</p>
      <p className='text-sm font-medium'>{currency ? currency + price : "Price Not Available"}</p>
    </Link>
  );
};

export default React.memo(ProductItem);
