import {
    Camera,
    Globe,
    Heart,
    MessageCircle,
    Phone
} from 'lucide-react';
import React, { useState } from 'react';
import PostCard from '../../components/specific/Home/PostCard';
import QuickActionsSection from '../../components/specific/Home/QuickActionSection';
import verified from '/icons/verified.png';
import ProfilePicture from '/mobile.jpg';
import { BiSolidMessageDetail } from "react-icons/bi";


const post =
{
    id: 1,
    user: {
        name: 'feeliummagic',
        avatar: '/perimg.png'
    },
    content: 'Explore new horizons... Follow us for design inspiration, Check out our latest graphic design and branding content. @feeliummagic...more',
    image: '/mobile.jpg',
    likes: '2k+',
    comments: '100+',
    shares: '250+',
    saves: '50+',
    timeAgo: '2h ago'
}


const datapost = {
    id: 2,
    user: {
        name: '_amu_456',
        avatar: '/perimg.png'
    },
    content: 'What a thrilling clash between MI & LSG last night! LSG got the time only with Mitchell Marsh hammering 60 off just 31 balls, powering them to a massive 204/5. Mumbai fought back strongly, but Suryakumar Yadav brought them back with a classy 67 (43). Hardik Pandya shined with the ball (3/21), but LSG\'s bowlers held their nerve in the death overs, sealing a 12-run win. Momentum shift. Playoff race heating up! This IPL just keeps getting better. #MIvsLSG #IPL2025 #CricketMadness #GameDay',
    image: null,
    likes: '2k+',
    comments: '100+',
    shares: '250+',
    saves: '50+',
    timeAgo: '4h ago'
}


const ProfilePage = () => {
    const [profilePicture, setProfilePicture] = useState(null);
    const [coverPicture, setCoverPicture] = useState(null);

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (type === 'profile') {
                        setProfilePicture(e.target.result);
                    } else {
                        setCoverPicture(e.target.result);
                    }
                };
                reader.readAsDataURL(file);
            } else {
                alert('Please select a valid image file.');
            }
        }
    };

    return (
        <div className="min-h-screen relative pb-15 smooth-scroll pt-8 bg-[#EDF6F9]">
            <div className="max-w-6xl mx-auto  rounded-xl border border-[#808080] bg-white">
                {/* Cover Photo Section */}
                <div className="relative h-80 bg-gradient-to-br from-slate-800 via-slate-900 to-black rounded-lg">
                    {coverPicture ? (
                        <img
                            src={coverPicture}
                            alt="Cover"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center rounded-lg">
                            <div className="text-center">
                                <Camera className="w-16 h-16 text-white/50 mx-auto mb-4" />
                                <p className="text-white/70 text-lg">Add Cover Photo</p>
                            </div>
                        </div>
                    )}

                    {/* Liked Page Button */}
                    <div className="absolute top-4 right-4">
                        <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2">
                            <Heart className="w-4 h-4 fill-current" />
                            <span>Liked Page</span>
                        </button>
                    </div>
                </div>

                {/* Profile Section */}
                <div className="relative px-8 pb-8 bg-white rounded-xl">
                    {/* Profile Picture */}
                    <div className="absolute -top-20 left-8">
                        <div className="relative">
                            <div className="w-40 h-40 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-lg">
                                <img
                                    src={ProfilePicture}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Upload Icon */}
                            <label
                                htmlFor="profile-upload"
                                className="absolute bottom-2 right-2 bg-white border-2 border-gray-300 rounded-full p-2 cursor-pointer hover:bg-gray-50 transition-colors shadow-md"
                            >
                                <Camera className="w-5 h-5 text-gray-600" />
                            </label>
                        </div>
                    </div>

                    {/* Profile Info Section */}
                    <div className="pt-4  flex flex-col md:flex-row justify-between items-start md:items-center w-full mt-6 md:mt-0">
                        {/* Left Side Info */}
                        <div className="ml-44 ">
                            <div className="flex items-center space-x-3 mb-2">
                                <h1 className="text-3xl font-bold text-gray-900">Bhuvan Rana</h1> <span><img src={verified} alt="verified" className="w-[40px] md:w-6 md:h-6" /></span>

                            </div>

                            <p className="text-gray-600 mb-1">@beatsByBhuvan</p>

                            <div className="flex items-center space-x-2 mb-4">
                                <span className="text-sm text-gray-600">Category:</span>
                                <span className="text-sm font-medium text-gray-800">
                                    HIP-HOP Music
                                </span>
                            </div>
                        </div>

                        {/* Right Side: Website, Phone & Message Button */}
                        <div className="flex flex-col  md:items-center md:justify-end gap-2 md:gap-6 w-full md:w-auto mt-4 md:mt-0">
                            <div className="flex flex-col text-md text-black-700">
                                <div className="flex items-center space-x-2 mr-10">
                                    <Globe className="w-4 h-4" />
                                    <span className="truncate max-w-[200px] md:max-w-none">
                                        www.optel.com
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Phone className="w-4 h-4" />
                                    <span>+91 9876543210</span>
                                </div>
                            </div>

                            <button className="w-1/2 md:w-auto bg-gradient-to-r from-[#3D8CFA] to-[#245394] text-white px-5 py-2 rounded-lg hover:opacity-90 transition-all flex items-center space-x-2 ">
                                <BiSolidMessageDetail width={20} height={20} className='text-white' />
                                <h4 className='text-white text-normal'>Message</h4>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                {/* <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex space-x-6">
                            <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
                                <Heart className="w-5 h-5" />
                                <span>Like</span>
                            </button>
                            <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
                                <Star className="w-5 h-5" />
                                <span>Follow</span>
                            </button>
                            <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
                                <Info className="w-5 h-5" />
                                <span>Info</span>
                            </button>
                        </div>
                        <div className="text-sm text-gray-500">Last updated: Just now</div>
                    </div>
                </div> */}
            </div>

            <div className='max-w-5xl mx-auto px-3 md:px-4 py-4 md:py-6'>
                <div className="sticky top-0 z-30 bg-[#EDF6F9] py-2 -mx-2 md:-mx-4">
                    <div className="mx-2 md:mx-4">
                        <QuickActionsSection />
                    </div>
                </div>


                <div className="mb-4 md:mb-6 mt-4 md:mt-6 smooth-content-transition bg-white rounded-xl border border-[#808080]">
                    <PostCard
                        user={post.user}
                        content={post.content}
                        image={post.image}
                        likes={post.likes}
                        comments={post.comments}
                        shares={post.shares}
                        saves={post.saves}
                        timeAgo={post.timeAgo}
                    />
                </div>


                <div className="space-y-4 md:space-y-6 mb-4 md:mb-6 bg-white rounded-xl border border-[#808080]">

                    <PostCard
                        key={datapost.id}
                        user={datapost.user}
                        content={datapost.content}
                        image={datapost.image}
                        likes={datapost.likes}
                        comments={datapost.comments}
                        shares={datapost.shares}
                        saves={datapost.saves}
                        timeAgo={post.timeAgo}
                    />

                </div>
            </div>

        </div>
    );
};

export default ProfilePage;
