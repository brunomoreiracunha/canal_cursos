import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: number;
}

export function StarRating({ rating, size = 16 }: StarRatingProps) {
  // Arredonda para o meio mais próximo (ex: 4.3 -> 4.5, 4.1 -> 4.0)
  const roundedRating = Math.round(rating * 2) / 2;
  
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((value) => {
        const filled = value <= Math.floor(roundedRating);
        const half = value === Math.ceil(roundedRating) && !filled;
        
        return (
          <div key={value} className="relative">
            <Star
              size={size}
              className={`${
                filled ? 'text-yellow-400' : 'text-gray-400'
              }`}
              fill={filled ? 'currentColor' : 'none'}
            />
            {half && (
              <div className="absolute inset-0 overflow-hidden w-1/2">
                <Star
                  size={size}
                  className="text-yellow-400"
                  fill="currentColor"
                />
              </div>
            )}
          </div>
        );
      })}
      <span className="text-sm text-gray-400 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}
