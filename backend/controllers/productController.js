import {v2 as cloudinary} from 'cloudinary';
import productModel from '../models/productModel.js';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_SECRET_KEY
});

const PRODUCT_CACHE_TTL = 60 * 1000;
const productCache = new Map();

const getCachedProducts = (key) => {
    const cached = productCache.get(key);
    if (!cached || cached.expiresAt < Date.now()) {
        productCache.delete(key);
        return null;
    }
    return cached.value;
};

const setCachedProducts = (key, value) => {
    productCache.set(key, { value, expiresAt: Date.now() + PRODUCT_CACHE_TTL });
};

const clearProductCache = () => productCache.clear();
  

// function for add product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

        // ✅ Ensure req.files exists
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ success: false, message: "No images uploaded" });
        }

        // ✅ Extract images safely
        const image1 = req.files.image1?.[0];
        const image2 = req.files.image2?.[0];
        const image3 = req.files.image3?.[0];
        const image4 = req.files.image4?.[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        // ✅ Upload images to Cloudinary
        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, {resource_type:'image'});
                return result.secure_url.replace('/upload/', '/upload/f_auto,q_auto,w_1600/');
            })
        );

        // ✅ Create product data object
        const productData = {
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            sizes: typeof sizes === 'string' ? JSON.parse(sizes) : (Array.isArray(sizes) ? sizes : []),
            bestseller: bestseller === "true" || bestseller === true,
            images: imagesUrl,
            date: Date.now(),
        };

        // ✅ Save product in DB
        const product = new productModel(productData);
        await product.save();
        clearProductCache();
        res.json({ success: true, message: "Product Added" });

    } 
    catch (error){
        console.log(error);
        res.json({success:false, message: error.message})
    }
}

// function for list product
const listProducts = async (req, res) => {
    try{
        const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 100, 1), 100);
        const cacheKey = `${page}:${limit}`;
        const cached = getCachedProducts(cacheKey);
        if (cached) {
            res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
            return res.json(cached);
        }

        const [products, total] = await Promise.all([
            productModel.find({}).sort({ date: -1 }).skip((page - 1) * limit).limit(limit).lean(),
            productModel.countDocuments({})
        ]);
        const response = { success: true, products, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
        setCachedProducts(cacheKey, response);
        res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
        res.json(response)
    }
    catch (error){
        console.log(error);
        res.json({success:false, message: error.message})
    }
}

// function for remove product
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id)
        clearProductCache();
        res.json({ success: true, message: "Product removed"})
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// function for single product info
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body
        const product = await productModel.findById(productId)
        res.json({success: true, product})
    }
    catch (error){
        console.log(error)
        res.json({success:false, message: error.message})
    }
}

export { listProducts, addProduct, removeProduct, singleProduct }
