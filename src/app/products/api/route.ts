import Product from "@/app/config/models/Product";
import connectDB from "@/app/config/mongoose";
import { NextRequest, NextResponse } from "next/server";

// Cấu hình CORS
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

// Thực hiện kết nối cơ sở dữ liệu 1 lần duy nhất (tối ưu hóa)
let isConnected = false;
const connect = async () => {
  if (isConnected) return;
  await connectDB();
  isConnected = true;
};

export async function POST(req: NextRequest) {
  await connect(); // Chỉ kết nối 1 lần

  try {
    const { title, description, image } = await req.json();
    const existed = await Product.findOne({ title });

    if (!existed) {
      const newProduct = await Product.create({ title, description, image });
      return NextResponse.json({ data: newProduct, message: "Success" }, { status: 200 });
    }

    return NextResponse.json({ data: null, message: "The post existed" }, { status: 400 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ data: null, message: "Error" }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  await connect();

  try {
    const limit = req.nextUrl.searchParams.get('limit') ?? 2;
    const page = req.nextUrl.searchParams.get('page') ?? 1;
    const totalPosts = await Product.countDocuments();
    const totalPage = Math.ceil(totalPosts / +limit);
    const allPost = await Product.find()
      .sort({ createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit);

    return NextResponse.json({
      data: allPost,
      meta: { totalPage, totalCount: totalPosts },
      message: "Get all post success"
    }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ data: null, message: "Error" }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  await connect(); 

  try {
    const { id, title, description, image } = await req.json();
    if (!id) return NextResponse.json({ message: "Product ID is required" }, { status: 400 });

    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ message: "The product does not exist" }, { status: 400 });

    const existedTitle = await Product.findOne({ title, _id: { $ne: id } });
    if (!existedTitle) {
      const updated = await Product.findByIdAndUpdate(id, { title, description, image }, { new: true });
      return NextResponse.json({ data: updated, message: "Success" }, { status: 200 });
    }

    return NextResponse.json({ message: "The title product already exists" }, { status: 400 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Error occurred" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await connect(); 

  try {
    const { id } = await req.json();
    const product = await Product.findById(id);

    if (!product) return NextResponse.json({ message: "The product is not exist" }, { status: 400 });

    const deletedProduct = await Product.findByIdAndDelete(id);
    return NextResponse.json({ data: deletedProduct, message: "Success" }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
