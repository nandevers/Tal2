// src/views/CampaignsView/CampaignsView.tsx
import React, { useState } from 'react';
import { MOCK_CAMPAIGNS, MOCK_CHANNELS } from '../../data/mockData';
import IconComponent from '../../utils/IconComponent'; // Using the shared IconComponent

const CampaignsView: React.FC = () => {
    const [expandedRow, setExpandedRow] = useState<number | null>(null);
    const [campaigns] = useState(MOCK_CAMPAIGNS);

    const toggleExpand = (id: number) => setExpandedRow(expandedRow === id ? null : id);

    return (
        <div className="w-full max-w-6xl mx-auto pt-24 px-8 fade-enter h-full overflow-y-auto pb-32">
            <header className="mb-12">
                <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Active Operations</h1>
            </header>

            <div className="w-full space-y-4">
                {campaigns.map(camp => (
                    <div key={camp.id} className="bg-white rounded-xl card-shadow border border-transparent hover:border-gray-100 overflow-hidden transition-all">
                        {/* Main Row */}
                        <div className="grid grid-cols-12 gap-4 items-center p-6 cursor-pointer" onClick={() => toggleExpand(camp.id)}>
                            <div className="col-span-4">
                                <h3 className="font-medium text-gray-900">{camp.name}</h3>
                                <span className="text-xs text-gray-400">{camp.leads} leads</span>
                            </div>
                            <div className="col-span-2 flex gap-2">
                                {camp.channels.map(c => {
                                    const ch = MOCK_CHANNELS.find(channel => channel.id === c);
                                    return (
                                        <div key={c} className={`p-1.5 rounded-md ${c === 'whatsapp' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                            {ch && <IconComponent name={ch.icon} size={14} />}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="col-span-4">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center justify-between text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                                        <span>Progress</span>
                                        <span className="text-gray-900">{camp.sent ?? 0}/{camp.leads} Sent</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden flex">
                                        <div className="h-full bg-gray-800" style={{width: `${((camp.sent ?? 0) / camp.leads) * 100}%`}}></div>
                                        <div className="h-full bg-green-500" style={{width: `${((camp.replies ?? 0) / camp.leads) * 100}%`}}></div>
                                    </div>
                                    <div className="flex justify-end gap-3 text-[9px] text-gray-400 mt-0.5">
                                        <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-gray-800 rounded-full"></div> Sent via SendGrid</span>
                                        {(camp.replies ?? 0) > 0 && <span className="flex items-center gap-1 text-green-600"><div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> {camp.replies} Replies</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-2 text-right text-gray-400">
                                <IconComponent name={expandedRow === camp.id ? "chevron-up" : "chevron-down"} size={16} />
                            </div>
                        </div>

                        {/* Expanded Mini-Drawer */}
                        {expandedRow === camp.id && (
                            <div className="bg-gray-50 px-6 py-6 border-t border-gray-100 grid grid-cols-2 gap-8">
                                {camp.channels.map(c => (
                                    <div key={c} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                {MOCK_CHANNELS.find(ch => ch.id === c)?.icon && <IconComponent name={MOCK_CHANNELS.find(ch => ch.id === c)?.icon as string} size={16} className="text-gray-500" />}
                                                <span className="text-sm font-medium text-gray-900 capitalize">{c} Config</span>
                                            </div>
                                            <div className="relative inline-flex h-5 w-9 items-center rounded-full bg-accent cursor-pointer">
                                                <span className="translate-x-4 inline-block h-3 w-3 transform rounded-full bg-white transition-transform"/>
                                            </div>
                                        </div>
                                        {c === 'facebook' || c === 'instagram' ? (
                                             <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-500 font-bold">BUDGET</span>
                                                <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">$50.00 / day</span>
                                             </div>
                                        ) : (
                                            <div>
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-[10px] text-gray-400 font-bold tracking-wider">VOLUME THROTTLE</span>
                                                    <span className="text-[10px] text-gray-500">240/day</span>
                                                </div>
                                                <input type="range" className="w-full" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CampaignsView;
