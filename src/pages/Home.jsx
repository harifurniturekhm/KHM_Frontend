import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import AdBanner from '../components/AdBanner';
import ProductCard from '../components/ProductCard';
import BrandScroller from '../components/BrandScroller';
import { HiArrowRight } from 'react-icons/hi';

const Home = () => {
    const [featured, setFeatured] = useState([]);
    const [offers, setOffers] = useState([]);
    const [reviews, setReviews] = useState({});
    const [likedIds, setLikedIds] = useState([]);
    const visitorId = localStorage.getItem('visitorId') || (() => {
        const id = 'v_' + Math.random().toString(36).slice(2);
        localStorage.setItem('visitorId', id);
        return id;
    })();

    useEffect(() => {
        API.get('/products/featured').then(res => {
            setFeatured(res.data);
            res.data.forEach(p => {
                API.get(`/reviews/${p._id}`).then(r => {
                    setReviews(prev => ({ ...prev, [p._id]: r.data }));
                }).catch(() => { });
            });
        }).catch(() => { });

        API.get('/offers/active').then(res => setOffers(res.data)).catch(() => { });
        API.get(`/likes/check?visitorId=${visitorId}`).then(res => setLikedIds(res.data)).catch(() => { });
    }, []);

    const toggleLike = async (productId) => {
        try {
            const res = await API.post('/likes', { product: productId, visitorId });
            setLikedIds(prev => res.data.liked ? [...prev, productId] : prev.filter(id => id !== productId));
        } catch { }
    };

    const getOffer = (productId) => offers.find(o => o.product?._id === productId || o.product === productId);

    return (
        <div className="min-h-screen">
            {/* Hero / Ad Banner */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28">
                <AdBanner />
            </section>

            {/* Featured Products */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="section-title">Featured <span className="text-primary">Collection</span></h2>
                        <p className="text-secondary mt-1">Handpicked furniture for your perfect space</p>
                    </div>
                    <Link to="/products" className="btn-outline text-sm hidden sm:flex items-center gap-2">
                        View All <HiArrowRight />
                    </Link>
                </div>

                {featured.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-3xl">🪑</span>
                        </div>
                        <h3 className="text-lg font-semibold text-dark-800 mb-1">No products yet</h3>
                        <p className="text-gray-500 text-sm">Featured products will appear here</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {featured.map(product => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                offer={getOffer(product._id)}
                                reviewData={reviews[product._id]}
                                isLiked={likedIds.includes(product._id)}
                                onToggleLike={toggleLike}
                            />
                        ))}
                    </div>
                )}

                <div className="text-center mt-8 sm:hidden">
                    <Link to="/products" className="btn-outline text-sm inline-flex items-center gap-2">
                        View All Products <HiArrowRight />
                    </Link>
                </div>
            </section>

            {/* Brands */}
            <BrandScroller />
        </div>
    );
};

export default Home;
