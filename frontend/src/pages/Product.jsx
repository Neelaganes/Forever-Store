import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/ui';
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, productsLoading, cartLoading } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');

  const fetchProductData = () => {
    const product = products.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
      const imgList = Array.isArray(product.images) ? product.images : (Array.isArray(product.image) ? product.image : []);
      setImage(imgList[0] || '');
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  const imagesList = productData ? (Array.isArray(productData.images) ? productData.images : (Array.isArray(productData.image) ? productData.image : [])) : [];

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* Product Section */}
      <div className="flex flex-col sm:flex-row gap-12">
        {/* Left Section: Images */}
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          {/* Thumbnails */}
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-auto sm:w-[20%] w-full gap-2">
            {imagesList.map((item, index) => (
              <img
                loading="lazy"
                decoding="async"
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className={`w-24 h-24 object-cover cursor-pointer border ${
                  image === item ? 'border-orange-500' : 'border-gray-200'
                }`}
                alt={`Thumbnail ${index + 1}`}
              />
            ))}
          </div>
          {/* Main Image */}
          <div className="w-full sm:w-[80%]">
            <img fetchPriority="high" decoding="async" src={image} className="w-full h-auto border border-gray-200" alt="Main Product" />
          </div>
        </div>

        {/* Right Section: Product Details */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} className="w-3.5" alt="Star" />
            <img src={assets.star_icon} className="w-3.5" alt="Star" />
            <img src={assets.star_icon} className="w-3.5" alt="Star" />
            <img src={assets.star_icon} className="w-3.5" alt="Star" />
            <img src={assets.star_dull_icon} className="w-3.5" alt="Dull Star" />
            <p className="pl-2">122</p>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-gray-500">{productData.description}</p>
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  key={index}
                  className={`bg-gray-100 py-2 px-4 border ${
                    item === size ? 'border-orange-500' : ''
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <button
            disabled={cartLoading}
            onClick={() => addToCart(productData._id, size)}
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700 disabled:opacity-60 flex items-center gap-2"
          >
            {cartLoading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Adding...
              </>
            ) : (
              'ADD TO CART'
            )}
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return & exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* Description and Reviews */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Description</b>
          <p className="border px-5 py-3 text-sm">Reviews (122)</p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>
            An e-commerce website is an online platform that facilitates the
            buying and selling of products or services over the internet. It
            serves as a virtual marketplace where businesses and individuals can
            showcase their products, interact with customers, and conduct
            transactions without the need for a physical presence. E-commerce
            websites have gained immense popularity due to their convenience,
            accessibility, and the global reach they offer.
          </p>
          <p>
            E-commerce websites typically display products or services along
            with detailed descriptions, images, prices, and any available
            variations (e.g., sizes, colors). Each product usually has its own
            dedicated page with relevant information.
          </p>
        </div>
      </div>

      {/* Related Products Section */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <span className="inline-block w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin"></span>
      <p className="text-gray-500 text-sm">{productsLoading ? 'Loading product...' : 'Product not found.'}</p>
    </div>
  );
};

export default Product;
