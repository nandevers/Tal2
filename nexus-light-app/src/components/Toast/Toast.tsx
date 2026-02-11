// src/components/Toast/Toast.tsx
import React from 'react';
import type { ToastProps } from './types';
import IconComponent from '../../utils/IconComponent'; // Assuming IconComponent is needed for the green dot, or replace

const Toast: React.FC<ToastProps> = ({ message, visible }) => {
    if (!visible) return null;

    return (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-[60] bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 toast-enter">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">{message}</span>
        </div>
    );
};

export default Toast;
