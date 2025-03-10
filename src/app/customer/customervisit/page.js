"use client";
import axios from 'axios';
import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from 'next/navigation';

const GetProduct = () => {
  const [products, setProducts] = useState([]);
  const [groupedProducts, setGroupedProducts] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const categoryRefs = useRef({});
  const productRefs = useRef({});

  const router = useRouter();
  const searchParams = useSearchParams();

  const fetchProduct = async () => {
    try {
      const response = await axios.get('http://localhost:5005/api/customerproductslist');
      if (Array.isArray(response.data.getproduct)) {
        setProducts(response.data.getproduct);
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

  useEffect(() => {
    if (products.length > 0) {
      // Group the products by category
      const grouped = products.reduce((acc, product) => {
        if (!acc[product.category]) {
          acc[product.category] = [];
        }
        acc[product.category].push(product);
        return acc;
      }, {});
      setGroupedProducts(grouped);

      // Get the category from the URL query parameters
      const categoryFromUrl = searchParams.get('category');
      if (categoryFromUrl) {
        // If category exists in the URL, set it as the selected category
        setSelectedCategory(categoryFromUrl);
      } else if (searchQuery) {
        // If the user has typed a category in the search field, use that as the selected category
        setSelectedCategory(searchQuery);
      } else {
        // If no category in URL and no search query, default to the first category in the grouped products
        const firstCategory = Object.keys(grouped)[0];
        setSelectedCategory(firstCategory);
      }
    }
  }, [products, searchParams, searchQuery]);

  // Filter categories by searchQuery
  const filteredCategories = Object.keys(groupedProducts).filter((category) =>
    category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter products by searchQuery within selected category
  const filteredProducts = selectedCategory
    ? groupedProducts[selectedCategory].filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    router.push(`/customer/customervisit?category=${category}`);

    if (categoryRefs.current[category]) {
      categoryRefs.current[category].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleProductClick = (productId) => {
    if (productRefs.current[productId]) {
      productRefs.current[productId].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query on user input
          placeholder="Search for a category"
        />
      </div>

      <div className="flex space-x-6">
        <div className="w-1/4 p-6 mt-10 bg-gray-50 rounded-lg shadow-md">
          <h2 className="font-bold text-xl mb-4">Categories</h2>
          <div className="space-y-4">
            {filteredCategories.length === 0 ? (
              <p>No categories found</p>
            ) : (
              filteredCategories.map((category) => (
                <div
                  key={category}
                  className="cursor-pointer border-2 border-solid border-gray-300 rounded-md p-2 transition-transform hover:scale-105"
                  onClick={() => handleCategoryClick(category)}
                  ref={(el) => (categoryRefs.current[category] = el)}
                >
                  <h5 className="font-semibold text-center">{category}</h5>
                  <ul className="w-full p-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {groupedProducts[category]?.map((product) => (
                      <li
                        key={product._id}
                        className="border-2 border-gray-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductClick(product._id);
                        }}
                      >
                        {product.title}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="w-3/4 p-6 bg-gray-50 rounded-lg shadow-md">
          {selectedCategory && groupedProducts[selectedCategory]?.length > 0 ? (
            <div ref={(el) => (categoryRefs.current[selectedCategory] = el)}>
              <h1 className="text-blue-800 font-bold text-3xl mb-6">{selectedCategory}</h1>
              <div className="flex flex-wrap gap-6">
                {filteredProducts.length === 0 ? (
                  <p>No products available in this category</p>
                ) : (
                  filteredProducts.map((product) => (
                    <div
                      key={product._id}
                      className="w-48 h-64 bg-gray-500 border-2 border-gray-300 rounded-lg shadow-lg"
                      ref={(el) => (productRefs.current[product._id] = el)}
                      onClick={() => handleProductClick(product._id)}
                    >
                      <img
                        src={`http://localhost:5005/api/uploads/${product.productimage}`}
                        alt={product.title}
                        className="h-44 object-cover rounded-md mb-3"
                      />
                      <h2 className="font-semibold text-lg pl-2">{product.title}</h2>
                      <p className="text-xl pl-2 font-semibold text-gray-800">
                        ₹{product.price.toLocaleString()}<span className="text-gray-500">/piece</span>
                      </p>
                    </div>
                  ))
                )}
              </div>

              {filteredProducts.length === 0 ? (
                <p>No products available in this category</p>
              ) : (
                filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    ref={(el) => (productRefs.current[product._id] = el)}
                    className="m-7 flex flex-row bg-gray-200 border-2 border-gray-300 rounded-lg p-3 w-auto"
                  >
                    {product.productimage ? (
                      <div className="flex bg-gray-200 border-2 border-gray-300 rounded-lg w-1/3 pr-3">
                        <div className="flex flex-col w-20 h-20 m-5 space-y-2">
                          {[product.productimage, product.productimage, product.productimage, product.productimage].map(
                            (image, index) => (
                              <img
                                key={index}
                                className="border-1 border-solid"
                                src={`http://localhost:5005/api/uploads/${image}`}
                                alt={product.title}
                              />
                            )
                          )}
                        </div>
                        <div className="border-2 border-solid w-60 h-80 mt-5">
                          <img
                            className="w-auto h-80"
                            src={`http://localhost:5005/api/uploads/${product.productimage}`}
                            alt={product.title}
                          />
                        </div>
                      </div>
                    ) : (
                      <div>No Image Available</div>
                    )}
                    <div className="flex flex-col pl-20 w-2/3">
                      <div>
                        <h2 className="font-mono font-bold text-3xl">{product.title}</h2>
                        <p className="font-bold">
                          Price: ₹{product.price.toLocaleString()}
                          <span className="text-gray-300">/piece</span>
                        </p>

                        <p className="text-sm font-semibold text-gray-700">Category: {product.category}</p>

                        <a
                          className="text-red-700 underline underline-offset-2"
                          href={`http://localhost:5005/api/uploads/${product.ProductBroucher}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Product Brochure
                        </a>

                        <a
                          className="pl-6 text-red-700 underline underline-offset-2"
                          href={`http://localhost:5005/api/uploads/${product.Productvideo}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Product Video
                        </a>
                      </div>

                      <div>
                        <table className="flex flex-row">
                          <thead>
                            <tr className="flex flex-col w-64">
                              <th className="border-2 border-solid p-2">Usage</th>
                              <th className="border-2 border-solid p-2">Input Phase</th>
                              <th className="border-2 border-solid p-2">Input Voltage</th>
                              <th className="border-2 border-solid p-2">Model Number</th>
                              <th className="border-2 border-solid p-2">Motor RPM</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="flex flex-col w-64">
                              <td className="border-2 border-solid p-2">{product.Usage}</td>
                              <td className="border-2 border-solid p-2">{product.inputPhase}</td>
                              <td className="border-2 border-solid p-2">{product.inputvoltage}</td>
                              <td className="border-2 border-solid p-2">{product.ModelNumber}</td>
                              <td className="border-2 border-solid p-2">{product.MotorRPM}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="m-6">
                        <p className="font-bold">
                          Product Details: <span className="text-gray-700">{product.description}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <p>No products available in this category</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GetProduct;
