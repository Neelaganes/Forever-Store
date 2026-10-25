import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/ui';
import CartTotal from '../components/CartTotal';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate, token, cartLoading } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  useEffect(()=>{
    if(products.length > 0){
      const tempData = [];
    for(const items in cartItems){
      for(const item in cartItems[items]){
        if(cartItems[items][item] > 0){
          tempData.push({
            _id: items,
            size : item,
            quantity: cartItems[items][item]
          })
        }
      }
    }
    setCartData(tempData);
    }
    
  }, [cartItems, products])
  return (
    <div className='border-t pt-14'>
      <div className='text-2xl mb-3'>
        <Title text1={'YOUR'} text2 = {'CART'}/>
      </div>
      <div>
        {cartData.map((item, index) => {
          const productData = products.find((product)=> product._id === item._id);
          if (!productData) return null;
          const cartImg = (Array.isArray(productData.images) && productData.images.length > 0)
            ? productData.images[0]
            : ((Array.isArray(productData.image) && productData.image.length > 0) ? productData.image[0] : '');

          return (
            <div key={index} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
              <div className='flex items-start gap-6'>
                <img loading="lazy" decoding="async" src={cartImg} className='w-16 sm:w-20 object-cover' alt={productData.name} />
                <div>
                  <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>
                  <div className='flex items-center gap-5 mt-2'>
                    <p>{currency}{productData.price}</p>
                    <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>{item.size}</p>
                  </div>
                </div>
              </div>
              <input onChange={(e)=> e.target.value === '' || e.target.value === '0' ? null : updateQuantity(item._id, item.size, Number(e.target.value))} className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1' type="number" min='1' defaultValue={item.quantity} />
              <img onClick={()=> updateQuantity(item._id, item.size, 0)} src={assets.bin_icon} className='w-4 mr-4 sm:w-5 cursor-pointer' alt="" />
            </div>
          )
        })}
      </div>
      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal/>
          <div className='w-full text-end'>
            <button onClick={()=> {
              if (!token) {
                navigate('/login');
                return;
              }
              navigate('/place-order');
            }} className='bg-black text-white text-sm my-8 px-8 py-3'>PROCEED TO CHECKOUT</button>
            {cartLoading && (
              <p className='text-xs text-gray-500 flex items-center justify-end gap-2'>
                <span className="inline-block w-3 h-3 border-2 border-gray-300 border-t-black rounded-full animate-spin"></span>
                Updating cart...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart;
