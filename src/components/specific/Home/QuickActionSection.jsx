import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

const QuickActionsSection = ({ className = '', fetchNewFeeds }) => {


  const actions = [
    {
      icon: () => <Icon icon="iconoir:post-solid" width="30" height="30" style={{ color: '#9748ff' }} />,
      color: 'text-purple-500',
      name: "text",
      tooltip: 'Texts', 
      // 'photos','video','music','files','maps','text'

    },
    {
      icon: () => <Icon icon="solar:album-bold" width="30" height="30" style={{ color: '#8BC34B' }} />,
      color: 'text-green-500',
      name: "photos",
      tooltip: 'images'
    },
    {
      icon: () => <Icon icon="solar:folder-bold" width="30" height="30" style={{ color: '#F44336' }} />,
      color: 'text-red-500',
      name: "files",
      tooltip: 'files'
    },
    {
      icon: () => <Icon icon="vscode-icons:file-type-video" width="30" height="30" style={{ color: '#8BC34B' }} />,
      color: 'text-green-600',
      name: "video",
      tooltip: 'videos'
    },
    {
      icon: () => <Icon icon="mdi:audio-video" width="30" height="30" style={{ color: '#01A9F4' }} />,
      color: 'text-blue-500',
      name: "music",
      tooltip: 'audio'
    },
    {
      icon: () => <Icon icon="fluent:document-one-page-multiple-24-filled" width="30" height="30" style={{ color: '#F69F58' }} />,
      color: 'text-orange-500',

      tooltip: 'Pages'
    },
    {
      icon: () => <Icon icon="bxl:blogger" width="30" height="30" style={{ color: '#F25D4D' }} />,
      color: 'text-red-500',

      tooltip: 'Blog'
    },
    {
      icon: () => <Icon icon="mingcute:news-fill" width="30" height="30" style={{ color: '#009DA0' }} />,
      color: 'text-teal-500',

      tooltip: 'Articles'
    },
    {
      icon: () => <Icon icon="hugeicons:new-job" width="30" height="30" style={{ color: '#4CAF50' }} />,
      color: 'text-green-500',

      tooltip: 'Jobs'
    },
  ];

  return (
            <div className={`bg-white rounded-2xl shadow-sm border border-[#d3d1d1] py-[8px] px-3 ${className}`}>
      <div className="flex items-center justify-between overflow-hidden space-x-1 md:space-x-2">
        {actions.map((action, index) => (

          <button key={index}
            className={`flex flex-col items-center space-y-1 md:space-y-2`}
            title={action.tooltip}
            onClick={() => fetchNewFeeds(action.name)}
          >
            <div className={`w-7 h-7  rounded-xl ${action.bg} flex items-center justify-center cursor-pointer`}>
              <action.icon />
            </div>
          </button>

        ))}
      </div>
    </div>
  );
};

export default memo(QuickActionsSection);