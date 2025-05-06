'use client'
import { useEffect, useState } from 'react';
import TableProduct from '../components/product.table';
import ModalCreate from '../components/product.create';
import { handleSearchProduct } from '@/action';
import { message } from 'antd';

export interface TProduct{
  title: string,
  description: string,
  image: string,
  _id: string
}


export default function ListProduct() {
  const [listProduct, setListProduct] = useState<{data: TProduct[], totalPage: number}>({data: [], totalPage: 0});
  const [params, setParams] = useState({
    page: 1,
    limit: 4,
  })
  const [isOpenModalCreate, setIsOpenModalCreate] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const fetchListProduct = async () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/api/?limit=${params.limit}&page=${params.page}`).then((res) => res.json().then((data) => {
      setListProduct({
        data: data.data,
        totalPage: data.meta.totalPage
      })
    }));
  }
  useEffect(() => {
    fetchListProduct();
  }, [params.page])
  
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchListProduct(); // Hiển thị lại danh sách ban đầu nếu ô tìm kiếm trống
      return;
    }
    const res = await handleSearchProduct(searchTerm);
    if (res?.message === "Success") {
      setListProduct({
        data: res.data.slice(0, params.limit), // Lấy số lượng sản phẩm theo giới hạn `limit`
        totalPage: Math.ceil(res.data.length / params.limit), // Tính tổng số trang
      });
    } else {
      message.error(res.message);
    }
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch();
    }, 500); 

    return () => clearTimeout(delayDebounceFn); // Xóa timeout nếu searchTerm thay đổi trước khi timeout hoàn thành
  }, [searchTerm]);

      return(
        <div className='container mx-auto w-[1200px]'>
          <div className='content-container bg-white mt-12'>
          <span className="text-black text-2xl">List Products</span>
              <div className='header-content flex justify-around'>
                <div className='search-box flex relative '>
                <input
                  type="text"
                  placeholder="Search..."
                  className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm} 
                  onChange={handleChange} 
                />
                {/* <i className="fa fa-search absolute right-2 top-1/2 transform -translate-y-1/2 text-black  cursor-pointer" style={{fontSize: "25px"}} 
                onClick={() => handleSearch()}
                ></i> */}
                </div>
                <button className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
                onClick={() => setIsOpenModalCreate(true)}
                >Add new Product</button>
            </div>
          </div>
           <TableProduct
           listProduct={listProduct}
           params={params}
           setParams={setParams}
           fetchListProduct={searchTerm.trim() ? handleSearch : fetchListProduct} // Gọi đúng hàm khi phân trang
           />
           <ModalCreate
           isOpenModalCreate={isOpenModalCreate}
           setIsOpenModalCreate={setIsOpenModalCreate}
           fetchListProduct={fetchListProduct}
           />
        </div>
      )
  }
