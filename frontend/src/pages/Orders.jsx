import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import { assets } from '../assets/ui';

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1 });

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null;
      }
      setLoading(true);
      const response = await axios.post(`${backendUrl}/api/order/userorders?page=${page}&limit=20`, {}, { headers: { token } });
      if (response.data.success) {
        let allOrderItems = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            const itemCopy = structuredClone(item);
            itemCopy['status'] = order.status;
            itemCopy['payment'] = order.payment;
            itemCopy['paymentMethod'] = order.paymentMethod;
            itemCopy['date'] = order.date;
            allOrderItems.push(itemCopy);
          });
        });
        setOrderData(allOrderItems.reverse());
        setPagination(response.data.pagination || { pages: 1 });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token, page]);

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div>
        {loading ? (
          <div className='flex items-center gap-3 py-8'>
            <span className="inline-block w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin"></span>
            <p className='text-gray-500'>Loading your orders...</p>
          </div>
        ) : orderData.length === 0 ? (
          <p className='py-8 text-gray-500'>You have not placed any orders yet.</p>
        ) : (
          orderData.map((item, index) => {
            const itemImg = (Array.isArray(item.images) && item.images.length > 0)
              ? item.images[0]
              : ((Array.isArray(item.image) && item.image.length > 0) ? item.image[0] : assets.parcel_icon);

            return (
              <div key={index} className='py-4 border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                <div className='flex items-start gap-6 text-sm'>
                  <img loading="lazy" decoding="async" className='w-16 sm:w-20 object-cover' src={itemImg} alt={item.name || "Product"} />
                  <div>
                    <p className='sm:text-base font-medium'>{item.name}</p>
                    <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                      <p>{currency}{item.price}</p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Size: {item.size}</p>
                    </div>
                    <p className='mt-1'>Date: <span className='text-gray-400'>{new Date(item.date).toDateString()}</span></p>
                    <p className='mt-1'>Payment: <span className='text-gray-400'>{item.paymentMethod}</span></p>
                  </div>
                </div>
                <div className='md:w-1/2 flex justify-between'>
                  <div className='flex items-center gap-2'>
                    <p className='min-w-2.5 h-2.5 rounded-full bg-green-500'></p>
                    <p className='text-sm md:text-base'>{item.status}</p>
                  </div>
                  <button onClick={loadOrderData} className='border px-4 py-2 text-sm font-medium rounded-sm hover:bg-gray-50'>Track Order</button>
                </div>
              </div>
            );
          })
        )}
        {pagination.pages > 1 && (
          <div className='flex items-center justify-center gap-4 py-5 text-sm'>
            <button disabled={page === 1 || loading} onClick={() => setPage((current) => current - 1)} className='border px-3 py-1 disabled:opacity-40'>Previous</button>
            <span>Page {page} of {pagination.pages}</span>
            <button disabled={page >= pagination.pages || loading} onClick={() => setPage((current) => current + 1)} className='border px-3 py-1 disabled:opacity-40'>Next</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
