import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdWeekend, MdOutlineDinnerDining, MdOutlineKitchen, MdOutlineBedroomParent } from 'react-icons/md';
import { FiLogOut } from 'react-icons/fi';
import axiosInstance from '../../util/AxiosInstance';
import InsideLayout from './InsideLayout';

const iconMap = {
    'Living Room': MdWeekend,
    'Dining Room': MdOutlineDinnerDining,
    'Kitchen': MdOutlineKitchen,
    'Bed Room': MdOutlineBedroomParent
};

export default function AgentLayout({ agentName, InsideContent }) {
    const [agentMenu, setAgentMenu] = useState([]);
    const [hasAgent, setHasAgent] = useState(false);
    const navigate = useNavigate();

    const fetchAgent = () => {
        // Replace this with your real API call once you have one.
        // For now this just simulates "no agents found".
        setAgentMenu([{ type: 'divider' }, { type: 'logout', icon: FiLogOut }]);
        setHasAgent(false);
    };

    useEffect(() => {
        const sessionId = localStorage.getItem('sessionId');
        if(!sessionId) {
            navigate('/');
        }
        fetchAgent();
    }, [navigate]);

    return (
        <>
            <InsideLayout menu={agentMenu} activePage={'Home'} insideActivePage={agentName}>
                    <InsideContent onRoomAdded={fetchAgent} /> 
            </InsideLayout>
        </>
    );
};