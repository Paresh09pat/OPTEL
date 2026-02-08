import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "../utils/constant";
import { toast } from "react-toastify";
import Loader from "../components/loading/Loader";

const CreateAlbum = () => {
  const navigate = useNavigate();
  const [albumName, setAlbumName] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Calculate total size of selected files
  const getTotalSize = () => {
    const totalBytes = selectedFiles.reduce((acc, file) => acc + file.size, 0);
    return (totalBytes / (1024 * 1024)).toFixed(2); // Convert to MB
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!albumName.trim()) {
      toast.error("Please enter album name");
      return;
    }

    if (selectedFiles.length === 0) {
      toast.error("Please select at least one photo");
      return;
    }

    // Calculate total size of all selected files
    const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0);
    const totalSizeInMB = totalSize / (1024 * 1024); // Convert bytes to MB

    // Check if total size exceeds 2MB
    if (totalSizeInMB > 2) {
      toast.error(`Total image size should be less than 2MB. Current size: ${totalSizeInMB.toFixed(2)}MB`);
      return;
    }

    try {
      const accessToken = localStorage.getItem("access_token");
      const formData = new FormData();

      formData.append("album_name", albumName);

      // Add all selected files to postPhotos array
      selectedFiles.forEach((file, index) => {
        console.log("file", file);
        formData.append("images[]", file);
      });

      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/create-album`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            Accept: "application/json",
          },
          body: formData,
        }
      );

      const data = await response.json();
    
      if (data.ok === true) {
        setAlbumName("");
        setSelectedFiles([]);
        toast.success("Album created successfully!");
      } else {
        toast.error("Failed to create album: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error creating album:", error);
      toast.error("Error creating album. Please try again.");
    }
    finally {
      setLoading(false)
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="bg-[#EDF6F9] w-full min-h-screen flex items-center justify-start flex-col">
        {/* Sticky Header */}
        <div className="w-full h-[98px] sticky pt-8 top-0 z-10 bg-[#EDF6F9]">
          <div className="flex items-center justify-between h-full px-4 md:px-7 flex-wrap gap-4">
            <h1 className="text-2xl font-bold text-[#212121]">My Albums</h1>
            <div className="flex gap-4 items-center">
              <button 
                onClick={() => navigate(-1)}
                className="border border-[#808080] py-1.5 px-4 rounded-2xl flex items-center gap-2 text-[#808080] text-base font-medium cursor-pointer hover:bg-gray-100 transition"
              >
                Back to Albums
              </button>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="w-[95%] md:w-[90%] max-w-6xl bg-white flex flex-col gap-6 rounded-xl my-6 shadow-md overflow-hidden">
          {/* Hero Banner */}
          <div className="relative h-64 flex items-start justify-end px-8 md:px-16">
            {/* Wave SVG */}
            <img src="/Vectorgroup.svg" alt="vector" className='absolute bottom-0 right-0 top-0 w-full' />
            <h2 className="text-xl md:text-2xl font-bold text-white z-10 pt-6">Create Album</h2>
          </div>

          <form
            className="w-full max-w-3xl mx-auto flex flex-col gap-6 p-4 md:p-8 pb-12"
            onSubmit={handleSubmit}
          >
            {/* Album Name */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="album-name"
                className="text-base text-gray-600 font-medium"
              >
                Album Name
              </label>
              <input
                type="text"
                id="album-name"
                className="w-full p-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter Album Name"
                value={albumName}
                onChange={(e) => setAlbumName(e.target.value)}
                required
              />
              <p className="text-sm text-gray-400">Your album title</p>
            </div>

            {/* Select Media */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="album-media"
                className="text-base text-gray-600 font-medium"
              >
                Select Photos
              </label>

              <input
                type="file"
                id="album-media"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />

              <label
                htmlFor="album-media"
                className="w-full min-h-[200px] border border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer text-[#555] p-4 hover:border-blue-500 transition-colors"
              >
                {selectedFiles.length === 0 ? (
                  <>
                    <img
                      src="/icons/selectAlbum.png"
                      alt="upload"
                      className="w-14 h-14 opacity-70"
                    />
                    <span className="font-medium text-sm">
                      Select photos
                    </span>
                  </>
                ) : (
                  <div className="flex flex-wrap justify-center gap-4 w-full">
                    {selectedFiles.map((file, index) => {
                      const fileURL = URL.createObjectURL(file);
                      return (
                        <div
                          key={index}
                          className="relative group w-[100px] h-[100px] rounded overflow-hidden border"
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            src={fileURL}
                            alt="preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              removeFile(index);
                            }}
                            className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors"
                            title="Remove"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                    {/* Add more button */}
                    <div
                      className="w-[100px] h-[100px] rounded border-2 border-dashed border-gray-400 flex items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                      onClick={(e) => {
                        // Allow this div to trigger the file input
                        e.stopPropagation();
                      }}
                    >
                      <span className="text-3xl text-gray-400">+</span>
                    </div>
                  </div>
                )}
              </label>

              {/* Show total size indicator */}
              {selectedFiles.length > 0 && (
                <div className="flex items-center justify-between px-2 py-1">
                  <span className="text-sm text-gray-600">
                    {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
                  </span>
                  <span className={`text-sm font-medium ${parseFloat(getTotalSize()) > 2 ? 'text-red-600' : 'text-green-600'}`}>
                    Total size: {getTotalSize()} MB / 2 MB
                  </span>
                </div>
              )}
              <p className="text-sm text-gray-400">Select photos for your album. Maximum total size: 2 MB</p>
            </div>

            {/* Submit and Cancel Buttons */}
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-[16rem] md:w-[15rem] h-[50px] border border-gray-400 text-gray-700 font-semibold text-[15px] md:text-[18px] py-2 px-8 rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-[16rem] md:w-[15rem] h-[50px] bg-blue-600 text-white font-semibold text-[15px] md:text-[18px] py-2 px-8 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Publishing...' : 'Publish Album'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateAlbum;
