import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus } from 'react-icons/fa';
import { FiMonitor, FiSearch } from 'react-icons/fi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import axiosInstance from '../../util/AxiosInstance';
import ModalLayout from '../layout/ModalLayout';
import EmptyRoomImg from '../../assets/EmptyRoom.png';

const customStyle1 = { fontWeight: '700', fontSize: '16px', lineHeight: '100%', letterSpacing: '-0.39px' };
const customStyle2 = { fontWeight: '600', fontSize: '14px', lineHeight: '100%', letterSpacing: '-0.39px' };

// const Buttons = ({ buttonName, onCancel, onDelete }) => (
//     <div className='d-flex justify-content-around'>
//         <button type='button' className='btn btn-outline-eaeaea px-5' onClick={onCancel}>Cancel</button>
//         <button type='submit' className='btn btn-dark px-5' onClick={onDelete}>{buttonName}</button>
//     </div>
// );

export default function RoomsContent({ roomName, onRoomAdded }) {
    const [devices, setDevices] = useState([]);
    const [hasRoom, setHasRoom] = useState(false);
    const [roomList, setRoomList] = useState([]);
    const [showAddRoomModal, setShowAddRoomModal] = useState(false);
    const [showRoomMenu, setShowRoomMenu] = useState(false);
    const [showDeleteRoomModal, setShowDeleteRoomModal] = useState(false);
    const [newRoomName, setNewRoomName] = useState('');
    const [modal, setModal] = useState({ show: false, title: '', message: '', isError: false, onConfirm: null });
    const navigate = useNavigate();

    const isLoggedIn = () => !!localStorage.getItem('sessionId');

    // const fetchDevice = useCallback(async () => {
    //     if (!token) {
    //         navigate('/');
    //         return;
    //     }
    //     try {
    //         const { data, status } = await axios.get(`${process.env.REACT_APP_API_URL}/user/thing`,
    //             { headers: { Authorization: `Bearer ${token}` } }
    //         );
    //         if (status === 200) {
    //             const deviceList = data.things.filter(thingsObj => thingsObj.roomName === roomName).map(thingsObj => {
    //                 const mainItem = thingsObj.items?.find(item =>
    //                     item.type === 'Switch' || item.type === 'Color' || item.name?.toLowerCase().includes('wiz_bulb_color')) || thingsObj.items?.[0];
    //                 return {
    //                     label: thingsObj.label,
    //                     itemName: mainItem?.name,
    //                     roomName: thingsObj.roomName,
    //                     status: mainItem?.state === 'ON' || mainItem?.state !== '0,0,0'
    //                 };
    //             });
    //             setDevices(deviceList);
    //         }
    //     } catch (err) {
    //         setDevices([]);
    //         const errorMessage = err.response?.data?.error || 'Failed to fetch device';
    //         console.error(errorMessage);
    //     }
    // }, [roomName, token, navigate]);

    const fetchDevice = useCallback(async () => {
        setDevices([]);        
    }, []);

    const fetchRoomList = useCallback(async () => {
        if(!isLoggedIn()) {
            navigate('/');
            return;
        }

        try {
            const { data, status } = await axiosInstance.get('/room/list');
            if (status === 200) {
                setRoomList(data.roomList);
                setHasRoom(data.roomList.some(r => r.roomName === roomName));
            }
        } catch (err) {
            setHasRoom(false);
            setRoomList([]);
            const errorMessage = err.response?.data?.message || 'Failed to fetch room';
            console.error(errorMessage);
        }
    }, [navigate, roomName]);

    // useEffect(() => {
    //     const fetchRoom = async () => {
    //         if (!sessionId) {
    //             navigate('/');
    //             return;
    //         }
    //         try {
    //             const { data, status } = await axiosInstance.get('/room/list',
    //                 { headers: {  "X-HomeId": "HOME001", } }
    //             );
    //             if (status === 200 && data.length > 0) {
    //                 setHasRoom(true);
    //                 return;
    //             }
    //         } catch (err) {
    //             setHasRoom(false);
    //             const errorMessage = err.response?.data?.error || 'Failed to fetch room';
    //             console.error(errorMessage);
    //         }
    //     };
    //     fetchRoom();

    //     // fetchDevice();
    // //     const intervalId = setInterval(() => {
    // //         fetchDevice();
    // //     }, 3000);
    // //     return () => clearInterval(intervalId);
    // }, [fetchDevice, navigate, sessionId]);

    useEffect(() => {
        fetchRoomList();
        fetchDevice();
    }, [fetchRoomList, fetchDevice]);

    const capitalize = (str) => {
        if (!str) return '';
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const handleAddRoom = async (e) => {
        e.preventDefault();
        if (!isLoggedIn()) {
            navigate('/');
            return;
        }

        try {
            const normalizedRoomName = capitalize(newRoomName);
            const { data, status } = await axiosInstance.post('/room/create', 
                { roomName: normalizedRoomName }
            );
            if (status === 200) {
                setNewRoomName('');
                setShowAddRoomModal(false);
                onRoomAdded?.();
                setModal({
                    show: true,
                    title: 'Success',
                    message: data.message,
                    isError: false,
                    onConfirm: () => {
                        setModal({ ...modal, show: false });
                        navigate(`/room/${normalizedRoomName}`);
                    }
                });
            }
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Failed to add room';
            setModal({
                show: true,
                title: 'Failed',
                message: <span className='text-danger'>{errorMessage}</span>,
                isError: true,
                onConfirm: () => setModal({ ...modal, show: false }),
            });
        }
    };

    // const handleToggle = async (itemName, newStatus) => {
    //     // if (!sessionId) {
    //     //     navigate('/');
    //     //     return;
    //     // }
    //     try {
    //         const { status } = await axiosInstance.post('/user/control', { itemName, command: newStatus ? 'ON' : 'OFF' },
    //             // { headers: { Authorization: `Bearer ${token}` } }
    //         );
    //         if (status === 200) {
    //             // fetchDevice();
    //         }
    //     } catch (err) {
    //         const errorMessage = err.response?.data?.error || 'Failed to send command';
    //         console.error(errorMessage);
    //     }
    // };

    const handleToggle = async (itemName, newStatus) => {
        // No backend endpoint exists yet for device control (/user/control doesn't exist) - kept as
        // a no-op so the switch doesn't crash the page when clicked, instead of calling a dead route.
        console.warn('Device control is not implemented on the backend yet:', itemName, newStatus);
    }

    const confirmDeleteRoom = () => {
        setShowDeleteRoomModal(true);
    };

    const handleDeleteRoomConfirmed = async () => {
        if (!isLoggedIn()) {
            navigate('/');
            return;
        }
        setShowDeleteRoomModal(false);
        const roomToDelete = roomList.find(r => r.roomName === roomName);
        if (!roomToDelete) {
            setModal({
                show: true,
                title: 'Error',
                message: <span className='text-danger'>Room not found</span>,
                isError: true,
                onConfirm: () => setModal({ ...modal, show: false }),
            });
            return;
        }
        try {
            // DELETE /room/delete takes X-RoomId and X-AgentId headers, not a roomId query param.
            // TODO: 'X-AgentId' is hardcoded - nothing in the app currently tracks the real agentId yet
            const response = await axiosInstance.delete('/room/delete', {
                headers: { 'X-RoomId': roomToDelete.roomId }
            });
            if (response.status === 200) {
                await fetchRoomList();
                setModal({
                    show: true,
                    title: 'Success',
                    message: response.data.message,
                    isError: false,
                    onConfirm: () => {
                        setModal({ ...modal, show: false });
                        const remaining = roomList.filter(r => r.roomId !== roomToDelete.roomId);
                        if (remaining.length === 0) {
                            navigate("/room/no_room");
                        } else {
                            navigate(`/room/${remaining[0].roomName}`);
                        }
                    }
                });
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to delete room';
            setModal({
                show: true,
                title: 'Failed',
                message: <span className='text-danger'>{errorMessage}</span>,
                isError: true,
                onConfirm: () => setModal({ ...modal, show: false }),
            });
        }
    };

    return (
        <>
            {/* <div className="container px-5 py-4">

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div style={{ fontSize: '24px', lineHeight: '100%', letterSpacing: '0' }}>{hasRoom === false ? 'No Room' : roomName}</div>
                    <button className="btn btn-dark" onClick={() => setShowAddRoomModal(true)}>Add Room</button>
                </div>

                Table
                <div style={{ width: '100%', overflowX: 'hidden', height: '300px', overflowY: 'auto' }}>
                    {hasRoom === true &&
                        <div className='table-responsive'>
                            <table className='table align-middle border-0'>
                                <thead className='table-1C1C1E border-0'>
                                    <tr>
                                        <th className='p-3 border-0' style={{ ...customStyle1, width: '40%' }}>Devices</th>
                                        <th className='p-3 border-0' style={{ ...customStyle1, width: '20%' }}>Room</th>
                                        <th className='p-3 border-0' style={{ ...customStyle1, width: '20%' }}>Status</th>
                                        <th className='p-3 border-0' style={{ ...customStyle1, width: '20%' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {devices.length > 0 ? (
                                        devices.map((devicesObj, index) => (
                                            <tr key={index} className={index % 2 === 0 ? 'table-EAEAEA' : ''}>
                                                <td className='p-3 border-0' style={{ ...customStyle2 }}>
                                                    {devicesObj.label}
                                                </td>
                                                <td className='p-3 border-0' style={{ ...customStyle2 }}>
                                                    {devicesObj.roomName}
                                                </td>
                                                <td className='p-3 border-0' style={{ ...customStyle2 }}>
                                                    <div className='form-check form-switch d-flex align-items-center'>
                                                        <input style={{ cursor: 'pointer' }} className='form-check-input' type='checkbox' checked={devicesObj.status}
                                                            onChange={() => handleToggle(devicesObj.itemName, !devicesObj.status)} />
                                                    </div>
                                                </td>
                                                <td className='p-3 border-0' style={{ ...customStyle2 }}>
                                                    <FaTrash onClick={confirmDeleteRoom} style={{ fontSize: '16px', cursor: 'pointer' }} />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr className='table-EAEAEA'>
                                            <td colSpan='3' className='p-3 border-0 text-center' style={{ ...customStyle2 }}>
                                                No devices found
                                            </td>
                                            <td className='p-3 border-0' style={{ ...customStyle2 }}>
                                                <FaTrash onClick={confirmDeleteRoom} style={{ fontSize: '16px', cursor: 'pointer' }} />
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    }

                    {hasRoom === false && (
                        <div className='alert d-flex justify-content-center align-items-center h-100'>No rooms yet to create</div>
                    )}
                </div>
            </div >

            Add Room Modal
            {showAddRoomModal && (
                <ModalLayout title={'Add Room'} modal={() => setShowAddRoomModal(false)}>
                    <form onSubmit={handleAddRoom}>
                        <div className="text-start mb-5">
                            <label className="form-label" htmlFor='roomName'>Room Name</label>
                            <input type="text" id='roomName' className="form-control" value={newRoomName} onChange={(e) => setNewRoomName(e.target.value)} required />
                        </div>
                        <Buttons buttonName={'Add'} onCancel={() => setShowAddRoomModal(false)} />
                    </form>
                </ModalLayout>
            )}

            Delete Room Modal
            {showDeleteRoomModal && (
                <ModalLayout title={'Delete Room'} msg={<span>Do you really want to delete {roomName} ?</span>}
                    modal={() => setShowDeleteRoomModal(false)}>
                    <Buttons buttonName={'Delete'} onCancel={() => setShowDeleteRoomModal(false)} onDelete={handleDeleteRoomConfirmed} />
                </ModalLayout>
            )}

            Alert Modal
            {modal.show && (
                <ModalLayout title={modal.title} msg={modal.message} modal={modal.onConfirm} hideClose={!modal.isError}>
                    <button onClick={modal.onConfirm} className={`btn btn-dark px-3`}>
                        {modal.isError ? 'Try Again' : 'OK'}
                    </button>
                </ModalLayout>
            )} */}

            <div className="container px-5 py-4">

                {/* Breadcrumb */}
                <div className="bg-light rounded p-3 mb-3">
                    <span className="text-muted">All Rooms</span>
                    <span className="text-muted mx-2">&gt;</span>
                    <span style={{ fontWeight: 700 }}>{hasRoom ? roomName : capitalize(newRoomName) || roomName}</span>
                </div>

                <div className="bg-white rounded p-4">
                    {hasRoom ? (
                        <>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div style={{ fontSize: '24px', lineHeight: '100%', letterSpacing: '0' }}>{roomName}</div>
                                <div className="d-flex align-items-center gap-3 position-relative">
                                    <Link
                                        to='/devices/scan_devices'
                                        className="btn btn-sm d-flex align-items-center gap-2 text-decoration-none text-1C1C1E"
                                        style={{ border: '1px solid #ddd', backgroundColor: '#fff' }}
                                    >
                                        <FiSearch size={14} /> Scan Devices
                                    </Link>
                                    <BsThreeDotsVertical
                                        style={{ fontSize: '18px', cursor: 'pointer' }}
                                        onClick={() => setShowRoomMenu(!showRoomMenu)}
                                    />
                                    {showRoomMenu && (
                                        <ul className='list-group position-absolute shadow' style={{ top: '36px', right: 0, zIndex: 10, minWidth: '160px' }}>
                                            <li className='list-group-item list-group-item-action d-flex align-items-center gap-2'
                                                style={{ cursor: 'pointer', fontSize: '14px' }}
                                                onClick={() => { setShowRoomMenu(false); setShowAddRoomModal(true); }}>
                                                <FaPlus size={12} /> Add Room
                                            </li>
                                            <li className='list-group-item list-group-item-action d-flex align-items-center gap-2 text-danger'
                                                style={{ cursor: 'pointer', fontSize: '14px' }}
                                                onClick={() => { setShowRoomMenu(false); confirmDeleteRoom(); }}>
                                                <FaTrash size={12} /> Delete Room
                                            </li>
                                        </ul>
                                    )}
                                </div>
                            </div>

                            {/* Table */}
                            <div style={{ width: '100%', overflowX: 'hidden', height: '300px', overflowY: 'auto' }}>
                                <div className='table-responsive'>
                                    <table className='table align-middle border-0'>
                                        <thead className='table-1C1C1E border-0'>
                                            <tr>
                                                <th className='p-3 border-0' style={{ ...customStyle1, width: '55%' }}>Devices</th>
                                                <th className='p-3 border-0' style={{ ...customStyle1, width: '25%' }}>Status</th>
                                                <th className='p-3 border-0' style={{ ...customStyle1, width: '20%' }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {devices.length > 0 ? (
                                                devices.map((devicesObj, index) => (
                                                    <tr key={index} className={index % 2 === 0 ? 'table-EAEAEA' : ''}>
                                                        <td className='p-3 border-0' style={{ ...customStyle2 }}>
                                                            <div className='d-flex align-items-center'>
                                                                <FiMonitor className='me-2' style={{ fontSize: '16px' }} />
                                                                {devicesObj.label}
                                                            </div>
                                                        </td>
                                                        <td className='p-3 border-0' style={{ ...customStyle2 }}>
                                                            <div className='form-check form-switch d-flex align-items-center'>
                                                                <input style={{ cursor: 'pointer' }} className='form-check-input' type='checkbox' checked={devicesObj.status}
                                                                    onChange={() => handleToggle(devicesObj.itemName, !devicesObj.status)} />
                                                            </div>
                                                        </td>
                                                        <td className='p-3 border-0' style={{ ...customStyle2 }}>
                                                            <div className='d-flex align-items-center gap-2'>
                                                                <button
                                                                    className='btn btn-sm'
                                                                    style={{ border: '1px solid #ddd', backgroundColor: '#fff', color: '#1C1C1E', fontSize: '12px', fontWeight: 600, padding: '4px 12px' }}
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => console.warn('Device deletion is not implemented on the backend yet:', devicesObj.itemName)}
                                                                    className='btn btn-sm'
                                                                    style={{ border: 'none', backgroundColor: '#E14434', color: '#fff', fontSize: '12px', fontWeight: 600, padding: '4px 12px' }}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr className='table-EAEAEA'>
                                                    <td colSpan='3' className='p-3 border-0 text-center' style={{ ...customStyle2 }}>
                                                        No devices found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="d-flex justify-content-between align-items-start mb-4">
                                <div className="bg-light rounded p-3 flex-grow-1 me-3">
                                    There is no room is added still now
                                </div>
                                <button
                                    className="btn btn-sm d-flex align-items-center gap-1 flex-shrink-0"
                                    style={{ border: '1px solid #ddd', backgroundColor: '#fff' }}
                                    onClick={() => setShowAddRoomModal(true)}
                                >
                                    <FaPlus size={12} /> Add Room
                                </button>
                            </div>
                            <div className="d-flex justify-content-center py-4">
                                {/* TODO: replace with your actual empty-room illustration */}
                                <img src={EmptyRoomImg} alt="No rooms yet" style={{ maxWidth: '420px' }} />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Add Room Modal */}
            {showAddRoomModal && (
                <ModalLayout modal={() => setShowAddRoomModal(false)}>
                    <div style={{ fontWeight: 700, fontSize: '14px', letterSpacing: '0.5px' }} className="mb-4">
                        ADD ROOM
                    </div>
                    <form onSubmit={handleAddRoom}>
                        <div className="mb-4">
                            <input
                                type="text" id='roomName' className="form-control" placeholder="Room Name"
                                value={newRoomName} onChange={(e) => setNewRoomName(e.target.value)} required
                            />
                        </div>
                        <div className='d-flex justify-content-center gap-3'>
                            <button type='submit' className='btn btn-dark px-4'>Add</button>
                            <button type='button' className='btn btn-dark px-4' onClick={() => setShowAddRoomModal(false)}>Cancel</button>
                        </div>
                    </form>
                </ModalLayout>
            )}

            {/* Delete Room Modal */}
            {showDeleteRoomModal && (
                <ModalLayout title={'Delete Room'} msg={<span>Do you really want to delete {roomName} ?</span>}
                    modal={() => setShowDeleteRoomModal(false)}>
                    <div className='d-flex justify-content-around'>
                        <button type='button' className='btn btn-outline-eaeaea px-5' onClick={() => setShowDeleteRoomModal(false)}>Cancel</button>
                        <button type='submit' className='btn btn-dark px-5' onClick={handleDeleteRoomConfirmed}>Delete</button>
                    </div>
                </ModalLayout>
            )}

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