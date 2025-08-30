import React from 'react';

const StarRating = ({
  rating,
  maxRating = 5,
  size = 'sm',
  interactive = false,
  onRatingChange = null
}) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4', 
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const handleStarClick = (starValue) => {
    if (interactive && onRatingChange) {
      onRatingChange(starValue);
    }
  };

  return (
    <div className="flex gap-1">
      {Array.from({ length: maxRating }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;

        return (
          <button
            key={index}
            type="button"
            className={`focus:outline-none ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
            onClick={() => handleStarClick(starValue)}
            disabled={!interactive}
          >
            <img
              className={sizeClasses[size]}
              src={isFilled ? "/icons/icon.png" : " "}
              alt={`${starValue} star`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
