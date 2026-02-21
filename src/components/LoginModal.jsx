import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { HiX, HiPhone } from 'react-icons/hi';

const LoginModal = () => {
    const { showLoginModal, setShowLoginModal, googleLogin, updateProfile, user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showPhoneInput, setShowPhoneInput] = useState(false);
    const [phone, setPhone] = useState('');

    if (!showLoginModal) return null;

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        try {
            const data = await googleLogin(credentialResponse.credential);
            if (data.needsPhone) {
                setShowPhoneInput(true);
                toast.success('Signed in with Google! Please add your phone number.');
            } else {
                toast.success(`Welcome back, ${data.user.name}!`);
                setShowLoginModal(false);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Google sign-in failed');
        } finally {
            setLoading(false);
        }
    };

    const handlePhoneSubmit = async (e) => {
        e.preventDefault();
        if (!phone || phone.length < 10) {
            toast.error('Please enter a valid phone number');
            return;
        }
        setLoading(true);
        try {
            await updateProfile(user?.name, phone);
            toast.success('Phone number saved!');
            setShowLoginModal(false);
            setShowPhoneInput(false);
            setPhone('');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save phone');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => { if (!showPhoneInput) setShowLoginModal(false); }}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Modal */}
            <div className="relative w-full max-w-md animate-slide-up" onClick={e => e.stopPropagation()}>
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="relative bg-gradient-to-br from-primary via-primary to-accent p-8 text-center">
                        {!showPhoneInput && (
                            <button
                                onClick={() => setShowLoginModal(false)}
                                className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                            >
                                <HiX className="w-5 h-5 text-white" />
                            </button>
                        )}
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-white font-display font-bold text-2xl">H</span>
                        </div>
                        <h2 className="text-white font-display font-bold text-2xl mb-1">
                            {showPhoneInput ? 'Almost Done!' : 'Welcome'}
                        </h2>
                        <p className="text-white/80 text-sm">
                            {showPhoneInput ? 'Add your phone number to continue' : 'Sign in with your Google account'}
                        </p>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {showPhoneInput ? (
                            /* Phone Number Form */
                            <form onSubmit={handlePhoneSubmit} className="space-y-4">
                                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 mb-2">
                                    {user?.picture ? (
                                        <img src={user.picture} alt="" className="w-10 h-10 rounded-full" />
                                    ) : (
                                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                            <span className="text-primary font-bold">{user?.name?.[0]?.toUpperCase()}</span>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm font-semibold text-dark-800">{user?.name}</p>
                                        <p className="text-xs text-gray-500">{user?.email}</p>
                                    </div>
                                </div>

                                <div className="relative">
                                    <HiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="tel"
                                        placeholder="Mobile Number *"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        className="input-field pl-12"
                                        required
                                        autoFocus
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : 'Continue'}
                                </button>
                            </form>
                        ) : (
                            /* Google Sign-In */
                            <div className="space-y-4">
                                <p className="text-center text-sm text-gray-500 mb-4">
                                    Sign in securely with your Google account to place orders and write reviews
                                </p>

                                <div className="flex justify-center">
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={() => toast.error('Google sign-in failed')}
                                        theme="outline"
                                        size="large"
                                        width="350"
                                        text="signin_with"
                                        shape="pill"
                                    />
                                </div>

                                {loading && (
                                    <div className="flex justify-center pt-2">
                                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                    </div>
                                )}

                                <p className="text-center text-xs text-gray-400 mt-4">
                                    By signing in, you agree to our terms of service
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
