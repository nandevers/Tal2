import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import IconComponent from '../../utils/IconComponent';
import EntityCard from './EntityCard';
import type { SearchViewProps } from './types';
import type { Entity } from '../../data/mockData';

// Define the structure of a message in the chat
interface Message {
    role: 'user' | 'model' | 'system';
    content: string;
    results?: Entity[];
}

const SearchView: React.FC<SearchViewProps> = ({ onAction }) => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selected, setSelected] = useState<number[]>([]);
    
    // Generate a unique session ID for the entire chat session
    const sessionId = useRef<string>(uuidv4());
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Start with a default greeting from the assistant
        setMessages([{
            role: 'model',
            content: "Hello! I'm your AI Sales Assistant. How can I help you find your next customer?"
        }]);
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        console.log("handleSubmit triggered!");
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch(`/api/search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: currentInput, session_id: sessionId.current }),
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }

            const data = await response.json();

            const aiMessage: Message = {
                role: 'model',
                content: data.summary, // The backend now always provides a 'summary'
                results: data.results || [],
            };
            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error("Error contacting the AI backend:", error);
            const errorMessage: Message = {
                role: 'system',
                content: "Sorry, I'm having trouble connecting to my brain. Please check the backend server."
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const toggleSelect = (id: number) => {
        setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    return (
        <div className="w-full max-w-4xl mx-auto pt-16 px-4 flex flex-col h-full">
            {/* Chat Messages Display */}
            <div className="flex-1 overflow-y-auto space-y-6 pb-24 pt-8">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0 shadow-lg">
                                <IconComponent name="sparkles" size={16} />
                            </div>
                        )}
                        <div className={`max-w-xl p-4 rounded-2xl ${
                            msg.role === 'user' 
                                ? 'bg-blue-500 text-white' 
                                : msg.role === 'system'
                                    ? 'bg-red-100 text-red-800 border border-red-200'
                                    : 'bg-white text-gray-800 border border-gray-100 shadow-sm'
                        }`}>
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                            {msg.results && msg.results.length > 0 && (
                                <div className="mt-4 space-y-3">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase">Found {msg.results.length} relevant entities:</h4>
                                    {msg.results.map((entity: any) => (
                                        <EntityCard key={entity.id} entity={entity} selected={selected} toggleSelect={toggleSelect} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div className="flex items-start gap-4 justify-start">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0 shadow-lg animate-pulse">
                            <IconComponent name="sparkles" size={16} />
                        </div>
                        <div className="max-w-xl p-4 rounded-2xl bg-white text-gray-800 border border-gray-100 shadow-sm">
                           <div className="flex items-center gap-2">
                               <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                               <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                               <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></div>
                           </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Floating Input Bar */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-10">
                <form onSubmit={handleSubmit} className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full pl-6 pr-16 py-4 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xl"
                        placeholder="Ask anything or start a search..."
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 transition-all">
                        <IconComponent name="arrow-up" size={20} />
                    </button>
                </form>
            </div>
             {selected.length > 0 && (
                <div className="absolute bottom-40 floating-island bg-white p-2 rounded-2xl flex items-center gap-2 fade-enter border border-gray-100 z-20">
                    <div className="px-4 py-2 font-medium text-sm text-gray-900 border-r border-gray-100">
                        {selected.length} selected
                    </div>
                    <button onClick={() => onAction('config', selected)} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 font-medium">
                        Build Campaign
                    </button>
                </div>
            )}
        </div>
    );
};


export default SearchView;