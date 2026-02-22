import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiPhone, HiMail, HiLocationMarker } from 'react-icons/hi';
import CallOptionsModal from './CallOptionsModal';

const Footer = () => {
    const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);

    return (
        <footer className="bg-dark-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Branding */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <img src="/logo.jpg" alt="Hari Furniture Logo" className="w-12 h-12 rounded-xl object-cover shadow-lg" />
                            <div>
                                <h3 className="font-display font-bold text-xl text-white">Hari Furniture</h3>
                                <p className="text-sm text-primary-300">& Co</p>
                            </div>
                        </div>
                        <p className="text-sm leading-relaxed text-gray-400">
                            Crafting quality furniture for modern living. Your home deserves the finest pieces,
                            designed with care and built to last.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-display font-semibold text-white mb-4">Quick Links</h4>
                        <div className="space-y-2">
                            {[{ to: '/', label: 'Home' }, { to: '/products', label: 'Products' }, { to: '/contact', label: 'Contact Us' }].map(link => (
                                <Link key={link.to} to={link.to} className="block text-sm text-gray-400 hover:text-primary transition-colors">
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-display font-semibold text-white mb-4">Contact Info</h4>
                        <div className="space-y-3">
                            <button
                                onClick={() => setIsPhoneModalOpen(true)}
                                className="flex items-center gap-3 text-sm text-gray-400 hover:text-primary transition-colors text-left"
                            >
                                <HiPhone className="w-4 h-4 text-primary shrink-0" />
                                <span>+91 86088 07283, +91 99430 25989</span>
                            </button>
                            <a href="mailto:harifurniturekhm@gmail.com" className="flex items-center gap-3 text-sm text-gray-400 hover:text-primary transition-colors">
                                <HiMail className="w-4 h-4 text-primary" /> harifurniturekhm@gmail.com
                            </a>
                            <div className="flex items-start gap-3 text-sm text-gray-400">
                                <HiLocationMarker className="w-4 h-4 text-primary mt-0.5" />
                                <span>no 14 abdul kalam nagar,<br />Thanjavur main road, kandiur, 613202</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-10 pt-6 text-center">
                    <p className="text-sm text-gray-500">© {new Date().getFullYear()} Hari Furniture & Co. All rights reserved.</p>
                </div>
            </div>

            <CallOptionsModal
                isOpen={isPhoneModalOpen}
                onClose={() => setIsPhoneModalOpen(false)}
            />
        </footer >
    );
};

export default Footer;
