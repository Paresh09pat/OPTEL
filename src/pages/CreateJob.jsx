import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../utils/constant';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../components/loading/Loader';

const CreateJob = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [company, setCompany] = useState('');
    const [location, setLocation] = useState('');
    const [salary, setSalary] = useState('');
    const [type, setType] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [jobTypes, setJobTypes] = useState([]);
    const [fetchingMetadata, setFetchingMetadata] = useState(true);

    const getMetadata = async () => {
        try {
            setFetchingMetadata(true);
            const accessToken = localStorage.getItem('access_token');
            const res = await axios.get(`${baseUrl}/api/v1/jobs/meta`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (res.data?.data) {
                const metadata = res.data.data;
                setCategories(metadata.categories || []);
                setJobTypes(metadata.job_types || []);
                
                // Set default values if available
                if (metadata.job_types && metadata.job_types.length > 0) {
                    setType(metadata.job_types[0].value);
                }
            }
        } catch (error) {
            console.log('Error fetching job metadata:', error);
            // Fallback to default job types if API fails
            setJobTypes([
                { value: 'full-time', label: 'Full Time' },
                { value: 'part-time', label: 'Part Time' },
                { value: 'contract', label: 'Contract' },
                { value: 'freelance', label: 'Freelance' },
                { value: 'internship', label: 'Internship' },
            ]);
            setType('full-time');
        } finally {
            setFetchingMetadata(false);
        }
    };

    useEffect(() => {
        getMetadata();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error('Please enter job title');
            return;
        }

        if (!description.trim()) {
            toast.error('Please enter job description');
            return;
        }

        if (!company.trim()) {
            toast.error('Please enter company name');
            return;
        }

        if (!location.trim()) {
            toast.error('Please enter job location');
            return;
        }

        if (!salary.trim() || isNaN(Number(salary))) {
            toast.error('Please enter a valid salary');
            return;
        }

        if (!type) {
            toast.error('Please select a job type');
            return;
        }

        const formData = {
            title: title.trim(),
            description: description.trim(),
            company: company.trim(),
            location: location.trim(),
            salary: Number(salary),
            type: type
        };

        // Add category if selected
        if (category) {
            formData.category = parseInt(category);
        }

        const accessToken = localStorage.getItem("access_token");
        setLoading(true);

        try {
            const response = await axios.post(
                `${baseUrl}/api/v1/jobs`,
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
            console.log('Job creation response:', data);

            if (data?.api_status === 200 || data?.ok === true || response.status === 200 || response.status === 201) {
                toast.success(data?.message || 'Job created successfully!');
                
                // Navigate to jobs list page
                setTimeout(() => {
                    navigate('/jobs');
                }, 800);

                // Reset form
                setTitle('');
                setDescription('');
                setCompany('');
                setLocation('');
                setSalary('');
                setType(jobTypes.length > 0 ? jobTypes[0].value : '');
                setCategory('');
            } else {
                toast.error(data?.message || 'Failed to create job');
            }
        } catch (error) {
            console.error('Error creating job:', error);
            const errorMsg = error?.response?.data?.message || error?.message || 'Failed to create job';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (fetchingMetadata) {
        return <Loader />;
    }

    return (
        <div className="bg-[#EDF6F9] w-full min-h-screen flex items-center justify-start flex-col">
            {/* Sticky Header */}
            <div className="w-full h-[98px] sticky pt-8 top-0 z-11 bg-[#EDF6F9]">
                <div className="flex items-center justify-between h-full px-4 md:px-7 flex-wrap gap-4">
                    <h1 className="text-2xl font-bold text-[#212121]">Create Job</h1>
                    <div className="flex gap-4 items-center">
                        <button
                            onClick={() => navigate('/jobs')}
                            className="border border-[#808080] py-1.5 px-4 rounded-2xl flex items-center gap-2 text-[#808080] text-base font-medium cursor-pointer hover:bg-gray-100 transition"
                        >
                            ← Back to Jobs
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Card */}
            <div className="w-[95%] md:w-[90%] max-w-6xl bg-white flex flex-col gap-6 rounded-xl my-6 shadow-md overflow-hidden">
                {/* Hero Banner */}
                <div
                    className="relative w-full bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/pagebg.jpg')" }}
                >
                    <div className="relative w-full h-[12rem] md:h-[18rem] flex top-15 justify-end pr-6 md:pr-20 z-10">
                        <h2 className="text-2xl md:text-4xl text-white font-bold text-right drop-shadow-md">
                            Post a Job
                        </h2>
                    </div>
                </div>

                {/* Form Section */}
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-3xl mx-auto flex flex-col gap-6 p-4 md:p-8"
                >
                    {/* Title */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="job-title"
                            className="text-lg text-black flex items-center gap-2"
                        >
                            Job Title : <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="job-title"
                            className="w-full p-2 px-4 border border-[#212121] rounded-full"
                            placeholder="e.g., Senior PHP Developer"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    {/* Company */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="job-company"
                            className="text-lg text-black flex items-center gap-2"
                        >
                            Company : <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="job-company"
                            className="w-full p-2 px-4 border border-[#212121] rounded-full"
                            placeholder="e.g., Tech Solutions Inc"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="job-description"
                            className="text-lg text-black flex items-center gap-2"
                        >
                            Description : <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="job-description"
                            rows="5"
                            className="w-full p-2 px-4 border border-[#212121] rounded-xl"
                            placeholder="Enter job description and requirements..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    {/* Location */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="job-location"
                            className="text-lg text-black flex items-center gap-2"
                        >
                            Location : <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="job-location"
                            className="w-full p-2 px-4 border border-[#212121] rounded-full"
                            placeholder="e.g., New York, NY"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                        />
                    </div>

                    {/* Salary */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="job-salary"
                            className="text-lg text-black flex items-center gap-2"
                        >
                            Salary : <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            id="job-salary"
                            className="w-full p-2 px-4 border border-[#212121] rounded-full"
                            placeholder="e.g., 80000"
                            value={salary}
                            onChange={(e) => setSalary(e.target.value)}
                            required
                            min="0"
                        />
                    </div>

                    {/* Category */}
                    {categories.length > 0 && (
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="job-category"
                                className="text-lg text-black flex items-center gap-2"
                            >
                                Category :
                            </label>
                            <div className="relative">
                                <select
                                    id="job-category"
                                    className="w-full p-2 px-4 border border-[#212121] rounded-full appearance-none cursor-pointer"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value="">Select category (optional)</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
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
                    )}

                    {/* Job Type */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="job-type"
                            className="text-lg text-black flex items-center gap-2"
                        >
                            Job Type : <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                id="job-type"
                                className="w-full p-2 px-4 border border-[#212121] rounded-full appearance-none cursor-pointer"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                required
                            >
                                <option value="">Select job type</option>
                                {jobTypes.map((jobType) => (
                                    <option key={jobType.value} value={jobType.value}>
                                        {jobType.label}
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

                    {/* Submit Button */}
                    <div className="text-center">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-[16rem] md:w-[20rem] h-[50px] border border-[#A3D36C] text-[#76B82A] font-semibold text-[18px] md:text-[20px] py-2 px-8 rounded-lg hover:bg-[#8BC34B] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Posting...' : 'Post Job'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateJob;

