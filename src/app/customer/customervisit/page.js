"use client";
import axios from 'axios';
import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from 'next/navigation';

const GetProduct = () => {
  const [products, setProducts] = useState([]);
  const [groupedProducts, setGroupedProducts] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
    quantity: 1,
    additionalRequirements: '',
    companyName: '',
    gstNumber: '',
  });
  const [step, setStep] = useState(1);

  const categoryRefs = useRef({});
  const productRefs = useRef({});

  const router = useRouter();
  const searchParams = useSearchParams();

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:5005/api/customerproductslist`);
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
        setSelectedCategory(categoryFromUrl);
      } else if (searchQuery) {
        setSelectedCategory(searchQuery);
      } else {
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {  
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5005/api/submit", {
        customerInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          description: formData.description,
        },
        productInfo: {
          quantity: formData.quantity,
          additionalRequirements: formData.additionalRequirements,
          companyName: formData.companyName,
          gstNumber: formData.gstNumber,
        },
        product: {
          title: selectedProduct.title,
          price: selectedProduct.price,
          productimage: selectedProduct.productimage,
          description: selectedProduct.description,
        },
      });
      alert("Submission successful!");
      setSelectedProduct(null);
    } catch (err) {
      console.error("Error submitting data:", err);
      alert("Error saving data.");
    }
  };

  const handleInterestedClick = (product) => {
    setSelectedProduct(product);
    setStep(1); 
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with search */}
      <div className="sticky top-0 bg-white z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4">
            <div className="flex items-center justify-center sm:justify-start w-full sm:w-auto mb-4 sm:mb-0">
              <img src="/logo123.png" alt="Company Logo" className="h-10 mr-4" />
            </div>
            <div className="w-full sm:w-auto sm:flex-1 sm:flex justify-center">
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search categories or products..."
                  className="w-full pl-4 pr-10 py-3 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 focus:outline-none transition-all"
                />
                <div className="absolute right-3 top-3 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Categories sidebar */}
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-bold text-xl mb-6 text-gray-800">Categories</h2>
              <div className="space-y-3">
                {filteredCategories.length === 0 ? (
                  <p className="text-gray-500">No categories found</p>
                ) : (
                  filteredCategories.map((category) => (
                    <div key={category} className="mb-4">
                      <div
                        className={`cursor-pointer p-3 rounded-lg transition-all hover:bg-blue-50 ${
                          selectedCategory === category ? "bg-blue-50 border-l-4 border-blue-600" : ""
                        }`}
                        onClick={() => handleCategoryClick(category)}
                        ref={(el) => (categoryRefs.current[category] = el)}
                      >
                        <h5 className={`font-medium ${selectedCategory === category ? "text-blue-600" : "text-gray-700"}`}>
                          {category}
                        </h5>
                      </div>

                      {/* Dropdown Products */}
                      {selectedCategory === category && groupedProducts[category] && (
                        <div className="ml-4 mt-2 space-y-1">
                          {groupedProducts[category]?.map((product) => (
                            <div
                              key={product._id}
                              className="cursor-pointer p-2 text-sm rounded-md hover:bg-gray-100 transition-all"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleProductClick(product._id);
                              }}
                            >
                              <p className="text-gray-600">{product.title}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Product display area */}
          <div className="w-full md:w-3/4">
            {selectedCategory && groupedProducts[selectedCategory]?.length > 0 ? (
              <div ref={(el) => (categoryRefs.current[selectedCategory] = el)}>
                <h1 className="text-2xl font-bold mb-6 text-gray-800">{selectedCategory}</h1>
                
                {/* Product cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                  {filteredProducts.length === 0 ? (
                    <p className="text-gray-500">No products available in this category</p>
                  ) : (
                    filteredProducts.map((product) => (
                      <div
                        key={product._id}
                        className="bg-white rounded-xl shadow-sm overflow-hidden transition-transform hover:shadow-md hover:-translate-y-1"
                        ref={(el) => (productRefs.current[product._id] = el)}
                      >
                        <div className="h-48 overflow-hidden">
                          <img
                            src={`http://localhost:5005/api/uploads/${product.productimage}`}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h2 className="font-semibold text-lg text-gray-800 mb-2">{product.title}</h2>
                          <p className="text-xl font-bold text-blue-600 mb-3">
                            ₹{product.price.toLocaleString()}<span className="text-gray-400 text-sm ml-1">/piece</span>
                          </p>
                          <button
                            onClick={() => handleInterestedClick(product)}
                            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {/* Product details expanded view */}
                {filteredProducts.length > 0 && (
                  <div className="space-y-8">
                    {filteredProducts.map((product) => (
                      <div
                        key={`detail-${product._id}`}
                        className="bg-white rounded-xl shadow-sm overflow-hidden"
                        ref={(el) => (productRefs.current[product._id] = el)}
                      >
                        <div className="flex flex-col md:flex-row">
                          {/* Product images */}
                          <div className="w-full md:w-2/5 p-6">
                            <div className="flex gap-4">
                              <div className="hidden md:flex flex-col gap-2 w-1/5">
                                {[...Array(4)].map((_, index) => (
                                  <div key={index} className="border border-gray-200 rounded-md overflow-hidden">
                                    <img
                                      className="h-16 w-full object-cover"
                                      src={`http://localhost:5005/api/uploads/${product.productimage}`}
                                      alt={`${product.title} view ${index + 1}`}
                                    />
                                  </div>
                                ))}
                              </div>
                              <div className="w-full md:w-4/5 rounded-lg overflow-hidden border border-gray-200">
                                <img
                                  className="w-full h-64 md:h-96 object-contain"
                                  src={`http://localhost:5005/api/uploads/${product.productimage}`}
                                  alt={product.title}
                                />
                              </div>
                            </div>
                          </div>
                          
                          {/* Product info */}
                          <div className="w-full md:w-3/5 p-6 flex flex-col">
                            <div className="mb-4">
                              <h2 className="text-2xl font-bold text-gray-800 mb-2">{product.title}</h2>
                              <p className="text-xl font-bold text-blue-600 mb-1">
                                ₹{product.price.toLocaleString()}
                                <span className="text-gray-400 text-sm ml-1">/piece</span>
                              </p>
                              <p className="text-sm text-gray-600 mb-4">Category: {product.category}</p>
                              
                              <div className="flex gap-4 mb-6">
                                <a
                                  className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                                  href={`http://localhost:5005/api/uploads/${product.ProductBroucher}`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                  </svg>
                                  Product Brochure
                                </a>
                                
                                <a
                                  className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                                  href={`http://localhost:5005/api/uploads/${product.Productvideo}`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Watch Video
                                </a>
                              </div>
                            </div>
                            
                            {/* Specifications */}
                            <div className="mb-6">
                              <h3 className="font-medium text-gray-800 mb-2">Specifications</h3>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <p className="text-xs text-gray-500">Usage</p>
                                  <p className="text-sm font-medium">{product.Usage || "N/A"}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <p className="text-xs text-gray-500">Input Phase</p>
                                  <p className="text-sm font-medium">{product.inputPhase || "N/A"}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <p className="text-xs text-gray-500">Input Voltage</p>
                                  <p className="text-sm font-medium">{product.inputvoltage || "N/A"}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <p className="text-xs text-gray-500">Model Number</p>
                                  <p className="text-sm font-medium">{product.ModelNumber || "N/A"}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <p className="text-xs text-gray-500">Motor RPM</p>
                                  <p className="text-sm font-medium">{product.MotorRPM || "N/A"}</p>
                                </div>
                              </div>
                            </div>
                            
                            {/* Description */}
                            <div className="mb-6">
                              <h3 className="font-medium text-gray-800 mb-2">Product Details</h3>
                              <p className="text-gray-600 text-sm">{product.description}</p>
                            </div>
                            
                            {/* Call to action */}
                            <div className="mt-auto">
                              <button
                                onClick={() => handleInterestedClick(product)}
                                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium flex items-center justify-center"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                I'm Interested
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow-sm p-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p className="text-gray-500">No products available in this category</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Details Form (Modal) */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-white bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 max-h-[90vh] overflow-auto animate-fadeIn mx-4">
            {/* Progress indicator */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {step === 1 && "Your Details"}
                {step === 2 && "Select Quantity"}
                {step === 3 && "Additional Requirements"}
                {step === 4 && "Company Information"}
                {step === 5 && "Review & Submit"}
              </h2>
              <button 
                onClick={() => setSelectedProduct(null)} 
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Step progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-in-out" 
                style={{ width: `${(step / 5) * 100}%` }}
              ></div>
            </div>

            {/* Step 1: Customer Info */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    required
                  />
                </div>
                
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    required
                  />
                </div>
                
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (123) 456-7890"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    required
                  />
                </div>
                
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Tell us about your requirements"
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 2: Quantity */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-center py-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-100 shadow-sm mb-4">
                      <img 
                        src={`http://localhost:5005/api/uploads/${selectedProduct.productimage}`}
                        alt={selectedProduct.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">{selectedProduct.title}</h3>
                    <p className="text-blue-600 font-medium">₹{selectedProduct.price.toLocaleString()}/piece</p>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <div className="flex rounded-lg overflow-hidden border border-gray-300">
                    <button 
                      type="button" 
                      onClick={() => setFormData({ ...formData, quantity: Math.max(1, formData.quantity - 1) })}
                      className="px-4 py-3 bg-gray-50 text-gray-700 hover:bg-gray-100 focus:outline-none transition-colors font-medium"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                      min="1"
                      className="w-full p-2 text-center focus:outline-none"
                      required
                    />
                    <button 
                      type="button" 
                      onClick={() => setFormData({ ...formData, quantity: formData.quantity + 1 })}
                      className="px-4 py-3 bg-gray-50 text-gray-700 hover:bg-gray-100 focus:outline-none transition-colors font-medium"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Additional Requirements */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">Additional Requirements</label>
                  <textarea
                    name="additionalRequirements"
                    value={formData.additionalRequirements}
                    onChange={(e) => setFormData({ ...formData, additionalRequirements: e.target.value })}
                    placeholder="Special instructions, customization requests, or other requirements"
                    rows="6"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                  />
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <span className="font-medium">Note:</span> Additional requirements may affect pricing and delivery time. We'll discuss details after submission.
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Company Info */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="ABC Corporation"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">GST Number</label>
                  <input
                    type="text"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                    placeholder="22AAAAA0000A1Z5"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    Business information helps us prepare proper invoices and documentation.
                  </p>
                </div>
              </div>
            )}

            {/* Step 5: Review */}
            {step === 5 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700">Product Details</h3>
                  <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                    <img 
                      src={`http://localhost:5005/api/uploads/${selectedProduct.productimage}`}
                      alt={selectedProduct.title}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div>
                      <h4 className="font-semibold">{selectedProduct.title}</h4>
                      <p className="text-gray-600 text-sm">₹{selectedProduct.price.toLocaleString()} × {formData.quantity}</p>
                      <p className="font-bold text-blue-600">Total: ₹{(selectedProduct.price * formData.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <h3 className="font-medium text-gray-700 mt-4">Contact Information</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{formData.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{formData.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{formData.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="font-medium">{formData.companyName || "Not specified"}</p>
                </div>
              </div>
            </div>
            
            {formData.additionalRequirements && (
              <div>
                <h3 className="font-medium text-gray-700">Additional Requirements</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm">{formData.additionalRequirements}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Next steps:</span> After submission, our team will contact you within 24 hours to discuss your requirements.
            </p>
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="mt-8 space-y-3">
        {step === 5 ? (
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            Submit Inquiry
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Next
          </button>
        )}
        
        {step > 1 && (
          <button
            onClick={handlePrev}
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Prev
          </button>
        )}
        
       
        
      </div>
    </div>
</div>
)}
    </div>
  );
}
export default GetProduct;
