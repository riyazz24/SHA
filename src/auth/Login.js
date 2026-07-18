import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/slice';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import ModalLayout from '../components/layout/ModalLayout';
import AuthLayout from '../components/layout/AuthLayout';
import axiosInstance from '../util/AxiosInstance';

const INITIAL_STATE = { email: '', rawPassword: '' };
const authBackgroundStyle = { width: '100%', maxWidth: '450px', minHeight: '450px' };
const passwordIconStyle = { position: 'absolute', right: '15px', top: '65%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#6c757d' };

export default function Login() {
    const [formData, setFormData] = useState(INITIAL_STATE);
    const [showPassword, setShowPassword] = useState(false);
    const [modal, setModal] = useState({ show: false, title: '', message: '', isError: false, onConfirm: null });
    const [showPairModal, setShowPairModal] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const formField = [
        { name: 'email', type: 'email', label: 'Email', autoComplete: 'email' },
        { name: 'rawPassword', type: showPassword ? 'text' : 'password', label: 'Password', autoComplete: 'current-password' }
    ];

    const resetForm = () => setFormData(INITIAL_STATE);
    const toggle = () => setShowPassword(!showPassword);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data, status } = await axiosInstance.post('/auth/login',formData);
            if (status === 200) {
                // localStorage.setItem('token', data.token);
                // localStorage.setItem('name', data.name);
                // localStorage.setItem('userId', data.userId);
                localStorage.setItem('role', data.role);
                localStorage.setItem('sessionId', data.sessionId);

                let userData = { role: data.role, sessionId: data.sessionId };
                if (data.role === 'USER') {
                    try {
                        const profileRes = await axiosInstance.get('/user/profile');
                        userData = { ...userData, userId: profileRes.data.userId, fullName: profileRes.data.fullName };
                        localStorage.setItem('userId', profileRes.data.userId);
                        localStorage.setItem('name', profileRes.data.fullName);
                    } catch (error) {
                        console.error('Error fetching user profile:', error);
                    }
                }
                dispatch(setUserData(userData));
                setModal({
                    show: true,
                    title: 'Success',
                    message: 'You have been logged in successfully',
                    isError: false,
                    onConfirm: () => {
                        setModal({ ...modal, show: false });
                        setShowPairModal(true);
                        navigate('/dashboard')
                    }
                });
                resetForm();
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
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
            <AuthLayout customStyle={authBackgroundStyle}>
                <h3 className='mb-3'>Login</h3>
                <p className='text-muted mb-3'>Please fill your detail to access your account.</p>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {formField.map((formFieldObj, index) => (
                        <React.Fragment key={index}>
                            <div className='position-relative mb-3'>
                                <label className='text-6c757d' htmlFor={formFieldObj.name}>{formFieldObj.label}</label>
                                <input className='form-control' type={formFieldObj.type} id={formFieldObj.name} name={formFieldObj.name} value={formData[formFieldObj.name]} onChange={handleChange} autoComplete={formFieldObj.autoComplete} required />
                                {formFieldObj.name === 'rawPassword' && (
                                    <span onClick={toggle} style={passwordIconStyle}>
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                )}
                            </div>
                        </React.Fragment>
                    ))}

                    <div className='text-end mb-3'>
                        <Link className='text-danger' to={'/forgot/password'}>Forgot Password?</Link>
                    </div>

                    <div className='mb-3'>
                        <button type='submit' className='btn btn-dark w-100'>Sign in</button>
                    </div>
                </form>

                <p className='text-center text-muted mb-3'>
                    Don't have an account?{' '}
                    <Link className='btn-link text-dark p-0 border-0 mb-1' to={'/register'}>Register</Link>
                </p>

            </AuthLayout>

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