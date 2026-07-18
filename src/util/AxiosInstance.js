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
    if(agentId) {
        config.headers['X-HomeId'] = agentId;
        config.headers['X-AgentId'] = agentId;
    }
    return config;
});

export default axiosInstance;