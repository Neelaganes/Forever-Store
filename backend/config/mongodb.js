import mongoose from 'mongoose';

const connectDB = async () => {
    mongoose.connection.on('connected', () => {
        console.log('Connected to MongoDB');
    });

    const baseUri = process.env.MONGODB_URI ? process.env.MONGODB_URI.replace(/\/+$/, '') : '';
    const uri = baseUri.endsWith('/e-commerce') ? baseUri : `${baseUri}/e-commerce`;

    await mongoose.connect(uri, {
        maxPoolSize: Number(process.env.MONGODB_MAX_POOL_SIZE || 10),
        minPoolSize: Number(process.env.MONGODB_MIN_POOL_SIZE || 2),
        serverSelectionTimeoutMS: Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS || 10000),
    });
};

export default connectDB;
