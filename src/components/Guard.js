import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Guard({ children }) {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handlePopState = () => {
            const sessionId = localStorage.getItem('sessionId');
            if (sessionId) {
                const confirmLogout = window.confirm("Going back will log you out. Do you want to proceed?");
                if (confirmLogout) {
                    localStorage.removeItem('sessionId');
                    navigate('/');
                } else {
                    navigate(location.pathname);
                }
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [navigate, location]);

    return children;
}