import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiX, HiUser, HiPhone, HiMail } from 'react-icons/hi';

const ProfileModal = () => {
    const { user, showProfileModal, setShowProfileModal, updateProfile } = useAuth();
    const [form, setForm] = useState({ name: '', phone: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setForm({ name: user.name || '', phone: user.phone || '' });
        }
    }, [user, showProfileModal]);

    if (!showProfileModal || !user) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) {
            toast.error('Name is required');
            return;
        }
        if (!form.phone.trim() || form.phone.length < 10) {
            toast.error('Please enter a valid phone number');
            return;
        }
        setLoading(true);
        try {
            await updateProfile(form.name, form.phone);
            toast.success('Profile updated!');
            setShowProfileModal(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setShowProfileModal(false)}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            <div className="relative w-full max-w-md animate-slide-up" onClick={e => e.stopPropagation()}>
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="relative bg-gradient-to-br from-primary via-primary to-accent p-8 text-center">
                        <button onClick={() => setShowProfileModal(false)}
                            className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
                            <HiX className="w-5 h-5 text-white" />
                        </button>
                        {user.picture ? (
                            <img src={user.picture} alt="" className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-white/30" referrerPolicy="no-referrer" />
                        ) : (
                            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-white font-display font-bold text-3xl">{user.name?.[0]?.toUpperCase()}</span>
                            </div>
                        )}
                        <h2 className="text-white font-display font-bold text-xl">Edit Profile</h2>
                    </div>

                    {/* Email (read-only) */}
                    <div className="px-6 pt-5 pb-2">
                        <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                            <HiMail className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-400">Email (Google Account)</p>
                                <p className="text-sm font-medium text-dark-800">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 pt-3 space-y-4">
                        <div className="relative">
                            <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Full Name *"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                className="input-field pl-12"
                                required
                            />
                        </div>

                        <div className="relative">
                            <HiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="tel"
                                placeholder="Mobile Number *"
                                value={form.phone}
                                onChange={e => setForm({ ...form, phone: e.target.value })}
                                className="input-field pl-12"
                                required
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={() => setShowProfileModal(false)} className="btn-outline flex-1">
                                Cancel
                            </button>
                            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60">
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;
