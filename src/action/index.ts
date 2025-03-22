'use server'

import { revalidateTag } from 'next/cache'
 
export const handleCreateProductAction =async (data: any) => {
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
export const handleUpdateProductAction =async ( updatedData: any) => {
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
export const handleDeleteProductAction =async ( id: any) => {
    const res = await fetch(`http://localhost:3000/products/api/`,{
        method: "DELETE",
        body: JSON.stringify(id),
        headers: {
           "Content-Type": "application/json",
          },
    })
    revalidateTag('delete-post')
    return await res.json()
}
export const handleSearchProduct  =async ( searchTerm: any) => {
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