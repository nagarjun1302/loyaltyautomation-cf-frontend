"use client";
import { useRouter } from 'next/navigation';

const Dasboard = () => {
  const router = useRouter();

  const productListdetails = () => {
    try {
      router.push('/admin/Addproduct');
    } catch (err) {
      console.log('Cannot go to the link', err);
    }
  };

  const getproduct = () => {
    try {
      router.push('/admin/Getproduct');
    } catch (err) {
      console.log('Cannot go to the link', err);
    }
  };

  const Enquiries = () => {
    try {
      router.push('/admin/Enquiry');
    } catch (err) {
      console.log('Cannot go to the link', err);
    }
  };

  const companyInfo = () => {
    try {
      router.push('/admin/CompanyInfo');
    } catch (err) {
      console.log('Cannot go to the link', err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-300">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold text-center text-green-600">Dashboard</h1>
        <div className="space-y-4">
          <button
            onClick={productListdetails}
            className="w-full py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Add Product
          </button>

          <button
            onClick={getproduct}
            className="w-full py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Get Product
          </button>

          <button
            onClick={Enquiries}
            className="w-full py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Enquiries
          </button>

          <button
            onClick={companyInfo}
            className="w-full py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Company Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dasboard;
