// src/views/FlowView/types.ts
export interface FlowViewConfig {
    leads: number[];
    channels: string[];
    product: string;
}

export interface FlowViewProps {
    config: FlowViewConfig;
    onPublish: () => void;
}
