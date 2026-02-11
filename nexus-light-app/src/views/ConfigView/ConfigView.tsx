// src/views/ConfigView/ConfigView.tsx
import React, { useState } from 'react';
import { Package, ChevronDown } from 'lucide-react';
import { MOCK_CHANNELS, MOCK_PRODUCTS } from '../../data/mockData';
import IconComponent from '../../utils/IconComponent';
import type { ConfigViewProps } from './types';

const ConfigView: React.FC<ConfigViewProps> = ({ selectedCount, onGenerate }) => {
    const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<string>("");

    const toggleChannel = (id: string) => {
        if (selectedChannels.includes(id)) setSelectedChannels(selectedChannels.filter(c => c !== id));
        else setSelectedChannels([...selectedChannels, id]);
    };

    return (
        <div className="h-full w-full flex items-center justify-center fade-enter relative z-40">
            <div className="absolute inset-0 bg-white/60 backdrop-blur-md z-0"></div>

            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 p-8 relative z-10 floating-island">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900">Strategy Configuration</h2>
                    <p className="text-sm text-gray-500 mt-2">Targeting {selectedCount} entities</p>
                </div>

                {/* Zone A: Channels */}
                <div className="mb-8">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 text-center">Where are we connecting?</h3>
                    <div className="flex justify-center gap-4">
                        {MOCK_CHANNELS.map(channel => (
                            <div key={channel.id} className="relative group">
                                <button
                                    onClick={() => toggleChannel(channel.id)}
                                    aria-label={channel.label}
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-200
                                        ${selectedChannels.includes(channel.id)
                                            ? 'bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/30'
                                            : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600'}`}
                                >
                                    {channel.icon && <IconComponent name={channel.icon} size={20} />}
                                </button>
                                {channel.badge && (
                                    <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                        {channel.badge}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Zone B: Product */}
                <div className="mb-8">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 text-center">What are we pitching?</h3>
                    <div className="relative max-w-xs mx-auto">
                        <Package size={16} className="absolute left-3 top-3.5 text-gray-400" />
                        <select
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 appearance-none text-gray-700"
                            value={selectedProduct}
                            onChange={(e) => setSelectedProduct(e.target.value)}
                        >
                            <option value="" disabled>Select Product or Offer...</option>
                            {MOCK_PRODUCTS.map(p => (
                                <option key={p.id} value={p.name}>{p.name}</option>
                            ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                <button
                    onClick={() => onGenerate(selectedChannels, selectedProduct)}
                    disabled={selectedChannels.length === 0 || !selectedProduct}
                    className={`w-full py-4 rounded-xl font-medium text-white transition-all
                        ${selectedChannels.length > 0 && selectedProduct
                            ? 'bg-brand-primary hover:bg-brand-hover shadow-xl shadow-brand-primary/20'
                            : 'bg-gray-200 cursor-not-allowed text-gray-400'}`}
                >
                    Generate Drafts
                </button>
            </div>
        </div>
    );
};

export default ConfigView;
