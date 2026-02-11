// src/components/DataIngestionPanel/types.ts
export interface DataIngestionPanelProps {
    isOpen: boolean;
    onClose: () => void;
    showToast: (message: string) => void;
    onToggleWidget: (show: boolean) => void;
}

export interface ConnectionState {
    google: boolean;
    meta: boolean;
    whatsapp: boolean;
    salesforce: boolean;
    totvs: boolean;
    sap: boolean;
}
