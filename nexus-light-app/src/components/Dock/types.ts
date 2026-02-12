// src/components/Dock/types.ts

export interface DockTab {
    id: string;
    icon: string; // Change to string to match IconComponent's name prop
    label: string;
    badge?: number; // Optional badge count
}

export interface DockProps {
    activeTab: string | null;
    onTabChange: (tabId: string) => void;
    onDataClick: () => void; // New prop
}
