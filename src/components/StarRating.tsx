import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  max?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ value, onChange, max = 5 }) => {
  return (
    <div className="flex items-center space-x-1 star-rating">
      {Array.from({ length: max }).map((_, index) => {
        const starValue = index + 1;
        const filled = starValue <= value;
        
        return (
          <button
            key={`star-${index}`}
            type="button"
            onClick={() => onChange(starValue)}
            className={cn(
              "p-1 focus:outline-none",
              filled ? "text-yellow-400" : "text-gray-300"
            )}
            aria-label={`Rate ${starValue} out of ${max} stars`}
          >
            <Star
              className={cn(
                "w-6 h-6 transition-all duration-300", 
                filled ? "fill-yellow-400 stroke-yellow-500" : "fill-none stroke-gray-300"
              )}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
