"use client";
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const GetProduct = () => {
  const [products, setProducts] = useState([]);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [allCategories, setAllCategories] = useState([]);
  const [openCategory, setOpenCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;
  const router = useRouter();

  // Fetch products
  const fetchProduct = async () => {
    try {
      const response = await axios.get('http://localhost:5005/api/customerproductslist');
      if (Array.isArray(response.data.getproduct)) {
        setProducts(response.data.getproduct);
        const categories = [...new Set(response.data.getproduct.map(product => product.category))];
        setAllCategories(categories);
      } else {
        console.error("Expected an array in 'getproduct' but got:", response.data.getproduct);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // Fetch company info
  const fetchCompanyInfo = async () => {
    try {
      const response = await axios.get('http://localhost:5005/info/companyInfo');
      if (Array.isArray(response.data) && response.data.length > 0) {
        setCompanyInfo(response.data[0]);
      } else {
        console.error("No company info found");
      }
    } catch (err) {
      console.error("Error fetching company info:", err);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchCompanyInfo();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryClick = (category) => {
    router.push(`/customer/customervisit?category=${category}`);
  };

  const toggleCategory = (category) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  const groupedProducts = () => {
    return products.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    }, {});
  };

  const groupedProductsData = groupedProducts();

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNextPage = () => {
    if ((currentPage + 1) * itemsPerPage < filteredProducts.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleProductClick = (productId) => {
    router.push(`/customer/customervisit?productId=${productId}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Modern Header with Glass Effect */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src="/logo123.png" alt="Company Logo" className="h-10" />
          </div>
          
          <div className="w-full max-w-lg mx-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search categories or products..."
                className="w-full p-3 pl-10 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 bg-gray-50"
              />
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
         
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        {/* Modern Category Sidebar */}
        <div className="w-full md:w-1/4 md:sticky md:top-24 md:self-start">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <h2 className="font-bold text-xl">Categories</h2>
            </div>
            
            <div className="divide-y divide-gray-100">
              {Object.keys(groupedProductsData).map((category, index) => (
                <div key={index} className="relative">
                  <button
                    className={`w-full text-left p-4 hover:bg-blue-50 transition-all duration-300 flex justify-between items-center ${openCategory === category ? 'bg-blue-50' : ''}`}
                    onClick={() => toggleCategory(category)}
                  >
                    <span className="font-medium">{category}</span>
                    <span
                      className={`transition-transform duration-300 text-blue-500 ${openCategory === category ? 'rotate-180' : ''}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </button>

                  {/* Category Products Dropdown with Animation */}
                  {openCategory === category && (
                    <div className="overflow-hidden transition-all duration-300 max-h-96">
                      <div className="bg-gray-50 p-2 space-y-2">
                        {groupedProductsData[category].map((product, productIndex) => (
                          <div
                            key={productIndex}
                            className="cursor-pointer p-3 bg-white rounded-lg hover:bg-blue-50 transition-all shadow-sm border border-gray-100"
                            onClick={() => handleCategoryClick(category)}
                          >
                            <p className="font-medium text-sm">{product.title}</p>
                            <p className="text-blue-600 font-semibold">₹{product.price.toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Content Area */}
        <div className="w-full md:w-3/4">
          {/* Featured Products Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">Featured Products</h1>
              
              <div className="flex space-x-2">
                <button
                  onClick={handlePrevPage}
                  className={`p-2 rounded-full ${currentPage === 0 ? 'text-gray-300 bg-gray-100' : 'text-white bg-blue-500 hover:bg-blue-600'} transition-all duration-200`}
                  disabled={currentPage === 0}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={handleNextPage}
                  className={`p-2 rounded-full ${(currentPage + 1) * itemsPerPage >= filteredProducts.length ? 'text-gray-300 bg-gray-100' : 'text-white bg-blue-500 hover:bg-blue-600'} transition-all duration-200`}
                  disabled={(currentPage + 1) * itemsPerPage >= filteredProducts.length}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Product Cards with Modern Design */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage).map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all duration-300 transform hover:scale-102"
                  onClick={() => handleProductClick(product._id)}
                >
                  <div className="relative">
                    <img
                      src={`http://localhost:5005/api/uploads/${product.productimage}`}
                      alt={product.title}
                      className="h-48 w-full object-cover"
                    />
                   
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-lg mb-1 line-clamp-1">{product.title}</h3>
                    <p className="text-gray-500 text-sm mb-2">{product.category}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-bold text-blue-600">
                        ₹{product.price.toLocaleString()}
                      </p>
                     
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Company Information Section with Modern Cards */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mb-12">
            <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <h2 className="text-2xl font-bold">Company Information</h2>
            </div>
            
            <div className="p-6">
              {/* About Us Section */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  About Us
                </h3>
                <p className="text-gray-600">{companyInfo?.aboutUs || "Loading about us information..."}</p>
              </div>

              {/* Basic Information Card */}
              <div className="mb-8 bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                    <path d="M10 4a1 1 0 011 1v4a1 1 0 01-1 1H6a1 1 0 110-2h3V5a1 1 0 011-1z" />
                  </svg>
                  Basic Information
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
                    <tbody className="bg-white divide-y divide-gray-100">
                      {companyInfo?.basicInformation && Object.entries(companyInfo.basicInformation).map(([key, value]) => (
                        <tr key={key} className="hover:bg-blue-50 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-gray-700">{key.replace(/([A-Z])/g, ' $1')}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Partners Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  Our Partners
                </h3>
                <div className="flex space-x-6 overflow-x-auto py-2">
                  {companyInfo?.partners?.map((logo, index) => (
                    <div key={index} className="flex-shrink-0 bg-white rounded-lg shadow-sm border border-gray-100 p-2 w-28 h-28">
                      <img
                        src={`http://localhost:5005/api/uploads/${logo.slice(10)}`}
                        alt={`Partner ${index}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Major Market & Export Countries in a Flex Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Major Market
                  </h3>
                  <p className="text-gray-600">{companyInfo?.majorMarket || "Loading major market information..."}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                    </svg>
                    Export Countries
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {companyInfo?.exportCountries?.map((country, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {country}
                      </span>
                    )) || <span className="text-gray-500">Loading export countries...</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* All Products Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text ">
              All Products
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="group bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300"
                  onClick={() => handleProductClick(product._id)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={`http://localhost:5005/api/uploads/${product.productimage}`}
                      alt={product.title}
                      className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-4 text-white">
                        <p className="font-bold">{product.title}</p>
                        <p className="text-sm">Click to view details</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-5"> {/* Increased padding from p-4 to p-5 */}
          <div className="flex justify-between mb-3"> {/* Increased margin-bottom */}
            <h3 className="font-medium text-l"> {/* Increased font size from text-lg and removed line-clamp-1 */}
              {product.title}
            </h3>
            <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">
              {product.category}
            </span>
          </div>
          <div className="flex justify-between items-center mt-2"> {/* Added margin-top */}
            <p className="text-lg font-bold text-blue-600">
              ₹{product.price.toLocaleString()}
            </p>
            <button className="text-sm px-3 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
              View
            </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modern Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-6 pt-12 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* About Company */}
            <div>
              <img src="/logo123.png" alt="Company Logo" className="h-10 mb-4 brightness-0 invert" />
              <p className="text-gray-300 mb-6">
                We are dedicated to providing high-quality products with exceptional service to meet all your needs.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="#" className="bg-blue-400 p-2 rounded-full hover:bg-blue-500 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a href="#" className="bg-red-600 p-2 rounded-full hover:bg-red-700 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                  </svg>
                </a>
              </div>
            </div>
            </div>
            </div>
</footer>
</div>
    );
}
export default GetProduct;
            