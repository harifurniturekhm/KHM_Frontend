import { HiStar } from 'react-icons/hi';

const StarRating = ({ rating = 0, onRate = null, size = 'md' }) => {
    const sizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' };

    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(star => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onRate && onRate(star)}
                    className={`${onRate ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
                    disabled={!onRate}
                >
                    <HiStar
                        className={`${sizes[size]} ${star <= rating ? 'text-amber-400' : 'text-gray-300'
                            } transition-colors`}
                    />
                </button>
            ))}
        </div>
    );
};

export default StarRating;
