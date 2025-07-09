import { useState, useEffect, useRef, useCallback, memo } from 'react';

const InfiniteFriendSuggestions = ({ friendSuggestions, onAddFriend }) => {
    const [displayedFriends, setDisplayedFriends] = useState([]);
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const scrollCheckRef = useRef(null);
    const isLoadingRef = useRef(false);

    const generateMoreFriends = useCallback(() => {
        const names = ['Alex Johnson', 'Sarah Wilson', 'Mike Chen', 'Emma Davis', 'David Kumar', 'Lisa Zhang', 'James Rodriguez', 'Anna Patel', 'Tom Brown', 'Maria Garcia', 'John Smith', 'Sophie Turner', 'Chris Lee', 'Rachel Green', 'Daniel Clark', 'Nina Sharma'];
        const usernames = ['@alex_dev', '@sarah_designer', '@mike_photo', '@emma_writer', '@david_code', '@lisa_art', '@james_music', '@anna_travel', '@tom_fitness', '@maria_chef', '@john_travel', '@sophie_reads', '@chris_tech', '@rachel_yoga', '@daniel_art', '@nina_dance'];

        const newFriends = [];
        for (let i = 0; i < 20; i++) {
            const randomIndex = Math.floor(Math.random() * names.length);
            newFriends.push({
                id: Date.now() + Math.random() + i,
                name: names[randomIndex],
                username: usernames[randomIndex],
                avatar: '/api/placeholder/160/128'
            });
        }
        return newFriends;
    }, []);

    useEffect(() => {
        const initialFriends = [...friendSuggestions, ...generateMoreFriends()];
        setDisplayedFriends(initialFriends);
    }, [friendSuggestions, generateMoreFriends]);

    // Throttled scroll check function
    const checkScrollButtons = useCallback(() => {
        if (scrollCheckRef.current) {
            cancelAnimationFrame(scrollCheckRef.current);
        }

        scrollCheckRef.current = requestAnimationFrame(() => {
            if (scrollRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                setCanScrollLeft(scrollLeft > 0);
                setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
            }
        });
    }, []);

    useEffect(() => {
        checkScrollButtons();
        const handleResize = () => checkScrollButtons();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            if (scrollCheckRef.current) {
                cancelAnimationFrame(scrollCheckRef.current);
            }
        };
    }, [displayedFriends, checkScrollButtons]);

    const scrollLeft = useCallback(() => {
        if (scrollRef.current) {
            const cardWidth = 176; // 160px + 16px gap
            scrollRef.current.scrollBy({ left: -cardWidth * 3, behavior: 'smooth' });
            // Use requestAnimationFrame for better timing
            requestAnimationFrame(() => {
                setTimeout(checkScrollButtons, 300);
            });
        }
    }, [checkScrollButtons]);

    const scrollRight = useCallback(() => {
        if (scrollRef.current) {
            const cardWidth = 176; // 160px + 16px gap
            scrollRef.current.scrollBy({ left: cardWidth * 3, behavior: 'smooth' });

            // Load more friends when near the end (throttled)
            if (!isLoadingRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                if (scrollLeft + clientWidth >= scrollWidth - 500) {
                    isLoadingRef.current = true;
                    requestAnimationFrame(() => {
                        setDisplayedFriends(prev => [...prev, ...generateMoreFriends()]);
                        setTimeout(() => {
                            isLoadingRef.current = false;
                        }, 300);
                    });
                }
            }

            // Use requestAnimationFrame for better timing
            requestAnimationFrame(() => {
                setTimeout(checkScrollButtons, 300);
            });
        }
    }, [checkScrollButtons, generateMoreFriends]);

    // Throttled scroll handler
    const handleScroll = useCallback(() => {
        checkScrollButtons();
    }, [checkScrollButtons]);

    return (
        <div className="relative group stable-layout">
            {/* Left Arrow - Desktop only */}
            <button
                onClick={scrollLeft}
                className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 items-center justify-center transition-all duration-200 hover:shadow-xl hidden md:flex group-hover:opacity-100 will-change-transform ${canScrollLeft ? 'opacity-70 hover:opacity-100' : 'opacity-30 cursor-not-allowed'
                    }`}
                disabled={!canScrollLeft}
            >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {/* Right Arrow - Desktop only */}
            <button
                onClick={scrollRight}
                className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 items-center justify-center transition-all duration-200 hover:shadow-xl hidden md:flex group-hover:opacity-100 will-change-transform ${canScrollRight ? 'opacity-70 hover:opacity-100' : 'opacity-30 cursor-not-allowed'
                    }`}
                disabled={!canScrollRight}
            >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            <div
                ref={scrollRef}
                className="flex space-x-4 overflow-x-auto scrollbar-hide smooth-scroll pb-2 px-2 md:px-12"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    WebkitOverflowScrolling: 'touch' // Better touch scrolling on mobile
                }}
                onScroll={handleScroll}
            >
                {displayedFriends.map(friend => (
                    <FriendSuggestionCard
                        key={friend.id}
                        user={friend}
                        onAddFriend={() => onAddFriend(friend.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default memo(InfiniteFriendSuggestions);


const FriendSuggestionCard = ({ user, onAddFriend }) => (
    <div className="bg-white rounded-xl shadow-sm border border-[#808080] overflow-hidden min-w-[150px] max-w-[150px] md:min-w-[160px] md:max-w-[160px] flex-shrink-0 hover:shadow-md transition-shadow duration-200">
        <div className="relative">
            <img
                src="/perimg.png"
                alt={user.name}
                className="w-full h-28 md:h-32 object-cover"
            />
        </div>
        <div className="p-3 text-center">
            <h3 className="font-semibold text-gray-900 text-xs md:text-sm mb-1 truncate">{user.name}</h3>
            <p className="text-xs text-gray-500 mb-3 truncate">{user.username}</p>
            <button
                onClick={onAddFriend}
                className="bg-white border border-gray-300 text-gray-700 px-2 md:px-3 py-1.5 rounded-md text-xs md:text-sm hover:bg-gray-50 transition-colors w-full font-medium"
            >
                Add Friend
            </button>
        </div>
    </div>
);