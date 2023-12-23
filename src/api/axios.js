import axios from 'axios';
const BASE_URL = 'https://localhost:7265';

export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin" : "*"
    },
    withCredentials: true
});