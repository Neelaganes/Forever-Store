import express from 'express'
import { placeOrder, updateStatus, allOrders, userOrders } from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router()

// Admin features
orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)

orderRouter.post('/place', authUser, placeOrder)

// User features
orderRouter.post('/userorders', authUser, userOrders)
orderRouter.post('/userOrders', authUser, userOrders)

export default orderRouter;
