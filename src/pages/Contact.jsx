import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import API from '../services/api';
import toast from 'react-hot-toast';
import { HiPhone, HiMail, HiLocationMarker } from 'react-icons/hi';

const Contact = () => {
    const { user } = useAuth();
    const [message, setMessage] = useState('');
    const [mobile, setMobile] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user && user.phone) {
            setMobile(user.phone);
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to send a message');
            return;
        }

        if (!mobile || mobile.trim() === '') {
            toast.error('Please provide a mobile number');
            return;
        }

        setLoading(true);
        try {
            await API.post('/queries', {
                name: user.name || 'User',
                mobile: mobile,
                message: message
            });
            toast.success('Message sent successfully!');
            setMessage('');
            // Do not clear mobile as they might want to send another message
        } catch {
            toast.error('Failed to send message');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 md:pt-28 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="section-title">Get in <span className="text-primary">Touch</span></h1>
                    <p className="text-secondary mt-2">We'd love to hear from you</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        <div className="card p-6">
                            <h3 className="font-display font-semibold text-dark-900 text-lg mb-4">Contact Information</h3>
                            <div className="space-y-4">
                                <a href="tel:+918608807283" className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                        <HiPhone className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Phone</p>
                                        <p className="font-medium text-dark-800">+91 86088 07283, +91 99430 25989</p>
                                    </div>
                                </a>
                                <a href="mailto:harifurniturekhm@gmail.com" className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                        <HiMail className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Email</p>
                                        <p className="font-medium text-dark-800">harifurniturekhm@gmail.com</p>
                                    </div>
                                </a>
                                <div className="flex items-center gap-4 p-3 rounded-xl">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                        <HiLocationMarker className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Address</p>
                                        <p className="font-medium text-dark-800">no 14 abdul kalam nagar, Thanjavur main road, kandiur, 613202</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form OR Login Prompt */}
                    <div className="card p-6">
                        <h3 className="font-display font-semibold text-dark-900 text-lg mb-4">Send us a Message</h3>

                        {!user ? (
                            <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-100">
                                <HiMail className="w-10 h-10 text-primary/50 mx-auto mb-3" />
                                <h4 className="font-medium text-dark-900 mb-2">Login Required</h4>
                                <p className="text-sm text-gray-500 mb-6">Please log in to your account to send us a direct message.</p>
                                <Link to="/login" className="btn-primary inline-block text-sm px-8 py-2.5">
                                    Login to Send Message
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="p-3 bg-primary/5 rounded-xl border border-primary/20 text-xs text-primary-700 font-medium mb-4 flex justify-between items-center">
                                    <span>Sending as <span className="font-bold">{user.name}</span></span>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1 ml-1" htmlFor="mobile">Mobile Number *</label>
                                    <input
                                        type="tel"
                                        id="mobile"
                                        placeholder="Enter your mobile number"
                                        required
                                        value={mobile}
                                        onChange={e => setMobile(e.target.value)}
                                        className="input-field"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1 ml-1" htmlFor="message">Message *</label>
                                    <textarea
                                        id="message"
                                        placeholder="Type your message here..."
                                        required
                                        value={message}
                                        rows={6}
                                        onChange={e => setMessage(e.target.value)}
                                        className="input-field resize-none"
                                    />
                                </div>

                                <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50 mt-2" id="send-query-btn">
                                    {loading ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
