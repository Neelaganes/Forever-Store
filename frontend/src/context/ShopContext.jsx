import { createContext, useEffect, useState } from "react"; 
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { getBackendUrl } from '../utils/backendUrl';

export const ShopContext = createContext(); 

const ShopContextProvider = (props) => { 
    const currency = '$'; 
    const delivery_fee = 10; 
    const backendUrl = getBackendUrl();
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');
    const [productsLoading, setProductsLoading] = useState(true);
    const [cartLoading, setCartLoading] = useState(false);
    const navigate = useNavigate();

    const addToCart = async (itemId, size) => {
        if (!token) {
            toast.error('Please login to add items to cart');
            navigate('/login');
            return false;
        }
        if (!size) {
            toast.error('Select Product Size');
            return false;
        }
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);
        try {
            setCartLoading(true);
            await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { token } });
            toast.success('Added to cart');
            return true;
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || error.message);
            return false;
        } finally {
            setCartLoading(false);
        }
    }
       
    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                if (cartItems[items][item] > 0) {
                    totalCount += cartItems[items][item];
                }
            }   
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);
        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }
        cartData[itemId][size] = quantity;
        setCartItems(cartData);
        if (token) {
            try {
                setCartLoading(true);
                await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } });
            } catch (error) {
                console.log(error);
                toast.error(error.response?.data?.message || error.message);
            } finally {
                setCartLoading(false);
            }
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (itemInfo) {
                for (const item in cartItems[items]) {
                    if (cartItems[items][item] > 0) {
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                }
            }
        }
        return totalAmount;
    }

    const getProductsData = async () => {
        try {
            setProductsLoading(true);
            const cached = sessionStorage.getItem('products-cache');
            if (cached) {
                const parsed = JSON.parse(cached);
                if (Date.now() - parsed.timestamp < 60 * 1000 && Array.isArray(parsed.products)) {
                    setProducts(parsed.products);
                    setProductsLoading(false);
                    return;
                }
            }
            const response = await axios.get(backendUrl + '/api/product/list?limit=100');
            if (response.data.success) {
                setProducts(response.data.products);
                sessionStorage.setItem('products-cache', JSON.stringify({ timestamp: Date.now(), products: response.data.products }));
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setProductsLoading(false);
        }
    }

    const getUserCart = async (userToken) => {
        try {
            setCartLoading(true);
            const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token: userToken } });
            if (response.data.success) {
                setCartItems(response.data.cartData || {});
            }
        } catch (error) {
            console.log(error);
        } finally {
            setCartLoading(false);
        }
    }

    useEffect(() => {
        getProductsData();
    }, []);

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            const savedToken = localStorage.getItem('token');
            setToken(savedToken);
            getUserCart(savedToken);
        } else if (token) {
            getUserCart(token);
        }
    }, [token]);

    const value = { 
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, setCartItems, addToCart, 
        getCartCount, updateQuantity, getCartAmount,
        navigate, backendUrl, token, setToken,
        setProducts, productsLoading, cartLoading
    };

    return ( 
        <ShopContext.Provider value={value}> 
            {props.children}
        </ShopContext.Provider> 
    );
};

export default ShopContextProvider;
