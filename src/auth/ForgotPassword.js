import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../util/AxiosInstance';
import ModalLayout from '../components/layout/ModalLayout';
import AuthLayout from '../components/layout/AuthLayout';

const INITIAL_STATE = { email: '' };
const authBackgroundStyle = { width: '100%', maxWidth: '450px', minHeight: '450px' };

export default function ForgotPassword() {
    const [formData, setFormData] = useState(INITIAL_STATE);
    const [modal, setModal] = useState({ show: false, title: '', message: '', isError: false, onConfirm: null });
    const navigate = useNavigate();

    const resetForm = () => setFormData(INITIAL_STATE);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // /user/forgot/password doesn't exist on the backend - the real flow is /auth/otp/trigger,
            // which sends the OTP and returns a securityCodeId the next screen needs as X-SecurityCodeId
            const { data, status } = await axiosInstance.post('/auth/otp/trigger', formData);
            if (status === 200) {
                setModal({
                    show: true,
                    title: 'Success',
                    message: 'OTP sent to your email',
                    isError: false,
                    onConfirm: () => {
                        setModal({ ...modal, show: false });
                        navigate('/otp/verify', { state: { email: formData.email, securityCodeId: data.securityCodeId } });
                    }
                });
                resetForm();
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Forgot Password failed.';
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

                <h3 className='mb-3'>Forgot Password</h3>

                <p className='text-muted mb-3'>Please enter your registered email to reset your password.</p>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label className='text-6c757d' htmlFor='email'>Email</label>
                        <input className='form-control' type='email' id='email' name='email' value={formData.email} onChange={handleChange} autoComplete='email' required />
                    </div>

                    <div className='mb-3'>
                        <button type='submit' className='btn btn-dark w-100'>Get OTP</button>
                    </div>
                </form>

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