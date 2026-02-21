import { Link } from 'react-router-dom';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi';
import StarRating from './StarRating';

const ProductCard = ({ product, offer, reviewData, isLiked, onToggleLike }) => {
    const hasOffer = offer && offer.isActive;

    return (
        <Link to={`/product/${product._id}`} className="card group animate-fade-in block cursor-pointer" id={`product-card-${product._id}`}>
            {/* Image */}
            <div className="relative overflow-hidden aspect-[4/3]">
                <img
                    src={product.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 bg-white"
                />
                {/* Offer Badge */}
                {hasOffer && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-orange-500 text-white 
                        px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                        {offer.offerPercent}% OFF
                    </div>
                )}
                {/* Like Button */}
                <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleLike && onToggleLike(product._id); }}
                    className="absolute top-3 right-3 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full 
                   flex items-center justify-center hover:scale-110 transition-all shadow-md"
                >
                    {isLiked ? (
                        <HiHeart className="w-5 h-5 text-red-500" />
                    ) : (
                        <HiOutlineHeart className="w-5 h-5 text-gray-600" />
                    )}
                </button>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-display font-semibold text-dark-900 mb-1 group-hover:text-primary transition-colors line-clamp-1">
                    {product.name}
                </h3>

                {/* Specs */}
                {product.specifications?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                        {product.specifications.slice(0, 2).map((spec, i) => (
                            <span key={i} className="text-xs bg-gray-100 text-secondary px-2 py-0.5 rounded-md">
                                {spec.name}: {spec.value}
                            </span>
                        ))}
                    </div>
                )}

                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.shortDescription}</p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                    <StarRating rating={Math.round(reviewData?.averageRating || 0)} size="sm" />
                    <span className="text-xs text-gray-500">({reviewData?.count || 0})</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                    {hasOffer ? (
                        <>
                            <span className="text-lg font-bold text-primary">₹{offer.discountedPrice?.toLocaleString()}</span>
                            <span className="text-sm text-gray-400 line-through">₹{product.price?.toLocaleString()}</span>
                        </>
                    ) : (
                        <span className="text-lg font-bold text-primary">₹{product.price?.toLocaleString()}</span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
