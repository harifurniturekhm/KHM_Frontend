import { HiPhone } from 'react-icons/hi';

const FloatingCallButton = () => {
    return (
        <a
            href="tel:+918608807283,+919943025989"
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 
                 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 
                 hover:scale-110 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300
                 animate-bounce"
            id="floating-call-btn"
            title="Call us"
        >
            <HiPhone className="w-6 h-6 text-white" />
        </a>
    );
};

export default FloatingCallButton;
