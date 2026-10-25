import React, { useState } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!image1 && !image2 && !image3 && !image4) {
      toast.error("Please upload at least one image");
      return;
    }
    try {
      setLoading(true);
      setStatus('Adding product, please wait...');
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(backendUrl + "/api/product/add", formData, { headers: { token } });
      if (response.data.success) {
        setStatus('Product added successfully.');
        toast.success(response.data.message);
        setName('');
        setDescription('');
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice('');
        setSizes([]);
        setBestseller(false);
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
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
      {status && (
        <p className={`w-full max-w-[500px] text-sm rounded py-2 px-3 border ${loading ? 'text-blue-700 bg-blue-50 border-blue-200' : 'text-green-700 bg-green-50 border-green-200'}`}>
          {status}
        </p>
      )}
      <div>
        <p className='mb-2 font-medium'>Upload Images</p>
        <div className='grid grid-flow-row-dense grid-cols-2 sm:grid-cols-4 gap-4'>
          <label htmlFor="image1" className='cursor-pointer'>
            <img className='w-20 h-20 object-cover border border-dashed border-gray-400 p-1' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
            <input disabled={loading} onChange={(e) => setImage1(e.target.files[0])} type="file" id='image1' hidden />
          </label>
          <label htmlFor="image2" className='cursor-pointer'>
            <img className='w-20 h-20 object-cover border border-dashed border-gray-400 p-1' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="" />
            <input disabled={loading} onChange={(e) => setImage2(e.target.files[0])} type="file" id='image2' hidden />
          </label>
          <label htmlFor="image3" className='cursor-pointer'>
            <img className='w-20 h-20 object-cover border border-dashed border-gray-400 p-1' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="" />
            <input disabled={loading} onChange={(e) => setImage3(e.target.files[0])} type="file" id='image3' hidden />
          </label>
          <label htmlFor="image4" className='cursor-pointer'>
            <img className='w-20 h-20 object-cover border border-dashed border-gray-400 p-1' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="" />
            <input disabled={loading} onChange={(e) => setImage4(e.target.files[0])} type="file" id='image4' hidden />
          </label>
        </div>
      </div>

      <div className='w-full'>
        <p className='mb-2 font-medium'>Product Name</p>
        <input disabled={loading} onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2 border rounded' type="text" placeholder='Type here' required />
      </div>

      <div className='w-full'>
        <p className='mb-2 font-medium'>Product Description</p>
        <textarea disabled={loading} onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2 border rounded' placeholder='Write description here' required />
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div>
          <p className='mb-2 font-medium'>Category</p>
          <select disabled={loading} onChange={(e) => setCategory(e.target.value)} value={category} className='w-full px-3 py-2 border rounded'>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div>
          <p className='mb-2 font-medium'>Sub Category</p>
          <select disabled={loading} onChange={(e) => setSubCategory(e.target.value)} value={subCategory} className='w-full px-3 py-2 border rounded'>
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>

        <div>
          <p className='mb-2 font-medium'>Product Price</p>
          <input disabled={loading} onChange={(e) => setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-[120px] border rounded' type="number" placeholder="25" required />
        </div>
      </div>

      <div>
        <p className='mb-2 font-medium'>Product Sizes</p>
        <div className='flex gap-3'>
          {["S", "M", "L", "XL", "XXL"].map((item) => (
            <div key={item} onClick={() => !loading && setSizes(prev => prev.includes(item) ? prev.filter(s => s !== item) : [...prev, item])}>
              <p className={`${sizes.includes(item) ? "bg-pink-200 border-pink-400" : "bg-slate-200"} border px-3 py-1 cursor-pointer font-medium text-sm rounded`}>{item}</p>
            </div>
          ))}
        </div>
      </div>

      <div className='flex gap-2 mt-2 items-center'>
        <input disabled={loading} onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id='bestseller' className='w-4 h-4 cursor-pointer' />
        <label className='cursor-pointer text-sm font-medium' htmlFor="bestseller">Add to bestseller</label>
      </div>

      <button 
        disabled={loading} 
        type='submit' 
        className='w-44 py-3 mt-4 bg-black text-white hover:bg-gray-800 disabled:opacity-60 flex items-center justify-center gap-2 rounded transition-all cursor-pointer'
      >
        {loading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>Adding...</span>
          </>
        ) : (
          "ADD PRODUCT"
        )}
      </button>
    </form>
  );
};

export default Add;
