import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

const QuickActionsSection = ({ className = '' }) => {
    const actions = [
      {
        icon: () => <Icon icon="iconoir:post-solid" width="30" height="30" style={{ color: '#9748ff' }} />,
        color: 'text-purple-500',
        bg: 'bg-purple-50',
        path: '/posts',
      },
      {
        icon: () => <Icon icon="solar:album-bold" width="30" height="30" style={{ color: '#8BC34B' }} />,
        color: 'text-green-500',
        bg: 'bg-green-50',
        path: '/albums',
      },
      {
        icon: () => <Icon icon="solar:folder-bold" width="30" height="30" style={{ color: '#F44336' }} />,
        color: 'text-red-500',
        bg: 'bg-red-50',
        path: '/folders',
      },
      {
        icon: () => <Icon icon="material-symbols:forum" width="30" height="30" style={{ color: '#8BC34B' }} />,
        color: 'text-green-600',
        bg: 'bg-green-50',
        path: '/forums',
      },
      {
        icon: () => <Icon icon="mingcute:group-3-fill" width="30" height="30" style={{ color: '#01A9F4' }} />,
        color: 'text-blue-500',
        bg: 'bg-blue-50',
        path: '/groups',
      },
      {
        icon: () => <Icon icon="fluent:document-one-page-multiple-24-filled" width="30" height="30" style={{ color: '#F69F58' }} />,
        color: 'text-orange-500',
        bg: 'bg-orange-50',
        path: '/documents',
      },
      {
        icon: () => <Icon icon="bxl:blogger" width="30" height="30" style={{ color: '#F25D4D' }} />,
        color: 'text-red-500',
        bg: 'bg-red-50',
        path: '/blogs',
      },
      {
        icon: () => <Icon icon="mingcute:news-fill" width="30" height="30" style={{ color: '#009DA0' }} />,
        color: 'text-teal-500',
        bg: 'bg-teal-50',
        path: '/news',
      },
      {
        icon: () => <Icon icon="hugeicons:new-job" width="30" height="30" style={{ color: '#4CAF50' }} />,
        color: 'text-green-500',
        bg: 'bg-green-50',
        path: '/jobs',
      },
    ];
  
    return (
      <div className={`bg-white rounded-2xl shadow-sm border border-[#808080] px-3 md:px-4 py-2 mb-4 md:mb-6 ${className}`}>
        <div className="flex items-center justify-between overflow-x-auto space-x-1 md:space-x-2">
          {actions.map((action, index) => (
            <Link to={action.path} key={index} className="flex-shrink-0">
              <button
                className={`flex flex-col items-center space-y-1 md:space-y-2 p-2 md:p-3 rounded-lg hover:bg-gray-50 transition-colors`}
              >
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl ${action.bg} flex items-center justify-center cursor-pointer`}>
                  <action.icon />
                </div>
              </button>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  export default memo(QuickActionsSection);