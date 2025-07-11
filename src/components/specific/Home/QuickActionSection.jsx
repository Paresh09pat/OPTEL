import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

const QuickActionsSection = ({ className = '' }) => {
    const actions = [
      {
        icon: () => <Icon icon="iconoir:post-solid" width="30" height="30" style={{ color: '#9748ff' }} />,
        color: 'text-purple-500',
       
        path: '/posts',
      },
      {
        icon: () => <Icon icon="solar:album-bold" width="30" height="30" style={{ color: '#8BC34B' }} />,
        color: 'text-green-500',
        
        path: '/albums',
      },
      {
        icon: () => <Icon icon="solar:folder-bold" width="30" height="30" style={{ color: '#F44336' }} />,
        color: 'text-red-500',
        
        path: '/folders',
      },
      {
        icon: () => <Icon icon="material-symbols:forum" width="30" height="30" style={{ color: '#8BC34B' }} />,
        color: 'text-green-600',
        
        path: '/forums',
      },
      {
        icon: () => <Icon icon="mingcute:group-3-fill" width="30" height="30" style={{ color: '#01A9F4' }} />,
        color: 'text-blue-500',
        
        path: '/groups',
      },
      {
        icon: () => <Icon icon="fluent:document-one-page-multiple-24-filled" width="30" height="30" style={{ color: '#F69F58' }} />,
        color: 'text-orange-500',
        
        path: '/documents',
      },
      {
        icon: () => <Icon icon="bxl:blogger" width="30" height="30" style={{ color: '#F25D4D' }} />,
        color: 'text-red-500',
        
        path: '/blogs',
      },
      {
        icon: () => <Icon icon="mingcute:news-fill" width="30" height="30" style={{ color: '#009DA0' }} />,
        color: 'text-teal-500',
        
        path: '/news',
      },
      {
        icon: () => <Icon icon="hugeicons:new-job" width="30" height="30" style={{ color: '#4CAF50' }} />,
        color: 'text-green-500',
        
        path: '/jobs',
      },
    ];
  
    return (
      <div className={`bg-white rounded-2xl shadow-sm border border-[#808080] py-[8px] px-3 ${className}`}>
        <div className="flex items-center justify-between overflow-hidden space-x-1 md:space-x-2">
          {actions.map((action, index) => (
            <Link to={action.path} key={index} className="flex-shrink-0">
              <button
                className={`flex flex-col items-center space-y-1 md:space-y-2 `}
              >
                <div className={`w-7 h-7  rounded-xl ${action.bg} flex items-center justify-center cursor-pointer`}>
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