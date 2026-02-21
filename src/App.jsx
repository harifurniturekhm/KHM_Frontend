import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingCallButton from './components/FloatingCallButton';
import LoginModal from './components/LoginModal';
import ProfileModal from './components/ProfileModal';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Contact from './pages/Contact';

function App() {
    const { user, loading, setShowLoginModal } = useAuth();

    useEffect(() => {
        if (loading) return;
        if (user) return;
        const alreadyShown = sessionStorage.getItem('loginPopupShown');
        if (alreadyShown) return;

        const timer = setTimeout(() => {
            setShowLoginModal(true);
            sessionStorage.setItem('loginPopupShown', 'true');
        }, 10000);

        return () => clearTimeout(timer);
    }, [user, loading, setShowLoginModal]);

    return (
        <>
            <LoginModal />
            <ProfileModal />
            <Routes>
                <Route path="/" element={<><Navbar /><Home /><Footer /><FloatingCallButton /></>} />
                <Route path="/products" element={<><Navbar /><Products /><Footer /><FloatingCallButton /></>} />
                <Route path="/product/:id" element={<><Navbar /><ProductDetail /><Footer /><FloatingCallButton /></>} />
                <Route path="/contact" element={<><Navbar /><Contact /><Footer /><FloatingCallButton /></>} />
            </Routes>
        </>
    );
}

export default App;
