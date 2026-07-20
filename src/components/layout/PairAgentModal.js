import React, { useState } from 'react';
import ModalLayout from './ModalLayout';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import axiosInstance from '../../util/AxiosInstance';



const INITIAL_STATE = { agentName: '', pairingCode: '' };

export default function PairAgentModal({ onDone, onSkip }) {
    const [formData, setFormData] = useState(INITIAL_STATE);
    const [step, setStep] = useState('form');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            await axiosInstance.patch('/localAgent/pair', formData);
            setStep('success');
        }catch (err) {
            setError(err.response?.data?.message || 'The pair code is incorrect');
            setStep('failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleRetry = () => {
        setError('');
        setStep('form');
    }

    if (step === 'success') {
        return (
            <ModalLayout hideClose>
                <div className='d-flex justify-content-center mb-4'>
                    <div style={{
                        width: '90px', height: '90px', borderRadius: '50%',
                        backgroundColor: '#1a9bd7', display: 'flex',
                        alignItems: 'center', justifyContent: 'center'
                    }}>
                        <FaCheck style={{ color: '#fff', fontSize: '36px' }} />
                    </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: '16px' }} className='mb-4'>
                    Pair code is correct your device is connected with Agent successfully
                </div>
                <button
                    onClick={onDone}
                    className='btn w-100'
                    style={{ backgroundColor: '#8b7ff0', color: '#fff', borderRadius: '10px', padding: '10px' }}
                >
                    Done
                </button>
            </ModalLayout>
        );
    }

    if (step === 'failed') {
        return (
            <ModalLayout hideClose>
                <div className='d-flex justify-content-center mb-4'>
                    <div style={{
                        width: '70px', height: '70px', borderRadius: '50%',
                        backgroundColor: '#e8433c', display: 'flex',
                        alignItems: 'center', justifyContent: 'center'
                    }}>
                        <FaTimes style={{ color: '#fff', fontSize: '28px' }} />
                    </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: '16px' }} className='mb-4'>
                    {error || 'The pair code is incorrect'}
                </div>
                <button
                    onClick={handleRetry}
                    className='btn w-100'
                    style={{ backgroundColor: '#8b7ff0', color: '#fff', borderRadius: '10px', padding: '10px' }}
                >
                    Retry
                </button>
            </ModalLayout>
        );
    }

    return (
        <ModalLayout modal={onSkip}>
            <div className='text-start mb-4' style={{ fontWeight: 700, fontSize: '16px' }}>
                Enter the Pair code shown in the wall mount device
            </div>
            <form onSubmit={handleSubmit} className='text-start'>
                <div className='mb-3'>
                    <input
                        type='text' name='agentName' className='form-control' placeholder='Name'
                        value={formData.agentName} onChange={handleChange} required
                    />
                </div>
                <div className='mb-3'>
                    <input
                        type='text' name='pairingCode' className='form-control' placeholder='Pair code'
                        value={formData.pairingCode} onChange={handleChange} required
                    />
                </div>
                {error && <div className='text-danger mb-3'>{error}</div>}
                <div className='d-flex justify-content-center mt-4'>
                    <button
                        type='submit' disabled={submitting}
                        className='btn' style={{ backgroundColor: '#1e5f3e', color: '#fff', padding: '8px 40px', borderRadius: '6px' }}
                    >
                        {submitting ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </form>
        </ModalLayout>
    )

}