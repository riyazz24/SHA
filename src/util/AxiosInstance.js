import axios from 'axios';
import { getDeviceId } from './DeviceId';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
    config.headers['X-DeviceId'] = getDeviceId();
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
        config.headers['X-SessionId'] = sessionId;
    }
    const agentId = localStorage.getItem('agentId');
    if (agentId) {
        config.headers['X-HomeId'] = agentId;
        config.headers['X-AgentId'] = agentId;
    }
    return config;
});

// ACCESS_TOKEN is short-lived (5 min). Rather than let every call start failing
// with 401 once it expires, silently rotate it via the REFRESH_TOKEN cookie and
// retry the original request - once. If that also fails, the session is truly
// dead, so clear local state and send the user back to Login.
let isRefreshing = false;
let pendingQueue = [];

const resolvePendingQueue = (error) => {
    pendingQueue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve()));
    pendingQueue = [];
};

const logoutAndRedirect = () => {
    localStorage.removeItem('sessionId');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
    localStorage.removeItem('agentId');
    if (window.location.pathname !== '/login') {
        window.location.href = '/login';
    }
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;
        const isAuthRoute = originalRequest?.url?.includes('/auth/login') || originalRequest?.url?.includes('/auth/rotate/refresh/token');

        if (status !== 401 || isAuthRoute || originalRequest._retry) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            // A refresh is already in flight - queue this request until it settles.
            return new Promise((resolve, reject) => {
                pendingQueue.push({ resolve, reject });
            }).then(() => axiosInstance(originalRequest));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            await axiosInstance.post('/auth/rotate/refresh/token');
            resolvePendingQueue(null);
            return axiosInstance(originalRequest);
        } catch (refreshError) {
            resolvePendingQueue(refreshError);
            logoutAndRedirect();
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default axiosInstance;

// import axios from 'axios';
// import { getDeviceId } from './DeviceId';

// const axiosInstance = axios.create({
//     baseURL: process.env.REACT_APP_API_URL,
//     withCredentials: true,
// });

// axiosInstance.interceptors.request.use((config) => {
//     config.headers['X-DeviceId'] = getDeviceId();
//     const sessionId = localStorage.getItem('sessionId');
//     if (sessionId) {
//         config.headers['X-SessionId'] = sessionId;
//     }
//     const agentId = localStorage.getItem('agentId');
//     if(agentId) {
//         config.headers['X-HomeId'] = agentId;
//         config.headers['X-AgentId'] = agentId;
//     }
//     return config;
// });

// export default axiosInstance;