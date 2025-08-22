import { memo } from "react";

const FeedCard = ({ image, username, isVideo = false, avatar, onClick }) => {
    return (
    <div 
      className="relative flex-shrink-0 w-[120px] h-[160px] rounded-xl overflow-hidden cursor-pointer group"
      onClick={onClick}
    >
        <img
            src={image}
            alt={username}
            className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-200"></div>
        {isVideo && (
            <div className="absolute top-3 right-3 bg-black bg-opacity-50 rounded-full p-1.5">
                <Play className="text-white w-3 h-3" />
            </div>
        )}
        <div className="absolute bottom-3 left-3 flex items-center space-x-2">
            <img
                src={avatar}
                alt={username}
                className="w-8 h-8 rounded-full border-2 border-white object-cover"
            />
            <span className="text-white text-sm font-medium">{username}</span>
        </div>
    </div>
    )
}

export default memo(FeedCard);