import { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../util/AxiosInstance';
import ModalLayout from '../components/layout/ModalLayout';
import AuthLayout from '../components/layout/AuthLayout';

const authBackgroundStyle = { width: '100%', maxWidth: '450px', minHeight: '450px' };

export default function OtpVerify() {
    const [otpData, setOtpData] = useState(['', '', '', '', '', '']);
    const [modal, setModal] = useState({ show: false, title: '', message: '', isError: false, onConfirm: null });
    const navigate = useNavigate();
    const input = useRef([]);
    const location = useLocation();
    const { email, securityCodeId: initialSecurityCodeId } = location.state || {};
    const [securityCodeId, setSecurityCodeId] = useState(initialSecurityCodeId);

    const resetForm = () => setOtpData(['', '', '', '', '', '']);

    const handleChange = (index, value) => {
        if (!/^\d?$/.test(value)) return;
        const newOtp = [...otpData];
        newOtp[index] = value;
        setOtpData(newOtp);
        if (value && index < 5) {
            input.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otpData[index] && index > 0) {
            input.current[index - 1].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otp = otpData.join('');
        try {
            // /user/otp/verify doesn't exist - real endpoint is /auth/otp/verify, needs X-SecurityCodeId
            // header (from the trigger/resend response) and { securityCode } body, not { email, otp }
            const { status } = await axiosInstance.post(
                '/auth/otp/verify',
                { securityCode: otp },
                { headers: { 'X-SecurityCodeId': securityCodeId } }
            );
            if (status === 200) {
                setModal({
                    show: true,
                    title: 'Success',
                    message: 'OTP verified',
                    isError: false,
                    onConfirm: () => {
                        setModal({ ...modal, show: false });
                        navigate('/reset/password', { state: { email } });
                    }
                });
                resetForm();
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'OTP-Verify failed.';
            setModal({
                show: true,
                title: 'Failed',
                message: <span className='text-danger'>{errorMessage}</span>,
                isError: true,
                onConfirm: () => setModal({ ...modal, show: false }),
            });
        }
    };

    const handleResendOtp = async (e) => {
        e.preventDefault();
        try {
            // /user/resend/otp doesn't exist - real endpoint is /auth/otp/retrigger, needs X-SecurityCodeId
            // header (no body) and returns a new securityCodeId to use on the next verify attempt
            const { data, status } = await axiosInstance.post(
                '/auth/otp/retrigger',
                {},
                { headers: { 'X-SecurityCodeId': securityCodeId } }
            );
            if (status === 200) {
                setSecurityCodeId(data.securityCodeId);
                setModal({
                    show: true,
                    title: 'Success',
                    message: 'A new OTP has been sent to your email',
                    isError: false,
                    onConfirm: () => {
                        setModal({ ...modal, show: false });
                    }
                });
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to resend OTP.';
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

                <h3 className='mb-3'>Verify OTP</h3>

                <p className='text-muted mb-3'>Enter 6 digit code sent to you at your email.</p>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className='d-flex justify-content-around mb-3'>
                        {otpData.map((digit, i) => (
                            <input
                                key={i}
                                ref={el => input.current[i] = el}
                                type='text'
                                maxLength='1'
                                value={digit}
                                onChange={(e) => handleChange(i, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(i, e)}
                                className='form-control text-center'
                                style={{ width: '50px', fontSize: '24px', borderRadius: '5px', background: 'transparent' }}
                                required
                            />
                        ))}
                    </div>

                    <div className='mb-3'>
                        <button type='submit' className='btn btn-dark w-100'>Verify OTP</button>
                    </div>

                    <p className='text-center text-muted mb-3'>
                        Didn’t receive a verification code?
                    </p>

                    <div className='text-center mb-3'>
                        <Link className='btn-link p-0 text-dark mx-2' onClick={handleResendOtp}>Resend Code</Link>
                        <span>|</span>
                        <Link className='btn-link p-0 text-dark mx-2' to={'/forgot/password'}>Change Email</Link>
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