import Product from "@/app/config/models/Product";
import connectDB from "@/app/config/mongoose";
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from 'next';



export async function POST(req: NextRequest) {
    await connectDB(); 
  
    try {
      // Lấy title từ body của yêu cầu
      const { title } = await req.json();
  
      if (!title) {
        return NextResponse.json({
          data: null,
          message: "Title is required"
        }, { status: 400 });
      }
  
      const products = await Product.find({
        title: { $regex: title, $options: 'i' } 
      });
  
      if (products.length === 0) {
        return NextResponse.json({
          data: null,
          message: "No products found"
        }, { status: 404 });
      }
  
      return NextResponse.json({
        data: products,
        message: "Success"
      }, { status: 200 });
    } catch (e) {
      console.log(e); 
      return NextResponse.json({
        data: null,
        message: "Error occurred"
      }, { status: 500 });
    }
  }


export async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Cho phép tất cả origin (dev mode)
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
