import { useEffect, useState } from 'react';
import API from '../services/api';

const AdBanner = () => {
    const [ads, setAds] = useState([]);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        API.get('/advertisements/active').then(res => setAds(res.data)).catch(() => { });
    }, []);

    useEffect(() => {
        if (ads.length <= 1) return;
        const timer = setInterval(() => setCurrent(c => (c + 1) % ads.length), 5000);
        return () => clearInterval(timer);
    }, [ads.length]);

    if (ads.length === 0) return null;
    const ad = ads[current];

    return (
        <section className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-2xl bg-dark-900 flex items-center justify-center">
            {ad.mediaType === 'video' ? (
                <video src={ad.media} autoPlay muted loop playsInline className="w-full h-full object-contain" />
            ) : (
                <img src={ad.media} alt="Advertisement" className="w-full h-full object-contain transition-all duration-700" />
            )}
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

            {/* Dots */}
            {ads.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {ads.map((_, i) => (
                        <button key={i} onClick={() => setCurrent(i)}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === current ? 'bg-white w-8' : 'bg-white/50'
                                }`} />
                    ))}
                </div>
            )}

            {/* Redirect */}
            {ad.redirectLink && (
                <a href={ad.redirectLink} target="_blank" rel="noreferrer"
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 btn-primary text-sm">
                    Learn More
                </a>
            )}
        </section>
    );
};

export default AdBanner;
