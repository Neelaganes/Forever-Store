import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1 });

  const fetchList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/product/list?page=${page}&limit=20`);
      if (response.data.success) {
        setList(response.data.products);
        setPagination(response.data.pagination || { pages: 1 });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [page]);

  const removeProduct = async (id) => {
    try {
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }
      setRemovingId(id);
      const response = await axios.post(
        backendUrl + '/api/product/remove',
        { id },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <>
      <p className='mb-2 text-lg font-semibold'>All Products List</p>
      <div className='flex flex-col gap-2'>
        {/* Table Header */}
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        </div>

        {loading ? (
          <div className='flex items-center justify-center py-12 gap-3'>
            <span className="inline-block w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin"></span>
            <p className='text-gray-500 text-sm'>Loading products...</p>
          </div>
        ) : list.length === 0 ? (
          <p className='text-gray-500 py-8 text-center'>No products found. Add your first product!</p>
        ) : (
          list.map((item, index) => (
            <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm' key={index}>
              <img className='w-12 h-12 object-cover' src={item.images?.[0] || ''} alt={item.name} />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{currency}{item.price}</p>
              <p 
                onClick={() => !removingId && removeProduct(item._id)} 
                className={`text-right md:text-center cursor-pointer text-lg ${removingId === item._id ? 'opacity-40' : 'text-red-500 hover:text-red-700'}`}
              >
                {removingId === item._id ? '...' : 'X'}
              </p>
            </div>
          ))
        )}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-4 py-5 text-sm">
            <button disabled={page === 1 || loading} onClick={() => setPage((current) => current - 1)} className="border px-3 py-1 disabled:opacity-40">Previous</button>
            <span>Page {page} of {pagination.pages}</span>
            <button disabled={page >= pagination.pages || loading} onClick={() => setPage((current) => current + 1)} className="border px-3 py-1 disabled:opacity-40">Next</button>
          </div>
        )}
      </div>
    </>
  );
};

export default List;
