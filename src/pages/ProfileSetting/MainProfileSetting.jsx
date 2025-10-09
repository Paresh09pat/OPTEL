import React, { useState } from 'react';
import { FiSettings, FiUser, FiShield, FiLink, FiUsers, FiBell, FiMapPin, FiCheckCircle, FiInfo, FiTrash2 } from 'react-icons/fi';
import { MdPalette } from 'react-icons/md';
import { MenuIcon, XIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

// Import all components
import GeneralSettings from './GeneralSettings';
import ProfileSettings from './ProfileSettings';
import PrivacySettings from './PrivacySettings';

const MainProfileSetting = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('general-setting');
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { 
      id: 'general-setting', 
      label: 'General Setting', 
      icon: FiSettings,
      hasSubMenu: false
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: FiUser,
      hasSubMenu: false
    },
    { 
      id: 'privacy', 
      label: 'Privacy', 
      icon: FiShield,
      hasSubMenu: true,
      subItems: [
        { id: 'privacy-main', label: 'Privacy' },
        { id: 'password', label: 'Password' },
        { id: 'manage-sessions', label: 'Manage Sessions' }
      ]
    },
    { 
      id: 'social-links', 
      label: 'Social Links', 
      icon: FiLink,
      hasSubMenu: false
    },
    { 
      id: 'design', 
      label: 'Design', 
      icon: MdPalette,
      hasSubMenu: true,
      subItems: [
        { id: 'theme', label: 'Theme' },
        { id: 'colors', label: 'Colors' },
        { id: 'layout', label: 'Layout' }
      ]
    },
    { 
      id: 'blocked-users', 
      label: 'Blocked Users', 
      icon: FiUsers,
      hasSubMenu: false
    },
    { 
      id: 'notification-setting', 
      label: 'Notification Setting', 
      icon: FiBell,
      hasSubMenu: false
    },
    { 
      id: 'location', 
      label: 'Location', 
      icon: FiMapPin,
      hasSubMenu: false
    },
    { 
      id: 'verification', 
      label: 'Verification', 
      icon: FiCheckCircle,
      hasSubMenu: false
    },
    { 
      id: 'my-information', 
      label: 'My Information', 
      icon: FiInfo,
      hasSubMenu: false
    },
    { 
      id: 'delete-account', 
      label: 'Delete Account', 
      icon: FiTrash2,
      hasSubMenu: false
    }
  ];

  const renderActiveComponent = () => {
    switch (activeMenuItem) {
      case 'general-setting':
        return <GeneralSettings />;
      case 'profile':
        return <ProfileSettings />;
      case 'privacy-main':
        return <PrivacySettings />;
      case 'password':
        return <div className="bg-white rounded-xl p-6 border border-[#d3d1d1]"><h2 className="text-xl font-semibold text-[#808080] text-center">Password Settings</h2><p className="text-center mt-4">Password settings component coming soon...</p></div>;
      case 'manage-sessions':
        return <div className="bg-white rounded-xl p-6 border border-[#d3d1d1]"><h2 className="text-xl font-semibold text-[#808080] text-center">Manage Sessions</h2><p className="text-center mt-4">Session management component coming soon...</p></div>;
      default:
        return <GeneralSettings />;
    }
  };

  const handleMenuClick = (item) => {
    if (item.hasSubMenu) {
      setActiveSubMenu(activeSubMenu === item.id ? null : item.id);
    } else {
      setActiveMenuItem(item.id);
      setActiveSubMenu(null);
    }
  };

  const handleSubMenuClick = (subItem) => {
    setActiveMenuItem(subItem.id);
  };

  return (
    <div className="min-h-screen bg-[#EDF6F9] pt-8 overflow-x-hidden pb-8">
      <div className="max-w-6xl mx-auto relative">

        {/* main header */}
        <div className="flex justify-between items-center flex-wrap gap-4 pb-8">
          <h1 className="text-xl sm:text-3xl lg:text-3xl font-bold text-gray-800">
            Profile Setting
          </h1>
          <Link to="/profile">
            <button className="text-[#808080] flex items-center gap-2 border border-[#808080] px-4 py-2 rounded-full text-sm sm:text-base hover:bg-gray-50 transition">
              <FiUser className="text-lg" />
              <span>View Profile</span>
            </button>
          </Link>
        </div>

        {/* Header */}
        <div className="bg-[#F69F58] rounded-xl p-4 h-[200px] py-5 px-8 ">
          <div className="flex items-center gap-5">
            <div className="size-[74px] bg-gray-800 rounded-full flex items-center justify-center" style={{ backgroundImage: "url('/perimg.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
            </div>
            <div>
              <h1 className="text-white text-xl font-semibold">Aman Shaikh ✓</h1>
              <p className="text-orange-100 text-sm">@_amu_456</p>
            </div>
          </div>
          <div className='absolute top-8 right-6 block md:hidden text-white cursor-pointer font-semibold z-50'>
            <button className=' ' onClick={() => setIsMenuOpen(!isMenuOpen)} >
              {isMenuOpen ? <XIcon className='size-7' /> : <MenuIcon className='size-7' />}
            </button>
          </div>
          <div className={`overlay ${isMenuOpen ? 'block' : 'hidden'} bg-black/50 absolute top-0 left-0 w-full min-h-screen z-40`} onClick={() => setIsMenuOpen(false)}></div>
          <div className={`w-64 z-50 overflow-hidden block md:hidden bg-white rounded-xl pt-1.5  mx-2 border border-[#808080] absolute top-16 -right-10 ${isMenuOpen ? '-translate-x-9' : 'translate-x-full'} transition-transform duration-300`}>
            <h3 className="text-[#808080] font-medium  text-xl text-center">Menu</h3>
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.id}>
                    <button
                      onClick={() => handleMenuClick(item)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm transition-colors ${
                        activeMenuItem === item.id || (item.hasSubMenu && activeSubMenu === item.id)
                          ? 'bg-gradient-to-r from-[rgba(246,159,88,1)] to-[rgba(244,180,0,0.5)] text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="size-[19px]" />
                        <span>{item.label}</span>
                      </div>
                      {item.hasSubMenu && (
                        <span className={`transform transition-transform ${activeSubMenu === item.id ? 'rotate-180' : ''}`}>
                          ▼
                        </span>
                      )}
                    </button>
                    
                    {/* Sub Menu */}
                    {item.hasSubMenu && activeSubMenu === item.id && (
                      <div className="ml-6 space-y-1">
                        {item.subItems.map((subItem) => (
                          <button
                            key={subItem.id}
                            onClick={() => handleSubMenuClick(subItem)}
                            className={`w-full flex items-center px-3 py-2 text-sm transition-colors ${
                              activeMenuItem === subItem.id
                                ? 'bg-gradient-to-r from-[rgba(246,159,88,1)] to-[rgba(244,180,0,0.5)] text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <span>{subItem.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className=" rounded-b-lg flex min-h-[600px] -mt-20">
          {/* Sidebar Menu */}
          <div className="w-64 hidden md:block overflow-hidden h-full bg-white rounded-xl pt-1.5  mx-2 border border-[#808080]">
            <h3 className="text-[#808080] font-medium  text-xl text-center">Menu</h3>
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.id}>
                    <button
                      onClick={() => handleMenuClick(item)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm transition-colors ${
                        activeMenuItem === item.id || (item.hasSubMenu && activeSubMenu === item.id)
                          ? 'bg-gradient-to-r from-[rgba(246,159,88,1)] to-[rgba(244,180,0,0.5)] text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="size-[19px]" />
                        <span>{item.label}</span>
                      </div>
                      {item.hasSubMenu && (
                        <span className={`transform transition-transform ${activeSubMenu === item.id ? 'rotate-180' : ''}`}>
                          ▼
                        </span>
                      )}
                    </button>
                    
                    {/* Sub Menu */}
                    {item.hasSubMenu && activeSubMenu === item.id && (
                      <div className="ml-6 space-y-1">
                        {item.subItems.map((subItem) => (
                          <button
                            key={subItem.id}
                            onClick={() => handleSubMenuClick(subItem)}
                            className={`w-full flex items-center px-3 py-2 text-sm transition-colors ${
                              activeMenuItem === subItem.id
                                ? 'bg-gradient-to-r from-[rgba(246,159,88,1)] to-[rgba(244,180,0,0.5)] text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <span>{subItem.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 pl-1 pr-2 ">
            {renderActiveComponent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainProfileSetting;
