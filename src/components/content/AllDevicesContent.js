import { useState, useEffect, useCallback } from 'react';
import { FiEdit2, FiTrash2, FiMonitor, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../util/AxiosInstance';
import ModalLayout from '../layout/ModalLayout';

const customStyle1 = { fontWeight: '700', fontSize: '16px', lineHeight: '100%', letterSpacing: '-0.39px' };
const customStyle2 = { fontWeight: '600', fontSize: '14px', lineHeight: '100%', letterSpacing: '-0.39px', height: '60px' };

// ---------------------------------------------------------------------------
// MOCK DATA (placeholder only)
// TODO(API): No backend endpoint exists yet for device/"thing" listing
// (no /user/thing). Using MOCK_DEVICES so the table/edit/delete flows can be
// built and reviewed now. Remove this and the `|| MOCK_DEVICES` fallback
// below once GET /user/thing (or equivalent) is available.
// ---------------------------------------------------------------------------
const MOCK_DEVICES = [
    { thingUID: 'mock-1', itemName: 'android_tv', label: 'Android TV', roomName: 'Living room', status: true },
    { thingUID: 'mock-2', itemName: 'smart_bulb', label: 'Smart Bulb', roomName: 'Dining Room', status: true },
    { thingUID: 'mock-3', itemName: 'smart_fan', label: 'Smart Fan Controller', roomName: 'Living room', status: true },
    { thingUID: 'mock-4', itemName: 'smart_lock', label: 'Smart Lock', roomName: 'Living room', status: true },
];

export default function AllDevicesContent() {
    const [devices, setDevices] = useState([]);
    const [modal, setModal] = useState({ show: false, title: '', message: '', isError: false, onConfirm: null });

    // Edit device name modal
    const [editingDevice, setEditingDevice] = useState(null);
    const [editedName, setEditedName] = useState('');

    // Delete success modal
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

    const navigate = useNavigate();

    const sessionId = localStorage.getItem('sessionId');

    const fetchDevice = useCallback(async () => {
        if (!sessionId) {
            navigate('/');
            return;
        }
        // TODO(API): No backend endpoint exists yet for device/"thing" listing
        // (no /user/thing). Using MOCK_DEVICES as a placeholder.
        setDevices(MOCK_DEVICES);
        // try {
        //     const { data, status } = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/user/thing`,
        //         { headers: { Authorization: `Bearer ${sessionId}` } }
        //     );
        //     if (status === 200) {
        //         const filteredDevices = data.things.map(thingsObj => {
        //             const mainItem = thingsObj.items?.find(itemsObj =>
        //                 itemsObj.type === 'Switch' || itemsObj.type === 'Color' || itemsObj.name?.toLowerCase().includes('wiz_bulb_color')) || thingsObj.items?.[0];
        //             return {
        //                 label: thingsObj.label,
        //                 itemName: mainItem?.name,
        //                 roomName: thingsObj.roomName,
        //                 status: mainItem?.state === 'ON' || mainItem?.state !== '0,0,0',
        //                 thingUID: thingsObj.thingUID
        //             };
        //         });
        //         setDevices(filteredDevices);
        //     }
        // } catch (err) {
        //     setDevices([]);
        //     const errorMessage = err.response?.data?.error || 'Failed to fetch device';
        //     console.error(errorMessage);
        // }
    }, [sessionId, navigate]);

    useEffect(() => {
        fetchDevice();
    }, [fetchDevice]);

    const handleToggle = async (itemName, newStatus) => {
        if (!sessionId) {
            navigate('/');
            return;
        }
        // TODO(API): No backend endpoint exists yet for device control
        // (no /user/control). Updating local state only for now so the toggle
        // is visually functional against the mock data.
        setDevices(prev => prev.map(d => d.itemName === itemName ? { ...d, status: newStatus } : d));
        // try {
        //     const { status } = await axiosInstance.post(`${process.env.REACT_APP_API_URL}/user/control`,
        //         { itemName, command: newStatus ? 'ON' : 'OFF' },
        //         { headers: { Authorization: `Bearer ${sessionId}` } }
        //     );
        //     if (status === 200) {
        //         fetchDevice();
        //     }
        // } catch (err) {
        //     const errorMessage = err.response?.data?.error || 'Sending command failed';
        //     console.error(errorMessage);
        // }
    };

    // --- Edit device name -----------------------------------------------
    const openEditModal = (devicesObj) => {
        setEditingDevice(devicesObj);
        setEditedName(devicesObj.label);
    };

    const closeEditModal = () => {
        setEditingDevice(null);
        setEditedName('');
    };

    const handleSaveDeviceName = async () => {
        if (!sessionId) {
            navigate('/');
            return;
        }
        if (!editedName.trim()) return;

        // TODO(API): No backend endpoint exists yet for renaming a device/"thing"
        // (no PATCH/PUT /user/thing). Updating local state only for now so the
        // edit flow is visually/functionally complete against the mock data.
        // try {
        //     const { status } = await axiosInstance.patch(`${process.env.REACT_APP_API_URL}/user/thing`,
        //         { thingUID: editingDevice.thingUID, label: editedName },
        //         { headers: { Authorization: `Bearer ${sessionId}` } }
        //     );
        //     if (status === 200) {
        //         fetchDevice();
        //     }
        // } catch (err) {
        //     const errorMessage = err.response?.data?.error || 'Failed to rename device';
        //     console.error(errorMessage);
        // }
        setDevices(prev => prev.map(d => d.thingUID === editingDevice.thingUID ? { ...d, label: editedName } : d));
        closeEditModal();
    };

    // --- Delete device -----------------------------------------------
    const handleDelete = async (thingUID) => {
        if (!sessionId) {
            navigate('/');
            return;
        }
        // TODO(API): No backend endpoint exists yet for deleting a device/"thing"
        // (no DELETE /user/delete/thing). Removing from local state only for now
        // so the delete flow is visually/functionally complete against the mock
        // data. Swap for the real request below once that endpoint is available.
        // try {
        //     const { data, status } = await axiosInstance.delete(`${process.env.REACT_APP_API_URL}/user/delete/thing`,
        //         { headers: { Authorization: `Bearer ${sessionId}` }, params: { thingUID } }
        //     );
        //     if (status === 200) {
        //         fetchDevice();
        //     }
        // } catch (err) {
        //     const errorMessage = err.response?.data?.error || 'Failed to delete device';
        //     setModal({
        //         show: true,
        //         title: 'Failed',
        //         message: <span className='text-danger'>{errorMessage}</span>,
        //         isError: true,
        //         onConfirm: () => setModal({ ...modal, show: false }),
        //     });
        //     return;
        // }
        setDevices(prev => prev.filter(d => d.thingUID !== thingUID));
        setShowDeleteSuccess(true);
    };

    return (
        <>
            <div className='container px-5 py-4'>

                <div className='d-flex justify-content-between align-items-center mb-3'>
                    <div style={{ fontSize: '24px', lineHeight: '100%', letterSpacing: '0' }}>All Devices</div>
                </div>

                {/* Table */}
                <div style={{ width: '100%', overflowX: 'hidden', height: '300px', overflowY: 'auto' }}>
                    {devices.length > 0 ? (
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
                                    {devices.map((devicesObj, index) => (
                                        <tr key={index} className={index % 2 === 0 ? 'table-EAEAEA' : ''}>
                                            <td className='p-3 border-0' style={{ ...customStyle2 }}>
                                                <div className='d-flex align-items-center'>
                                                    <FiMonitor className='me-2' style={{ fontSize: '16px' }} />
                                                    {devicesObj.label}
                                                </div>
                                            </td>
                                            <td className='p-3 border-0' style={{ ...customStyle2, color: '#5B6EE1' }}>
                                                {devicesObj.roomName}
                                            </td>
                                            <td className='p-3 border-0' style={{ ...customStyle2 }}>
                                                <div className='form-check form-switch d-flex align-items-center'>
                                                    <input
                                                        style={{ cursor: 'pointer' }}
                                                        className='form-check-input'
                                                        type='checkbox'
                                                        checked={devicesObj.status}
                                                        onChange={() => handleToggle(devicesObj.itemName, !devicesObj.status)}
                                                    />
                                                </div>
                                            </td>
                                            <td className='p-3 border-0' style={{ ...customStyle2 }}>
                                                <div className='d-flex align-items-center gap-3'>
                                                    <FiEdit2 style={{ fontSize: '15px', cursor: 'pointer' }}
                                                        onClick={() => openEditModal(devicesObj)}
                                                    />
                                                    <FiTrash2 style={{ fontSize: '15px', cursor: 'pointer' }}
                                                        onClick={() => handleDelete(devicesObj.thingUID)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className='alert d-flex justify-content-center align-items-center h-100'>No devices found</div>
                    )}
                </div>

            </div>

            {/* Edit device name modal */}
            {editingDevice && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.1)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 1050
                }}>
                    <div style={{
                        backgroundColor: '#fff', borderRadius: '12px',
                        width: '100%', maxWidth: '380px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                        padding: '24px', position: 'relative'
                    }}>
                        <button onClick={closeEditModal} style={{
                            position: 'absolute', top: '12px', right: '14px',
                            background: 'none', border: 'none', cursor: 'pointer'
                        }}>
                            <FiX size={16} />
                        </button>

                        <div className='fw-bold mb-3' style={{ fontSize: '15px' }}>Change the device name</div>

                        <input
                            type='text'
                            className='form-control mb-4'
                            style={{ backgroundColor: '#eaeaea', border: 'none' }}
                            placeholder='Device Name'
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            autoFocus
                        />

                        <div className='text-center'>
                            <button className='btn btn-dark px-5' onClick={handleSaveDeviceName}>Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete success modal */}
            {showDeleteSuccess && (
                <ModalLayout hideClose>
                    <div className='d-flex justify-content-center mb-3'>
                        <div className='d-flex justify-content-center align-items-center rounded-circle'
                            style={{ width: '64px', height: '64px', backgroundColor: '#2FB6E0' }}>
                            <div className='d-flex justify-content-center align-items-center rounded-circle bg-white'
                                style={{ width: '48px', height: '48px' }}>
                                <FiX size={26} color='#E14434' />
                            </div>
                        </div>
                    </div>
                    <div className='mb-1' style={{ fontSize: '15px' }}>The Device is Deleted Sucessfully</div>
                    <div className='text-muted mb-4' style={{ fontSize: '14px' }}>Go to All Device Page</div>
                    <button className='btn btn-dark px-5' onClick={() => setShowDeleteSuccess(false)}>Done</button>
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
