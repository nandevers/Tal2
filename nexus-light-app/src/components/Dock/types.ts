// src/components/Dock/types.ts
import type { LucideIcon } from 'lucide-react';

export interface DockTab {
    id: string;
    icon: LucideIcon; // LucideIcon is a component type
    label: string;
    badge?: number; // Optional badge count
}

export interface DockProps {
    activeTab: string;
    onTabChange: (tabId: string) => void;
    onDataClick: () => void; // New prop
}
