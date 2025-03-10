"use client";
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const GetProduct = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [allCategories, setAllCategories] = useState([]);
  const [openCategory, setOpenCategory] = useState(null); // Track open category dropdowns
  const router = useRouter();

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

  useEffect(() => {
    fetchProduct();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryClick = (category) => {
    router.push(`/customer/customervisit?category=${category}`);
  };

  const toggleCategory = (category) => {
    if (openCategory === category) {
      setOpenCategory(null); // Close dropdown if already open
    } else {
      setOpenCategory(category); // Open dropdown for selected category
    }
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

  return (
    <div>
      <div className="ml-80 mr-20 mt-20">
        <h1 className="pl-40 bg-amber-500 text-5xl">Welcome to the loyalty product site.</h1>
      </div>

      <div className="ml-80 mt-8">
      <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search categories or products..."
          className="border-2 border-gray-300 p-2 rounded-md"
        />
        
        {searchQuery && (
          <ul>
            {allCategories.filter(category => category.toLowerCase().includes(searchQuery.toLowerCase())).map((category, index) => (
              <li key={index} 
                  className="cursor-pointer text-blue-500 hover:underline"
                  onClick={() => handleCategoryClick(category)}>
                {category}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-row">
        <div className="flex w-6xl">
          <div className="w-1/4 p-6 mt-10 bg-amber-100 rounded-lg shadow-md">
            <h2 className="font-bold text-xl mb-4">Categories</h2>
            <div className="space-y-4">
              {Object.keys(groupedProductsData).map((category, index) => (
                <div key={index} className="cursor-pointer">
                  <button
                    className="w-full text-left bg-amber-200 p-2 rounded-md mb-2 hover:bg-amber-300 flex items-center justify-between"
                    onClick={() => toggleCategory(category)}
                  >
                    {category} 
                    <span
                      className={`transform transition-transform ${openCategory === category ? 'rotate-180' : ''}`}
                    >
                      ▼
                    </span>
                  </button>

                  {/* Dropdown for each category */}
                  {openCategory === category && (
                    <div className="bg-gray-100 border rounded-lg p-2 space-y-2">
                      {groupedProductsData[category].map((product, productIndex) => (
                        <div
                          key={productIndex}
                          className="cursor-pointer border-2 border-solid border-gray-300 rounded-md p-2 hover:scale-105"
                          onClick={() => handleCategoryClick(category)}
                        >
                          <p className="font-semibold">{product.title}</p>
                          <p>₹{product.price.toLocaleString()} /piece</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap w-3/4 mt-10 ml-4">
          {filteredProducts.map(product => (
            <div
              key={product._id}
              className="w-48 h-64 m-2 bg-gray-500 border-2 border-gray-300 rounded-lg shadow-lg"
            >
              <img
                src={`http://localhost:5005/api/uploads/${product.productimage}`}
                alt={product.title}
                className="h-44 object-cover rounded-md mb-3"
              />
              <h2 className="font-semibold text-lg pl-2">{product.title}</h2>
              <p className="text-xl pl-2 font-semibold text-gray-800">
                ₹{product.price.toLocaleString()} <span className="text-gray-500">/piece</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GetProduct;
