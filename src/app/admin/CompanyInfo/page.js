"use client";
import { useState } from 'react';
import axios from 'axios';

const CompanyForm = () => {
  const [formData, setFormData] = useState({
    annualTurnover: '',
    legalStatus: '',
    gstRegistrationDate: '',
    numberOfEmployees: '',
    companyCEO: '',
    natureOfBusiness: '',
    majorMarket: '',
    aboutUs: '',
    additionalBusiness: '',
    team: '',
    tradeMarket: '',
    exportCountries: '',
  });

  const [files, setFiles] = useState([]);
  const [filePreview, setFilePreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [fileError, setFileError] = useState("");

  const handleFileChange = (e) => {
    const newSelectedFiles = Array.from(e.target.files);
    
    // Check if adding these new files would exceed the limit
    if (files.length + newSelectedFiles.length > 5) {
      setFileError(`You can only upload a maximum of 5 images. You already have ${files.length} images.`);
      return;
    }
    
    setFileError(""); // Clear error if within the limit
    
    // Add new files to existing files
    const updatedFiles = [...files, ...newSelectedFiles];
    setFiles(updatedFiles);
    
    // Create previews for newly selected images
    const newPreviews = newSelectedFiles.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file)
    }));
    
    // Add new previews to existing previews
    setFilePreview([...filePreview, ...newPreviews]);
    
    // Reset file input
    e.target.value = '';
  };

  const removeFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);

    const updatedPreviews = [...filePreview];
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(updatedPreviews[index].url);
    updatedPreviews.splice(index, 1);
    setFilePreview(updatedPreviews);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData();

    // Append form data fields
    for (let key in formData) {
      form.append(key, formData[key]);
    }

    // Append files to form data
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        form.append('partners', files[i]);
      }
    }

    try {
      const response = await axios.post('http://localhost:5005/info/companyInfo', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage({ type: 'success', text: response.data.message });
      setLoading(false);
      
      // Clean up file previews
      filePreview.forEach(preview => URL.revokeObjectURL(preview.url));
      
      // Reset form
      setFormData({
        annualTurnover: '',
        legalStatus: '',
        gstRegistrationDate: '',
        numberOfEmployees: '',
        companyCEO: '',
        natureOfBusiness: '',
        majorMarket: '',
        aboutUs: '',
        additionalBusiness: '',
        team: '',
        tradeMarket: '',
        exportCountries: '',
      });
      setFiles([]);
      setFilePreview([]);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'An error occurred during submission'
      });
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-lg">
      <h1 className="text-3xl font-semibold text-center text-indigo-600 mb-6">Company Information</h1>

      {message && (
        <div className={`mb-4 p-4 rounded-lg text-white ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {message.text}
        </div>
      )}

      {fileError && (
        <div className="mb-4 p-4 rounded-lg text-white bg-red-500">
          {fileError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Annual Turnover */}
        <div className="flex flex-col">
          <label htmlFor="annualTurnover" className="font-medium text-lg">Annual Turnover</label>
          <input
            type="text"
            id="annualTurnover"
            name="annualTurnover"
            value={formData.annualTurnover}
            onChange={handleChange}
            className="mt-2 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Legal Status */}
        <div className="flex flex-col">
          <label htmlFor="legalStatus" className="font-medium text-lg">Legal Status</label>
          <input
            type="text"
            id="legalStatus"
            name="legalStatus"
            value={formData.legalStatus}
            onChange={handleChange}
            className="mt-2 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* GST Registration Date */}
        <div className="flex flex-col">
          <label htmlFor="gstRegistrationDate" className="font-medium text-lg">GST Registration Date</label>
          <input
            type="text"
            id="gstRegistrationDate"
            name="gstRegistrationDate"
            value={formData.gstRegistrationDate}
            onChange={handleChange}
            className="mt-2 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Number of Employees */}
        <div className="flex flex-col">
          <label htmlFor="numberOfEmployees" className="font-medium text-lg">Number of Employees</label>
          <input
            type="number"
            id="numberOfEmployees"
            name="numberOfEmployees"
            value={formData.numberOfEmployees}
            onChange={handleChange}
            className="mt-2 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Company CEO */}
        <div className="flex flex-col">
          <label htmlFor="companyCEO" className="font-medium text-lg">Company CEO</label>
          <input
            type="text"
            id="companyCEO"
            name="companyCEO"
            value={formData.companyCEO}
            onChange={handleChange}
            className="mt-2 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Nature of Business */}
        <div className="flex flex-col">
          <label htmlFor="natureOfBusiness" className="font-medium text-lg">Nature of Business</label>
          <input
            type="text"
            id="natureOfBusiness"
            name="natureOfBusiness"
            value={formData.natureOfBusiness}
            onChange={handleChange}
            className="mt-2 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Major Market */}
        <div className="flex flex-col">
          <label htmlFor="majorMarket" className="font-medium text-lg">Major Market</label>
          <input
            type="text"
            id="majorMarket"
            name="majorMarket"
            value={formData.majorMarket}
            onChange={handleChange}
            className="mt-2 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* About Us */}
        <div className="flex flex-col">
          <label htmlFor="aboutUs" className="font-medium text-lg">About Us</label>
          <textarea
            id="aboutUs"
            name="aboutUs"
            value={formData.aboutUs}
            onChange={handleChange}
            className="mt-2 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Additional Business */}
        <div className="flex flex-col">
          <label htmlFor="additionalBusiness" className="font-medium text-lg">Additional Business</label>
          <textarea
            id="additionalBusiness"
            name="additionalBusiness"
            value={formData.additionalBusiness}
            onChange={handleChange}
            className="mt-2 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Team */}
        <div className="flex flex-col">
          <label htmlFor="team" className="font-medium text-lg">Team</label>
          <textarea
            id="team"
            name="team"
            value={formData.team}
            onChange={handleChange}
            className="mt-2 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Trade Market */}
        <div className="flex flex-col">
          <label htmlFor="tradeMarket" className="font-medium text-lg">Trade Market</label>
          <input
            type="text"
            id="tradeMarket"
            name="tradeMarket"
            value={formData.tradeMarket}
            onChange={handleChange}
            className="mt-2 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Export Countries */}
        <div className="flex flex-col">
          <label htmlFor="exportCountries" className="font-medium text-lg">Export Countries (comma separated)</label>
          <input
            type="text"
            id="exportCountries"
            name="exportCountries"
            value={formData.exportCountries}
            onChange={handleChange}
            className="mt-2 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* File Upload - Enhanced Multiple Image Upload with Incremental Addition */}
        <div className="flex flex-col">
          <label className="font-medium text-lg">Partners Images (Upload up to 5 images)</label>
          <div className="mt-2 p-3 border border-gray-300 rounded-md">
            <div className="flex items-center">
              <input
                type="file"
                id="partners"
                name="partners"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className={`ml-2 px-3 py-1 rounded-md font-medium text-sm ${
                files.length >= 5 ? 'bg-gray-300 text-gray-500' : 'bg-indigo-100 text-indigo-700'
              }`}>
                {files.length}/5
              </div>
            </div>
            
            {/* Image preview section */}
            {filePreview.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Selected images:</p>
                <div className="flex flex-wrap gap-4">
                  {filePreview.map((file, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={file.url} 
                        alt={`Preview ${index}`} 
                        className="h-24 w-24 object-cover rounded-md border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                      <p className="text-xs mt-1 text-center truncate w-24">{file.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Click "Choose File" to add more images. {files.length < 5 ? `You can add ${5 - files.length} more.` : "Maximum limit reached."}
          </p>
          <p className="text-sm text-gray-500">
            Allowed file types: JPG, PNG, GIF
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || fileError}
          className={`mt-6 w-full py-3 font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            loading || fileError
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default CompanyForm;