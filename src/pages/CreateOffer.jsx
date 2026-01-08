import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../utils/constant';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreateOffer = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [location, setLocation] = useState('');
    const [expireDate, setExpireDate] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error('Please enter offer title');
            return;
        }

        if (!description.trim()) {
            toast.error('Please enter offer description');
            return;
        }

        if (!price.trim() || isNaN(Number(price))) {
            toast.error('Please enter a valid price');
            return;
        }

        const formData = {
            title: title.trim(),
            description: description.trim(),
            price: Number(price),
            currency: currency,
            location: location.trim() || 'Unknown',
        };

        // Add expire_date if provided
        if (expireDate) {
            formData.expire_date = expireDate;
        }

        const accessToken = localStorage.getItem("access_token");
        setLoading(true);

        try {
            const response = await axios.post(
                `${baseUrl}/api/v1/offers`,
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                }
            );

            const data = response.data;
            console.log('Offer creation response:', data);

            if (data?.api_status === 200 || data?.ok === true || response.status === 200 || response.status === 201) {
                toast.success(data?.message || 'Offer created successfully!');
                
                // Navigate to offers list page
                setTimeout(() => {
                    navigate('/offers');
                }, 800);

                // Reset form
                setTitle('');
                setDescription('');
                setPrice('');
                setCurrency('USD');
                setLocation('');
                setExpireDate('');
            } else {
                // Handle errors array from response
                if (data.api_status === 400 && data.errors && Array.isArray(data.errors)) {
                    data.errors.forEach((error) => {
                        toast.error(error);
                    });
                } else {
                    toast.error(data?.message || 'Failed to create offer');
                }
            }
        } catch (error) {
            console.error('Error creating offer:', error);
            // Handle axios error response
            if (error.response?.data) {
                const errorData = error.response.data;
                if (errorData.api_status === 400 && errorData.errors && Array.isArray(errorData.errors)) {
                    errorData.errors.forEach((errorMsg) => {
                        toast.error(errorMsg);
                    });
                } else if (errorData.message) {
                    toast.error('Failed to create offer: ' + errorData.message);
                } else {
                    toast.error('Failed to create offer');
                }
            } else {
                toast.error('Failed to create offer. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#EDF6F9] w-full min-h-screen flex items-center justify-start flex-col">
            {/* Sticky Header */}
            <div className="w-full h-[98px] sticky pt-8 top-0 z-11 bg-[#EDF6F9]">
                <div className="flex items-center justify-between h-full px-4 md:px-7 flex-wrap gap-4">
                    <h1 className="text-2xl font-bold text-[#212121]">Create Offer</h1>
                    <div className="flex gap-4 items-center">
                        <button
                            onClick={() => navigate('/offers')}
                            className="border border-[#808080] py-1.5 px-4 rounded-2xl flex items-center gap-2 text-[#808080] text-base font-medium cursor-pointer hover:bg-gray-100 transition"
                        >
                            ← Back to Offers
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
                    <h2 className="text-xl md:text-2xl font-bold text-white z-10 pt-6">
                        Create Offer
                    </h2>
                </div>

                {/* Form Section */}
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-3xl mx-auto flex flex-col gap-6 p-4 md:p-8"
                >
                    {/* Title */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="offer-title"
                            className="text-lg text-black flex items-center gap-2"
                        >
                            Offer Title : <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="offer-title"
                            className="w-full p-2 px-4 border border-[#212121] rounded-full"
                            placeholder="e.g., Professional Web Development Services"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="offer-description"
                            className="text-lg text-black flex items-center gap-2"
                        >
                            Description : <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="offer-description"
                            rows="5"
                            className="w-full p-2 px-4 border border-[#212121] rounded-xl"
                            placeholder="Enter detailed description of your offer..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    {/* Price and Currency */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="offer-price"
                                className="text-lg text-black flex items-center gap-2"
                            >
                                Price : <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="offer-price"
                                className="w-full p-2 px-4 border border-[#212121] rounded-full"
                                placeholder="e.g., 1000"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                                min="0"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="offer-currency"
                                className="text-lg text-black flex items-center gap-2"
                            >
                                Currency :
                            </label>
                            <select
                                id="offer-currency"
                                className="w-full p-2 px-4 border border-[#212121] rounded-full appearance-none cursor-pointer"
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                            >
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                                <option value="INR">INR</option>
                            </select>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="offer-location"
                            className="text-lg text-black flex items-center gap-2"
                        >
                            Location :
                        </label>
                        <input
                            type="text"
                            id="offer-location"
                            className="w-full p-2 px-4 border border-[#212121] rounded-full"
                            placeholder="e.g., New York, NY"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>

                    {/* Expire Date */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="offer-expire-date"
                            className="text-lg text-black flex items-center gap-2"
                        >
                            Expire Date :
                        </label>
                        <input
                            type="date"
                            id="offer-expire-date"
                            className="w-full p-2 px-4 border border-[#212121] rounded-full"
                            value={expireDate}
                            onChange={(e) => setExpireDate(e.target.value)}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="text-center">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-[16rem] md:w-[20rem] h-[50px] border border-[#A3D36C] text-[#76B82A] font-semibold text-[18px] md:text-[20px] py-2 px-8 rounded-lg hover:bg-[#8BC34B] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating...' : 'Create Offer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateOffer;
