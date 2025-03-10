"use client";
import axios from 'axios';
import { useEffect, useState, useRef } from "react";

const GetProduct = () => {
  const [products, setProducts] = useState([]);
  const [groupedProducts, setGroupedProducts] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

 

  const fetchProduct = async () => {
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
      }
    } catch (err) {
      console.error("I got the error", err);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const grouped = products.reduce((acc, product) => {
        if (!acc[product.category]) {
          acc[product.category] = [];
        }
        acc[product.category].push(product);
        return acc;
      }, {});
      setGroupedProducts(grouped);

      const firstCategory = Object.keys(grouped)[0];
      setSelectedCategory(firstCategory);
    }
  }, [products]);

  

  
 

  return (
    <div>
      
    </div>
  );
};

export default GetProduct;
