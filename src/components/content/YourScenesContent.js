import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegLightbulb } from 'react-icons/fa';
import { FiPower } from 'react-icons/fi';
import axiosInstance from '../../util/AxiosInstance';
import ModalLayout from '../layout/ModalLayout';

// ---------------------------------------------------------------------------
// MOCK DATA (placeholder only)
// TODO(API): Replace with a real call once a rules/scenes endpoint exists on
// the backend (e.g. GET /user/rule). Remove MOCK_SCENES/MOCK_DEVICES and the
// mock fallbacks below once that endpoint is available.
// ---------------------------------------------------------------------------
const MOCK_SCENES = [
    {
        ruleId: 'mock-1',
        ruleName: 'My Morning',
        roomName: 'Living Room',
        fromTime: '6:30 am',
        toTime: '10:29 pm',
        enabled: true,
        days: ['MONDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'],
    },
    {
        ruleId: 'mock-2',
        ruleName: 'My Morning',
        roomName: 'Living Room',
        fromTime: '6:30 am',
        toTime: '10:29 pm',
        enabled: true,
        days: ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'],
    },
];

const MOCK_DEVICES = [
    { roomName: 'Living Room', status: true },
];

const ALL_DAYS = [
    { short: 'Sun', full: 'SUNDAY' },
    { short: 'Mon', full: 'MONDAY' },
    { short: 'Tue', full: 'TUESDAY' },
    { short: 'Wed', full: 'WEDNESDAY' },
    { short: 'Thu', full: 'THURSDAY' },
    { short: 'Fri', full: 'FRIDAY' },
    { short: 'Sat', full: 'SATURDAY' },
];

