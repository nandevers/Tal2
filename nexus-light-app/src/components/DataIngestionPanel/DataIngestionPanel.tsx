// src/components/DataIngestionPanel/DataIngestionPanel.tsx
import React, { useState } from 'react';
import type { DataIngestionPanelProps, ConnectionState } from './types';
import IconComponent from '../../utils/IconComponent';

const DataIngestionPanel: React.FC<DataIngestionPanelProps> = ({ isOpen, onClose, showToast, onToggleWidget }) => {
    const [activeCategory, setActiveCategory] = useState('social');
    const [connections, setConnections] = useState<ConnectionState>({ google: false, meta: false, whatsapp: false, salesforce: false, totvs: false, sap: false });

    const toggleConnection = (key: keyof ConnectionState) => {
        const newState = !connections[key];
        setConnections({ ...connections, [key]: newState });
        if (newState) {
            showToast(`${key.charAt(0).toUpperCase() + key.slice(1)} Connected`);
            if (key === 'whatsapp' && onToggleWidget) onToggleWidget(true);
        } else {
            if (key === 'whatsapp' && onToggleWidget) onToggleWidget(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="absolute inset-y-0 right-0 w-[480px] bg-white shadow-2xl border-l border-gray-100 z-[100] slide-in-right flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-header text-lg text-gray-900">Integrations Hub</h3>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                    <IconComponent name="x" size={18} />
                </button>
            </div>
            <div className="flex border-b border-gray-100 px-6">
                <button onClick={() => setActiveCategory('social')} className={`py-3 mr-6 text-xs font-medium border-b-2 transition-colors ${activeCategory === 'social' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                    Social & Identity
                </button>
                <button onClick={() => setActiveCategory('enterprise')} className={`py-3 text-xs font-medium border-b-2 transition-colors ${activeCategory === 'enterprise' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                    Enterprise & ERP
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {activeCategory === 'social' && (
                    <div className="space-y-8 fade-enter">
                        <div>
                            <div className="text-label mb-3 flex items-center gap-2">
                                <IconComponent name="fingerprint" size={14} /> Identity & Auth
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center">
                                            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">Google SSO</div>
                                            <div className="text-[10px] text-gray-500">OAuth 2.0 • Profile Enrichment</div>
                                        </div>
                                    </div>
                                    <button onClick={() => toggleConnection('google')} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${connections.google ? 'bg-green-500' : 'bg-gray-200'}`}>
                                        <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${connections.google ? 'translate-x-5' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                                            <IconComponent name="facebook" size={16} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">Facebook Login</div>
                                            <div className="text-[10px] text-gray-500">Identity • Permissions</div>
                                        </div>
                                    </div>
                                    <button onClick={() => toggleConnection('meta')} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${connections.meta ? 'bg-green-500' : 'bg-gray-200'}`}>
                                        <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${connections.meta ? 'translate-x-5' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="text-label mb-3 flex items-center gap-2">
                                <IconComponent name="message-circle" size={14} /> Communication
                            </div>
                            <div className="p-4 border border-green-100 bg-green-50/30 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                                        <IconComponent name="message-circle" size={16} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">WhatsApp Widget</div>
                                        <div className="text-[10px] text-gray-500">Floating Chat • Support</div>
                                    </div>
                                </div>
                                <button onClick={() => toggleConnection('whatsapp')} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${connections.whatsapp ? 'bg-green-500' : 'bg-gray-200'}`}>
                                    <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${connections.whatsapp ? 'translate-x-5' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        </div>
                        <div>
                            <div className="text-label mb-3 flex items-center gap-2">
                                <IconComponent name="eye" size={14} /> Invisible Tracking
                            </div>
                            <div className="p-4 border border-gray-100 rounded-xl">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium">Meta Pixel / Google Tag</span>
                                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Active</span>
                                </div>
                                <div className="text-[10px] text-gray-400 font-mono bg-gray-50 p-2 rounded border border-gray-200">
                                    {'<script>fbq("track", "PageView");</script>'}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {activeCategory === 'enterprise' && (
                    <div className="space-y-8 fade-enter">
                        <div>
                            <div className="text-label mb-3 flex items-center gap-2">
                                <IconComponent name="users" size={14} /> CRM & Sales
                            </div>
                            <div className={`flex items-center justify-between p-4 border rounded-xl transition-all ${connections.salesforce ? 'border-blue-200 bg-blue-50/20' : 'border-gray-100'}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                                        <IconComponent name="cloud" size={16} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">Salesforce</div>
                                        <div className="text-[10px] text-gray-500">Web-to-Lead • Sync</div>
                                    </div>
                                </div>
                                <button onClick={() => toggleConnection('salesforce')} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${connections.salesforce ? 'text-blue-600 bg-blue-100' : 'bg-black text-white hover:bg-gray-800'}`}>
                                    {connections.salesforce ? 'Connected' : 'Connect OAuth'}
                                </button>
                            </div>
                        </div>
                        <div>
                            <div className="text-label mb-3 flex items-center gap-2">
                                <IconComponent name="server" size={14} /> ERP & Logistics
                            </div>
                            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-[10px]">T</div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">TOTVS (Protheus)</div>
                                        <div className="text-[10px] text-gray-500">Middleware Required • SOAP/REST</div>
                                    </div>
                                </div>
                                <button onClick={() => toggleConnection('totvs')} className={`px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 ${connections.totvs ? 'text-orange-600 border-orange-200 bg-orange-50' : 'text-gray-600'}`}>
                                    {connections.totvs ? 'Syncing...' : 'Configure'}
                                </button>
                            </div>
                            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center text-white font-bold text-[10px]">SAP</div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">SAP S/4HANA</div>
                                        <div className="text-[10px] text-gray-500">Inventory Check • Order Push</div>
                                    </div>
                                </div>
                                <button onClick={() => toggleConnection('sap')} className={`px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 ${connections.sap ? 'text-blue-800 border-blue-200 bg-blue-50' : 'text-gray-600'}`}>
                                    {connections.sap ? 'Active' : 'Link API'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400">
                    <IconComponent name="shield" size={12} /> <span>GDPR & LGPD Compliant Data Processing</span>
                </div>
            </div>
        </div>
    );
};

export default DataIngestionPanel;
