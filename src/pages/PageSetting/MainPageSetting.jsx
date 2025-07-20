// PageManagementSystem.js
import React, { useState } from 'react';

// Import all components
import GeneralSettings from './GeneralSettings';
import PageInformation from './PageInformation';
import SocialLinks from './SocialLinks';
import ProfilePictureAndCover from './ProfilePictureAndCover';
import Design from './Design';
import Admin from './Admin';
import PageAnalytics from './PageAnalytics';
import DeletePage from './DeletePage';
import { FiSettings } from 'react-icons/fi';
import { GoLink } from "react-icons/go";
import { RiShieldUserLine } from "react-icons/ri";
import { MdOutlineDelete } from "react-icons/md";
import { CiBurger } from 'react-icons/ci';
import { MenuIcon, XIcon } from 'lucide-react';

const MainPageSetting = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('general-setting');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pageIcon = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={19} height={19} viewBox="0 0 16 16"><path fill="currentColor" fillRule="evenodd" d="M14 4.57a.5.5 0 0 0-.024-.235l-.013-.063a1.5 1.5 0 0 0-.18-.434c-.092-.15-.222-.28-.482-.54l-2.59-2.59c-.259-.26-.389-.39-.54-.483a1.5 1.5 0 0 0-.496-.193a.5.5 0 0 0-.235-.024C9.329.004 9.194.004 9.015.004h-2.21c-1.68 0-2.52 0-3.16.327a3.02 3.02 0 0 0-1.31 1.31c-.327.642-.327 1.48-.327 3.16v6.4c0 1.68 0 2.52.327 3.16a3.02 3.02 0 0 0 1.31 1.31c.642.327 1.48.327 3.16.327h2.4c1.68 0 2.52 0 3.16-.327a3 3 0 0 0 1.31-1.31c.327-.642.327-1.48.327-3.16V4.99c0-.178 0-.313-.005-.425zm-4.8 10.4H6.8c-.857 0-1.44 0-1.89-.038c-.438-.035-.663-.1-.819-.18a2 2 0 0 1-.874-.874c-.08-.156-.145-.38-.18-.819c-.037-.45-.038-1.03-.038-1.89v-6.4c0-.857.001-1.44.038-1.89c.036-.438.101-.663.18-.819c.192-.376.498-.682.874-.874c.156-.08.381-.145.819-.18C5.36.97 5.94.97 6.8.97H9v3.5a.5.5 0 0 0 .5.5H13v6.2c0 .857 0 1.44-.038 1.89c-.035.438-.1.663-.18.819a2 2 0 0 1-.874.874c-.156.08-.38.145-.819.18c-.45.037-1.03.037-1.89.037zm.8-13.6l2.59 2.59H10z" clipRule="evenodd"></path></svg>
    ) 
  }
  const profileIcon = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={19} height={19} viewBox="0 0 14 14"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5v2a1 1 0 0 1-1 1h-2m0-13h2a1 1 0 0 1 1 1v2m-13 0v-2a1 1 0 0 1 1-1h2m0 13h-2a1 1 0 0 1-1-1v-2m6.5-4a2 2 0 1 0 0-4a2 2 0 0 0 0 4m3.803 4.5a3.994 3.994 0 0 0-7.606 0z" strokeWidth={1}></path></svg>
    ) 
  }
  const designIcon = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={19} height={19} viewBox="0 0 16 16"><path fill="currentColor" d="M3.58 1.125a.5.5 0 0 1 .12.598a.3.3 0 0 0-.013.09c0 .063.016.183.167.333c.073.073.129.125.19.182c.05.046.103.094.17.16c.13.124.267.27.39.453c.255.383.396.862.396 1.559c0 .382-.063.74-.178 1.057C4.496 6.457 3.763 7 3 7s-1.496-.544-1.822-1.443A3.1 3.1 0 0 1 1 4.5c0-.326.087-.715.207-1.074s.288-.732.482-1.032c.231-.39.556-.717.808-.937a6 6 0 0 1 .432-.343l.03-.02l.009-.007l.003-.002l.002-.001a.5.5 0 0 1 .608.041M3 8a2.7 2.7 0 0 0 1.738-.628q.03.094.057.19C5 8.314 5 9.244 5 9.963V10c0 2.058-.385 3.28-.821 4.007a2.7 2.7 0 0 1-.638.747a1.7 1.7 0 0 1-.33.2S3.084 15 3 15a.8.8 0 0 1-.211-.046a1.7 1.7 0 0 1-.33-.2a2.7 2.7 0 0 1-.638-.747C1.385 13.281 1 12.058 1 10v-.036c0-.72 0-1.649.205-2.403q.026-.094.057-.19A2.7 2.7 0 0 0 3 8.002m3.998 2.973a4.5 4.5 0 0 1-1.016-.235Q6 10.362 6 9.96v-.296c.31.147.646.25.998.3V8a2 2 0 0 1 2-2h1.965a3.5 3.5 0 0 0-5.075-2.609a3.2 3.2 0 0 0-.384-.926A4.5 4.5 0 0 1 11.97 6h1.027a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2zM11.971 7a4.5 4.5 0 0 1-3.973 3.973V12a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm-1.008 0H8.998a1 1 0 0 0-1 1v1.965A3.5 3.5 0 0 0 10.963 7"></path></svg>
    ) 
  }
  const analyticsIcon = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={19} height={19} viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth={1.5}><path strokeLinejoin="round" d="m7 14l2.293-2.293a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 0 1.414 0L17 10m0 0v2.5m0-2.5h-2.5"></path><path d="M22 12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2s7.071 0 8.535 1.464c.974.974 1.3 2.343 1.41 4.536"></path></g></svg>
    ) 
  }
  const menuItems = [
    { id: 'general-setting', label: 'General Setting', icon: FiSettings },
    { id: 'page-information', label: 'Page Information', icon: pageIcon },
    { id: 'social-links', label: 'Social Links', icon: GoLink },
    { id: 'profile-picture-cover', label: 'Profile Picture & Cover', icon: profileIcon },
    { id: 'design', label: 'Design', icon: designIcon },
    { id: 'admin', label: 'Admin', icon: RiShieldUserLine },
    { id: 'page-analytics', label: 'Page Analytics', icon: analyticsIcon },
    { id: 'delete-page', label: 'Delete Page', icon: MdOutlineDelete },
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
    <div className="min-h-screen bg-[#EDF6F9] pt-8 overflow-x-hidden">
      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <div className="bg-[#F69F58] rounded-xl p-4 h-[200px] py-5 px-8 ">
          <div className="flex items-center gap-5">
          <div className="size-[74px] bg-gray-800 rounded-full flex items-center justify-center" style={{backgroundImage: "url('/perimg.png')", backgroundSize: "cover", backgroundPosition: "center"}}>
            
          </div>
          <div>
            <h1 className="text-white text-xl font-semibold">Just Bhuvan Things ✓</h1>
            <p className="text-orange-100 text-sm">Category : HIP-HOP Music</p>
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
                  <button
                    key={item.id}
                    onClick={() => setActiveMenuItem(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-sm  transition-colors ${
                      activeMenuItem === item.id
                        ? 'bg-gradient-to-r from-[rgba(246,159,88,1)] to-[rgba(244,180,0,0.5)] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="size-[19px]" />
                    <span>{item.label}</span>
                  </button>
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
                  <button
                    key={item.id}
                    onClick={() => setActiveMenuItem(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-sm  transition-colors ${
                      activeMenuItem === item.id
                        ? 'bg-gradient-to-r from-[rgba(246,159,88,1)] to-[rgba(244,180,0,0.5)] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="size-[19px]" />
                    <span>{item.label}</span>
                  </button>
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

export default MainPageSetting;