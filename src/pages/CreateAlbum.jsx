import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "../utils/constant";
import { toast } from "react-toastify";
import Loader from "../components/loading/Loader";
import { FiX } from 'react-icons/fi';

const CreateAlbum = () => {
  const navigate = useNavigate();
  const [albumName, setAlbumName] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
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
      toast.error("Please select at least one photo or video");
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
      <div className="bg-white w-full h-full flex flex-col rounded-3xl shadow-2xl overflow-hidden">
        <div className="w-full flex flex-col gap-4">
          <div className="relative h-64 flex items-start justify-end px-8 md:px-16">
            {/* Close Button */}
            <button
              onClick={() => navigate(-1)}
              className="z-10 absolute flex -right-2 -top-2 w-10 h-10 items-center justify-center cursor-pointer text-gray-600 bg-gray-100 rounded-full transition-colors hover:bg-gray-200"
            >
              <FiX className="w-6 h-6" />
            </button>
            
            {/* Wave SVG */}
            <img src="/Vectorgroup.svg" alt="vector" className='absolute bottom-0 right-0 top-0 w-full' />
            <h2 className="text-xl md:text-2xl font-bold text-white z-10 pt-6">Create Album</h2>
          </div>

          <form
            className="w-full max-w-[800px] mx-auto flex flex-col gap-6 p-8"
            onSubmit={handleSubmit}
          >
            {/* Album Name */}
            <div className="w-full flex flex-col gap-2">
              <label
                htmlFor="album-name"
                className="text-lg text-black flex items-center gap-2"
              >
                Album Name : <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="album-name"
                className="w-full p-2 px-4 border border-[#d3d1d1] rounded-full"
                placeholder="Enter Album Name"
                value={albumName}
                onChange={(e) => setAlbumName(e.target.value)}
              />
            </div>

            {/* Select Media */}
            <div className="w-full flex flex-col gap-2">
              <label
                htmlFor="album-media"
                className="text-lg text-black flex items-center gap-2"
              >
                Select : <span className="text-red-500">*</span>
              </label>

              <input
                type="file"
                id="album-media"
                accept="image/*, video/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />

              <label
                htmlFor="album-media"
                className="w-full min-h-[200px] border border-[#d3d1d1] rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer text-[#555] p-4"
              >
                {selectedFiles.length === 0 ? (
                  <>
                    <img
                      src="/icons/selectAlbum.png"
                      alt="upload"
                      className="w-14 h-14 opacity-70"
                    />
                    <span className="font-medium text-sm">
                      Select photos & video
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
                          {file.type.startsWith("image") ? (
                            <img
                              src={fileURL}
                              alt="preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <video
                              src={fileURL}
                              className="w-full h-full object-cover"
                              controls
                            />
                          )}
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
            </div>

            {/* Submit */}
            <div className="w-full text-center">
              <button
                type="submit"
                className="w-[20rem] h-[50px] rounded-2xl border-2 border-blue-600 text-blue-600 bg-white font-semibold text-[20px] hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Publish Album
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateAlbum;
