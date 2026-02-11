import React from 'react';
import type { DockTab, DockProps } from './types';
import IconComponent from '../../utils/IconComponent'; // Use our consistent IconComponent

const Dock: React.FC<DockProps> = ({ activeTab, onTabChange, onDataClick }) => { // Add onDataClick here
    const tabs: DockTab[] = [
        { id: 'search', icon: 'search', label: 'Search' }, // Use string name for IconComponent
        { id: 'leads', icon: 'users', label: 'Entities' },
        { id: 'campaigns', icon: 'layers', label: 'Campaigns' },
        { id: 'inbox', icon: 'inbox', label: 'Inbox', badge: 2 }, // Badge will be dynamic later
        { id: 'insights', icon: 'bar-chart-2', label: 'Insights' },
        // Removed 'settings' from here as it will be a separate button
    ];

    return (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
            <div className="dock-container bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl px-3 py-2 flex items-center gap-2"> {/* Adjusted px/py */}
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        aria-label={tab.label}
                        className={`relative group p-3 rounded-xl transition-all duration-300 ease-out flex flex-col items-center justify-center
                            ${activeTab === tab.id ? 'bg-gray-100 scale-105' : 'hover:bg-gray-50 hover:scale-105'}`}
                    >
                        <div className={`relative ${activeTab === tab.id ? 'text-black' : 'text-gray-500 group-hover:text-black'}`}>
                            <IconComponent name={tab.icon} size={22} /> {/* Use IconComponent */}
                            {tab.badge && (
                                <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                                    {tab.badge}
                                </span>
                            )}
                        </div>
                        <span className="absolute -top-10 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            {tab.label}
                        </span>
                        {activeTab === tab.id && (
                            <div className="absolute -bottom-1 w-1 h-1 bg-black rounded-full"></div>
                        )}
                    </button>
                ))}
                <div className="w-px h-8 bg-gray-200 mx-1"></div> {/* Separator */}
                <button
                    onClick={onDataClick}
                    aria-label="Data Sources"
                    className="relative group p-3 rounded-xl transition-all duration-300 ease-out flex flex-col items-center justify-center hover:bg-gray-50 hover:scale-105"
                >
                    <div className="relative text-gray-500 group-hover:text-black">
                        <IconComponent name="database" size={22} />
                    </div>
                    <span className="absolute -top-10 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Data Sources
                    </span>
                </button>
                <button
                    onClick={() => onTabChange('settings')}
                    aria-label="Settings"
                    className={`relative group p-3 rounded-xl transition-all duration-300 ease-out flex flex-col items-center justify-center
                        ${activeTab === 'settings' ? 'bg-gray-100 scale-105' : 'hover:bg-gray-50 hover:scale-105'}`}
                >
                    <div className={`relative ${activeTab === 'settings' ? 'text-black' : 'text-gray-500 group-hover:text-black'}`}>
                        <IconComponent name="settings" size={22} />
                    </div>
                    <span className="absolute -top-10 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Settings
                    </span>
                    {activeTab === 'settings' && (
                        <div className="absolute -bottom-1 w-1 h-1 bg-black rounded-full"></div>
                    )}
                </button>
            </div>
        </div>
    );
};

export default Dock;
