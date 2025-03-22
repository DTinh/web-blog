import Product from "@/app/config/models/Product";
import Post from "@/app/config/models/Product";
import connectDB from "@/app/config/mongoose";
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from 'next';

export async function POST(req: NextRequest){
    await connectDB();

    try {
        const {title, description, image} = await req.json()
        const existed = await Post.findOne({title})
        if(!existed){
            const newProduct = await Post.create({title, description, image})
            return NextResponse.json({
                data: newProduct,
                message: "Success"
            },{status: 200, statusText: "Create"})
        }
        return NextResponse.json({
            data: null,
            message: "The post existed"
        },{status: 400, statusText: "Invalide"})
    } catch (e) {
        return NextResponse.json({
            data: null,
            message: "Error"
        },{status: 400, statusText: "Failed"})
        console.log(e);
        
    }

    
}

export async function GET(req: NextRequest){
    await connectDB();
    try {
        const limit = req.nextUrl.searchParams.get('limit') ?? 2;
        const page = req.nextUrl.searchParams.get('page') ?? 2;
        const totalPosts = await Post.countDocuments(); 
        const totalPage = Math.ceil(totalPosts / +limit)
        const allPost = await Post.find().sort({ createdAt: -1 }).skip((+page - 1) * +limit).limit(+limit);
        return NextResponse.json({
            data: allPost,
            meta: {
                totalPage,
                totalCount: totalPosts
            },
            message: "Get all post success"
        },{status: 200})
    } catch (e) {
        return NextResponse.json({
            data: null,
            message: "Error"
        },{status: 400, statusText: "Failed"})
        console.log(e);
    }
}
export async function PUT(req: NextRequest) {
    await connectDB();
    try {
        const { id, title, description, image } = await req.json();

        if (!id) {
            return NextResponse.json({
                data: null,
                message: "Product ID is required"
            }, { status: 400, statusText: "Failed" });
        }

        const product = await Product.findById(id);

        if (!product) {
            return NextResponse.json({
                data: null,
                message: "The product does not exist"
            }, { status: 400, statusText: "Failed" });
        }

        const existedTitle = await Product.findOne({ title, _id: { $ne: id } });
        if (!existedTitle) {
            const updated = await Product.findByIdAndUpdate(id, { title, description, image }, { new: true });
            return NextResponse.json({
                data: updated,
                message: "Success"
            }, { status: 200 });
        }

        return NextResponse.json({
            data: null,
            message: "The title product already exists"
        }, { status: 400, statusText: "Invalid" });

    } catch (e) {
        console.log(e);
        return NextResponse.json({
            data: null,
            message: "Error occurred"
        }, { status: 500, statusText: "Failed" });
    }
}
export async function DELETE(req: NextRequest){
    await connectDB();
    try {
        const { id } = await req.json();
        const product = await Product.findById(id);

        if(!product){
            return NextResponse.json({
                data: null,
                message: "The product is not exist"
            },{status: 400, statusText: "Failed"})
        }
                    const deletedProduct =  await Product.findByIdAndDelete(id)
                    return NextResponse.json({
                        data: deletedProduct,
                        message: "Success"
                    },{status: 200})
       
    } catch (e) {
        return NextResponse.json({
            data: null,
            message: "Error"
        },{status: 500, statusText: "Failed"})
        console.log(e);
    }
}


export async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    // Xử lý preflight request của CORS
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json([{ id: 1, title: 'Product 1' }]);
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
