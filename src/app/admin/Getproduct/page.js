"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const GetProduct = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editProductId, setEditProductId] = useState(null);
  const [editableProductData, setEditableProductData] = useState({});

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    setLoading(true);
    setError("");
    setProducts([]);

    try {
      const response = await axios.get('http://localhost:5005/api/getproductslist', {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (Array.isArray(response.data.getproducts)) {
        setProducts(response.data.getproducts);
      } else {
        console.error("Expected an array in 'getproducts' but got:", response.data.getproducts);
        setError("Failed to fetch products.");
      }
    } catch (err) {
      console.error("Error fetching data", err);
      setError("Failed to fetch data from the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (productId) => {
    setEditProductId(productId);
    const product = products.find((prod) => prod._id === productId);
    setEditableProductData({ ...product });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5005/api/update/${editProductId}`,
        editableProductData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        setProducts(products.map((product) =>
          product._id === editProductId ? { ...product, ...editableProductData } : product
        ));
        alert("Product updated successfully.");
        setEditProductId(null);
      }
    } catch (err) {
      console.error("Error saving the product", err);
      setError("Failed to update the product.");
    }
  };

  const handleCancel = () => {
    setEditProductId(null);
  };

  const handleDelete = async (productId) => {
    try {
      const response = await axios.delete(`http://localhost:5005/api/delete/${productId}`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setProducts(products.filter(product => product._id !== productId));
        alert("Product deleted successfully.");
      }
    } catch (err) {
      console.error("Error deleting product", err);
      setError("Failed to delete the product.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-indigo-300">
      <div className="w-full max-w-7xl p-8 space-y-8 bg-white rounded-xl shadow-2xl">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl sm:text-4xl font-semibold text-center text-indigo-600">Product List</h1>
        </div>

        {loading && <p className="text-center text-indigo-600">Loading...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        {products.length > 0 ? (
          <div className="space-y-6">
            {products.map((product) => (
              <div key={product._id} className="w-full p-4 sm:p-6 md:w-1/2 lg:w-full xl:w-full">
                <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
                  {editProductId === product._id ? (
                    <>
                      <div>
                        <label className="block font-medium">Product Name</label>
                        <input
                          type="text"
                          name="title"
                          value={editableProductData.title || ""}
                          onChange={handleInputChange}
                          className="w-full border-gray-300 rounded-lg p-2"
                        />
                      </div>
                      <div>
                        <label className="block font-medium">Description</label>
                        <textarea
                          name="description"
                          value={editableProductData.description || ""}
                          onChange={handleInputChange}
                          className="w-full border-gray-300 rounded-lg p-2"
                        />
                      </div>
                      <div>
                        <label className="block font-medium">Category</label>
                        <input
                          type="text"
                          name="category"
                          value={editableProductData.category || ""}
                          onChange={handleInputChange}
                          className="w-full border-gray-300 rounded-lg p-2"
                        />
                      </div>
                      <div>
                        <label className="block font-medium">Price</label>
                        <input
                          type="number"
                          name="price"
                          value={editableProductData.price || ""}
                          onChange={handleInputChange}
                          className="w-full border-gray-300 rounded-lg p-2"
                        />
                      </div>

                      {/* New fields */}
                      <div>
                        <label className="block font-medium">Product Brochure</label>
                        <input
                          type="file"
                          name="ProductBroucher"
                          onChange={handleInputChange}
                          className="w-full border-gray-300 rounded-lg p-2"
                        />
                      </div>
                      <div>
                        <label className="block font-medium">Product Image</label>
                        <input
                          type="file"
                          name="productimage"
                          onChange={handleInputChange}
                          className="w-full border-gray-300 rounded-lg p-2"
                        />
                      </div>
                      <div>
                        <label className="block font-medium">Product Video</label>
                        <input
                          type="file"
                          name="Productvideo"
                          onChange={handleInputChange}
                          className="w-full border-gray-300 rounded-lg p-2"
                        />
                      </div>
                      <div>
                        <label className="block font-medium">Brand</label>
                        <input
                          type="text"
                          name="Brand"
                          value={editableProductData.Brand || ""}
                          onChange={handleInputChange}
                          className="w-full border-gray-300 rounded-lg p-2"
                        />
                      </div>
                      <div>
                        <label className="block font-medium">Usage</label>
                        <input
                          type="text"
                          name="Usage"
                          value={editableProductData.Usage || ""}
                          onChange={handleInputChange}
                          className="w-full border-gray-300 rounded-lg p-2"
                        />
                      </div>
                      <div>
                        <label className="block font-medium">Input Phase</label>
                        <input
                          type="text"
                          name="inputPhase"
                          value={editableProductData.inputPhase || ""}
                          onChange={handleInputChange}
                          className="w-full border-gray-300 rounded-lg p-2"
                        />
                      </div>
                      <div>
                        <label className="block font-medium">Input Voltage</label>
                        <input
                          type="text"
                          name="inputvoltage"
                          value={editableProductData.inputvoltage || ""}
                          onChange={handleInputChange}
                          className="w-full border-gray-300 rounded-lg p-2"
                        />
                      </div>
                      <div>
                        <label className="block font-medium">Model Number</label>
                        <input
                          type="text"
                          name="ModelNumber"
                          value={editableProductData.ModelNumber || ""}
                          onChange={handleInputChange}
                          className="w-full border-gray-300 rounded-lg p-2"
                        />
                      </div>
                      <div>
                        <label className="block font-medium">Motor RPM</label>
                        <input
                          type="text"
                          name="MotorRPM"
                          value={editableProductData.MotorRPM || ""}
                          onChange={handleInputChange}
                          className="w-full border-gray-300 rounded-lg p-2"
                        />
                      </div>

                      {/* Other additional fields */}
                    </>
                  ) : (
                    <>
                      <div><strong>Product Name:</strong> {product.title || "Not Available"}</div>
                      <div><strong>Description:</strong> {product.description || "Not Available"}</div>
                      <div><strong>Category:</strong> {product.category || "Not Available"}</div>
                      <div><strong>Price:</strong> ${product.price || "Not Available"}</div>
                      <div><strong>Product Image:</strong> {product.productimage || "Not Available"}</div>
                      <div><strong>Product Brochure:</strong> {product.ProductBroucher || "Not Available"}</div>
                    </>
                  )}

                  <div className="flex space-x-2 mt-4">
                    {editProductId === product._id ? (
                      <>
                        <button
                          onClick={handleSave}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(product._id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No products found</p>
        )}
      </div>
    </div>
  );
};

export default GetProduct;
