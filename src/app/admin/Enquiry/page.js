"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get("http://localhost:5005/api/submissions", {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });
        setSubmissions(response.data);
      } catch (err) {
        setError("Error fetching submissions.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  if (loading) {
    return <div className="text-center text-xl text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 text-xl">{error}</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-indigo-300">
      <div className="w-full max-w-6xl p-8 bg-white rounded-2xl shadow-lg">
        <h1 className="text-3xl sm:text-4xl font-semibold text-center text-indigo-600 mb-8">
          Submissions
        </h1>

        {submissions.length === 0 ? (
          <p className="text-center text-lg text-gray-500">No submissions found.</p>
        ) : (
          <ul className="space-y-8">
            {submissions.map((submission) => (
              <li
                key={submission._id}
                className="border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105 bg-white"
              >
                <h3 className="text-xl sm:text-2xl font-semibold text-indigo-700">
                  {submission.product.title}
                </h3>
                <p className="text-lg text-gray-700 mt-2">{submission.product.description}</p>

                <div className="mt-4 space-y-2">
                  <p className="text-gray-600">
                    <strong className="font-semibold">Customer:</strong> {submission.customerInfo.name}
                  </p>
                  <p className="text-gray-600">
                    <strong className="font-semibold">Email:</strong> {submission.customerInfo.email}
                  </p>
                  <p className="text-gray-600">
                    <strong className="font-semibold">Phone:</strong> {submission.customerInfo.phone}
                  </p>
                  <p className="text-gray-600">
                    <strong className="font-semibold">Quantity:</strong> {submission.productInfo.quantity}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Submissions;
