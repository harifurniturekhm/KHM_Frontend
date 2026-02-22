import React from 'react';
import { HiX, HiPhone } from 'react-icons/hip';

const CallOptionsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const numbers = [
        { label: 'Primary Contact', phone: '8608807283' },
        { label: 'Secondary Contact', phone: '9943025989' }
    ];

    const handleCall = (phone) => {
        window.location.href = `tel:+91${phone}`;
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-dark-800 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <h3 className="font-display font-semibold text-lg text-gray-900 dark:text-white">
                        Select a number to call
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <HiX className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-5 space-y-3">
                    {numbers.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => handleCall(item.phone)}
                            className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-500/10 group transition-all duration-300"
                        >
                            <div className="flex flex-col items-start gap-1">
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{item.label}</span>
                                <span className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 text-lg">
                                    +91 {item.phone.slice(0, 5)} {item.phone.slice(5)}
                                </span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <HiPhone className="w-5 h-5" />
                            </div>
                        </button>
                    ))}

                    <button
                        onClick={onClose}
                        className="w-full mt-2 py-3 rounded-xl font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CallOptionsModal;
