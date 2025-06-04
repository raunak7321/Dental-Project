import React, { useState, useEffect } from "react";
import axios from "axios";

const FilesTab = () => {
  const [note, setNote] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileRecords, setFileRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all file records when component mounts
  useEffect(() => {
    fetchFileRecords();
  }, []);

  const fetchFileRecords = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/files/getfileUpload`
      );
      // Make sure we're always setting an array to fileRecords
      setFileRecords(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (err) {
      setError("Failed to load files");
      setLoading(false);
      console.error("Error fetching files:", err);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate file size and count
    const validFiles = files.filter((file) => file.size <= 500 * 1024); // 500KB

    if (validFiles.length > 5) {
      setError("Maximum 5 files allowed");
      setSelectedFiles(validFiles.slice(0, 5));
    } else if (files.length !== validFiles.length) {
      setError("Some files exceed the 500KB size limit");
      setSelectedFiles(validFiles);
    } else {
      setError("");
      setSelectedFiles(validFiles);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError("Please select at least one file");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("note", note);

    try {
      await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/files/fileUpload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Reset form and refresh file list
      setNote("");
      setSelectedFiles([]);
      fetchFileRecords();
      setLoading(false);
    } catch (err) {
      setError("Failed to upload files");
      setLoading(false);
      console.error("Upload error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      try {
        setLoading(true);
        await axios.delete(
          `${import.meta.env.VITE_APP_BASE_URL}/files/deletefileUploadBy/${id}`
        );
        fetchFileRecords();
        setLoading(false);
      } catch (err) {
        setError("Failed to delete file");
        setLoading(false);
        console.error("Delete error:", err);
      }
    }
  };  

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getFileType = (filename) => {
    return "File";
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Files</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="border rounded p-4">
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">
            Upload Files *
          </label>
          <div className="flex">
            <label className="cursor-pointer bg-gray-200 text-gray-700 px-4 py-2 rounded">
              Choose Files
              <input
                type="file"
                className="hidden"
                multiple
                onChange={handleFileChange}
                accept="image/*,video/*,.pdf,.doc,.docx"
              />
            </label>
            <span className="ml-2 py-2 text-gray-500">
              {selectedFiles.length
                ? `${selectedFiles.length} file(s) selected`
                : "No file chosen"}
            </span>
          </div>
          <div className="mt-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="text-sm text-gray-600">
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            * Max 5 files, 500KB each. Supported formats: Images, Videos, PDF,
            Word
          </p>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Note</label>
          <textarea
            className="w-full border rounded p-2 h-24"
            placeholder="Add notes about the files here..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={100}
          ></textarea>
          <p className="text-xs text-gray-500 mt-1">
            {100 - note.length} characters remaining
          </p>
        </div>

        <button
          className={`${
            loading ? "bg-blue-300" : "bg-blue-500"
          } text-white px-4 py-2 rounded`}
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      <div className="mt-6">
        <table className="w-full border">
          <thead className="bg-teal-500 text-white">
            <tr>
              <th className="text-left p-2">Date</th>
              <th className="text-left p-2">File Type</th>
              <th className="text-left p-2">Filename</th>
              <th className="text-left p-2">Notes</th>
              <th className="text-left p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : fileRecords.length > 0 ? (
              fileRecords.map((record) => (
                <tr key={record._id} className="border-t">
                  <td className="p-2">{formatDate(record.createdAt)}</td>
                  <td className="p-2">{getFileType(record.filename)}</td>
                  <td className="p-2">
                    <a
                      href={record.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {record.filename}
                    </a>
                  </td>
                  <td className="p-2">{record.note}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDelete(record._id)}
                      className="bg-red-500 text-white px-2 py-1 text-xs rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No Record Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FilesTab;
