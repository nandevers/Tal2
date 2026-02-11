// src/views/EntitiesView/EntitiesView.tsx
import React, { useState } from 'react';
import { Filter, Upload, Plus, SlidersHorizontal, Download, MoreHorizontal, PlusCircle, Search } from 'lucide-react';
import { MOCK_ENTITIES } from '../../data/mockData';
import IconComponent from '../../utils/IconComponent'; // Using the shared IconComponent

const EntitiesView: React.FC = () => {
    const [activeGroup, setActiveGroup] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all'); // all, person, business

    const groups = [
        { id: 'all', label: 'All Entities', count: MOCK_ENTITIES.length },
        { id: 'vip', label: 'VIP / High Value', count: 4 },
        { id: 'new', label: 'Added This Week', count: 12 },
        { id: 'stale', label: 'Needs Attention', count: 8 },
        { id: 'archived', label: 'Archived', count: 320 },
    ];

    const filteredEntities = MOCK_ENTITIES.filter(e => {
        if (typeFilter !== 'all' && e.type !== typeFilter) return false;
        // Group filtering logic would go here
        return true;
    });

    return (
        <div className="flex h-full fade-enter pt-12">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col h-full z-10 pt-16">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Segments</h2>
                    <button className="text-gray-400 hover:text-black" aria-label="Filter segments"><IconComponent name="filter" size={14}/></button>
                </div>
                <div className="space-y-1">
                    {groups.map(group => (
                        <button
                            key={group.id}
                            onClick={() => setActiveGroup(group.id)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${activeGroup === group.id ? 'bg-gray-100 text-black font-medium' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            <span>{group.label}</span>
                            <span className="text-xs text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">{group.count}</span>
                        </button>
                    ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                     <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Tags</h2>
                     <div className="flex flex-wrap gap-2">
                        <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100">#Fintech</span>
                        <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100">#SeriesB</span>
                        <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100">#SaoPaulo</span>
                     </div>
                </div>

                <div className="mt-auto mb-20 text-[10px] text-gray-400 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>Synced: Just now
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-[#FAFAFA] px-12 pt-16 overflow-y-auto pb-32">
                 <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">{groups.find(g => g.id === activeGroup)?.label}</h1>
                        <p className="text-sm text-gray-500 mt-1">Managing {filteredEntities.length} entities</p>
                    </div>
                    <div className="flex gap-3">
                         <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2 shadow-sm">
                            <IconComponent name="upload" size={14}/> Import CSV
                         </button>
                         <button className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 flex items-center gap-2 shadow-lg shadow-black/10">
                            <IconComponent name="plus" size={14}/> Add Entity
                         </button>
                    </div>
                </header>

                {/* Toolbar */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="flex bg-white border border-gray-200 rounded-lg p-1">
                        <button
                            onClick={() => setTypeFilter('all')}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${typeFilter === 'all' ? 'bg-gray-100 text-black' : 'text-gray-500 hover:text-black'}`}
                        >
                            Mixed
                        </button>
                        <button
                            onClick={() => setTypeFilter('person')}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${typeFilter === 'person' ? 'bg-gray-100 text-black' : 'text-gray-500 hover:text-black'}`}
                        >
                            People
                        </button>
                        <button
                            onClick={() => setTypeFilter('business')}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${typeFilter === 'business' ? 'bg-gray-100 text-black' : 'text-gray-500 hover:text-black'}`}
                        >
                            Businesses
                        </button>
                    </div>

                    <div className="relative flex-1 max-w-sm">
                        <IconComponent name="search" size={14} className="absolute left-3 top-3 text-gray-400" />
                        <input type="text" placeholder="Search..." className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-300" />
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                        <button className="p-2 text-gray-400 hover:text-black bg-white border border-gray-200 rounded-lg" aria-label="Filter entities"><IconComponent name="sliders-horizontal" size={14}/></button>
                        <button className="p-2 text-gray-400 hover:text-black bg-white border border-gray-200 rounded-lg" aria-label="Download data"><IconComponent name="download" size={14}/></button>
                    </div>
                </div>

                {/* Entity Table */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider w-10">
                                    <input type="checkbox" className="rounded border-gray-300" />
                                </th>
                                <th className="px-6 py-3 text-label">Entity</th>
                                <th className="px-6 py-3 text-label">Status</th>
                                <th className="px-6 py-3 text-label">Source</th>
                                <th className="px-6 py-3 text-label text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredEntities.map((entity) => (
                                 <tr key={entity.id} className="hover:bg-gray-50/80 transition-colors group">
                                    <td className="px-6 py-4">
                                        <input type="checkbox" className="rounded border-gray-300" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className={`h-9 w-9 bg-gray-100 overflow-hidden mr-3 border border-gray-100 flex items-center justify-center ${entity.type === 'business' ? 'rounded-lg' : 'rounded-full'}`}>
                                                <img src={entity.avatar} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-gray-900">{entity.name}</span>
                                                    {entity.type === 'business' && <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 rounded border border-gray-200">BIZ</span>}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {entity.type === 'person' ? `${entity.role} @ ${entity.company}` : `${entity.industry} • ${entity.location}`}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                                            entity.status === 'Active' || entity.status === 'Customer' ? 'bg-green-50 text-green-700 border-green-100' :
                                            entity.status === 'New' || entity.status === 'Target' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                            'bg-gray-100 text-gray-600 border-gray-200'
                                        }`}>
                                            {entity.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs text-gray-400">{entity.source}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-200" aria-label="More actions">
                                            <IconComponent name="more-horizontal" size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination/Footer */}
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                        <span>Showing {filteredEntities.length} of {MOCK_ENTITIES.length}</span>
                        <div className="flex gap-2">
                            <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50" disabled>Prev</button>
                            <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EntitiesView;
