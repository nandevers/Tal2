import React, { useState } from 'react';
import { MOCK_ENTITIES } from '../../data/mockData';
import IconComponent from '../../utils/IconComponent';
import EntityCard from './EntityCard';
import type { SearchViewProps } from './types';
import MapView from '../../components/MapView/MapView';

const SearchView: React.FC<SearchViewProps> = ({ onAction }) => {
    const [query, setQuery] = useState("");
    const [hasSearched, setHasSearched] = useState(false);
    const [selected, setSelected] = useState<number[]>([]);
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [showPeople, setShowPeople] = useState(true);
    const [showCompanies, setShowCompanies] = useState(true);

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setHasSearched(true);
            if (query.toLowerCase().includes("around me") || query.toLowerCase().includes("map")) {
                setViewMode('map');
            } else {
                setViewMode('list');
            }
        }
    };

    const toggleSelect = (id: number) => {
        setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const people = MOCK_ENTITIES.filter(e => e.type === 'person');
    const companies = MOCK_ENTITIES.filter(e => e.type === 'business');

    return (
        <div className="w-full max-w-4xl mx-auto pt-32 px-6 flex flex-col items-center justify-center relative h-full">
            <div className={`transition-all duration-500 w-full ${hasSearched ? 'transform -translate-y-0' : 'transform translate-y-20'}`}>
                <div className="relative group shadow-sm hover:shadow-md transition-shadow rounded-2xl bg-white border border-gray-100">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                        <IconComponent name="search" size={20} className="text-gray-400" />
                    </div>
                    <input 
                        type="text" 
                        value={query} 
                        onChange={(e) => setQuery(e.target.value)} 
                        onKeyDown={handleSearch} 
                        className="block w-full pl-14 pr-20 py-4 bg-transparent border-none rounded-2xl text-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100 transition-all" 
                        placeholder="Describe your ideal lead..." 
                        autoFocus 
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                        <span className="text-xs text-gray-400 border border-gray-100 px-2 py-1 rounded-md bg-gray-50">⌘K</span>
                    </div>
                </div>
                {!hasSearched && (
                    <div className="mt-6 flex flex-wrap justify-center gap-3 fade-enter" style={{animationDelay: '0.1s'}}>
                        <button onClick={() => { setQuery("Find SaaS CEOs in Brazil"); setHasSearched(true); }} className="px-3 py-1.5 rounded-full border border-gray-100 bg-white text-xs text-gray-500 hover:text-black hover:border-gray-300 transition-colors shadow-sm">
                            Find SaaS CEOs in Brazil
                        </button>
                        <button onClick={() => { setQuery("Companies around me"); setHasSearched(true); setViewMode('map'); }} className="px-3 py-1.5 rounded-full border border-gray-100 bg-white text-xs text-gray-500 hover:text-black hover:border-gray-300 transition-colors shadow-sm">
                            Companies around me
                        </button>
                    </div>
                )}
            </div>

            {hasSearched && (
                <div className="w-full mt-8 fade-enter pb-32">
                    <div className="flex justify-between items-end mb-6 px-2">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Search Results</h3>
                            <span className="text-xs text-gray-400">{MOCK_ENTITIES.length} matches found</span>
                        </div>
                        <div className="bg-gray-100 p-1 rounded-lg flex gap-1">
                            <button onClick={() => setViewMode('list')} aria-label="List view" className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
                                <IconComponent name="list" size={16} />
                            </button>
                            <button onClick={() => setViewMode('map')} aria-label="Map view" className={`p-1.5 rounded-md transition-all ${viewMode === 'map' ? 'bg-white shadow text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
                                <IconComponent name="map" size={16} />
                            </button>
                        </div>
                    </div>
                    {viewMode === 'list' ? (
                        <div className="space-y-8">
                            {people.length > 0 && (
                                <div>
                                    <h4 className="text-label mb-3 pl-2 flex items-center gap-2">
                                        <IconComponent name="users" size={12} /> People ({people.length})
                                    </h4>
                                    <div className="grid grid-cols-1 gap-3">
                                        {people.map(entity => (
                                            <EntityCard key={entity.id} entity={entity} selected={selected} toggleSelect={toggleSelect} />
                                        ))}
                                    </div>
                                </div>
                            )}
                            {companies.length > 0 && (
                                <div>
                                    <h4 className="text-label mb-3 pl-2 flex items-center gap-2">
                                        <IconComponent name="building-2" size={12} /> Companies ({companies.length})
                                    </h4>
                                    <div className="grid grid-cols-1 gap-3">
                                        {companies.map(entity => (
                                            <EntityCard key={entity.id} entity={entity} selected={selected} toggleSelect={toggleSelect} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <MapView
                            entities={MOCK_ENTITIES}
                            selected={selected}
                            onToggleSelect={toggleSelect}
                            showPeople={showPeople}
                            showCompanies={showCompanies}
                            setShowPeople={setShowPeople}
                            setShowCompanies={setShowCompanies}
                        />
                    )}
                </div>
            )}
            {selected.length > 0 && (
                <div className="absolute bottom-32 floating-island bg-white p-2 rounded-2xl flex items-center gap-2 fade-enter border border-gray-100 z-40">
                    <div className="px-4 py-2 font-medium text-sm text-gray-900 border-r border-gray-100">
                        {selected.length} selected
                    </div>
                    <button onClick={() => onAction('config', selected)} className="px-4 py-2 text-sm bg-brand-primary text-white rounded-lg hover:bg-brand-hover transition-colors shadow-lg shadow-brand-primary/20 font-medium">
                        Build Campaign
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchView;