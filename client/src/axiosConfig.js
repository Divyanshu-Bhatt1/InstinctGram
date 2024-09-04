// src/axiosConfig.js
import axios from 'axios';
import React, { useState } from 'react';
import {Outlet, Navigate, useNavigate} from 'react-router-dom'




axios.defaults.withCredentials = true; // Ensure cookies are sent with requests

axios.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const navigate=useNavigate()
            // localStorage.removeItem('token'); // Clean up local storage if using it
            // window.location.href = '/'; // Redirect to login page
            navigate('/')
        }
        return Promise.reject(error);
    }
);

export default axios;
