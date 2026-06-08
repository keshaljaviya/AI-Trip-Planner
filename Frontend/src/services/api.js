import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Add a request interceptor to include the JWT token
axios.defaults.timeout = 60000; // 60 seconds timeout
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const login = async (credentials) => {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
};

export const register = async (userData) => {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const generateTrip = async (tripData) => {
    const response = await axios.post(`${API_URL}/trip/generate`, tripData);
    return response.data;
};

export const saveTrip = async (tripData) => {
    const response = await axios.post(`${API_URL}/trip/save`, tripData);
    return response.data;
};

export const fetchSavedTrips = async () => {
    const response = await axios.get(`${API_URL}/trip/my-trips`);
    return response.data;
};

export const deleteTrip = async (id) => {
    const response = await axios.delete(`${API_URL}/trip/${id}`);
    return response.data;
};

export const fetchAttractions = async (city) => {
    const response = await axios.get(`${API_URL}/attractions`, { params: { city } });
    return response.data;
};

export const fetchTransport = async (source, destination) => {
    const response = await axios.post(`${API_URL}/transport`, { source, destination });
    return response.data;
};
