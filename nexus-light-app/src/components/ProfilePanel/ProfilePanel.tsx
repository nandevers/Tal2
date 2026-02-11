// src/components/ProfilePanel/ProfilePanel.tsx
import React from 'react';
import IconComponent from '../../utils/IconComponent';

interface ProfilePanelProps {
    isOpen: boolean;
    onClose: () => void;
    onViewChange: (view: string) => void;
}

const ProfilePanel: React.FC<ProfilePanelProps> = ({ isOpen, onClose, onViewChange }) => {
    if (!isOpen) return null;

    return (
        <div className="absolute inset-y-0 right-0 w-80 bg-white shadow-2xl border-l border-gray-100 z-[100] slide-in-right flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/30">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900">Felix Admin</h3>
                        <p className="text-xs text-gray-500">Workspace Owner</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-md text-gray-400 transition-colors"><IconComponent name="x" size={16} /></button>
            </div>

            <div className="flex-1 p-4 space-y-1">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-2">Account</div>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors text-left">
                    <IconComponent name="user" size={16} /> My Profile
                </button>
                <button onClick={() => { onViewChange('settings'); onClose(); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors text-left">
                    <IconComponent name="settings" size={16} /> Workspace Settings
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors text-left">
                    <IconComponent name="credit-card" size={16} /> Billing
                </button>

                <div className="h-px bg-gray-100 my-2 mx-3"></div>

                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-2">Support</div>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors text-left">
                    <IconComponent name="help-circle" size={16} /> Help Center
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors text-left">
                    <IconComponent name="info" size={16} /> About Nexus
                </button>
            </div>

            <div className="p-4 border-t border-gray-100">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                    <IconComponent name="log-out" size={14} /> Log Out
                </button>
                <div className="text-center mt-3 text-[10px] text-gray-400">Nexus Light v2.4.0</div>
            </div>
        </div>
    );
};

export default ProfilePanel;