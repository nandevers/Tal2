// src/components/MapView/types.ts
import type { Entity } from '../../data/mockData';

export interface MapViewProps {
    entities: Entity[];
    selected: number[]; // Array of selected entity IDs
    onToggleSelect: (id: number) => void;
    showPeople: boolean;
    showCompanies: boolean;
    setShowPeople: (show: boolean) => void;
    setShowCompanies: (show: boolean) => void;
}
