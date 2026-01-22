import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

const QuickActionsSection = ({ className = '', fetchNewFeeds, activeFilter = null }) => {


  const actions = [
    {
      icon: () => <Icon icon="solar:album-bold" width="30" height="30" style={{ color: '#8BC34B' }} />,
      color: 'text-green-500',
      name: "image",
      tooltip: 'Images'
    },
    {
      icon: () => <Icon icon="solar:folder-bold" width="30" height="30" style={{ color: '#F44336' }} />,
      color: 'text-red-500',
      name: "file",
      tooltip: 'Files'
    },
    {
      icon: () => <Icon icon="vscode-icons:file-type-video" width="30" height="30" style={{ color: '#8BC34B' }} />,
      color: 'text-green-600',
      name: "video",
      tooltip: 'Videos'
    },
    {
      icon: () => <Icon icon="solar:music-note-bold" width="30" height="30" style={{ color: '#01A9F4' }} />,
      color: 'text-blue-500',
      name: "audio",
      tooltip: 'Audio'
    },
    {
      icon: () => <Icon icon="bxl:blogger" width="30" height="30" style={{ color: '#F25D4D' }} />,
      color: 'text-red-500',
      name: "blogs",
      tooltip: 'Blogs'
    },
    {
      icon: () => <Icon icon="mingcute:news-fill" width="30" height="30" style={{ color: '#009DA0' }} />,
      color: 'text-teal-500',
      name: "articles",
      tooltip: 'Articles'
    },
    {
      icon: () => <Icon icon="hugeicons:new-job" width="30" height="30" style={{ color: '#4CAF50' }} />,
      color: 'text-green-500',
      name: "jobs",
      tooltip: 'Jobs'
    },
  ];

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-[#d3d1d1] py-5 px-6 ${className}`}>
      <div className="flex items-center justify-between gap-3 md:gap-4">
        {actions.map((action, index) => {
          const isActive = activeFilter === action.name;
          return (
            <button 
              key={index}
              className={`flex flex-col items-center transition-all duration-200 ${
                isActive ? 'scale-110' : 'hover:scale-105'
              }`}
              title={action.tooltip}
              onClick={() => fetchNewFeeds(action.name)}
            >
              <div className={`w-7 h-7 rounded-xl ${action.bg} flex items-center justify-center cursor-pointer transition-all duration-200 ${
                isActive 
                  ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg' 
                  : 'hover:shadow-md'
              }`}>
                <action.icon />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default memo(QuickActionsSection);