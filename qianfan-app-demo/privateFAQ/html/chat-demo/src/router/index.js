import React from 'react';
import { Navigate } from "react-router-dom";
import ChatDemo from '../modules/chatDemo/';

export const routers = [
    {
        path: '/',
        exact: true,
        element: <Navigate to='chatDemo' />,
    },
    {
        path: '/chatDemo',
        exact: true,
        element: <ChatDemo appName="faq"/>,
    },
];