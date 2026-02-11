// src/views/SettingsView/SettingsView.tsx
import React, { useState } from 'react';
import IconComponent from '../../utils/IconComponent'; // Use our consistent IconComponent

// Assuming SettingsView doesn't take props for now, based on index2.html
const SettingsView: React.FC = () => {
    const [activeSection, setActiveSection] = useState('billing');
    
    return (
        <div className="flex h-full fade-enter pt-12">
            <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col h-full z-10 pt-16">
                <h2 className="text-label mb-4 px-2">Settings</h2>
                <div className="space-y-1">
                    {['General', 'Billing', 'Team', 'Notifications'].map(section => (
                        <button 
                            key={section}
                            onClick={() => setActiveSection(section.toLowerCase())}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${activeSection === section.toLowerCase() ? 'bg-gray-100 text-black font-medium' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            {section}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 bg-[#FAFAFA] px-16 pt-16 overflow-y-auto pb-32">
                {activeSection === 'billing' ? (
                    <div className="max-w-4xl mx-auto space-y-10">
                        <div>
                            <h1 className="text-3xl text-header text-gray-900">Billing & Plans</h1>
                            <p className="text-gray-500 mt-2">Manage your workspace subscription and payment details.</p>
                        </div>

                        {/* Current Plan Status */}
                        <div className="bg-gray-900 text-white rounded-2xl p-8 flex justify-between items-center shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20"></div>
                            <div className="relative z-10">
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">CURRENT PLAN</div>
                                <div className="text-3xl font-bold mb-2">Pro Plan</div>
                                <div className="text-sm text-gray-400">Next billing date: March 12, 2026</div>
                            </div>
                            <div className="relative z-10 text-right">
                                <div className="text-3xl font-bold">$49<span className="text-sm text-gray-400 font-normal">/mo</span></div>
                                <button className="mt-3 text-xs bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">Manage Subscription</button>
                            </div>
                        </div>

                        {/* Upgrade Options */}
                        <div>
                            <h3 className="text-label mb-6">Available Plans</h3>
                            <div className="grid grid-cols-3 gap-6">
                                {/* Starter */}
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="text-lg font-bold text-gray-900 mb-1">Starter</div>
                                    <div className="text-2xl font-bold text-gray-900 mb-4">$0<span className="text-sm text-gray-400 font-normal">/mo</span></div>
                                    <ul className="space-y-3 mb-6">
                                        <li className="text-xs text-gray-600 flex items-center gap-2"><IconComponent name="check" size={12} className="text-green-500"/> 1 User</li>
                                        <li className="text-xs text-gray-600 flex items-center gap-2"><IconComponent name="check" size={12} className="text-green-500"/> 100 Leads/mo</li>
                                    </ul>
                                    <button className="w-full py-2 border border-gray-200 rounded-lg text-xs font-medium hover:bg-gray-50">Downgrade</button>
                                </div>
                                
                                {/* Pro (Current) */}
                                <div className="bg-white p-6 rounded-2xl border-2 border-blue-500 shadow-lg relative">
                                    <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">CURRENT</div>
                                    <div className="text-lg font-bold text-gray-900 mb-1">Pro</div>
                                    <div className="text-2xl font-bold text-gray-900 mb-4">$49<span className="text-sm text-gray-400 font-normal">/mo</span></div>
                                    <ul className="space-y-3 mb-6">
                                        <li className="text-xs text-gray-600 flex items-center gap-2"><IconComponent name="check" size={12} className="text-blue-500"/> 5 Users</li>
                                        <li className="text-xs text-gray-600 flex items-center gap-2"><IconComponent name="check" size={12} className="text-blue-500"/> Unlimited Leads</li>
                                        <li className="text-xs text-gray-600 flex items-center gap-2"><IconComponent name="check" size={12} className="text-blue-500"/> Advanced Analytics</li>
                                    </ul>
                                    <button className="w-full py-2 bg-blue-50 text-blue-600 font-bold rounded-lg text-xs cursor-default">Active</button>
                                </div>

                                {/* Enterprise */}
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="text-lg font-bold text-gray-900 mb-1">Enterprise</div>
                                    <div className="text-2xl font-bold text-gray-900 mb-4">Custom</div>
                                    <ul className="space-y-3 mb-6">
                                        <li className="text-xs text-gray-600 flex items-center gap-2"><IconComponent name="check" size={12} className="text-green-500"/> Unlimited Users</li>
                                        <li className="text-xs text-gray-600 flex items-center gap-2"><IconComponent name="check" size={12} className="text-green-500"/> Dedicated Support</li>
                                    </ul>
                                    <button className="w-full py-2 bg-black text-white rounded-lg text-xs font-medium hover:bg-gray-800">Contact Sales</button>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div>
                            <h3 className="text-label mb-6">Payment Method</h3>
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center border border-gray-200">
                                        {/* Card icon placeholder, from index2.html */}
                                        <div className="w-6 h-4 bg-red-500/20 rounded-full relative overflow-hidden">
                                            <div className="absolute inset-0 bg-yellow-500/40 translate-x-2"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">Mastercard ending in 4242</div>
                                        <div className="text-xs text-gray-500">Expires 12/28</div>
                                    </div>
                                </div>
                                <button className="text-xs text-blue-600 font-medium hover:underline">Update</button>
                            </div>
                        </div>

                        {/* Invoice History */}
                        <div>
                            <h3 className="text-label mb-6">Invoice History</h3>
                            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                                {[
                                    { date: 'Feb 12, 2026', amount: '$49.00', status: 'Paid' },
                                    { date: 'Jan 12, 2026', amount: '$49.00', status: 'Paid' },
                                    { date: 'Dec 12, 2025', amount: '$49.00', status: 'Paid' },
                                ].map((invoice, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                        <div className="text-sm text-gray-900">{invoice.date}</div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">{invoice.status}</span>
                                            <span className="text-sm font-medium text-gray-900">{invoice.amount}</span>
                                            <button className="text-gray-400 hover:text-black"><IconComponent name="download" size={14}/></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <IconComponent name="settings" size={48} className="mb-4 opacity-20" />
                        <p>Section under construction</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingsView;
