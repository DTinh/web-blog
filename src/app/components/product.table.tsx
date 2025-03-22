'use client';
import { useState } from "react";
import { TProduct } from "../products/page";
import Image from 'next/image';
import ModalUpdate from "./product.update";
import { message, Popconfirm } from "antd";
import { handleDeleteProductAction } from "@/action";
interface TProps {
    fetchListProduct: () => void;
    listProduct: { data: TProduct[]; totalPage: number };
    params: { page: number; limit: number }; 
    setParams: React.Dispatch<React.SetStateAction<{ page: number; limit: number }>>;
  }


const TableProduct = (props: TProps) => {
    const [isOpenModalUpdate, setIsOpenModalUpdate] = useState(false);
    const {listProduct, params, setParams, fetchListProduct } = props;
    const [dataUpdate, setDataUpdate] = useState<TProduct | null>(null);

    const handleUpdate = (data: TProduct) => {
      setIsOpenModalUpdate(true);
      setDataUpdate(data);
    }
    const handleDelete = async (data: TProduct) => {
        const res = await handleDeleteProductAction(String(data._id));
        if(res?.message === "Success"){
          message.success("Delete success")
          fetchListProduct();
      }
    }
    return (
        <div className="text-black mt-10">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
                <tr>
                <th className="w-1/4 border px-4 py-2">Title</th>
                <th className="w-1/4 border px-4 py-2">Description</th>
                <th className="w-1/4 border px-4 py-2">Image</th>
                <th className="w-1/4 border px-4 py-2">Action</th>
                </tr>
            </thead>
            <tbody>
            {listProduct.data.map((product) => (
                <tr key={product._id}>
                <td className="border px-4 py-2">{product.title}</td>
                <td className="border px-4 py-2">{product.description}</td>
                <td className="border px-4 py-2 flex justify-center">
                    {/* <img className="w-10 h-10" src={product.image} alt="" /> */}
                    <Image
                    src={product.image}
                    alt="Image description"
                    width={50}
                    height={50}
                  />
                </td>
                <td className="border px-4 py-2">
                    <button 
                    className="ml-10 mr-10"><i style={{fontSize: '25px'}} className="fa fa-pencil text-yellow-500"
                    onClick={() => handleUpdate(product)}
                    ></i></button>
                    <Popconfirm
                  placement='leftTop'
                  title={'Confirm product deletiont'}
                  description={'Do you accept product deletion?'}
                  onConfirm={() => handleDelete(product)}
                  okText="Xac nhan"
                  cancelText='Huy'
                >
                    <button><i style={{fontSize: '25px'}}  className="fa fa-trash text-red-500"></i></button>
                    </Popconfirm>
                </td>
                </tr>
            ))}
            </tbody>
            </table>
            <div  className="flex items-center justify-center gap-2 mt-3">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                disabled= {params.page === 1}
              onClick={() => {
                setParams({
                  ...params,
                  page: params.page - 1
                })
              }}>Previous</button>
              <div>Current page: {params.page}</div>
              <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                disabled= {params.page === listProduct.totalPage}
              onClick={() => {
                setParams({
                  ...params,
                  page: params.page + 1
                })
              }}>Next</button>
          </div>
          {dataUpdate ? (
            <ModalUpdate
              isOpenModalUpdate={isOpenModalUpdate}
              setIsOpenModalUpdate={setIsOpenModalUpdate}
              dataUpdate={dataUpdate}
              fetchListProduct={fetchListProduct}
            />
          ) : (
            <p>Loading...</p>  
          )}
        </div>
    );
};

export default TableProduct;