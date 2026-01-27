import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../components/loading/Loader';

const VerifyAccount = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [optionsLoading, setOptionsLoading] = useState(true);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [idProofType, setIdProofType] = useState('');
    const [idProofNumber, setIdProofNumber] = useState('');
    const [frontImage, setFrontImage] = useState(null);
    const [backImage, setBackImage] = useState(null);
    const [frontImagePreview, setFrontImagePreview] = useState(null);
    const [backImagePreview, setBackImagePreview] = useState(null);
    const [badgeType, setBadgeType] = useState('');
    const [idProofTypes, setIdProofTypes] = useState([]);
    const [badgeTypes, setBadgeTypes] = useState([]);
    const [verificationHistory, setVerificationHistory] = useState([]);
    const [verificationStatus, setVerificationStatus] = useState(null);
    const [showHistory, setShowHistory] = useState(false);
    const [cancelLoading, setCancelLoading] = useState(false);
    const [resubmitMode, setResubmitMode] = useState(false);

    // Fetch verification options from API
    useState(() => {
        const fetchOptions = async () => {
            try {
                setOptionsLoading(true);
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/verification/options`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    }
                });

                const data = await response.json();

                if (data.api_status === 200) {
                    // Map ID proof types - all types require both sides
                    const mappedIdProofTypes = data.data.id_proof_types.map(type => ({
                        value: type.key,
                        label: type.name,
                        hasBothSides: true // All ID types require both sides
                    }));
                    setIdProofTypes(mappedIdProofTypes);
                    setBadgeTypes(data.data.badge_types || []);
                } else {
                    toast.error('Failed to load verification options');
                }
            } catch (error) {
                console.error('Error fetching verification options:', error);
                toast.error('Failed to load verification options');
            } finally {
                setOptionsLoading(false);
            }
        };

        fetchOptions();
    }, []);

    // Fetch verification status and history
    useState(() => {
        const fetchVerificationData = async () => {
            try {
                setHistoryLoading(true);
                const accessToken = localStorage.getItem('access_token');

                // Fetch verification status
                const statusResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/verification/status`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                        'Accept': 'application/json',
                    }
                });

                const statusData = await statusResponse.json();
                if (statusData.api_status === 200) {
                    setVerificationStatus(statusData.data);
                }

                // Fetch verification history
                const historyResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/verification/history`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                        'Accept': 'application/json',
                    }
                });

                const historyData = await historyResponse.json();
                if (historyData.api_status === 200) {
                    setVerificationHistory(historyData.data.history || []);
                    
                    // If user has history, show history by default
                    if (historyData.data.history && historyData.data.history.length > 0) {
                        setShowHistory(true);
                    }
                }
            } catch (error) {
                console.error('Error fetching verification data:', error);
            } finally {
                setHistoryLoading(false);
            }
        };

        fetchVerificationData();
    }, []);

    // All ID proof types require both sides
    const selectedIdProof = idProofTypes.find(type => type.value === idProofType);
    const requiresBothSides = true; // Always require both sides

    // Helper function to get status badge styling
    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' };
            case 'approved':
                return { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' };
            case 'rejected':
                return { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' };
            default:
                return { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Cancel pending verification request
    const handleCancelRequest = async () => {
        if (!window.confirm('Are you sure you want to cancel your pending verification request?')) {
            return;
        }

        setCancelLoading(true);
        try {
            const accessToken = localStorage.getItem('access_token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/verification/cancel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/json',
                },
            });

            const data = await response.json();

            if (data.api_status === 200 || data.ok === true) {
                toast.success(data?.message || data?.api_text || 'Verification request cancelled successfully!');
                
                // Refresh verification data
                window.location.reload();
            } else {
                toast.error(data?.message || data?.api_text || 'Failed to cancel verification request');
            }
        } catch (error) {
            console.error('Error cancelling verification:', error);
            toast.error('Failed to cancel verification request. Please try again.');
        } finally {
            setCancelLoading(false);
        }
    };

    // Handle resubmit
    const handleResubmit = () => {
        setResubmitMode(true);
        setShowHistory(false);
    };

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

            // Check file type - only images allowed
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                toast.error('Only images (JPEG, PNG, GIF, WebP) are allowed');
                e.target.value = ''; // Reset input
                return;
            }

            setFrontImage(file);
            setFrontImagePreview(URL.createObjectURL(file));
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

            // Check file type - only images allowed
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                toast.error('Only images (JPEG, PNG, GIF, WebP) are allowed');
                e.target.value = ''; // Reset input
                return;
            }

            setBackImage(file);
            setBackImagePreview(URL.createObjectURL(file));
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
            toast.error('Please upload front image of ID proof');
            return;
        }

        if (!backImage) {
            toast.error('Please upload back image of ID proof');
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
            formData.append('id_proof_front_image', frontImage);
            formData.append('id_proof_back_image', backImage);
            formData.append('badge_type', badgeType);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/verification/${resubmitMode ? 'resubmit' : 'submit'}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/json',
                },
                body: formData,
            });

            const data = await response.json();

            if (data?.api_status === 200 || data?.ok === true) {
                toast.success(data?.message || data?.api_text || `Verification request ${resubmitMode ? 'resubmitted' : 'submitted'} successfully!`);
                
                // Reset form
                setIdProofType('');
                setIdProofNumber('');
                setFrontImage(null);
                setBackImage(null);
                setFrontImagePreview(null);
                setBackImagePreview(null);
                setBadgeType('');
                setResubmitMode(false);

                // Reload page to refresh data
                setTimeout(() => {
                    window.location.reload();
                }, 1500);

            } else {
                // Handle error response - check for errors object first
                const errorMessage = data?.errors?.error_text || data?.message || data?.api_text || 'Failed to submit verification request';
                toast.error(errorMessage);
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
                    <div className="flex gap-4 items-center flex-wrap">
                        {verificationHistory.length > 0 && (
                            <button
                                onClick={() => {
                                    setShowHistory(!showHistory);
                                    setResubmitMode(false);
                                }}
                                className="border border-blue-500 text-blue-500 py-1.5 px-4 rounded-2xl flex items-center gap-2 text-base font-medium cursor-pointer hover:bg-blue-50 transition"
                            >
                                {showHistory ? '📝 New Request' : '📋 View History'}
                            </button>
                        )}
                        <button
                            onClick={() => {
                                // Use window.history.back() which is more reliable than navigate(-1)
                                window.history.back();
                            }}
                            className="border border-[#808080] py-1.5 px-4 rounded-2xl flex items-center gap-2 text-[#808080] text-base font-medium cursor-pointer hover:bg-gray-100 transition"
                        >
                            ← Back
                        </button>
                    </div>
                </div>
            </div>

            {/* Verification Status Alert */}
            {verificationStatus && verificationStatus.has_pending && !showHistory && (
                <div className="w-[95%] md:w-[90%] max-w-4xl bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-4">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                            <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <h3 className="font-semibold text-yellow-800">Verification Pending</h3>
                                <p className="text-sm text-yellow-700 mt-1">
                                    You have a pending verification request. Please wait for admin review.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleCancelRequest}
                            disabled={cancelLoading}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                            {cancelLoading ? 'Cancelling...' : 'Cancel Request'}
                        </button>
                    </div>
                </div>
            )}

            {/* History Section */}
            {showHistory && (
                <div className="w-[95%] md:w-[90%] max-w-4xl bg-white flex flex-col gap-6 rounded-xl my-6 shadow-md p-6">
                    <h2 className="text-2xl font-bold text-gray-800">Verification History</h2>
                    
                    {historyLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading history...</p>
                            </div>
                        </div>
                    ) : verificationHistory.length > 0 ? (
                        <div className="space-y-4">
                            {verificationHistory.map((item) => {
                                const statusBadge = getStatusBadge(item.status);
                                return (
                                    <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-semibold text-gray-800">{item.id_proof_type_name}</h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                                                        {item.status_name}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600">Badge Type: {item.badge_type_name}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <span className="text-gray-500">Submitted:</span>
                                                <span className="ml-2 text-gray-700">{formatDate(item.submitted_at)}</span>
                                            </div>
                                            {item.reviewed_at && (
                                                <div>
                                                    <span className="text-gray-500">Reviewed:</span>
                                                    <span className="ml-2 text-gray-700">{formatDate(item.reviewed_at)}</span>
                                                </div>
                                            )}
                                        </div>

                                        {item.rejection_reason && item.rejection_reason_text && (
                                            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                                <p className="text-sm font-medium text-red-800">Rejection Reason:</p>
                                                <p className="text-sm text-red-700 mt-1">{item.rejection_reason_text}</p>
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="mt-4 flex gap-3">
                                            {item.status === 'pending' && (
                                                <button
                                                    onClick={handleCancelRequest}
                                                    disabled={cancelLoading}
                                                    className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {cancelLoading ? 'Cancelling...' : 'Cancel Request'}
                                                </button>
                                            )}
                                            {item.status === 'rejected' && (
                                                <button
                                                    onClick={handleResubmit}
                                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition cursor-pointer"
                                                >
                                                    Resubmit Request
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-gray-500 text-lg">No verification history</p>
                            <p className="text-gray-400 text-sm mt-2">You haven't submitted any verification requests yet</p>
                        </div>
                    )}
                </div>
            )}

            {/* Main Card */}
            {!showHistory && (
                <div className="w-[95%] md:w-[90%] max-w-4xl bg-white flex flex-col gap-6 rounded-xl my-6 shadow-md overflow-hidden">
                {/* Hero Banner */}
                <div className="relative h-64 flex items-start justify-end px-8 md:px-16">
                    <img src="/Vectorgroup.svg" alt="vector" className='absolute bottom-0 right-0 top-0 w-full' />
                    <h2 className="text-xl md:text-2xl font-bold text-white z-10 pt-6">
                        {resubmitMode ? 'Resubmit Verification' : 'Account Verification'}
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
                        {optionsLoading ? (
                            <div className="flex items-center justify-center py-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                            </div>
                        ) : (
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
                        )}
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
                            Front Image of ID Proof : <span className="text-red-500">*</span>
                        </label>
                        <p className="text-sm text-gray-500">
                            Upload front side image of your ID proof (Max 5MB)
                        </p>
                        <input
                            type="file"
                            id="front-image"
                            accept="image/*"
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
                                    <span className="font-medium text-sm">Upload front image</span>
                                    <span className="text-xs text-gray-400">Max size: 5MB</span>
                                </>
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

                    {/* Back Image Upload - Always required */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="back-image"
                            className="text-lg text-black flex items-center gap-2"
                        >
                            Back Image of ID Proof : <span className="text-red-500">*</span>
                        </label>
                        <p className="text-sm text-gray-500">Upload back side image of your ID proof (Max 5MB)</p>
                        <input
                            type="file"
                            id="back-image"
                            accept="image/*"
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
                                    <span className="font-medium text-sm">Upload back image</span>
                                    <span className="text-xs text-gray-400">Max size: 5MB</span>
                                </>
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

                    {/* Badge Type Selection */}
                    <div className="flex flex-col gap-2">
                        <label className="text-lg text-black flex items-center gap-2">
                            Badge Type : <span className="text-red-500">*</span>
                        </label>
                        {optionsLoading ? (
                            <div className="flex items-center justify-center py-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {badgeTypes.map((badge) => (
                                    <label key={badge.key} className="flex items-start gap-3 cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="badge-type"
                                            value={badge.key}
                                            checked={badgeType === badge.key}
                                            onChange={(e) => setBadgeType(e.target.value)}
                                            className="w-5 h-5 cursor-pointer mt-1"
                                            required
                                        />
                                        <div className={`flex-1 flex items-start gap-3 px-4 py-3 rounded-lg border-2 transition-all ${
                                            badgeType === badge.key
                                                ? badge.key === 'blue' 
                                                    ? 'border-blue-500 bg-blue-50' 
                                                    : 'border-yellow-500 bg-yellow-50'
                                                : 'border-[#808080] bg-white group-hover:border-gray-400'
                                        }`}>
                                            <svg className={`w-6 h-6 flex-shrink-0 ${badge.key === 'blue' ? 'text-blue-500' : 'text-yellow-500'}`} fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <div className="flex-1">
                                                <span className="font-semibold text-gray-800 block">{badge.name}</span>
                                                <span className="text-sm text-gray-600 mt-1 block">{badge.description}</span>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="text-center">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-[16rem] md:w-[20rem] h-[50px] border border-[#4A90E2] text-[#4A90E2] font-semibold text-[18px] md:text-[20px] py-2 px-8 rounded-lg hover:bg-[#4A90E2] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (resubmitMode ? 'Resubmitting...' : 'Submitting...') : (resubmitMode ? 'Resubmit Verification' : 'Submit Verification')}
                        </button>
                    </div>
                </form>
            </div>
            )}
        </div>
    );
};

export default VerifyAccount;