export default function YourScenes() {
    const [scenes, setScenes] = useState([]);
    const [devices, setDevices] = useState([]);
    const [modal, setModal] = useState({ show: false, title: '', message: '', isError: false, onConfirm: null });
    const navigate = useNavigate();

    const sessionId = localStorage.getItem('sessionId');

    const fetchScene = useCallback(async () => {
        if (!sessionId) {
            navigate('/');
            return;
        }
        // TODO(API): No backend endpoint exists for rules/scenes yet (no /user/rule,
        // no RuleController). Using MOCK_SCENES as a placeholder so the UI can be
        // built/reviewed now. Swap this for the real fetch below once it exists.
        setScenes(MOCK_SCENES);
        // try {
        //     const { data, status } = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/user/rule`,
        //         { headers: { Authorization: `Bearer ${sessionId}` } }
        //     );
        //     if (status === 200) {
        //         setScenes(data);
        //     }
        // } catch (err) {
        //     const errorMessage = err.response?.data?.message || 'Failed to fetch schedule';
        //     console.error(errorMessage);
        // }
    }, [sessionId, navigate]);

    const fetchDevice = useCallback(async () => {
        if (!sessionId) {
            navigate('/');
            return;
        }
        // TODO(API): No backend endpoint exists for device/"thing" listing yet
        // (no /user/thing). Using MOCK_DEVICES as a placeholder.
        setDevices(MOCK_DEVICES);
        // try {
        //     const { data, status } = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/user/thing`,
        //         { headers: { Authorization: `Bearer ${sessionId}` } }
        //     );
        //     if (status === 200 && Array.isArray(data.things)) {
        //         const devicesList = data.things.map(thing => {
        //             const mainItem = thing.items?.find(item =>
        //                 item.type === 'Switch' || item.type === 'Color' || item.name?.toLowerCase().includes('wiz_bulb_color')) || thing.items?.[0];
        //             return {
        //                 id: mainItem?.name,
        //                 roomName: thing.roomName,
        //                 thingName: thing.label,
        //                 status: mainItem?.type === 'Switch' ? mainItem?.state === 'ON' : mainItem?.state !== '0,0,0'
        //             };
        //         });
        //         setDevices(devicesList);
        //     }
        // } catch (err) {
        //     setDevices([]);
        //     const errorMessage = err.response?.data?.message || 'Failed to fetch device';
        //     console.error(errorMessage);
        // }
    }, [sessionId, navigate]);

    useEffect(() => {
        fetchScene();
        fetchDevice();
    }, [fetchDevice, fetchScene]);

    return (
        <>
            <div className='container px-5 py-4'>

                <div className='d-flex justify-content-between align-items-center mb-3'>
                    <div style={{ fontSize: '24px', lineHeight: '100%', letterSpacing: '0' }}>Your Scenes</div>
                </div>

                {/* Content */}
                <div style={{ width: '100%', overflowX: 'hidden', height: '300px', overflowY: 'auto' }}>
                    {scenes.length === 0 ? (
                        <div className='alert d-flex justify-content-center align-items-center h-100'>No schedule yet to create</div>
                    ) : (
                        scenes.reduce((rows, scenesObj, index) => {
                            if (index % 2 === 0) rows.push([]);
                            rows[rows.length - 1].push(scenesObj);
                            return rows;
                        }, []).map((row, rowIndex) => (
                            <div className="row mx-0 mb-3" key={rowIndex}>
                                {row.map((scenesObj, colIndex) => (
                                    <div className="col-6" key={colIndex}>

                                        <div className="d-flex flex-column border rounded p-3"
                                            style={{ backgroundColor: '#ffffff', width: '100%', height: '168px', cursor: 'pointer' }}
                                            onClick={() => {
                                                navigate(`/schedule/update_schedule/${scenesObj.ruleId}`, { state: { scene: scenesObj } });
                                            }}>

                                            <div className="d-flex justify-content-between align-items-center mb-2">

                                                <div style={{ fontSize: '14px' }}>
                                                    <span className='fw-bold'>{scenesObj.ruleName}</span> - {scenesObj.roomName}
                                                </div>

                                                <div className="form-check form-switch">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        role="switch"
                                                        checked={scenesObj.enabled}
                                                        onClick={(e) => e.stopPropagation()}
                                                        onChange={async (e) => {
                                                            e.stopPropagation();
                                                            const newEnabled = e.target.checked;
                                                            // TODO(API): No backend endpoint exists for toggling rules/scenes
                                                            // (no /user/rule/toggle). Updating local state only for now so the
                                                            // toggle is visually functional against the mock data.
                                                            setScenes(prevScenes =>
                                                                prevScenes.map(scene =>
                                                                    scene.ruleId === scenesObj.ruleId ? { ...scene, enabled: newEnabled } : scene
                                                                )
                                                            );
                                                            // try {
                                                            //     await axiosInstance.patch(`${process.env.REACT_APP_API_URL}/user/rule/toggle`,
                                                            //         { ruleId: scenesObj.ruleId, enable: newEnabled },
                                                            //         { headers: { Authorization: `Bearer ${sessionId}` } }
                                                            //     );
                                                            // } catch (err) {
                                                            //     const errorMessage = err.response?.data?.message || 'Failed to update rule';
                                                            //     setModal({
                                                            //         show: true,
                                                            //         title: 'Failed',
                                                            //         message: <span className='text-danger'>{errorMessage}</span>,
                                                            //         isError: true,
                                                            //         onConfirm: () => setModal({ ...modal, show: false }),
                                                            //     });
                                                            // }
                                                        }}
                                                    />
                                                </div>

                                            </div>

                                            <div className="text-muted mb-2" style={{ fontSize: '13px' }}>
                                                {scenesObj.fromTime} to {scenesObj.toTime}
                                            </div>

                                            <div className="d-flex flex-wrap justify-content-between align-items-center mb-2">

                                                <div className='d-flex flex-column justify-content-center align-items-center bg-eaeaea rounded p-2'>
                                                    <FaRegLightbulb className='text-muted mb-1' style={{ width: '24px', height: '24px' }} />
                                                    <div className='d-flex justify-content-center align-items-center' style={{ fontSize: '12px' }}>
                                                        <FiPower className='mx-1' />
                                                        <div className='mx-1'>
                                                            {(() => {
                                                                const device = devices.find(dev =>
                                                                    dev.roomName === scenesObj.roomName
                                                                );
                                                                return device?.status ? 'On' : 'Off';
                                                            })()}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='d-flex gap-1'>
                                                    {ALL_DAYS.map(({ short, full }) => {
                                                        const isActive = scenesObj.days.includes(full);
                                                        return (
                                                            <span key={full}
                                                                className={`d-flex justify-content-center align-items-center rounded-circle ${isActive ? 'bg-dark text-white' : 'bg-eaeaea text-muted'}`}
                                                                style={{ height: '30px', width: '30px', fontSize: '10px' }}>
                                                                {short}
                                                            </span>
                                                        );
                                                    })}
                                                </div>

                                            </div>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))
                    )}
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
