// src/views/SearchView/types.ts
import type { Entity } from '../../data/mockData';

export interface EntityCardProps {
    entity: Entity;
    selected: number[]; // Array of selected entity IDs
    toggleSelect: (id: number) => void;
}

export interface SearchViewProps {
    onAction: (action: string, payload: number[]) => void;
}
