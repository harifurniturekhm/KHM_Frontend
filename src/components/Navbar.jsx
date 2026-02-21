import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiMenu, HiX, HiLogout, HiLogin, HiPencil } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const { pathname } = useLocation();
    const { user, logout, setShowLoginModal, setShowProfileModal } = useAuth();

    const links = [
        { to: '/', label: 'Home' },
        { to: '/products', label: 'Products' },
        { to: '/contact', label: 'Contact' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 md:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <img src="/logo.jpg" alt="Hari Furniture Logo" className="w-10 h-10 rounded-xl object-cover shadow-lg group-hover:scale-110 transition-transform" />
                        <div className="hidden sm:block">
                            <h1 className="font-display font-bold text-lg text-dark-900 leading-tight">Hari Furniture</h1>
                            <p className="text-xs text-secondary -mt-0.5">& Co</p>
                        </div>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {links.map(link => (
                            <Link key={link.to} to={link.to}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${pathname === link.to
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-dark-600 hover:text-primary hover:bg-primary/5'
                                    }`}>
                                {link.label}
                            </Link>
                        ))}

                        {/* Auth Section */}
                        {user ? (
                            <div className="flex items-center gap-2 ml-3">
                                <button onClick={() => setShowProfileModal(true)} className="flex items-center gap-2 bg-primary/5 px-3 py-1.5 rounded-xl hover:bg-primary/10 transition-colors" title="Edit Profile">
                                    {user.picture ? (
                                        <img src={user.picture} alt="" className="w-7 h-7 rounded-full" referrerPolicy="no-referrer" />
                                    ) : (
                                        <div className="w-7 h-7 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                                            <span className="text-white font-bold text-xs">{user.name?.[0]?.toUpperCase() || 'U'}</span>
                                        </div>
                                    )}
                                    <span className="text-sm font-medium text-dark-800 max-w-[100px] truncate">{user.name}</span>
                                </button>
                                <button onClick={logout}
                                    className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                    title="Logout">
                                    <HiLogout className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => setShowLoginModal(true)}
                                className="ml-3 flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-all shadow-md hover:shadow-lg">
                                <HiLogin className="w-4 h-4" />
                                Login
                            </button>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <div className="flex items-center gap-2 md:hidden">
                        {user ? (
                            user.picture ? (
                                <img src={user.picture} alt="" className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                            ) : (
                                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-xs">{user.name?.[0]?.toUpperCase() || 'U'}</span>
                                </div>
                            )
                        ) : (
                            <button onClick={() => setShowLoginModal(true)}
                                className="p-2 rounded-xl text-primary hover:bg-primary/10 transition-colors">
                                <HiLogin className="w-5 h-5" />
                            </button>
                        )}
                        <button onClick={() => setOpen(!open)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors" id="mobile-menu-toggle">
                            {open ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {open && (
                <div className="md:hidden glass border-t border-gray-100 animate-slide-up">
                    <div className="px-4 py-3 space-y-1">
                        {links.map(link => (
                            <Link key={link.to} to={link.to} onClick={() => setOpen(false)}
                                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${pathname === link.to ? 'bg-primary/10 text-primary' : 'text-dark-600 hover:bg-gray-50'
                                    }`}>
                                {link.label}
                            </Link>
                        ))}
                        {user ? (
                            <div className="border-t border-gray-100 pt-2 mt-2">
                                <div className="flex items-center gap-3 px-4 py-2">
                                    {user.picture ? (
                                        <img src={user.picture} alt="" className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                                    ) : (
                                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                                            <span className="text-white font-bold text-xs">{user.name?.[0]?.toUpperCase() || 'U'}</span>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm font-medium text-dark-800">{user.name}</p>
                                        <p className="text-xs text-gray-400">{user.email}</p>
                                    </div>
                                </div>
                                <button onClick={() => { setShowProfileModal(true); setOpen(false); }}
                                    className="w-full px-4 py-3 rounded-xl text-sm font-medium text-primary hover:bg-primary/10 text-left transition-all flex items-center gap-2">
                                    <HiPencil className="w-4 h-4" /> Edit Profile
                                </button>
                                <button onClick={() => { logout(); setOpen(false); }}
                                    className="w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 text-left transition-all flex items-center gap-2">
                                    <HiLogout className="w-4 h-4" /> Logout
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => { setShowLoginModal(true); setOpen(false); }}
                                className="w-full px-4 py-3 rounded-xl text-sm font-medium text-primary hover:bg-primary/10 text-left transition-all flex items-center gap-2">
                                <HiLogin className="w-4 h-4" /> Login / Sign Up
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
