import Link from 'next/link'
export default function Home() {
  return (
    <div className='flex items-center justify-center min-h-screen '>
     <Link className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600' href="/products">List Products</Link>
    </div>
  );
}
