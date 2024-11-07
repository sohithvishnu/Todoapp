import mongoose from 'mongoose';
import { MONGO_URI } from '$env/static/private';

const DB_URI = MONGO_URI;  // Replace with your MongoDB URI

let isConnected = false;

export const connectToDB = async () => {
    if (isConnected) return;

    try {
        // Remove the deprecated options
        await mongoose.connect(DB_URI);
        isConnected = true;
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB', err);
    }
};
