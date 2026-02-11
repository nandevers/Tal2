// src/views/InboxView/InboxView.tsx
import React, { useState } from 'react';
import { MOCK_INBOX, MOCK_CHAT_HISTORY } from '../../data/mockData';
import IconComponent from '../../utils/IconComponent';

// Assuming InboxView doesn't take props for now, based on index2.html
const InboxView: React.FC = () => {
    const [filter, setFilter] = useState<'all' | 'messages' | 'system'>('all');
    const [selectedId, setSelectedId] = useState<number>(MOCK_INBOX[0]?.id || 0); // Initialize with first item or 0
    const [replyText, setReplyText] = useState("");

    const filteredItems = MOCK_INBOX.filter(item => {
        if (filter === 'messages') return item.category === 'message';
        if (filter === 'system') return item.category === 'system';
        return true;
    });

    const selectedItem = MOCK_INBOX.find(item => item.id === selectedId);

    return (
        <div className="flex h-full fade-enter pt-12">
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full z-10 pt-6">
                <div className="px-6 mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Inbox</h2>
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button onClick={() => setFilter('all')} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${filter === 'all' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>
                            All
                        </button>
                        <button onClick={() => setFilter('messages')} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${filter === 'messages' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>
                            Messages
                        </button>
                        <button onClick={() => setFilter('system')} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${filter === 'system' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>
                            Alerts
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {filteredItems.map(item => (
                        <div key={item.id} onClick={() => setSelectedId(item.id)} className={`px-6 py-4 border-b border-gray-50 cursor-pointer transition-colors relative ${selectedId === item.id ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}>
                            {item.unread && <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 bg-accent rounded-full"></div>}
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center gap-2">
                                    {item.category === 'message' ? (
                                        <div className="relative">
                                            <img src={item.avatar} className="w-6 h-6 rounded-full bg-gray-200" alt="Avatar" />
                                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-gray-100">
                                                <IconComponent name={item.type === 'whatsapp' ? 'message-circle' : 'linkedin'} size={10} className={item.type === 'whatsapp' ? 'text-green-500' : 'text-blue-600'} />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${item.type === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-gray-100 text-gray-500'}`}>
                                            <IconComponent name={item.icon || 'bell'} size={14} /> {/* Default to 'bell' if icon is undefined */}
                                        </div>
                                    )}
                                    <span className={`text-sm font-medium ${item.unread ? 'text-gray-900' : 'text-gray-600'}`}>{item.title}</span>
                                </div>
                                <span className="text-[10px] text-gray-400">{item.time}</span>
                            </div>
                            <p className={`text-xs truncate ${item.unread ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>{item.preview}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 bg-[#FAFAFA] flex flex-col relative h-full">
                {selectedItem ? (
                    <>
                        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-8 bg-white/50 backdrop-blur-sm sticky top-0 z-20">
                            <div className="flex items-center gap-3">
                                <h3 className="text-sm font-bold text-gray-900">{selectedItem.title}</h3>
                                {selectedItem.category === 'message' && (
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${selectedItem.type === 'whatsapp' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                        via {selectedItem.type === 'whatsapp' ? 'WhatsApp' : 'LinkedIn'}
                                    </span>
                                )}
                                {selectedItem.category === 'system' && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                                        System Notification
                                    </span>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                                    <IconComponent name="check" size={16} />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                                    <IconComponent name="trash" size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8">
                            {selectedItem.category === 'message' ? (
                                <div className="space-y-6">
                                    {MOCK_CHAT_HISTORY.map(msg => (
                                        <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-md p-4 rounded-2xl text-sm ${msg.sender === 'me' ? 'bg-accent text-white rounded-br-none' : 'bg-white border border-gray-100 text-gray-700 rounded-bl-none shadow-sm'}`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}
                                    {/* Display selected item's preview as a message */}
                                    <div className="flex justify-start">
                                        <div className="max-w-md p-4 rounded-2xl rounded-bl-none bg-white border border-gray-100 text-gray-700 shadow-sm text-sm">
                                            {selectedItem.preview}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="max-w-xl mx-auto mt-10">
                                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                                        <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${selectedItem.type === 'warning' ? 'bg-amber-50 text-amber-500' : 'bg-green-50 text-green-500'}`}>
                                            <IconComponent name={selectedItem.icon || 'bell'} size={32} />
                                        </div>
                                        <h2 className="text-lg font-bold text-gray-900 mb-2">{selectedItem.title}</h2>
                                        <p className="text-gray-500 text-sm leading-relaxed mb-6">{selectedItem.preview} Verify the source file or adjust campaign settings.</p>
                                        <button className="bg-gray-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        {selectedItem.category === 'message' && (
                            <div className="p-6 bg-white border-t border-gray-200">
                                <div className="relative">
                                    <input type="text" value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Type your reply..." className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-all" />
                                    <button className="absolute right-2 top-2 p-1.5 bg-accent text-white rounded-lg hover:bg-blue-700 transition-colors">
                                        <IconComponent name="send" size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400">
                        <div className="text-center">
                            <IconComponent name="inbox" size={48} className="mx-auto mb-4 opacity-20" />
                            <p>Select a conversation</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InboxView;