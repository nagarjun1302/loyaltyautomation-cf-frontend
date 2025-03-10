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
      
      const response = await axios.post(
        "http://localhost:5005/api/productdetails",
        product,
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
    <div>
      <form onSubmit={handleSubmit}>
        <label>PRODUCT NAME:</label>
        <input
          name="title"
          value={product.title}
          placeholder="Enter product name"
          onChange={handleChange}
        />

        <label>PRODUCT DETAILS:</label>
        <input
          type="textarea"
          name="description"
          value={product.description}
          placeholder="Enter product details"
          onChange={handleChange}
        />

        <label>PRODUCT PRICE:</label>
        <input
          name="price"
          value={product.price}
          placeholder="Enter product price"
          onChange={handleChange}
        />

        <label>PRODUCT CATEGORY:</label>
        <input
          name="category"
          value={product.category}
          placeholder="Enter product category"
          onChange={handleChange}
        />

        <label>PRODUCT BROCHURE:</label>
        <input
          name="ProductBroucher"
          type="file"
          onChange={handleFileChange}
        />
          <label>PRODUCT IMAGE:</label>
        <input
          name="productimage"
          type="file"
          onChange={handleFileChange}
        />
        <label>BRAND:</label>
        <input
          name="Brand"
          value={product.Brand}
          placeholder="Enter product brand"
          onChange={handleChange}
        />

        <label>USAGE:</label>
        <input
          name="Usage"
          value={product.Usage}
          placeholder="Enter product usage"
          onChange={handleChange}
        />

        <label>INPUT PHASE:</label>
        <input
          name="inputPhase"
          value={product.inputPhase}
          placeholder="Enter input phase"
          onChange={handleChange}
        />

        <label>INPUT VOLTAGE:</label>
        <input
          name="inputvoltage"
          value={product.inputvoltage}
          placeholder="Enter input voltage"
          onChange={handleChange}
        />

        <label>MODEL NUMBER:</label>
        <input
          name="ModelNumber"
          value={product.ModelNumber}
          placeholder="Enter model number"
          onChange={handleChange}
        />

        <label>MOTOR RPM:</label>
        <input
          name="MotorRPM"
          value={product.MotorRPM}
          placeholder="Enter motor RPM"
          onChange={handleChange}
        />

        <label>MAXIMUM TRANSCURRENT:</label>
        <input
          name="MaximumTarancientcurrent"
          value={product.MaximumTarancientcurrent}
          placeholder="Enter maximum current"
          onChange={handleChange}
        />

        <label>EMC FILTER:</label>
        <input
          name="Emcfilter"
          value={product.Emcfilter}
          placeholder="Enter EMC filter"
          onChange={handleChange}
        />

        <label>WIDTH:</label>
        <input
          name="Width"
          value={product.Width}
          placeholder="Enter width"
          onChange={handleChange}
        />

        <label>TRANSMISSION FRAME:</label>
        <input
          name="Transmissionframe"
          value={product.Transmissionframe}
          placeholder="Enter transmission frame"
          onChange={handleChange}
        />

        <label>MOTOR POWER:</label>
        <input
          name="Motorpower"
          value={product.Motorpower}
          placeholder="Enter motor power"
          onChange={handleChange}
        />

        <label>SUPPLY FREQUENCY:</label>
        <input
          name="supplyfrequency"
          value={product.supplyfrequency}
          placeholder="Enter supply frequency"
          onChange={handleChange}
        />

        <label>DISCRETE OUTPUT NUMBER:</label>
        <input
          name="DiscreteoutputNo"
          value={product.DiscreteoutputNo}
          placeholder="Enter discrete output number"
          onChange={handleChange}
        />

        <button type="submit">Submit</button>

        {errorMessage && <div>{errorMessage}</div>}
      </form>
    </div>
  );
};

export default ProductRequest;
