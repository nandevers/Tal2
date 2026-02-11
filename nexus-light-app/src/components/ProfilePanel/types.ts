// src/components/ProfilePanel/types.ts
export interface ProfilePanelProps {
    isOpen: boolean;
    onClose: () => void;
    onViewChange: (view: string) => void;
}