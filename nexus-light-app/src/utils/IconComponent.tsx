// src/utils/IconComponent.tsx
import React from 'react';
import {
    Mail, Linkedin, MessageCircle, Facebook, Instagram, Search, Users, Layers, Inbox, BarChart2, Settings,
    Check, Building2, User, Package, ChevronDown, Upload, Plus, Filter, SlidersHorizontal, Download, MoreHorizontal,
    ArrowRight, PlusCircle, Database, List, Map, Sparkles, Zap, Target, Bell, Trash, Send, ChevronUp, Globe, X, Fingerprint, Eye, Cloud, Server, Shield
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react'; // Import LucideIcon as a type

// Helper to map icon names to Lucide components
const iconMap: { [key: string]: LucideIcon } = {
    mail: Mail,
    linkedin: Linkedin,
    'message-circle': MessageCircle,
    facebook: Facebook,
    instagram: Instagram,
    search: Search,
    users: Users,
    layers: Layers,
    inbox: Inbox,
    'bar-chart-2': BarChart2,
    settings: Settings,
    check: Check,
    'building-2': Building2,
    user: User,
    package: Package,
    'chevron-down': ChevronDown,
    'chevron-up': ChevronUp,
    upload: Upload,
    plus: Plus,
    filter: Filter,
    'sliders-horizontal': SlidersHorizontal,
    download: Download,
    'more-horizontal': MoreHorizontal,
    'arrow-right': ArrowRight,
    'plus-circle': PlusCircle,
    database: Database, // Added database
    list: List, // Added list
    map: Map, // Added map
    sparkles: Sparkles,
    zap: Zap,
    target: Target,
    bell: Bell,
    trash: Trash,
    send: Send,
    globe: Globe,
    x: X,
    fingerprint: Fingerprint,
    eye: Eye,
    cloud: Cloud,
    server: Server,
    shield: Shield,
    // Add other icons as needed
};

interface IconComponentProps {
    name: string;
    size?: number;
    className?: string;
}

const IconComponent: React.FC<IconComponentProps> = ({ name, size = 18, className = "" }) => {
    const LucideIcon = iconMap[name];
    if (!LucideIcon) {
        console.warn(`Icon "${name}" not found in iconMap.`);
        return null; // Or return a default icon
    }
    return <LucideIcon size={size} className={className} />;
};

export default IconComponent;
