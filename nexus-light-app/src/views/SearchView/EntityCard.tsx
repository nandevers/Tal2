// src/views/SearchView/EntityCard.tsx
import React from 'react';
import { Check, Building2, User, Globe } from 'lucide-react';
import type { EntityCardProps } from './types';

const EntityCard: React.FC<EntityCardProps> = ({ entity, selected, toggleSelect }) => (
    <div
        onClick={() => toggleSelect(entity.id)}
        className={`group flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200
            ${selected.includes(entity.id)
                ? 'bg-blue-50 border-blue-200 shadow-sm'
                : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'}`}
    >
        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors
            ${selected.includes(entity.id) ? 'bg-brand-primary border-brand-primary' : 'border-gray-300'}`}>
            {selected.includes(entity.id) && <Check size={12} className="text-white" />}
        </div>

        <div className="relative">
            <img src={entity.avatar} className={`w-10 h-10 bg-gray-100 ${entity.type === 'business' ? 'rounded-lg' : 'rounded-full'}`} />
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 border border-gray-100 shadow-sm">
                {entity.type === 'business' ? <Building2 size={10} className="text-gray-400" /> : <User size={10} className="text-gray-400" />}
            </div>
        </div>

        <div className="flex-1">
            <div className="flex justify-between items-start">
                <h4 className={`font-medium ${selected.includes(entity.id) ? 'text-brand-primary' : 'text-gray-900'}`}>{entity.name}</h4>
                <span className="text-[9px] bg-gray-50 text-gray-400 px-1.5 py-0.5 rounded border border-gray-100 flex items-center gap-1">
                    <Globe size={8} /> {entity.source}
                </span>
            </div>
            <p className="text-sm text-gray-500">
                {entity.type === 'person' ? `${entity.role} @ ${entity.company}` : `${entity.industry} • ${entity.location}`}
            </p>
        </div>
    </div>
);

export default EntityCard;
