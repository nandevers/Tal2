// src/components/MapView/MapView.tsx
import React, { useState } from 'react';
import type { MapViewProps } from './types';
import IconComponent from '../../utils/IconComponent';

const MapView: React.FC<MapViewProps> = ({ entities, selected, onToggleSelect, showPeople, showCompanies, setShowPeople, setShowCompanies }) => {
    const [hovered, setHovered] = useState<number | null>(null);

    const filtered = entities.filter(e => {
        if (e.type === 'person' && !showPeople) return false;
        if (e.type === 'business' && !showCompanies) return false;
        return true;
    });

    return (
        <div className="w-full h-[500px] rounded-3xl relative overflow-hidden map-container shadow-sm border border-gray-200">
            <div className="map-grid"></div>
            <div className="map-vignette"></div>
            <div className="radar-pulse"></div>
            
            <div className="absolute top-6 left-6 flex gap-2 z-20 bg-white/80 backdrop-blur-md p-1.5 rounded-xl shadow-sm border border-white/50">
                <button onClick={() => setShowPeople(!showPeople)} className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${showPeople ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}>
                    <div className={`w-2 h-2 rounded-full ${showPeople ? 'bg-brand-primary' : 'bg-gray-300'}`}></div>People
                </button>
                <button onClick={() => setShowCompanies(!showCompanies)} className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${showCompanies ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}>
                    <div className={`w-2 h-2 rounded-sm ${showCompanies ? 'bg-purple-500' : 'bg-gray-300'}`}></div>Companies
                </button>
            </div>

            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 group cursor-default">
                <div className="relative">
                    <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-md z-10 relative"></div>
                    <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20"></div>
                </div>
                <div className="mt-2 px-3 py-1 bg-black/90 text-white text-[10px] font-medium rounded-full shadow-xl backdrop-blur-sm opacity-60 group-hover:opacity-100 transition-opacity transform translate-y-1">
                    Mexican Restaurant {/* This is hardcoded in index2.html, should potentially be dynamic */}
                </div>
            </div>

            {filtered.map(entity => {
                const isSelected = selected.includes(entity.id);
                // Ensure entity.coords exists, as it's optional in the type
                if (!entity.coords) return null; 

                return (
                    <div
                        key={entity.id}
                        className="absolute cursor-pointer marker-float"
                        style={{ left: `${entity.coords.x}%`, top: `${entity.coords.y}%` }}
                        onMouseEnter={() => setHovered(entity.id)}
                        onMouseLeave={() => setHovered(null)}
                        onClick={() => onToggleSelect(entity.id)}
                    >
                        <div className={`transform -translate-x-1/2 -translate-y-full`}>
                            <div className="relative flex flex-col items-center">
                                <div className={`relative z-10 transition-all duration-300 ${isSelected ? 'scale-110' : 'scale-100'}`}>
                                    <div className={`w-10 h-10 rounded-full p-0.5 bg-white shadow-lg flex items-center justify-center overflow-hidden transition-all ${isSelected ? 'ring-2 ring-brand-primary ring-offset-2' : ''} ${entity.type === 'business' ? 'rounded-xl' : 'rounded-full'}`}>
                                        <img src={entity.avatar} className={`w-full h-full object-cover ${entity.type === 'business' ? 'rounded-lg' : 'rounded-full'}`} alt={entity.name} />
                                    </div>
                                    {isSelected && <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand-primary rounded-full border border-white flex items-center justify-center text-white z-20">
                                        <IconComponent name="check" size={10} strokeWidth={3} />
                                    </div>}
                                </div>
                                <div className={`w-px h-3 bg-gray-300 mt-px ${isSelected ? 'h-4 bg-brand-primary' : ''}`}></div>
                                <div className="w-3 h-1 bg-black/10 rounded-full blur-[1px]"></div>
                            </div>
                            {(hovered === entity.id || isSelected) && (
                                <div className="absolute bottom-full mb-3 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-xl p-3 rounded-2xl shadow-xl border border-gray-100 w-56 z-50 text-left fade-enter">
                                    <div className="flex items-start gap-3">
                                        <div className={`w-8 h-8 flex-shrink-0 bg-gray-50 overflow-hidden ${entity.type === 'business' ? 'rounded-lg' : 'rounded-full'}`}>
                                            <img src={entity.avatar} className="w-full h-full object-cover" alt={entity.name} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-bold text-gray-900 truncate">{entity.name}</div>
                                            <div className="text-[10px] text-gray-500 leading-tight mt-0.5 truncate">{entity.type === 'person' ? `${entity.role}` : entity.industry}</div>
                                            <div className="mt-2 flex items-center gap-1">
                                                <IconComponent name="globe" size={10} className="text-blue-400" />
                                                <span className="text-[9px] text-gray-400">{entity.source}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default MapView;