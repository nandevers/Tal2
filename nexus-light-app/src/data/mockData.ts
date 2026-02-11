// src/data/mockData.ts

export interface Product {
    id: string;
    name: string;
    type: "Product" | "Plan" | "Event" | "Offer";
}

export const MOCK_PRODUCTS: Product[] = [
    { id: 'api', name: "Enterprise API", type: "Product" },
    { id: 'pro', name: "Pro Plan Subscription", type: "Plan" },
    { id: 'webinar', name: "Q3 Webinar: AI Sales", type: "Event" },
    { id: 'audit', name: "Free Tech Audit", type: "Offer" }
];

export interface Channel {
    id: string;
    icon: string; // Corresponds to Lucide icon name string
    label: string;
    badge: string | null;
}

export const MOCK_CHANNELS: Channel[] = [
    { id: 'email', icon: 'mail', label: 'Email', badge: null },
    { id: 'linkedin', icon: 'linkedin', label: 'LinkedIn', badge: null },
    { id: 'whatsapp', icon: 'message-circle', badge: 'High Intent', label: 'WhatsApp' },
    { id: 'facebook', icon: 'facebook', label: 'Facebook', badge: null },
    { id: 'instagram', icon: 'instagram', label: 'Instagram', badge: null },
];

export interface Campaign {
    id: number;
    name: string;
    status: boolean;
    volume: number;
    sentiment: 'high' | 'neutral' | 'low';
    tips: string | null;
    leads: number;
    channels: string[]; // IDs of channels
    replies?: number; // New field from index2.html
    sent?: number; // New field from index2.html
}

export const MOCK_CAMPAIGNS: Campaign[] = [
    { id: 1, name: "Series B Founders - Brazil", status: true, volume: 45, sentiment: 'high', tips: null, leads: 124, channels: ['email', 'linkedin'], replies: 12, sent: 80 },
    { id: 2, name: "Fintech CTOs - Outreach", status: true, volume: 20, sentiment: 'neutral', tips: "Reply rate dipping.", leads: 58, channels: ['email', 'whatsapp'], replies: 5, sent: 40 },
    { id: 3, name: "Q1 Webinar Invite", status: false, volume: 0, sentiment: 'low', tips: null, leads: 200, channels: ['facebook', 'instagram'], replies: 0, sent: 0 },
];

export interface PersonEntity {
    id: number;
    type: 'person';
    name: string;
    role: string;
    company: string;
    avatar: string;
    status: string;
    group: string;
    coords?: { x: number; y: number; }; // New field from index2.html
    source?: string; // New field from index2.html
}

export interface BusinessEntity {
    id: number;
    type: 'business';
    name: string;
    industry: string;
    location: string;
    avatar: string;
    status: string;
    group: string;
    coords?: { x: number; y: number; }; // New field from index2.html
    source?: string; // New field from index2.html
}

export type Entity = PersonEntity | BusinessEntity;

export const MOCK_ENTITIES: Entity[] = [
    // People
    { id: 1, type: 'person', name: "Elena Silva", role: "VP Sales", company: "TechFlow", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena", status: "Active", group: "VIP", coords: { x: 30, y: 40 }, source: "LinkedIn Sales Nav" },
    { id: 2, type: 'person', name: "Marcus Chen", role: "Head of Growth", company: "Nubank", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus", status: "Active", group: "Fintech", coords: { x: 65, y: 25 }, source: "Apollo.io" },
    { id: 3, type: 'person', name: "Sarah Jones", role: "CRO", company: "Vtex", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", status: "Unassigned", group: "Retail", coords: { x: 20, y: 70 }, source: "Clearbit" },
    
    // Businesses
    { id: 101, type: 'business', name: "TechFlow HQ", industry: "SaaS Platform", location: "São Paulo", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TF", status: "Target", group: "High Growth", coords: { x: 32, y: 38 }, source: "Google Places" },
    { id: 102, type: 'business', name: "Nubank Office", industry: "Fintech", location: "São Paulo", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=NB", status: "Customer", group: "Enterprise", coords: { x: 62, y: 22 }, source: "Google Places" },
    { id: 103, type: 'business', name: "Mercado Libre", industry: "E-commerce", location: "Buenos Aires", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=ML", status: "New", group: "Enterprise", coords: { x: 80, y: 60 }, source: "Internal DB" },
];

export interface InboxItem {
    id: number;
    category: 'message' | 'system';
    type: 'whatsapp' | 'linkedin' | 'alert' | 'warning';
    title: string;
    preview: string;
    time: string;
    unread: boolean;
    avatar?: string;
    icon?: string;
}

export const MOCK_INBOX: InboxItem[] = [
    { id: 1, category: 'message', type: 'whatsapp', title: 'Elena Silva', preview: 'Thanks for the docs! When can we chat?', time: '15m ago', unread: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena" },
    { id: 2, category: 'system', type: 'alert', title: 'Import Complete', preview: '24 records added from CSV.', time: '2m ago', unread: true, icon: 'database' },
    { id: 3, category: 'message', type: 'linkedin', title: 'Marcus Chen', preview: 'Sure, lets connect next week.', time: '1h ago', unread: false, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus" },
    { id: 4, category: 'system', type: 'warning', title: 'Campaign Paused', preview: 'Series B Founders reached daily limit.', time: '3h ago', unread: false, icon: 'alert-triangle' }
];

export interface ChatItem {
    id: number;
    sender: 'me' | 'them';
    text: string;
    time: string;
}

export const MOCK_CHAT_HISTORY: ChatItem[] = [
    { id: 1, sender: 'me', text: "Hi Elena, saw you're scaling at TechFlow. Released docs for Enterprise API. Want PDF?", time: '10:42 AM' },
    { id: 2, sender: 'them', text: "Thanks for the docs! When can we chat?", time: '10:55 AM' }
];
