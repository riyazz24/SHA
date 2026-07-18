import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import axiosInstance from '../../util/AxiosInstance';
import ModalLayout from '../layout/ModalLayout';

const customStyle1 = { fontWeight: '700', fontSize: '16px', lineHeight: '100%', letterSpacing: '-0.39px' };
const customStyle2 = { fontWeight: '600', fontSize: '14px', lineHeight: '100%', letterSpacing: '-0.39px' };

const Buttons = ({ buttonName, onCancel, onDelete }) => (
    <div className='d-flex justify-content-around'>
        <button type='button' className='btn btn-outline-eaeaea px-5' onClick={onCancel}>Cancel</button>
        <button type='submit' className='btn btn-dark px-5' onClick={onDelete}>{buttonName}</button>
    </div>
);

export default function AgentContent({ agentName }) {
    const [agents, setagents] = useState([]);
    const [hasAgent, setHasAgent] = useState(false);
    const [showAddAgentModal, setShowAddAgentModal] = useState(false);
    const [showDeleteAgentModal, setShowDeleteAgentModal] = useState(false);
    const [newagentName, setNewagentName] = useState('');
    const [modal, setModal] = useState({ show: false, title: '', message: '', isError: false, onConfirm: null });
    const navigate = useNavigate();
    const sessionId = localStorage.getItem('sessionId');

    const showMessage = (action) => {
        setModal({
            show: true,
            title: 'Action',
            message: `Agent ${action} isn't available yet - this feature is still being build. Check back soon!`, 
        });
    };

    const fetchAgent = () => {
        if (!sessionId) {
            navigate('/');
            return;
        }
        showMessage('Not available');
    };

    const capitalize = (str) => {
        if (!str) return '';
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const handleAddAgent = async (e) => {
        e.preventDefault();
        if (!sessionId) {
            navigate('/');
            return;
        }
        setShowAddAgentModal(false);
        setNewagentName('');
        showMessage('Creation');
    };

    const handleToggle = async (itemName, newStatus) => {
        if (!sessionId) {
            navigate('/');
            return;
        }
        showMessage('control');
    };

    const confirmDeleteAgent = () => {
        setShowDeleteAgentModal(true);
    };

    const handleDeleteAgentConfirmed = async () => {
        if (!sessionId) {
            navigate('/');
            return;
        }
        setShowDeleteAgentModal(false);
        showMessage('deletion');
    };


    return (
        <>
            <div className="container px-5 py-4">

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div style={{ fontSize: '24px', lineHeight: '100%', letterSpacing: '0' }}>{hasAgent === false ? 'No Agent' : agentName}</div>
                    <button className="btn btn-dark" onClick={() => setShowAddAgentModal(true)}>Add Agent</button>
                </div>

                {/* Table */}
                <div style={{ width: '100%', overflowX: 'hidden', height: '300px', overflowY: 'auto' }}>
                    {hasAgent === true &&
                        <div className='table-responsive'>
                            <table className='table align-middle border-0'>
                                <thead className='table-1C1C1E border-0'>
                                    <tr>
                                        <th className='p-3 border-0' style={{ ...customStyle1, width: '40%' }}>agents</th>
                                        <th className='p-3 border-0' style={{ ...customStyle1, width: '20%' }}>Agent</th>
                                        <th className='p-3 border-0' style={{ ...customStyle1, width: '20%' }}>Status</th>
                                        <th className='p-3 border-0' style={{ ...customStyle1, width: '20%' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {agents.length > 0 ? (
                                        agents.map((agentsObj, index) => (
                                            <tr key={index} className={index % 2 === 0 ? 'table-EAEAEA' : ''}>
                                                <td className='p-3 border-0' style={{ ...customStyle2 }}>
                                                    {agentsObj.label}
                                                </td>
                                                <td className='p-3 border-0' style={{ ...customStyle2 }}>
                                                    {agentsObj.agentName}
                                                </td>
                                                <td className='p-3 border-0' style={{ ...customStyle2 }}>
                                                    <div className='form-check form-switch d-flex align-items-center'>
                                                        <input style={{ cursor: 'pointer' }} className='form-check-input' type='checkbox' checked={agentsObj.status}
                                                            onChange={() => handleToggle(agentsObj.itemName, !agentsObj.status)} />
                                                    </div>
                                                </td>
                                                <td className='p-3 border-0' style={{ ...customStyle2 }}>
                                                    <FaTrash onClick={confirmDeleteAgent} style={{ fontSize: '16px', cursor: 'pointer' }} />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr className='table-EAEAEA'>
                                            <td colSpan='3' className='p-3 border-0 text-center' style={{ ...customStyle2 }}>
                                                No agents found
                                            </td>
                                            <td className='p-3 border-0' style={{ ...customStyle2 }}>
                                                <FaTrash onClick={confirmDeleteAgent} style={{ fontSize: '16px', cursor: 'pointer' }} />
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    }

                    {hasAgent === false && (
                        <div className='alert d-flex justify-content-center align-items-center h-100'>No Agents yet to create</div>
                    )}
                </div>
            </div >

            {/* Add Agent Modal */}
            {showAddAgentModal && (
                <ModalLayout title={'Add Agent'} modal={() => setShowAddAgentModal(false)}>
                    <form onSubmit={handleAddAgent}>
                        <div className="text-start mb-5">
                            <label className="form-label" htmlFor='agentName'>Agent Name</label>
                            <input type="text" id='agentName' className="form-control" value={newagentName} onChange={(e) => setNewagentName(e.target.value)} required />
                        </div>
                        <Buttons buttonName={'Add'} onCancel={() => setShowAddAgentModal(false)} />
                    </form>
                </ModalLayout>
            )}

            {/* Delete Agent Modal */}
            {showDeleteAgentModal && (
                <ModalLayout title={'Delete Agent'} msg={<span>Do you really want to delete {agentName} ?</span>}
                    modal={() => setShowDeleteAgentModal(false)}>
                    <Buttons buttonName={'Delete'} onCancel={() => setShowDeleteAgentModal(false)} onDelete={handleDeleteAgentConfirmed} />
                </ModalLayout>
            )}

            {/* Alert Modal */}
            {modal.show && (
                <ModalLayout title={modal.title} msg={modal.message} modal={() => setModal({ ...modal, show: false})}>
                    <button onClick={() => setModal({ ...modal, show: false })} className={`btn btn-dark px-3`}>
                        OK
                    </button>
                </ModalLayout>
            )}
        </>
    );
};