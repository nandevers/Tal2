// src/views/FlowView/FlowView.tsx
import React, { useState } from 'react';

import { MOCK_ENTITIES, MOCK_CHANNELS } from '../../data/mockData';
import type { Entity } from '../../data/mockData'; // Import Entity type
import IconComponent from '../../utils/IconComponent';
import type { FlowViewProps } from './types';

const FlowView: React.FC<FlowViewProps> = ({ config, onPublish }) => {
    const [activeTab, setActiveTab] = useState(config.channels[0] || 'email');

    // Helper to get selected entities details
    const selectedEntities = config.leads.map(id => MOCK_ENTITIES.find(e => e.id === id) as Entity | undefined).filter(Boolean) as Entity[];

    const getContentForChannel = (channel: string) => {
        if (channel === 'whatsapp') {
            return (
                <div className="bg-gray-100 p-4 rounded-lg rounded-tl-none max-w-sm">
                    <p className="text-sm text-gray-800">
                        Hi <span className="text-blue-600 bg-blue-100 px-1 rounded">{'{{FirstName}}'}</span>, saw you're scaling operations at <span className="text-blue-600 bg-blue-100 px-1 rounded">{'{{Company}}'}</span>.
                        We just released the docs for our {config.product}. Want me to send the PDF?
                    </p>
                    <span className="text-[10px] text-gray-400 block mt-1 text-right">10:42 AM</span>
                </div>
            );
        }
        if (channel === 'facebook' || channel === 'instagram') {
            return (
                <div className="border border-gray-200 rounded-lg overflow-hidden max-w-sm mx-auto bg-white shadow-sm">
                    <div className="bg-gray-100 h-48 flex items-center justify-center text-gray-400">
                        <img src="https://via.placeholder.com/150" alt="Placeholder" className="object-cover w-full h-full" /> {/* Placeholder Image */}
                    </div>
                    <div className="p-4">
                        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Sponsored</p>
                        <h4 className="font-bold text-gray-900 mb-2">Scale with {config.product}</h4>
                        <p className="text-sm text-gray-600 mb-4">
                            Stop wrestling with data provenance. See why <span className="text-blue-600">{'{{Company}}'}</span> needs the new standard.
                        </p>
                        <button className="w-full py-2 bg-gray-100 text-gray-900 text-xs font-bold rounded uppercase">Learn More</button>
                    </div>
                </div>
            );
        }
        if (channel === 'linkedin') {
            return (
                <div className="bg-white border border-gray-200 rounded-lg p-4 max-w-md shadow-sm">
                    <p className="text-sm text-gray-700 leading-relaxed">
                        Hi <span className="text-blue-600 bg-blue-50 px-1 rounded">{'{{FirstName}}'}</span>, <br/>
                        Just saw the news about <span className="text-blue-600 bg-blue-50 px-1 rounded">{'{{Company}}'}</span>. Impressive growth.<br/>
                        Open to connecting?
                    </p>
                </div>
            );
        }
        // Default Email
        return (
            <div className="space-y-6 text-gray-700 font-light leading-relaxed text-lg">
                <div className="mb-8 pb-4 border-b border-gray-100">
                    <input type="text" defaultValue={`Opportunity: {{Company}} x ${config.product}`} className="w-full text-xl font-medium text-gray-900 placeholder-gray-300 focus:outline-none" />
                </div>
                <p>Hi <span className="bg-blue-50 text-blue-600 px-1 rounded border border-blue-100 font-normal">{'{{FirstName}}'}</span>,</p>
                <p>
                    I've been following <span className="bg-blue-50 text-blue-600 px-1 rounded border border-blue-100 font-normal">{'{{Company}}'}</span>'s trajectory.
                    The recent news about <span className="bg-purple-50 text-purple-600 px-1 rounded border border-purple-100 font-normal">{'{{RecentNews}}'}</span> suggests you are ready for our <span className="font-medium text-gray-900">{config.product}</span>.
                </p>
                <p>We solved data provenance for Nubank last quarter. I'd love to share the technical brief if you're open to it?</p>
                <p>Best,<br/>Felix</p>
            </div>
        );
    };

    return (
        <div className="h-full flex fade-enter">
            {/* Left: Context */}
            <div className="w-80 bg-white border-r border-gray-200 p-6 flex flex-col h-full z-10">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Campaign Context</h2>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
                    <div className="text-xs text-gray-500 uppercase mb-1">Product</div>
                    <div className="font-medium text-blue-700">{config.product}</div>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3">
                     {/* Dynamic Selected Entities */}
                     {selectedEntities.map((entity, index) => { // Added index for key if id not unique enough for map
                        if (!entity) return null; // Should not happen with filter(Boolean) but good for TS
                        return (
                            <div key={entity.id || index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                                <div className={`w-8 h-8 flex-shrink-0 bg-gray-100 overflow-hidden ${entity.type === 'business' ? 'rounded-lg' : 'rounded-full'}`}>
                                    <img src={entity.avatar} className="w-full h-full object-cover" alt={entity.name} />
                                </div>
                                <div className="overflow-hidden">
                                    <div className="text-sm font-medium text-gray-900 truncate">{entity.name}</div>
                                    <div className="text-xs text-gray-500 truncate">
                                        {entity.type === 'person' ? entity.company : entity.industry}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Right: Split Editor */}
            <div className="flex-1 bg-[#FAFAFA] p-12 flex flex-col relative">
                {/* Tabs */}
                <div className="flex gap-2 mb-0 ml-1">
                    {config.channels.map(channelId => {
                        const ch = MOCK_CHANNELS.find(c => c.id === channelId);
                        return (
                            <button
                                key={channelId}
                                onClick={() => setActiveTab(channelId)}
                                className={`px-6 py-3 rounded-t-xl text-sm font-medium flex items-center gap-2 border-t border-x transition-all relative top-[1px] z-10
                                    ${activeTab === channelId
                                        ? 'bg-white border-gray-200 text-gray-900'
                                        : 'bg-gray-100 border-transparent text-gray-500 hover:text-gray-700'}`}
                            >
                                {ch?.icon && <IconComponent name={ch.icon} size={14} />} {ch?.label}
                            </button>
                        );
                    })}
                </div>

                {/* Editor Canvas */}
                <div className="max-w-3xl w-full bg-white min-h-[600px] shadow-sm border border-gray-200 rounded-b-xl rounded-tr-xl p-12 relative z-0">
                    {getContentForChannel(activeTab)}
                </div>

                <div className="absolute top-6 right-8">
                    <button onClick={onPublish} className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-black/10 flex items-center gap-2">
                        Publish Campaign <IconComponent name="arrow-right" size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FlowView;
