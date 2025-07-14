import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CreateAlbum = () => {
    const [albumName, setAlbumName] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles((prev) => [...prev, ...files]);
    };

    const removeFile = (index) => {
        const newFiles = [...selectedFiles];
        newFiles.splice(index, 1);
        setSelectedFiles(newFiles);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!albumName.trim()) {
            alert("Please enter album name");
            return;
        }

        if (selectedFiles.length === 0) {
            alert("Please select at least one photo or video");
            return;
        }

        const formData = new FormData();
        formData.append('albumName', albumName);
        selectedFiles.forEach((file, index) => {
            formData.append('media', file);
        });

        // For demonstration
        console.log("Submitting form...");
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        // API submission example:
        // await axios.post('/api/create-album', formData)

        alert('Album submitted successfully!');
        setAlbumName('');
        setSelectedFiles([]);
    };

    return (
        <>
            <div className="bg-white w-full h-full flex flex-col">
                <div className='w-full h-[98px] sticky pt-8 top-0 z-10 bg-[#EDF6F9]'>
                    <div className="flex items-center justify-between h-full px-4 md:px-7 md:flex-row gap-4">
                        <h1 className="text-2xl font-bold text-[#212121] mb-4">My Albums</h1>
                        <div className="flex gap-6 items-center">
                            <Link to={"/create-album"} className='border border-[#808080] cursor-pointer py-1.5 px-3.5 rounded-2xl flex items-center gap-1.5'>
                                <img src="/icons/gridicons_create.svg" alt="create" className='size-[15px]' />
                                <span className='text-[#808080] text-base font-medium'>Create Album</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className='w-full flex flex-col gap-4'>
                    <div style={{ backgroundSize: "100% 100%" }} className='w-full h-[10rem] md:h-[18rem] bg-[url("/create-album.png")] bg-no-repeat bg-top'>
                        <div className='w-full flex items-end justify-end p-6 md:p-16'>
                            <h2 className='text-3xl text-white font-bold'>Create Album</h2>
                        </div>
                    </div>

                    <form
                        className='w-full max-w-[800px] mx-auto flex flex-col gap-6 p-8'
                        onSubmit={handleSubmit}
                    >
                        {/* Album Name */}
                        <div className='w-full flex flex-col gap-2'>
                            <label htmlFor="album-name" className='text-lg text-black flex items-center gap-2'>
                                Album Name : <span className='text-red-500'>*</span>
                            </label>
                            <input
                                type="text"
                                id="album-name"
                                className='w-full p-2 px-4 border border-[#212121] rounded-full'
                                placeholder='Enter Album Name'
                                value={albumName}
                                onChange={(e) => setAlbumName(e.target.value)}
                            />
                        </div>

                        {/* Select Media */}
                        <div className='w-full flex flex-col gap-2'>
                            <label htmlFor="album-media" className='text-lg text-black flex items-center gap-2'>
                                Select : <span className='text-red-500'>*</span>
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
                                className='w-full min-h-[200px] border border-[#212121] rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer text-[#555] p-4'
                            >
                                {selectedFiles.length === 0 ? (
                                    <>
                                        <img src="/icons/selectAlbum.png" alt="upload" className='w-14 h-14 opacity-70' />
                                        <span className='font-medium text-sm'>Select photos & video</span>
                                    </>
                                ) : (
                                    <div className='flex flex-wrap justify-center gap-4 w-full'>
                                        {selectedFiles.map((file, index) => {
                                            const fileURL = URL.createObjectURL(file);
                                            return (
                                                <div key={index} className='relative group w-[100px] h-[100px] rounded overflow-hidden border'>
                                                    {file.type.startsWith('image') ? (
                                                        <img src={fileURL} alt="preview" className='w-full h-full object-cover' />
                                                    ) : (
                                                        <video src={fileURL} className='w-full h-full object-cover' controls />
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeFile(index);
                                                        }}
                                                        className='absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center cursor-pointer'
                                                        title="Remove"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </label>
                        </div>

                        {/* Submit */}
                        <div className="w-full text-center">
                            <button
                                type="submit"
                                className='w-[20rem] h-[50px] border border-[#A3D36C] text-[#76B82A] font-semibold  text-[20px] py-2 px-8 rounded-lg hover:bg-[#8BC34B] transition hover:text-[#fff] '
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
