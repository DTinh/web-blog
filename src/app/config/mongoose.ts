import mongoose from "mongoose";


const connectDB = async() => {
    try {
        mongoose.connect(`${process.env.MONGO_DB}`)
        console.log('Connect DB success');
        
    } catch (e) {
        console.log('connect db failed', e);
        
    }
}

export default connectDB;