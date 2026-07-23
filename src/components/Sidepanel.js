import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MdHome, MdDevices, MdSchedule, MdSmartToy, MdOutlineBarChart } from 'react-icons/md';
import { FaDoorOpen } from 'react-icons/fa';
import { FiSettings, FiZap } from 'react-icons/fi';
import axiosInstance from '../util/AxiosInstance';
import Profile from '../assets/Profile.png';
import "@fontsource/roboto/300.css";
import '@fontsource/roboto/400.css';

const customStyle = { fontFamily: 'Roboto', fontWeight: 300, lineHeight: '100%', letterSpacing: '0%' };
const linkStyle = { ...customStyle, fontSize: '16px' };

export default function SidePanel({ activePage }) {
    const [firstRoomName, setFirstRoomName] = useState('');
    const navigate = useNavigate();

    const userData = useSelector((state) => state.user);

    const sessionId = localStorage.getItem('sessionId');

    useEffect(() => {
        const fetchRoom = async () => {
            if (!sessionId) {
                navigate('/');
                return;
            }
            try {
                const { data, status } = await axiosInstance.get('/room/list');
                if (status === 200 && data.roomList.length > 0) {
                    setFirstRoomName(data.roomList[0].roomName);
                } else {
                    setFirstRoomName('no_room');
                }
            } catch (err) {
                const errorMessage = err.response?.data?.error;
                console.error(errorMessage);
            }
        };
        fetchRoom();
    }, [navigate, sessionId]);

    const menuItems = [
        { to: '/agent', icon: <MdHome className="me-2" />, label: 'Agent', page: 'Agent' },
        { to: `/room/${firstRoomName}`, icon: <FaDoorOpen className="me-2" />, label: 'Room', page: 'Rooms' },
        { to: '/devices/all_devices', icon: <MdDevices className="me-2" />, label: 'Devices', page: 'Devices' },
        { to: '/schedule/your_schedule', icon: <MdSchedule className="me-2" />, label: 'Schedule', page: 'Schedule' },
        // { to: '/power_consumption', icon: <FiZap className="me-2" />, label: 'Power Consumption', page: 'Power Consumption' },
        // { to: '/analytics', icon: <MdOutlineBarChart className="me-2" />, label: 'Analytics', page: 'Analytics' },
        { to: '/settings/profile', icon: <FiSettings className="me-2" />, label: 'Settings', page: 'Settings' }
    ];

    return (
        <>
            <div className="bg-1C1C1E text-white min-vh-100 px-3">

                <div className="text-center py-4" style={{ ...customStyle, fontSize: '20px' }}>SMART HOME</div>

                <div className="d-flex align-items-center border-top border-bottom p-3" >
                    <img src={Profile} alt="Profile" width={'35px'} height={'35px'} className="rounded-circle me-3" />
                    <span style={{ ...customStyle, fontSize: '20px', fontWeight: '400' }}>{userData.fullName}</span>
                </div>

                <div className="d-flex flex-column py-4">
                    {menuItems.map((menuItemsObj, index) => (
                        <Link key={index} to={menuItemsObj.to} className={`text-decoration-none text-eaeaea d-flex align-items-center px-3 py-12px mb-3 sidepanel-hover ${activePage === menuItemsObj.page ? 'sidepanel-active' : ''}`} style={linkStyle}>
                            {menuItemsObj.icon} {menuItemsObj.label}
                        </Link>
                    ))}
                </div>

            </div >
        </>
    );
};