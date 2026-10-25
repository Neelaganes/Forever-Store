import express from 'express'
import cors from 'cors'
import 'dotenv/config' 
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import responseCompression from './middleware/responseCompression.js'

//App config
const app = express()
const port = process.env.PORT || 8001;
connectDB();
connectCloudinary();
// middlewares
app.use(express.json())
app.use(responseCompression)
app.use(cors({
  origin: true,
  credentials: true,
}))

// api endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.get('/', (req, res) => {
    res.send("API working")
})

app.get('/health', (req, res) => {
    res.json({ success: true, status: 'ok' })
})

app.listen(port, '0.0.0.0', ()=> console.log('Server started on port: ' + port));
