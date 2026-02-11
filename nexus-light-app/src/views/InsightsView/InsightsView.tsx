import React from 'react';
import IconComponent from '../../utils/IconComponent';

interface InsightsViewProps {
    onAction: (action: string, payload: number[]) => void;
}

const InsightsView: React.FC<InsightsViewProps> = ({ onAction }) => {
    return (
        <div className="flex h-full fade-enter pt-12">
            <div className="w-full max-w-7xl mx-auto px-8 overflow-y-auto pb-32">
                {/* AI Summary Header */}
                <div className="mb-10 mt-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                            <IconComponent name="sparkles" size={24} />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl text-header text-gray-900 leading-tight">Good afternoon, Felix.</h1>
                            <p className="text-lg text-gray-500 mt-2 font-light leading-relaxed max-w-3xl">
                                Campaign performance is trending <span className="text-green-600 font-medium">up 12%</span> this week.
                                I've detected a high-intent segment of <span className="text-indigo-600 font-medium cursor-pointer hover:underline">24 SaaS Leads</span> in Brazil interacting with your Enterprise API pricing page.
                            </p>
                        </div>
                        <button
                            onClick={() => onAction('config', [1, 2, 3])} // Mock IDs
                            className="px-6 py-3 bg-black text-white rounded-xl font-medium shadow-xl shadow-black/10 hover:bg-gray-800 transition-all flex items-center gap-2 whitespace-nowrap"
                        >
                            <IconComponent name="zap" size={16} /> Action Insight
                        </button>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-4 gap-6 mb-10">
                    {[
                        { label: 'Total Revenue', value: '$124,500', change: '+8.2%', trend: 'up' },
                        { label: 'Active Leads', value: '1,240', change: '+12%', trend: 'up' },
                        { label: 'Conversion Rate', value: '3.4%', change: '-0.1%', trend: 'down' },
                        { label: 'Avg. Deal Size', value: '$12,400', change: '+2.4%', trend: 'up' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="text-label mb-2">{stat.label}</div>
                            <div className="flex items-end justify-between">
                                <div className="text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</div>
                                <div className={`text-xs font-medium px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                    {stat.change}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Forecast Chart */}
                <div className="grid grid-cols-3 gap-8 mb-10">
                    <div className="col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Revenue Forecast</h3>
                                <p className="text-xs text-gray-500 mt-1">Actual vs AI Projected Growth</p>
                            </div>
                            <div className="flex gap-2">
                                <span className="flex items-center gap-1 text-[10px] text-gray-500"><div className="w-2 h-2 rounded-full bg-black"></div> Actual</span>
                                <span className="flex items-center gap-1 text-[10px] text-gray-500"><div className="w-2 h-2 rounded-full bg-indigo-500 border border-dashed"></div> Projected</span>
                            </div>
                        </div>

                        {/* CSS/SVG Chart */}
                        <div className="h-64 w-full relative">
                            {/* Grid Lines */}
                            <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-gray-300">
                                {[100, 75, 50, 25, 0].map(val => <div key={val} className="border-b border-gray-50 w-full h-0"></div>)}
                            </div>

                            {/* SVG Curve */}
                            <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.1"/>
                                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
                                    </linearGradient>
                                </defs>
                                {/* Historical Data */}
                                <path d="M0,200 C100,180 200,220 300,150 C400,80 500,120 600,100" fill="none" stroke="#111827" strokeWidth="3" strokeLinecap="round" className="chart-path" />
                                {/* AI Projection (Dashed) */}
                                <path d="M600,100 C700,80 800,40 900,20" fill="none" stroke="#6366f1" strokeWidth="3" strokeDasharray="8,8" strokeLinecap="round" />
                                {/* Area */}
                                <path d="M0,200 C100,180 200,220 300,150 C400,80 500,120 600,100 C700,80 800,40 900,20 V250 H0 Z" fill="url(#gradient)" opacity="0.5" />

                                {/* Interaction Point */}
                                <circle cx="600" cy="100" r="6" fill="#6366f1" stroke="white" strokeWidth="3" className="drop-shadow-md" />
                                <foreignObject x="560" y="50" width="100" height="40">
                                    <div className="bg-black text-white text-[10px] px-2 py-1 rounded-lg text-center shadow-lg">Today</div>
                                </foreignObject>
                            </svg>
                        </div>
                    </div>

                    {/* Segmentation / Funnel */}
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Funnel Health</h3>
                        <div className="space-y-6 flex-1 flex flex-col justify-center">
                            {[
                                { label: 'New Leads', val: 85, color: 'bg-blue-500' },
                                { label: 'Qualified', val: 60, color: 'bg-indigo-500' },
                                { label: 'Negotiation', val: 35, color: 'bg-purple-500' },
                                { label: 'Closed Won', val: 20, color: 'bg-green-500' },
                            ].map((stage, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-xs font-medium mb-2">
                                        <span className="text-gray-600">{stage.label}</span>
                                        <span className="text-gray-900">{stage.val}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className={`h-full ${stage.color} rounded-full bar-grow`} style={{width: `${stage.val}%`, animationDelay: `${i * 0.1}s`}}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="mt-6 w-full py-3 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                            View Detailed Report
                        </button>
                    </div>
                </div>

                {/* Recent Activity / Insights */}
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-label mb-4">Customer Sentiment</h3>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-center h-40">
                                {/* Simple Sentiment Viz */}
                                <div className="flex gap-4 items-end h-full">
                                    <div className="w-12 bg-green-100 rounded-t-lg relative group h-[80%]"><div className="absolute bottom-0 w-full bg-green-500 rounded-t-lg transition-all duration-1000 h-full"></div></div>
                                    <div className="w-12 bg-gray-100 rounded-t-lg relative group h-[15%]"><div className="absolute bottom-0 w-full bg-gray-400 rounded-t-lg transition-all duration-1000 h-full"></div></div>
                                    <div className="w-12 bg-red-100 rounded-t-lg relative group h-[5%]"><div className="absolute bottom-0 w-full bg-red-500 rounded-t-lg transition-all duration-1000 h-full"></div></div>
                                </div>
                            </div>
                            <div className="flex justify-center gap-8 mt-4 text-xs text-gray-500">
                                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Positive (80%)</span>
                                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-gray-400"></div> Neutral (15%)</span>
                                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> Negative (5%)</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-label mb-4">Campaign Recommendations</h3>
                        <div className="space-y-3">
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center group cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                        <IconComponent name="target" size={18} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">Retarget "Pricing Page" Drop-offs</div>
                                                                                    <div className="text-xs text-gray-500">34 leads visited pricing {'>'} 2x but didn't convert.</div>                                    </div>
                                </div>
                                <IconComponent name="arrow-right" size={16} className="text-gray-300 group-hover:text-indigo-600 transform group-hover:translate-x-1 transition-all" />
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center group cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                                        <IconComponent name="users" size={18} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900 group-hover:text-green-600 transition-colors">Upsell "Enterprise" to Pro Users</div>
                                        <div className="text-xs text-gray-500">12 accounts nearing usage limits.</div>
                                    </div>
                                </div>
                                <IconComponent name="arrow-right" size={16} className="text-gray-300 group-hover:text-green-600 transform group-hover:translate-x-1 transition-all" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InsightsView;