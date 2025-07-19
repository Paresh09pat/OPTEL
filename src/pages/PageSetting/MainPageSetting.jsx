// PageManagementSystem.js
import React, { useState } from 'react';
import { 
  Settings, 
  FileText, 
  Share2, 
  Image, 
  Palette, 
  Shield, 
  BarChart3, 
  Trash2 
} from 'lucide-react';

// Import all components
import GeneralSettings from './GeneralSettings';
import PageInformation from './PageInformation';
import SocialLinks from './SocialLinks';
import ProfilePictureAndCover from './ProfilePictureAndCover';
import Design from './Design';
import Admin from './Admin';
import PageAnalytics from './PageAnalytics';
import DeletePage from './DeletePage';

const MainPageSetting = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('general-setting');

  const menuItems = [
    { id: 'general-setting', label: 'General Setting', icon: Settings },
    { id: 'page-information', label: 'Page Information', icon: FileText },
    { id: 'social-links', label: 'Social Links', icon: Share2 },
    { id: 'profile-picture-cover', label: 'Profile Picture & Cover', icon: Image },
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'admin', label: 'Admin', icon: Shield },
    { id: 'page-analytics', label: 'Page Analytics', icon: BarChart3 },
    { id: 'delete-page', label: 'Delete Page', icon: Trash2 },
  ];

  const renderActiveComponent = () => {
    switch (activeMenuItem) {
      case 'general-setting':
        return <GeneralSettings />;
      case 'page-information':
        return <PageInformation />;
      case 'social-links':
        return <SocialLinks />;
      case 'profile-picture-cover':
        return <ProfilePictureAndCover />;
      case 'design':
        return <Design />;
      case 'admin':
        return <Admin />;
      case 'page-analytics':
        return <PageAnalytics />;
      case 'delete-page':
        return <DeletePage />;
      default:
        return <GeneralSettings />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 to-orange-600 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-orange-500 rounded-t-lg p-4 flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">JB</span>
          </div>
          <div>
            <h1 className="text-white text-xl font-semibold">Just Bhuvan Things ✓</h1>
            <p className="text-orange-100 text-sm">Category : HIP-HOP Music</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gray-100 rounded-b-lg flex min-h-[600px]">
          {/* Sidebar Menu */}
          <div className="w-64 bg-white rounded-bl-lg p-4">
            <h3 className="text-gray-600 font-medium mb-4 text-center">Menu</h3>
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveMenuItem(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                      activeMenuItem === item.id
                        ? 'bg-orange-500 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6">
            {renderActiveComponent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPageSetting;