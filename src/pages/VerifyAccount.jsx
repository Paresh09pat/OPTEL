import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../components/loading/Loader';

const VerifyAccount = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [idProofType, setIdProofType] = useState('');
    const [idProofNumber, setIdProofNumber] = useState('');
    const [frontImage, setFrontImage] = useState(null);
    const [backImage, setBackImage] = useState(null);
    const [frontImagePreview, setFrontImagePreview] = useState(null);
    const [backImagePreview, setBackImagePreview] = useState(null);
    const [badgeType, setBadgeType] = useState('');

    const idProofTypes = [
        { value: 'aadhar', label: 'Aadhar Card', hasBothSides: true },
        { value: 'voter_id', label: 'Voter ID', hasBothSides: false },
        { value: 'passport', label: 'Passport', hasBothSides: true },
        { value: 'driving_license', label: 'Driving License', hasBothSides: false },
        { value: 'pan_card', label: 'PAN Card', hasBothSides: false }
    ];

    // Check if selected ID proof type requires both sides
    const selectedIdProof = idProofTypes.find(type => type.value === idProofType);
    const requiresBothSides = selectedIdProof?.hasBothSides || false;

    const handleFrontImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (5MB limit)
            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
            if (file.size > maxSize) {
                toast.error('File size must be less than 5MB');
                e.target.value = ''; // Reset input
                return;
            }

            // Check file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                toast.error('Only images (JPEG, PNG, GIF, WebP) and PDF files are allowed');
                e.target.value = ''; // Reset input
                return;
            }

            setFrontImage(file);
            // For PDF, show a placeholder instead of preview
            if (file.type === 'application/pdf') {
                setFrontImagePreview('pdf');
            } else {
                setFrontImagePreview(URL.createObjectURL(file));
            }
        }
    };

    const handleBackImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (5MB limit)
            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
            if (file.size > maxSize) {
                toast.error('File size must be less than 5MB');
                e.target.value = ''; // Reset input
                return;
            }

            // Check file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                toast.error('Only images (JPEG, PNG, GIF, WebP) and PDF files are allowed');
                e.target.value = ''; // Reset input
                return;
            }

            setBackImage(file);
            // For PDF, show a placeholder instead of preview
            if (file.type === 'application/pdf') {
                setBackImagePreview('pdf');
            } else {
                setBackImagePreview(URL.createObjectURL(file));
            }
        }
    };

    const removeFrontImage = () => {
        setFrontImage(null);
        setFrontImagePreview(null);
    };

    const removeBackImage = () => {
        setBackImage(null);
        setBackImagePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!idProofType) {
            toast.error('Please select an ID proof type');
            return;
        }

        if (!idProofNumber.trim()) {
            toast.error('Please enter ID proof number');
            return;
        }

        if (!frontImage) {
            toast.error('Please upload front image/PDF of ID proof');
            return;
        }

        // Only require back image if front is not a PDF and ID requires both sides
        if (requiresBothSides && frontImage.type !== 'application/pdf' && !backImage) {
            toast.error('Please upload back image or use a PDF with both sides');
            return;
        }

        if (!badgeType) {
            toast.error('Please select a badge type');
            return;
        }

        setLoading(true);

        try {
            const accessToken = localStorage.getItem('access_token');
            const formData = new FormData();
            
            formData.append('id_proof_type', idProofType);
            formData.append('id_proof_number', idProofNumber);
            formData.append('front_image', frontImage);
            if (requiresBothSides && backImage) {
                formData.append('back_image', backImage);
            }
            formData.append('badge_type', badgeType);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/verify-account`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/json',
                },
                body: formData,
            });

            const data = await response.json();

            if (data?.ok === true || data?.api_status === 200) {
                toast.success(data?.message || 'Verification request submitted successfully!');
                
                // Reset form
                setIdProofType('');
                setIdProofNumber('');
                setFrontImage(null);
                setBackImage(null);
                setFrontImagePreview(null);
                setBackImagePreview(null);
                setBadgeType('');

                // Navigate back after a delay
                setTimeout(() => {
                    navigate(-1);
                }, 1500);
            } else {
                toast.error(data?.message || 'Failed to submit verification request');
            }
        } catch (error) {
            console.error('Error submitting verification:', error);
            toast.error('Failed to submit verification request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#EDF6F9] w-full min-h-screen flex items-center justify-start flex-col">
            {loading && <Loader />}
            
            {/* Header */}
            <div className="w-full h-[98px] sticky pt-8 top-0 z-11 bg-[#EDF6F9]">
                <div className="flex items-center justify-between h-full px-4 md:px-7 flex-wrap gap-4">
                    <h1 className="text-2xl font-bold text-[#212121]">Verify Account</h1>
                    <div className="flex gap-4 items-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="border border-[#808080] py-1.5 px-4 rounded-2xl flex items-center gap-2 text-[#808080] text-base font-medium cursor-pointer hover:bg-gray-100 transition"
                        >
                            ← Back
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Card */}
            <div className="w-[95%] md:w-[90%] max-w-4xl bg-white flex flex-col gap-6 rounded-xl my-6 shadow-md overflow-hidden">
                {/* Hero Banner */}
                <div className="relative h-64 flex items-start justify-end px-8 md:px-16">
                    <img src="/Vectorgroup.svg" alt="vector" className='absolute bottom-0 right-0 top-0 w-full' />
                    <h2 className="text-xl md:text-2xl font-bold text-white z-10 pt-6">
                        Account Verification
                    </h2>
                </div>

                {/* Form Section */}
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-3xl mx-auto flex flex-col gap-6 p-4 md:p-8"
                >
                    {/* ID Proof Type */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="id-proof-type"
                            className="text-lg text-black flex items-center gap-2"
                        >
                            Government ID Proof Type : <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                id="id-proof-type"
                                className="w-full p-2 px-4 border border-[#808080] rounded-full appearance-none cursor-pointer"
                                value={idProofType}
                                onChange={(e) => setIdProofType(e.target.value)}
                                required
                            >
                                <option value="">Select ID proof type</option>
                                {idProofTypes.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <svg
                                    className="w-5 h-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* ID Proof Number */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="id-proof-number"
                            className="text-lg text-black flex items-center gap-2"
                        >
                            ID Proof Number : <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="id-proof-number"
                            className="w-full p-2 px-4 border border-[#808080] rounded-full"
                            placeholder="Enter your ID proof number"
                            value={idProofNumber}
                            onChange={(e) => setIdProofNumber(e.target.value)}
                            required
                        />
                    </div>

                    {/* Front Image Upload */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="front-image"
                            className="text-lg text-black flex items-center gap-2"
                        >
                            {requiresBothSides ? 'Front Image/PDF of ID Proof' : 'Image/PDF of ID Proof'} : <span className="text-red-500">*</span>
                        </label>
                        <p className="text-sm text-gray-500">
                            {requiresBothSides 
                                ? 'Upload front image or a PDF containing both sides (Max 5MB)' 
                                : 'Upload image or PDF of your ID proof (Max 5MB)'}
                        </p>
                        <input
                            type="file"
                            id="front-image"
                            accept="image/*,application/pdf"
                            className="hidden"
                            onChange={handleFrontImageChange}
                        />
                        <label
                            htmlFor="front-image"
                            className="w-full min-h-[200px] border border-[#808080] rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer text-[#555] p-4"
                        >
                            {!frontImagePreview ? (
                                <>
                                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="font-medium text-sm">{requiresBothSides ? 'Upload front image or PDF' : 'Upload image or PDF'}</span>
                                    <span className="text-xs text-gray-400">Max size: 5MB</span>
                                </>
                            ) : frontImagePreview === 'pdf' ? (
                                <div className="relative w-full h-full flex flex-col items-center justify-center gap-3">
                                    <svg className="w-16 h-16 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-medium text-sm text-gray-700">{frontImage?.name}</span>
                                    <span className="text-xs text-gray-400">{(frontImage?.size / 1024 / 1024).toFixed(2)} MB</span>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            removeFrontImage();
                                        }}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                                    >
                                        ×
                                    </button>
                                </div>
                            ) : (
                                <div className="relative w-full h-full flex items-center justify-center">
                                    <img
                                        src={frontImagePreview}
                                        alt="Front preview"
                                        className="max-w-full max-h-[180px] object-contain"
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            removeFrontImage();
                                        }}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                                    >
                                        ×
                                    </button>
                                </div>
                            )}
                        </label>
                    </div>

                    {/* Back Image Upload - Only show for ID types that have both sides */}
                    {requiresBothSides && (
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="back-image"
                                className="text-lg text-black flex items-center gap-2"
                            >
                                Back Image/PDF of ID Proof : <span className="text-red-500">*</span>
                            </label>
                            <p className="text-sm text-gray-500">Upload back image or skip if you uploaded a PDF with both sides (Max 5MB)</p>
                            <input
                                type="file"
                                id="back-image"
                                accept="image/*,application/pdf"
                                className="hidden"
                                onChange={handleBackImageChange}
                            />
                            <label
                                htmlFor="back-image"
                                className="w-full min-h-[200px] border border-[#808080] rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer text-[#555] p-4"
                            >
                                {!backImagePreview ? (
                                    <>
                                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="font-medium text-sm">Upload back image or PDF</span>
                                        <span className="text-xs text-gray-400">Max size: 5MB</span>
                                    </>
                                ) : backImagePreview === 'pdf' ? (
                                    <div className="relative w-full h-full flex flex-col items-center justify-center gap-3">
                                        <svg className="w-16 h-16 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                        </svg>
                                        <span className="font-medium text-sm text-gray-700">{backImage?.name}</span>
                                        <span className="text-xs text-gray-400">{(backImage?.size / 1024 / 1024).toFixed(2)} MB</span>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                removeBackImage();
                                            }}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ) : (
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        <img
                                            src={backImagePreview}
                                            alt="Back preview"
                                            className="max-w-full max-h-[180px] object-contain"
                                        />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                removeBackImage();
                                            }}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                                        >
                                            ×
                                        </button>
                                    </div>
                                )}
                            </label>
                        </div>
                    )}

                    {/* Badge Type Selection */}
                    <div className="flex flex-col gap-2">
                        <label className="text-lg text-black flex items-center gap-2">
                            Badge Type : <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-6">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="badge-type"
                                    value="blue"
                                    checked={badgeType === 'blue'}
                                    onChange={(e) => setBadgeType(e.target.value)}
                                    className="w-5 h-5 cursor-pointer"
                                    required
                                />
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                                    badgeType === 'blue' 
                                        ? 'border-blue-500 bg-blue-50' 
                                        : 'border-[#808080] bg-white group-hover:border-blue-300'
                                }`}>
                                    <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-medium text-gray-700">Blue Badge</span>
                                </div>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="badge-type"
                                    value="golden"
                                    checked={badgeType === 'golden'}
                                    onChange={(e) => setBadgeType(e.target.value)}
                                    className="w-5 h-5 cursor-pointer"
                                    required
                                />
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                                    badgeType === 'golden' 
                                        ? 'border-yellow-500 bg-yellow-50' 
                                        : 'border-[#808080] bg-white group-hover:border-yellow-300'
                                }`}>
                                    <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-medium text-gray-700">Golden Badge</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="text-center">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-[16rem] md:w-[20rem] h-[50px] border border-[#4A90E2] text-[#4A90E2] font-semibold text-[18px] md:text-[20px] py-2 px-8 rounded-lg hover:bg-[#4A90E2] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Submitting...' : 'Submit Verification'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VerifyAccount;
