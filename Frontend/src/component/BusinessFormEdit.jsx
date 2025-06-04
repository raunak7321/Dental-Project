import React, { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";
import { toast } from "react-toastify";

const BusinessEditForm = ({
  setShowEditForm,
  showEditForm,
  businessData,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    businessName: "",
    address: "",
    contact: "",
    licenseNumber: "",
    financialYear: "",
    businessPhoto: { url: "", public_id: "" },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileToUpload, setFileToUpload] = useState(null);

  useEffect(() => {
    if (businessData) {
      setFormData({
        businessName: businessData.businessName || "",
        address: businessData.address || "",
        contact: businessData.contact || "",
        licenseNumber: businessData.licenseNumber || "",
        financialYear: businessData.financialYear || "",
        businessPhoto: businessData.businessPhoto || { url: "", public_id: "" },
      });

      if (businessData.businessPhoto?.url) {
        setPreviewImage(businessData.businessPhoto.url);
      }
    }
  }, [businessData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileToUpload(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      console.log("Updating business with ID:", businessData._id);

      let updatedFormData = new FormData();

      // Append all text fields
      for (const key in formData) {
        if (key !== "businessPhoto") {
          updatedFormData.append(key, formData[key]);
        }
      }

      // Append existing photo data if not changed
      if (!fileToUpload && formData.businessPhoto?.url) {
        updatedFormData.append(
          "businessPhoto[url]",
          formData.businessPhoto.url
        );
        updatedFormData.append(
          "businessPhoto[public_id]",
          formData.businessPhoto.public_id
        );
      }

      // Append new file if selected
      if (fileToUpload) {
        updatedFormData.append("businessPhotoFile", fileToUpload);
      }

      await axios.put(
        `${import.meta.env.VITE_APP_BASE_URL}/business/updatebusiness/${
          businessData._id
        }`,
        updatedFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Business updated successfully!");
      onUpdate();
      setShowEditForm(false);
    } catch (error) {
      console.error("Update error details:", error.response || error);
      toast.error(`Update failed: ${error.message || "Try again"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showEditForm) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-xl font-bold text-teal-900">Edit Business</h2>
            <button
              onClick={() => setShowEditForm(false)}
              className="p-1 hover:bg-gray-200 rounded-full"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="businessName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Business Name
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="contact"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Contact
                </label>
                <input
                  type="tel"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="licenseNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  License Number
                </label>
                <input
                  type="text"
                  id="licenseNumber"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="financialYear"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Financial Year
                </label>
                <input
                  type="text"
                  id="financialYear"
                  name="financialYear"
                  value={formData.financialYear}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="businessPhoto"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Business Photo
                </label>
                <div className="flex flex-col items-center">
                  {previewImage && (
                    <div className="mb-2">
                      <img
                        src={previewImage}
                        alt="Business preview"
                        className="h-32 w-auto object-contain"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    id="businessPhoto"
                    name="businessPhoto"
                    onChange={handleFileChange}
                    className="w-full border rounded-md p-2"
                    accept="image/*"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => setShowEditForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Business"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BusinessEditForm;
