import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import StarRating from '../components/StarRating';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiHeart, HiOutlineHeart, HiShoppingCart, HiLogin } from 'react-icons/hi';

const ProductDetail = () => {
    const { id } = useParams();
    const { user, setShowLoginModal } = useAuth();
    const [product, setProduct] = useState(null);
    const [offer, setOffer] = useState(null);
    const [reviewData, setReviewData] = useState({ reviews: [], averageRating: 0, count: 0 });
    const [selectedImage, setSelectedImage] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [showOrderForm, setShowOrderForm] = useState(false);
    const [orderForm, setOrderForm] = useState({ address: '', quantity: 1 });
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
    const visitorId = localStorage.getItem('visitorId') || 'v_' + Math.random().toString(36).slice(2);

    useEffect(() => {
        localStorage.setItem('visitorId', visitorId);
        API.get(`/products/${id}`).then(res => setProduct(res.data)).catch(() => { });
        API.get(`/reviews/${id}`).then(res => setReviewData(res.data)).catch(() => { });
        API.get('/offers/active').then(res => {
            const match = res.data.find(o => o.product?._id === id || o.product === id);
            if (match) setOffer(match);
        }).catch(() => { });
        API.get(`/likes/check?visitorId=${visitorId}`).then(res => setIsLiked(res.data.includes(id))).catch(() => { });
    }, [id]);



    const toggleLike = async () => {
        try {
            const res = await API.post('/likes', { product: id, visitorId });
            setIsLiked(res.data.liked);
            toast.success(res.data.liked ? 'Added to favorites!' : 'Removed from favorites');
        } catch { toast.error('Failed to update'); }
    };

    const handleOrderClick = () => {
        if (!user) {
            toast.error('Please login to place an order');
            setShowLoginModal(true);
            return;
        }
        setShowOrderForm(true);
    };

    const submitOrder = async (e) => {
        e.preventDefault();
        try {
            await API.post('/orders', { address: orderForm.address, quantity: orderForm.quantity, product: id });
            toast.success('Order placed successfully!');
            setShowOrderForm(false);
            setOrderForm({ address: '', quantity: 1 });
        } catch (err) {
            if (err.response?.status === 401) {
                toast.error('Please login to place an order');
                setShowLoginModal(true);
            } else {
                toast.error('Failed to place order');
            }
        }
    };

    const submitReview = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to write a review');
            setShowLoginModal(true);
            return;
        }
        try {
            await API.post('/reviews', { ...reviewForm, product: id });
            toast.success('Review submitted!');
            setReviewForm({ rating: 5, comment: '' });
            API.get(`/reviews/${id}`).then(res => setReviewData(res.data)).catch(() => { });
        } catch (err) {
            if (err.response?.status === 401) {
                toast.error('Please login to write a review');
                setShowLoginModal(true);
            } else {
                toast.error('Failed to submit review');
            }
        }
    };

    if (!product) return (
        <div className="min-h-screen pt-24 flex items-center justify-center">
            <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
        </div>
    );

    const hasOffer = offer?.isActive;
    const displayPrice = hasOffer ? offer.discountedPrice : product.price;

    return (
        <div className="min-h-screen pt-24 md:pt-28 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="relative aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden">
                            <img
                                src={product.images?.[selectedImage] || 'https://via.placeholder.com/600x450?text=No+Image'}
                                alt={product.name}
                                className="w-full h-full object-contain"
                            />
                            {hasOffer && (
                                <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                                    {offer.offerPercent}% OFF
                                </div>
                            )}
                        </div>
                        {product.images?.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto">
                                {product.images.map((img, i) => (
                                    <button key={i} onClick={() => setSelectedImage(i)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${i === selectedImage ? 'border-primary shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'
                                            }`}>
                                        <img src={img} alt="" className="w-full h-full object-contain" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-display font-bold text-dark-900 mb-2">{product.name}</h1>
                            <div className="flex items-center gap-3">
                                <StarRating rating={Math.round(reviewData.averageRating)} size="md" />
                                <span className="text-sm text-gray-500">({reviewData.count} reviews)</span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-3">
                            <span className="text-3xl font-bold text-primary">₹{displayPrice?.toLocaleString()}</span>
                            {hasOffer && <span className="text-xl text-gray-400 line-through">₹{product.price?.toLocaleString()}</span>}
                            {product.stock > 0 ? (
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">In Stock</span>
                            ) : (
                                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">Out of Stock</span>
                            )}
                        </div>

                        <p className="text-gray-600 leading-relaxed">{product.shortDescription}</p>

                        {/* Specifications */}
                        {product.specifications?.length > 0 && (
                            <div>
                                <h3 className="font-display font-semibold text-dark-800 mb-3">Specifications</h3>
                                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                                    {product.specifications.map((spec, i) => (
                                        <div key={i} className="flex justify-between text-sm py-1.5 border-b border-gray-100 last:border-0">
                                            <span className="text-gray-500">{spec.name}</span>
                                            <span className="font-medium text-dark-800">{spec.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {product.detailedDescription && (
                            <div>
                                <h3 className="font-display font-semibold text-dark-800 mb-2">Description</h3>
                                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{product.detailedDescription}</p>
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex gap-3 pt-2">
                            <button onClick={handleOrderClick} className="btn-primary flex items-center gap-2 flex-1" id="order-btn">
                                <HiShoppingCart className="w-5 h-5" /> Place Order
                            </button>
                            <button onClick={toggleLike}
                                className={`px-4 py-3 rounded-xl border-2 transition-all ${isLiked ? 'border-red-200 bg-red-50 text-red-500' : 'border-gray-200 text-gray-500 hover:border-red-200'
                                    }`}>
                                {isLiked ? <HiHeart className="w-5 h-5" /> : <HiOutlineHeart className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Order Modal */}
                {showOrderForm && (
                    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowOrderForm(false)}>
                        <div className="bg-white rounded-2xl p-6 w-full max-w-md animate-slide-up" onClick={e => e.stopPropagation()}>
                            <h3 className="text-xl font-display font-bold text-dark-900 mb-4">Place Order</h3>

                            {/* User Info (read-only) */}
                            <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">{user?.name?.[0]?.toUpperCase()}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-dark-800">{user?.name}</p>
                                        <p className="text-xs text-gray-500">{user?.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 pl-1">
                                    <span className="text-xs text-gray-400">📱</span> {user?.phone}
                                </div>
                            </div>

                            <form onSubmit={submitOrder} className="space-y-3">
                                <textarea placeholder="Delivery Address *" required value={orderForm.address}
                                    onChange={e => setOrderForm({ ...orderForm, address: e.target.value })} className="input-field" rows={3} />
                                <input type="number" min={1} placeholder="Quantity" value={orderForm.quantity}
                                    onChange={e => setOrderForm({ ...orderForm, quantity: parseInt(e.target.value) || 1 })} className="input-field" />
                                <div className="text-right text-sm text-gray-500 font-medium">
                                    Total: ₹{(displayPrice * orderForm.quantity).toLocaleString()}
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setShowOrderForm(false)} className="btn-outline flex-1">Cancel</button>
                                    <button type="submit" className="btn-primary flex-1">Confirm Order</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Reviews Section */}
                <section className="mt-16">
                    <h2 className="section-title mb-8">Customer <span className="text-primary">Reviews</span></h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Review Form */}
                        <div className="card p-6">
                            {user ? (
                                <>
                                    <h4 className="font-display font-semibold text-dark-800 mb-4">Write a Review</h4>
                                    <form onSubmit={submitReview} className="space-y-3">
                                        <div className="flex items-center gap-2 bg-primary/5 px-3 py-2 rounded-xl">
                                            <div className="w-7 h-7 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                                                <span className="text-white font-bold text-xs">{user.name?.[0]?.toUpperCase()}</span>
                                            </div>
                                            <span className="text-sm font-medium text-dark-800">{user.email.split('@')[0]}</span>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-500 mb-1 block">Rating</label>
                                            <StarRating rating={reviewForm.rating} onRate={r => setReviewForm({ ...reviewForm, rating: r })} size="lg" />
                                        </div>
                                        <textarea placeholder="Your review..." value={reviewForm.comment}
                                            onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })} className="input-field" rows={4} />
                                        <button type="submit" className="btn-primary w-full">Submit Review</button>
                                    </form>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
                                        <HiLogin className="w-8 h-8 text-primary" />
                                    </div>
                                    <h4 className="font-display font-semibold text-dark-800 mb-2">Write a Review</h4>
                                    <p className="text-sm text-gray-500 mb-4">Login to share your experience with this product</p>
                                    <button onClick={() => setShowLoginModal(true)} className="btn-primary w-full flex items-center justify-center gap-2">
                                        <HiLogin className="w-5 h-5" /> Login to Review
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Reviews List */}
                        <div className="lg:col-span-2 space-y-4">
                            {reviewData.reviews.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                                </div>
                            ) : (
                                reviewData.reviews.map(review => (
                                    <div key={review._id} className="card p-4">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
                                                <span className="font-semibold text-primary text-sm">
                                                    {(review.userName || 'A')[0].toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-dark-800 text-sm">{review.userName || 'Anonymous'}</p>
                                                <StarRating rating={review.rating} size="sm" />
                                            </div>
                                            <span className="ml-auto text-xs text-gray-400">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {review.comment && <p className="text-sm text-gray-600 ml-12">{review.comment}</p>}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ProductDetail;
