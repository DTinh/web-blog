import Product from "@/app/config/models/Product";
import connectDB from "@/app/config/mongoose";
import { NextRequest, NextResponse } from "next/server";
const allowedOrigins = ["https://list-products-lilac.vercel.app", "http://localhost:3000"];

export function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": allowedOrigins.join(","),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Content-Type",
    }
  });
}
const connect = connectDB();

export async function POST(req: NextRequest) {
    await connect; 
  
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


