import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../util/AxiosInstance';
import ModalLayout from '../layout/ModalLayout';

export default function CreateScenesContent() {
    const [deviceList, setDeviceList] = useState([]);
    const [roomList, setRoomList] = useState([]);
    const [ruleName, setRuleName] = useState('');
    const [fromTime, setFromTime] = useState('');
    const [toTime, setToTime] = useState('');
    const [selectedDays, setSelectedDays] = useState([]);
    const [room, setRoom] = useState('');
    const [device, setDevice] = useState('');
    const [command, setCommand] = useState('ON');
    const [modal, setModal] = useState({ show: false, title: '', message: '', isError: false, onConfirm: null });
    const navigate = useNavigate();

    const sessionId = localStorage.getItem('sessionId');

    const days = [
        { short: 'Sun', full: 'SUNDAY' },
        { short: 'Mon', full: 'MONDAY' },
        { short: 'Tue', full: 'TUESDAY' },
        { short: 'Wed', full: 'WEDNESDAY' },
        { short: 'Thu', full: 'THURSDAY' },
        { short: 'Fri', full: 'FRIDAY' },
        { short: 'Sat', full: 'SATURDAY' },
    ];

    useEffect(() => {
        if (!sessionId) {
            navigate('/');
            return;
        }
        const fetchRoomsAndDevices = async () => {
            try {
                const response1 = await axiosInstance.get('/room/list');
                if (response1.status === 200) {
                    setRoomList(response1.data.roomList);
                }
            } catch (err) {
                const errorMessage = err.response?.data?.error || 'Failed to fetch room';
                console.error(errorMessage);
            }
            // No backend endpoint exists for device/"thing" listing yet (no /user/thing)
            setDeviceList([]);
            // try {
            //     const response2 = await axiosInstance.get('/user/thing');
            //     if (response2.status === 200) {
            //         setDeviceList(response2.data.things);
            //     }
            // } catch (err) {
            //     const errorMessage = err.response?.data?.error || 'Failed to fetch device';
            //     console.error(errorMessage);
            // }
        };
        fetchRoomsAndDevices();
    }, [navigate, sessionId]);

    const toggleDay = (dayFull) => {
        setSelectedDays(prev =>
            prev.includes(dayFull) ? prev.filter(d => d !== dayFull) : [...prev, dayFull]
        );
    };

    const handleSubmit = async () => {
        if (!sessionId) {
            navigate('/');
            return;
        }
        if (!fromTime || !toTime || selectedDays.length === 0 || !room || !device || !command) {
            setModal({
                show: true,
                title: 'Error',
                message: <span className='text-danger'>All fields are required</span>,
                isError: true,
                onConfirm: () => setModal({ ...modal, show: false }),
            });
            return;
        }
        const payload = {
            ruleName,
            fromTime,
            toTime,
            days: selectedDays,
            roomId: room,
            thingId: device,
            command,
        };

        setModal({
            show: true,
            title: 'Not available',
            message: <span className='text-danger'>Schedules/Scenes aren't supported by the backend yet.</span>,
            isError: true,
            onConfirm: () => setModal({ ...modal, show: false }),
        })
        // try {
        //     const { data, status } = await axios.post(`${process.env.REACT_APP_API_URL}/user/rule`, payload,
        //         { headers: { Authorization: `Bearer ${sessionId}` } }
        //     );
        //     if (status === 200) {
        //         setModal({
        //             show: true,
        //             title: 'Success',
        //             message: data.message,
        //             isError: false,
        //             onConfirm: () => {
        //                 setModal({ ...modal, show: false });
        //                 navigate('/schedule/your_schedule');
        //             }
        //         });
        //     }
        // } catch (err) {
        //     const errorMessage = err.response?.data?.error || 'Failed to create schedule. Please try again.';
        //     setModal({
        //         show: true,
        //         title: 'Failed',
        //         message: <span className='text-danger'>{errorMessage}</span>,
        //         isError: true,
        //         onConfirm: () => setModal({ ...modal, show: false }),
        //     });
        // }
    };

    return (
        <>
            <div className='container px-5 py-4'>

                <div style={{ fontSize: '24px', lineHeight: '100%', letterSpacing: '0' }} className='mb-3'>Create Schedule</div>

                {/* Content */}
                <div style={{ width: '100%', overflowX: 'hidden', height: '300px', overflowY: 'auto' }}>

                    <div className="mb-2">
                        <div className="form-label">Name</div>
                        <input type='text' id='ruleName' className="form-control" value={ruleName} onChange={e => setRuleName(e.target.value)} required />
                    </div>

                    <div className="mb-2">
                        <div className="form-label">Time</div>
                        <div className="d-flex gap-2">
                            <input type="time" id='time' className="form-control" value={fromTime} onChange={e => setFromTime(e.target.value)} required />
                            <span className="align-self-center">To</span>
                            <input type="time" id='time' className="form-control" value={toTime} onChange={e => setToTime(e.target.value)} required />
                        </div>
                    </div>

                    <div className="mb-2">
                        <div className="form-label">Days</div>
                        <div className="d-flex flex-wrap gap-2">
                            {days.map(({ short, full }) => (
                                <button
                                    key={full}
                                    className={`btn border border-dark rounded-circle d-flex justify-content-center align-items-center ${selectedDays.includes(full) ? 'btn-dark text-white' : 'btn-light'}`}
                                    onClick={() => toggleDay(full)}
                                    style={{ height: '35px', width: '35px', fontSize: '12px' }}>
                                    {short}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-2">
                        <div className="form-label">Device</div>
                        <select className="form-select" id='label' value={device} onChange={e => setDevice(e.target.value)} required>
                            <option value="">Select Device</option>
                            {deviceList.map((deviceListObj, index) => (
                                <option key={index} value={deviceListObj.thingId}>{deviceListObj.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-2">
                        <div className="form-label">Room</div>
                        <select className="form-select" id='room' value={room} onChange={e => setRoom(e.target.value)} required>
                            <option value="">Select Room</option>
                            {roomList.map((roomListObj, index) => (
                                <option key={index} value={roomListObj.roomId}>{roomListObj.roomName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-2">
                        <div className="d-block form-label">Condition</div>
                        <button className='btn btn-dark' onClick={() => setCommand('ON')}>On</button>
                    </div>
                </div>

                <div className='text-end my-5'>
                    <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
                </div>
            </div>

            {/* Alert Modal */}
            {modal.show && (
                <ModalLayout title={modal.title} msg={modal.message} modal={modal.onConfirm} hideClose={!modal.isError}>
                    <button onClick={modal.onConfirm} className={`btn btn-dark px-3`}>
                        {modal.isError ? 'Try Again' : 'OK'}
                    </button>
                </ModalLayout>
            )}
        </>
    );
};