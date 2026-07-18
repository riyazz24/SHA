import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axiosInstance from '../util/AxiosInstance';
import ModalLayout from '../components/layout/ModalLayout';
import AuthLayout from '../components/layout/AuthLayout';

const INITIAL_STATE = { fullName: '', email: '', contactNo: '', rawPassword: '', confirmPassword: '' };
const authBackgroundStyle = { maxWidth: '500px', width: '100%' };
const passwordIconStyle = { position: 'absolute', right: '15px', top: '65%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#6c757d' };
const CONTACT_NO_PATTERN = /^[0-9]{5}\s[0-9]{5}$/; // e.g. "98765 43210"
const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export default function Register() {
    const [formData, setFormData] = useState(INITIAL_STATE);
    const [showPassword, setShowPassword] = useState({ rawPassword: false, confirmPassword: false });
    const [modal, setModal] = useState({ show: false, title: '', message: '', isError: false, onConfirm: null });
    const navigate = useNavigate();

    const formField = [
        { name: 'fullName', type: 'text', label: 'Name', autoComplete: 'name' },
        { name: 'email', type: 'email', label: 'Email', autoComplete: 'email' },
        { name: 'contactNo', type: 'tel', label: 'Contact No', autoComplete: 'tel', placeholder: 'e.g. 98765 43210' },
        { name: 'rawPassword', label: 'Password', autoComplete: 'new-password' },
        { name: 'confirmPassword', label: 'Confirm Password', autoComplete: 'new-password' },
    ];
   
    const resetForm = () => setFormData(INITIAL_STATE);

    const toggle = (field) => {
        setShowPassword({ ...showPassword, [field]: !showPassword[field] });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const showError = (message) => {
        setModal({
            show: true,
            title: 'Error',
            message: <span className='text-danger'>{message}</span>,
            isError: true,
            onConfirm: () => setModal({...modal, show: false})
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.rawPassword !== formData.confirmPassword) {
            showError('Passwords do not match.');
            return;
        }

        if (!CONTACT_NO_PATTERN.test(formData.contactNo)) {
            showError('Contact number must be 10 digits, formatted as "12345 67890"');
            return;
        } 

        if (!PASSWORD_PATTERN.test(formData.rawPassword)) {
            showError('Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and one of @ $ ! % * ? &');
            return;
        }

        const { confirmPassword, ...payload } = formData;

        try {
            const { data, status } = await axiosInstance.post('/user/create', payload);
            if (status === 200) {
                setModal({
                    show: true,
                    title: 'Success',
                    message: data.message,
                    isError: false,
                    onConfirm: () => {
                        setModal({ ...modal, show: false });
                        navigate('/');
                    }
                });
                resetForm();
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
            showError(errorMessage);
        }
    };

    return (
        <>
            <AuthLayout customStyle={authBackgroundStyle}>
                <h3 className='mb-3'>Register</h3>
                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {formField.map((formFieldObj, index) => (
                        <React.Fragment key={index}>
                            <div className='position-relative mb-3'>
                                <label className='text-6c757d' htmlFor={formFieldObj.name}>{formFieldObj.label}</label>
                                <input className='form-control' type={(formFieldObj.name === 'rawPassword' || formFieldObj.name === 'confirmPassword') ? (showPassword[formFieldObj.name] ? 'text' : 'password') : formFieldObj.type} id={formFieldObj.name} name={formFieldObj.name} value={formData[formFieldObj.name]} onChange={handleChange} autoComplete={formFieldObj.autoComplete} placeholder={formFieldObj.placeholder} required />
                                {(formFieldObj.name === 'rawPassword' || formFieldObj.name === 'confirmPassword') && (
                                    <span onClick={() => toggle(formFieldObj.name)} style={passwordIconStyle}>
                                        {showPassword[formFieldObj.name] ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                )}
                            </div>
                        </React.Fragment>
                    ))}

                    <div className='mb-3'>
                        <button type='submit' className='btn btn-dark w-100'>Register</button>
                    </div>
                </form>

                <p className='text-center text-muted mb-3'>
                    By registering you agree to <strong>Terms & Conditions</strong> and <strong>Privacy Policy</strong> of the Vermo
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