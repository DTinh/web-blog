'use server'

import { revalidateTag } from 'next/cache'
 
interface ProductData {
    title: string;
    description: string;
    image: string; 
  }
export const handleCreateProductAction =async (data: ProductData) => {
    const res = await fetch('http://localhost:3000/products/api/',{
        method: "POST",
        body: JSON.stringify(data),
        headers: {
           "Content-Type": "application/json",
          },
    })
    revalidateTag('create-post')
    return await res.json()
}
export const handleUpdateProductAction =async ( updatedData: ProductData) => {
    const res = await fetch(`http://localhost:3000/products/api/`,{
        method: "PUT",
        body: JSON.stringify(updatedData),
        headers: {
           "Content-Type": "application/json",
          },
    })
    revalidateTag('update-post')
    return await res.json()
}
export const handleDeleteProductAction =async (  id: string ) => {
    const res = await fetch(`http://localhost:3000/products/api/`,{
        method: "DELETE",
        body: JSON.stringify({id}),
        headers: {
           "Content-Type": "application/json",
          },
    })
    revalidateTag('delete-post')
    return await res.json()
}
export const handleSearchProduct  =async ( searchTerm: string) => {
    const res = await fetch(`http://localhost:3000/products/api/search`,{
        method: "POST",
        body: JSON.stringify({ title: searchTerm }),
        headers: {
           "Content-Type": "application/json",
          },
    })
    revalidateTag('search-post')
    return await res.json()
}