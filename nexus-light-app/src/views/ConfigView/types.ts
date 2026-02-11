// src/views/ConfigView/types.ts
export interface ConfigViewProps {
    selectedCount: number;
    onGenerate: (channels: string[], product: string) => void;
}
