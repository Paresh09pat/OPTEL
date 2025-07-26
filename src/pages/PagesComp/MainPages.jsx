import React, { useState } from 'react';
import MyPages from './MyPages';
import SuggestedPages from './SuggestedPages';
import LikedPages from './LikedPages';
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { Link } from 'react-router-dom';

const MainPages = () => {
  const [activeTab, setActiveTab] = useState('myPages');

  const tabs = [
    { id: 'myPages', label: 'My Pages' },
    { id: 'suggestedPages', label: 'Suggested Page' },
    { id: 'likedPages', label: 'Liked Page' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'myPages':
        return <MyPages />;
      case 'suggestedPages':
        return <SuggestedPages />;
      case 'likedPages':
        return <LikedPages />;
      default:
        return <MyPages />;
    }
  };

  return (
    <div className="min-h-screen bg-[#EDF6F9] px-4 sm:px-6 lg:px-15 py-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center flex-wrap gap-4 pb-6">
          <h1 className="text-xl sm:text-3xl lg:text-3xl font-bold text-gray-800">
            My Pages
          </h1>
          <Link to="/pagescomp/mainpages/createpage">
            <button className="text-[#808080] border cursor-pointer flex items-center gap-2 border-[#808080] px-4 py-2 rounded-full text-sm sm:text-base hover:bg-gray-50 transition">
              <MdOutlineAddPhotoAlternate className="text-lg" />
              <span>Create Page</span>
            </button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 sm:px-6 sm:py-3 rounded-full font-medium transition-colors duration-200 cursor-pointer text-sm sm:text-base ${activeTab === tab.id
                ? 'text-white shadow-md bg-gradient-to-b from-[rgba(246,159,88,1)] to-[rgba(244,180,0,0.5)]'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>


        {/* Content Section */}
        <div className="transition-all duration-300">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default MainPages;
