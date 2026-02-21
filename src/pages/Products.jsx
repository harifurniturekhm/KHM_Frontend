import { useEffect, useState } from 'react';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import { HiSearch, HiHeart } from 'react-icons/hi';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [offers, setOffers] = useState([]);
    const [reviews, setReviews] = useState({});
    const [likedIds, setLikedIds] = useState([]);
    const [likedProducts, setLikedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const visitorId = localStorage.getItem('visitorId') || 'v_' + Math.random().toString(36).slice(2);

    useEffect(() => {
        localStorage.setItem('visitorId', visitorId);

        API.get('/products').then(res => {
            setProducts(res.data);
            res.data.forEach(p => {
                API.get(`/reviews/${p._id}`).then(r => {
                    setReviews(prev => ({ ...prev, [p._id]: r.data }));
                }).catch(() => { });
            });
        }).catch(() => { });

        API.get('/offers/active').then(res => setOffers(res.data)).catch(() => { });
        API.get('/categories').then(res => setCategories(res.data)).catch(() => { });
        API.get(`/likes/check?visitorId=${visitorId}`).then(res => setLikedIds(res.data)).catch(() => { });
        API.get(`/likes/visitor/${visitorId}`).then(res => setLikedProducts(res.data.map(l => l.product))).catch(() => { });
    }, []);

    const toggleLike = async (productId) => {
        try {
            const res = await API.post('/likes', { product: productId, visitorId });
            if (res.data.liked) {
                setLikedIds(prev => [...prev, productId]);
                const prod = products.find(p => p._id === productId);
                if (prod) setLikedProducts(prev => [...prev, prod]);
            } else {
                setLikedIds(prev => prev.filter(id => id !== productId));
                setLikedProducts(prev => prev.filter(p => p._id !== productId));
            }
        } catch { }
    };

    const getOffer = (productId) => offers.find(o => o.product?._id === productId || o.product === productId);

    const categoryProducts = products.filter(p => p.categoryType === 'category');
    const nonCategoryProducts = products.filter(p => p.categoryType === 'non-category');

    const filterBySearch = (list) =>
        list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    const tabs = [
        { id: 'all', label: 'All Products', count: products.length },
        { id: 'category', label: 'By Category', count: categoryProducts.length },
        { id: 'non-category', label: 'General', count: nonCategoryProducts.length },
        { id: 'liked', label: 'Liked', count: likedProducts.length, icon: <HiHeart className="w-4 h-4" /> },
    ];

    const renderGrid = (items) => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filterBySearch(items).map(product => (
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
    );

    const renderEmpty = () => (
        <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🔍</span>
            </div>
            <p className="text-gray-500">No products found</p>
        </div>
    );

    return (
        <div className="min-h-screen pt-24 md:pt-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="section-title">Our <span className="text-primary">Products</span></h1>
                    <p className="text-secondary mt-1">Discover furniture that defines your space</p>
                </div>

                {/* Search */}
                <div className="relative max-w-md mb-6">
                    <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="input-field pl-12"
                        id="product-search"
                    />
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id
                                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                }`}>
                            {tab.icon} {tab.label}
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white/20' : 'bg-gray-100'
                                }`}>{tab.count}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                {activeTab === 'all' && (filterBySearch(products).length > 0 ? renderGrid(products) : renderEmpty())}

                {activeTab === 'category' && (
                    <div className="space-y-10">
                        {categories.map(cat => {
                            const catProducts = categoryProducts.filter(p =>
                                p.category?._id === cat._id || p.category === cat._id
                            );
                            if (catProducts.length === 0) return null;
                            return (
                                <div key={cat._id}>
                                    <h3 className="text-xl font-display font-semibold text-dark-800 mb-4 flex items-center gap-2">
                                        {cat.image && <img src={cat.image} alt="" className="w-8 h-8 rounded-lg object-contain bg-white" />}
                                        {cat.name}
                                    </h3>
                                    {renderGrid(catProducts)}
                                </div>
                            );
                        })}
                    </div>
                )}

                {activeTab === 'non-category' && (filterBySearch(nonCategoryProducts).length > 0 ? renderGrid(nonCategoryProducts) : renderEmpty())}

                {activeTab === 'liked' && (likedProducts.length > 0 ? renderGrid(likedProducts) : (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 mx-auto mb-3 bg-red-50 rounded-full flex items-center justify-center">
                            <HiHeart className="w-8 h-8 text-red-300" />
                        </div>
                        <p className="text-gray-500">You haven't liked any products yet</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Products;
