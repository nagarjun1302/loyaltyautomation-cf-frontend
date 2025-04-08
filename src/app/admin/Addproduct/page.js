"use client";

import { useState } from "react";
import axios from "axios";

const ProductRequest = () => {
  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    ProductBroucher: "",
    Productvideo: "",
    Brand: "",
    Usage: "",
    inputPhase: "",
    inputvoltage: "",
    ModelNumber: "",
    MotorRPM: "",
    MaximumTarancientcurrent: "",
    Emcfilter: "",
    Width: "",
    Transmissionframe: "",
    Motorpower: "",
    supplyfrequency: "",
    DiscreteoutputNo: "",
    productimage: "", // Added for image upload
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.category ||
      !product.ProductBroucher
    ) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    try {
      const formData = new FormData();
      for (const key in product) {
        formData.append(key, product[key]);
      }

      const response = await axios.post(
        "http://localhost:5005/api/productdetails",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      console.log(response.data);
      alert("Lead entry successfully submitted");

      setProduct({
        title: "",
        description: "",
        price: "",
        category: "",
        ProductBroucher: "",
        Productvideo: "",
        Brand: "",
        Usage: "",
        inputPhase: "",
        inputvoltage: "",
        ModelNumber: "",
        MotorRPM: "",
        MaximumTarancientcurrent: "",
        Emcfilter: "",
        Width: "",
        Transmissionframe: "",
        Motorpower: "",
        supplyfrequency: "",
        DiscreteoutputNo: "",
        productimage: "", // Reset image field
      });
    } catch (err) {
      console.log("Error submitting productdetails:", err);
      if (err.response) {
        alert(`Error: ${err.response.data.message}`);
      } else {
        alert("Something went wrong, please try again later.");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setProduct({
      ...product,
      [name]: files[0], // Store the first selected file
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-300">
      <div className="w-full max-w-4xl p-6 sm:p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-green-600">Product Request</h1>
        <form onSubmit={handleSubmit}>
          {errorMessage && <div className="text-red-600 text-center">{errorMessage}</div>}

          {/* Product fields */}
          <div className="flex flex-col space-y-4">
            <div>
              <label className="text-lg font-medium text-gray-700">PRODUCT NAME:</label>
              <input
                name="title"
                value={product.title}
                placeholder="Enter product name"
                onChange={handleChange}
                className="border p-2 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-green-400 w-full"
              />
            </div>

            <div>
              <label className="text-lg font-medium text-gray-700">PRODUCT DETAILS:</label>
              <textarea
                name="description"
                value={product.description}
                placeholder="Enter product details"
                onChange={handleChange}
                className="border p-2 rounded-md mt-1 h-32 focus:outline-none focus:ring-2 focus:ring-green-400 w-full"
              />
            </div>

            <div>
              <label className="text-lg font-medium text-gray-700">PRODUCT PRICE:</label>
              <input
                name="price"
                value={product.price}
                placeholder="Enter product price"
                onChange={handleChange}
                className="border p-2 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-green-400 w-full"
              />
            </div>

            <div>
              <label className="text-lg font-medium text-gray-700">PRODUCT CATEGORY:</label>
              <input
                name="category"
                value={product.category}
                placeholder="Enter product category"
                onChange={handleChange}
                className="border p-2 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-green-400 w-full"
              />
            </div>

            <div>
              <label className="text-lg font-medium text-gray-700">PRODUCT BROCHURE:</label>
              <input
                name="ProductBroucher"
                type="file"
                onChange={handleFileChange}
                className="border p-2 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-green-400 w-full"
              />
            </div>

            <div>
              <label className="text-lg font-medium text-gray-700">PRODUCT IMAGE:</label>
              <input
                name="productimage"
                type="file"
                onChange={handleFileChange}
                className="border p-2 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-green-400 w-full"
              />
            </div>

            <div>
              <label className="text-lg font-medium text-gray-700">PRODUCT VIDEO:</label>
              <input
                name="Productvideo"
                type="file"
                onChange={handleFileChange}
                className="border p-2 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-green-400 w-full"
              />
            </div>

            <div>
              <label className="text-lg font-medium text-gray-700">BRAND:</label>
              <input
                name="Brand"
                value={product.Brand}
                placeholder="Enter product brand"
                onChange={handleChange}
                className="border p-2 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-green-400 w-full"
              />
            </div>

            <div>
              <label className="text-lg font-medium text-gray-700">USAGE:</label>
              <input
                name="Usage"
                value={product.Usage}
                placeholder="Enter product usage"
                onChange={handleChange}
                className="border p-2 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-green-400 w-full"
              />
            </div>

            <div>
              <label className="text-lg font-medium text-gray-700">INPUT PHASE:</label>
              <input
                name="inputPhase"
                value={product.inputPhase}
                placeholder="Enter input phase"
                onChange={handleChange}
                className="border p-2 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-green-400 w-full"
              />
            </div>

            <div>
              <label className="text-lg font-medium text-gray-700">INPUT VOLTAGE:</label>
              <input
                name="inputvoltage"
                value={product.inputvoltage}
                placeholder="Enter input voltage"
                onChange={handleChange}
                className="border p-2 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-green-400 w-full"
              />
            </div>

            <div>
              <label className="text-lg font-medium text-gray-700">MODEL NUMBER:</label>
              <input
                name="ModelNumber"
                value={product.ModelNumber}
                placeholder="Enter model number"
                onChange={handleChange}
                className="border p-2 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-green-400 w-full"
              />
            </div>

            <div>
              <label className="text-lg font-medium text-gray-700">MOTOR RPM:</label>
              <input
                name="MotorRPM"
                value={product.MotorRPM}
                placeholder="Enter motor RPM"
                onChange={handleChange}
                className="border p-2 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-green-400 w-full"
              />
            </div>

            <div>
              <label className="text-lg font-medium text-gray-700">MAXIMUM CURRENT:</label>
              <input
                name="MaximumTarancientcurrent"
                value={product.MaximumTarancientcurrent}
                placeholder="Enter maximum current"
                onChange={handleChange}
                className="border p-2 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-green-400 w-full"
              />
            </div>

            <div>
              <label className="text-lg font-medium text-gray-700">EMC FILTER:</label>
              <input
                name="Emcfilter"
                value={product.Emcfilter}
                placeholder="Enter EMC filter"
                onChange={handleChange}
                className="border p-2 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-green-400 w-full"
              />
            </div>

            <div>
              <label className="text-lg font-medium text-gray-700">WIDTH:</label>
              <input
                name="Width"
                value={product.Width}
                placeholder="Enter width"
                onChange={handleChange}
                className="border p-2 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-green-400 w-full"
              />
            </div>

            <div>
              <label className="text-lg font-medium text-gray-700">TRANSMISSION FRAME:</label>
              <input
                name="Transmissionframe"
                value={product.Transmissionframe}
                placeholder="Enter transmission frame"
                onChange={handleChange}
                className="border p-2 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-green-400 w-full"
              />
            </div>

            <div>
              <label className="text-lg font-medium text-gray-700">MOTOR POWER:</label>
              <input
                name="Motorpower"
                value={product.Motorpower}
                placeholder="Enter motor power"
                onChange={handleChange}
                className="border p-2 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-green-400 w-full"
              />
            </div>

            <div>
              <label className="text-lg font-medium text-gray-700">SUPPLY FREQUENCY:</label>
              <input
                name="supplyfrequency"
                value={product.supplyfrequency}
                placeholder="Enter supply frequency"
                onChange={handleChange}
                className="border p-2 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-green-400 w-full"
              />
            </div>

            <div>
              <label className="text-lg font-medium text-gray-700">DISCRETE OUTPUT NUMBER:</label>
              <input
                name="DiscreteoutputNo"
                value={product.DiscreteoutputNo}
                placeholder="Enter discrete output number"
                onChange={handleChange}
                className="border p-2 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-green-400 w-full"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductRequest;
