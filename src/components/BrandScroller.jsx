import { useEffect, useState } from 'react';
import API from '../services/api';

const BrandScroller = () => {
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        API.get('/brands').then(res => setBrands(res.data)).catch(() => { });
    }, []);

    if (brands.length === 0) return null;

    // Create a massive array of duplicated brands to ensure the ticker 
    // is always vastly wider than any screen, preventing gap issues.
    const duplicatedBrands = Array(20).fill(brands).flat();

    return (
        <section className="py-16 bg-white overflow-hidden w-full">
            <div className="w-full mb-8">
                <h2 className="section-title text-center">Our <span className="text-primary">Brands</span></h2>
                <p className="text-secondary text-center mt-2 px-4">Partnered with the finest furniture brands</p>
            </div>

            <div className="relative h-40 overflow-hidden w-full bg-white flex items-center group">
                {/* 
                  The track is incredibly wide, running a single massive row of duplicated logos.
                  It translates from 0 to -50% to create the perfect infinite loop illusion.
                */}
                <div className="flex w-max animate-scroll-left group-hover:pause">
                    <div className="flex gap-12 px-6 items-center flex-shrink-0">
                        {duplicatedBrands.map((brand, i) => (
                            <div key={`brand-${i}`} className="flex-shrink-0 flex flex-col items-center gap-2 w-32 border border-transparent">
                                <div className="w-24 h-24 bg-gray-50 rounded-2xl flex items-center justify-center p-3 
                                group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300 border border-gray-100 cursor-pointer">
                                    <img src={brand.logo} alt={brand.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                                </div>
                                <span className="text-xs font-semibold text-secondary text-center line-clamp-1">{brand.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scrollLeft {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                }
                .animate-scroll-left {
                    animation: scrollLeft 60s linear infinite;
                }
                .group-hover\\:pause:hover {
                    animation-play-state: paused;
                }
            `}} />
        </section>
    );
};

export default BrandScroller;
