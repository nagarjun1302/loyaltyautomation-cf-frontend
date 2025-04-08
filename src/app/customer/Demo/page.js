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
    } catch (err) {
      console.error("Error submitting data:", err);
      alert("Error saving data.");
    }
  };

  const handleInterestedClick = (product) => {
    setSelectedProduct(product);
    setStep(1); // Reset the form steps when a product is clicked
  };

  return (
    <div className="sticky top-0 bg-white z-50 shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-center p-4">
        <div className="flex items-center justify-center sm:justify-start w-full sm:w-auto mb-4 sm:mb-0">
          <img src="/logo123.png" alt="Company Logo" className="h-10 mr-4" />
        </div>
        <div className="w-full sm:w-auto sm:flex-1 sm:flex justify-center">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search categories or products..."
            className="border-2 border-gray-700 p-3 rounded-md bg-white w-full sm:w-96"
          />
        </div>
      </div>

      <div className="flex space-x-6">
  <div className="w-1/4 p-6 mt-10 bg-gray-50 rounded-lg shadow-md">
    <h2 className="font-bold text-xl mb-4">Categories</h2>
    <div className="space-y-4">
      {filteredCategories.length === 0 ? (
        <p>No categories found</p>
      ) : (
        filteredCategories.map((category) => (
          <div key={category}>
            <div
              className="cursor-pointer border-2 border-solid border-gray-300 rounded-md p-2 transition-transform hover:scale-105"
              onClick={() => handleCategoryClick(category)}
              ref={(el) => (categoryRefs.current[category] = el)}
            >
              <h5 className="font-semibold text-center">{category}</h5>
            </div>

            {/* Dropdown Options */}
            {groupedProducts[category] && (
              <ul className="w-full p-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                {groupedProducts[category]?.map((product) => (
                  <li
                    key={product._id}
                    className="cursor-pointer border-2 border-gray-300 p-2 hover:bg-blue-100 rounded-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(product._id);
                    }}
                  >
                    {product.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))
      )}
    </div>
  </div>


      {/* Right Section - Product Display */}
<div className="w-3/4 p-6 bg-gray-50 rounded-lg shadow-md">
  {selectedCategory && groupedProducts[selectedCategory]?.length > 0 ? (
    <div ref={(el) => (categoryRefs.current[selectedCategory] = el)}>
      <h1 className="text-blue-800 font-bold text-3xl mb-6">{selectedCategory}</h1>
      {/* Flex container to display products in a row */}
      <div className="flex flex-row justify-start gap-6 overflow-x-auto"> {/* Line to change */}
        {filteredProducts.length === 0 ? (
          <p>No products available in this category</p>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product._id}
              className="w-48 h-64 bg-white-500 border-2 border-gray-300 rounded-lg shadow-lg flex flex-col"
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
      {selectedCategory && groupedProducts[selectedCategory]?.length > 0 ? (
            <div ref={(el) => (categoryRefs.current[selectedCategory] = el)}>
              <div className="flex flex-wrap gap-6">
                {filteredProducts.length === 0 ? (
                  <p>No products available in this category</p>
                ) : (
                  filteredProducts.map((product) => (
                    <div
                      key={product._id}
                      className="m-7 flex flex-row border-2 border-gray-300 rounded-lg p-3 w-auto"
                      ref={(el) => (productRefs.current[product._id] = el)}
                    >
                      {product.productimage ? (
                        <div className="flex border-2 border-gray-300 rounded-lg w-1/3 pr-3">
                          <div className="flex flex-col w-20 h-20 m-5 space-y-2">
                            {[product.productimage, product.productimage, product.productimage, product.productimage].map(
                              (image, index) => (
                                <img
                                  key={index}
                                  className="border-2 border-gray-300 "
                                  src={`http://localhost:5005/api/uploads/${image}`}
                                  alt={product.title}
                                />
                              )
                            )}
                          </div>
                          <div className="border-2 border-gray-300  w-60 h-80 mt-5">
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
                                <th className="border-2 border-gray-300 p-2 ">Usage</th>
                                <th className="border-2 border-gray-300 p-2">Input Phase</th>
                                <th className="border-2 border-gray-300 p-2">Input Voltage</th>
                                <th className="border-2 border-gray-300 p-2">Model Number</th>
                                <th className="border-2 border-gray-300 p-2">Motor RPM</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="flex flex-col w-64">
                                <td className="border-2 border-gray-300  p-2">{product.Usage}</td>
                                <td className="border-2 border-gray-300  p-2">{product.inputPhase}</td>
                                <td className="border-2 border-gray-300  p-2">{product.inputvoltage}</td>
                                <td className="border-2 border-gray-300  p-2">{product.ModelNumber}</td>
                                <td className="border-2 border-gray-300  p-2">{product.MotorRPM}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="m-6">
                          <p className="font-bold">
                            Product Details: <span className="text-gray-700">{product.description}</span>
                          </p>
                        </div>

                        {/* Yes, I'm Interested Button */}
                        <button
                          onClick={() => handleInterestedClick(product)} // Open the modal form
                          className="mt-4 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                        >
                          Yes, I'm Interested
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <p>No products available in this category</p>
          )}
    </div>
  ) : (
    <p>No products available in this category</p>
  )}
</div>


  

         
      </div>

   {/* Product Details Form (Modal) */}
{selectedProduct && (
<div className="fixed inset-0 bg-white bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
    <div className="bg-white rounded-xl shadow-2xl w-[450px] p-8 max-h-[90vh] overflow-auto animate-fadeIn">
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
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
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
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center text-center">
              <img 
                src={`http://localhost:5005/api/uploads/${selectedProduct.productimage}`}
                alt={selectedProduct.title}
                className="w-32 h-32 object-cover rounded-lg mb-4 border-2 border-gray-200"
              />
              <h3 className="text-lg font-semibold">{selectedProduct.title}</h3>
              <p className="text-blue-600 font-medium">₹{selectedProduct.price.toLocaleString()}/piece</p>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <div className="flex rounded-lg overflow-hidden border border-gray-300">
              <button 
                type="button" 
                onClick={() => setFormData({ ...formData, quantity: Math.max(1, formData.quantity - 1) })}
                className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none"
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
                className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none"
              >
                +
              </button>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-700">Estimated Total: <span className="font-bold text-blue-600">₹{(selectedProduct.price * formData.quantity).toLocaleString()}</span></p>
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
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <h4 className="font-semibold">{selectedProduct.title}</h4>
                <p className="text-gray-600">₹{selectedProduct.price.toLocaleString()} × {formData.quantity}</p>
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
