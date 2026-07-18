import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axiosInstance from '../../util/AxiosInstance';
import ModalLayout from '../layout/ModalLayout';

const passwordIconStyle = { position: 'absolute', right: '15px', top: '70%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#6c757d' };

export default function ChangePasswordContent() {
    const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState({ currentPassword: false, newPassword: false, confirmPassword: false });
    const [modal, setModal] = useState({ show: false, title: '', message: '', isError: false, onConfirm: null });
    const navigate = useNavigate();

    const formField = [
        { name: 'currentPassword', placeholder: 'Current Password', label: 'Current Password' },
        { name: 'newPassword', placeholder: 'New Password', label: 'New Password' },
        { name: 'confirmPassword', placeholder: 'Confirm Password', label: 'Confirm Password' }
    ];

    const userData = useSelector((state) => state.user);

    const sessionId = localStorage.getItem('sessionId');

    useEffect(() => {
        if (!sessionId) {
            navigate('/');
            return;
        }
    }, [navigate, sessionId]);

    const resetForm = () => {
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    const toggle = (field) => {
        setShowPassword({ ...showPassword, [field]: !showPassword[field] });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!sessionId) {
            navigate('/');
            return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            setModal({
                show: true,
                title: 'Error',
                message: <span className='text-danger'>Passwords do not match</span>,
                isError: true,
                onConfirm: () => setModal({ ...modal, show: false }),
            });
            return;
        }

        // No backend endpoint exists for changing password with the current password directly
        // (no /user/change/password anywhere in UserController). The only real password-change path
        // is POST /user/update/password, but that's guarded by SECURITY_TOKEN cookies from the OTP
        // flow (/auth/otp/trigger -> /auth/otp/verify), not by supplying the current password here -
        // so this form can't work as designed until that flow is reused. Fail gracefully for now.
        setModal({
            show: true,
            title: 'Not available',
            message: <span className='text-danger'>Changing your password this way isn't supported by the backend yet - use "Forgot password" instead.</span>,
            isError: true,
            onConfirm: () => setModal({ ...modal, show: false }),
        });

        // try {
        //     const payload = { userId: userData.userId, currentPassword: formData.currentPassword, newPassword: formData.newPassword };

        //     const { data, status } = await axios.patch(`${process.env.REACT_APP_API_URL}/user/change/password`, payload,
        //         { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sessionId}` } }
        //     );
        //     if (status === 200) {
        //         setModal({
        //             show: true,
        //             title: 'Success',
        //             message: data.message,
        //             isError: false,
        //             onConfirm: () => {
        //                 setModal({ ...modal, show: false });
        //                 navigate('/settings/profile');
        //             }
        //         });
        //         resetForm();
        //     }
        // } catch (err) {
        //     const errorMessage = err.response?.data.error || 'Password update failed. Please try again.';
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

                <div style={{ fontSize: '24px', lineHeight: '100%', letterSpacing: '0' }} className='mb-3'>Change Password</div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div style={{ width: '100%', overflowX: 'hidden', height: '300px', overflowY: 'auto' }}>
                        {formField.map((formFieldObj, index) => (
                            <React.Fragment key={index}>
                                <div className='position-relative mb-3'>
                                    <label className='form-label fw-bold' htmlFor={formFieldObj.name}>{formFieldObj.label}</label>
                                    <input className='form-control pe-5' type={(formFieldObj.name === 'currentPassword' || formFieldObj.name === 'newPassword' || formFieldObj.name === 'confirmPassword') ? (showPassword[formFieldObj.name] ? 'text' : 'password') : formFieldObj.type} id={formFieldObj.name} name={formFieldObj.name} placeholder={formFieldObj.placeholder} value={formData[formFieldObj.name]} onChange={handleChange} required />
                                    {(formFieldObj.name === 'currentPassword' || formFieldObj.name === 'newPassword' || formFieldObj.name === 'confirmPassword') && (
                                        <span onClick={() => toggle(formFieldObj.name)} style={passwordIconStyle}>
                                            {showPassword[formFieldObj.name] ? <FaEyeSlash /> : <FaEye />}
                                        </span>
                                    )}
                                </div>
                            </React.Fragment>
                        ))}
                    </div>

                    <div className='text-end my-5'>
                        <button type='submit' className='btn btn-dark'>Update Password</button>
                    </div>
                </form>
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