import { memo } from 'react';

const Poll = ({ pollOptions, onVote, hasVoted, isLoading }) => {
  // Calculate total votes
  const totalVotes = pollOptions.reduce((sum, opt) => sum + (opt.votes || 0), 0);

  const handleOptionClick = (optionId) => {
    if (!hasVoted && !isLoading && onVote) {
      onVote(optionId);
    }
  };

  return (
    <div className="px-4 pb-3">
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        {pollOptions.map((option) => {
          // Use percentage from API if available, otherwise calculate
          const percentage = option.percentage !== undefined 
            ? option.percentage 
            : (totalVotes > 0 ? ((option.votes || 0) / totalVotes) * 100 : 0);
          const isSelected = option.is_voted;

          return (
            <div
              key={option.id}
              className={`relative rounded-lg border-2 transition-all duration-200 overflow-hidden ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : hasVoted
                  ? 'border-gray-200 bg-white cursor-default'
                  : 'border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50 cursor-pointer active:scale-[0.98]'
              } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
              onClick={() => handleOptionClick(option.id)}
            >
              <div className="p-4 flex items-center justify-between relative z-10">
                <span className={`text-sm font-medium flex-1 ${
                  isSelected ? 'text-blue-700' : 'text-gray-800'
                }`}>
                  {option.text}
                </span>
                {(hasVoted || isSelected) && (
                  <span className={`text-sm font-semibold ml-4 whitespace-nowrap ${
                    isSelected ? 'text-blue-700' : 'text-gray-600'
                  }`}>
                    {percentage.toFixed(1)}%
                  </span>
                )}
              </div>

              {/* Progress bar - show only after voting */}
              {hasVoted && (
                <div className="absolute bottom-0 left-0 right-0 h-full bg-gray-200/30 rounded-lg overflow-hidden pointer-events-none">
                  <div
                    className={`h-full transition-all duration-700 ease-out ${
                      isSelected ? 'bg-blue-500/20' : 'bg-gray-400/20'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}

        {hasVoted && totalVotes > 0 && (
          <div className="text-xs text-gray-500 text-center pt-3 border-t border-gray-200 mt-2">
            {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'} total
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(Poll);

