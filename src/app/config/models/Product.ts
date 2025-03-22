import mongoose from "mongoose";


const ProductSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
}, {timestamps: true})

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema)
export default Product;