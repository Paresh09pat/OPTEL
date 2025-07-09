import { useRef ,memo} from 'react';

const ScrollableSection = ({ children, title }) => {
  const scrollRef = useRef(null);

  return (
    <div className="relative stable-layout">
      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide smooth-scroll pb-2"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default memo(ScrollableSection);