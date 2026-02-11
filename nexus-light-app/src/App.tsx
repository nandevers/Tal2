import { useState, useEffect } from 'react';
import './index.css'; // Ensure main CSS is imported
import {
    MOCK_PRODUCTS,
    MOCK_CHANNELS,
    MOCK_CAMPAIGNS,
    MOCK_ENTITIES
} from './data/mockData';
import IconComponent from './utils/IconComponent';


import Dock from './components/Dock/Dock';
import SearchView from './views/SearchView/SearchView';
import ConfigView from './views/ConfigView/ConfigView';
import EntitiesView from './views/EntitiesView/EntitiesView';
import FlowView from './views/FlowView/FlowView';
import CampaignsView from './views/CampaignsView/CampaignsView';
import Toast from './components/Toast/Toast'; // Import Toast component
import DataIngestionPanel from './components/DataIngestionPanel/DataIngestionPanel'; // Import DataIngestionPanel
import InboxView from './views/InboxView/InboxView'; // Import InboxView
import SettingsView from './views/SettingsView/SettingsView'; // Import SettingsView
import InsightsView from './views/InsightsView/InsightsView'; // Import InsightsView
import ProfilePanel from './components/ProfilePanel/ProfilePanel'; // Import ProfilePanel


interface DraftConfig {
    leads: number[];
    channels: string[];
    product: string;
}


// --- MAIN APP ---
const App = () => {
    const [view, setView] = useState('search');
    const [activeTab, setActiveTab] = useState('search');
    const [draftConfig, setDraftConfig] = useState<DraftConfig | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [isDataPanelOpen, setIsDataPanelOpen] = useState(false);
    const [showWhatsApp, setShowWhatsApp] = useState(false); // New state for WhatsApp widget
    const [isProfileOpen, setIsProfileOpen] = useState(false); // New state for ProfilePanel

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        // Ensure all views are handled
        if (tabId === 'leads') setView('leads');
        else if (tabId === 'campaigns') setView('campaigns');
        else if (tabId === 'inbox') setView('inbox');
        else if (tabId === 'insights') setView('insights');
        else if (tabId === 'settings') setView('settings');
        else setView('search'); // Default to search
    };

    const handleAction = (action: string, payload: number[]) => {
        if (action === 'config') {
            setDraftConfig({ leads: payload }); // Initialize leads only, channels and product will be set in ConfigView
            setView('config');
            setActiveTab(null);
        }
    };

    const handleGenerate = (channels: string[], product: string) => {
        if (draftConfig) { // Ensure draftConfig is not null
            setDraftConfig({ ...draftConfig, channels, product });
        }
        setView('flow');
    };

    const showToast = (msg: string) => { // showToast function
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    return (
        <div className="h-screen w-screen bg-[#FAFAFA] relative overflow-hidden">
            <main className="h-full w-full overflow-hidden relative">
                {view === 'search' && <SearchView onAction={handleAction} />}
                {view === 'config' && <ConfigView selectedCount={draftConfig?.leads?.length || 0} onGenerate={handleGenerate} />}
                {view === 'flow' && draftConfig && <FlowView config={draftConfig} onPublish={() => handleTabChange('campaigns')} />}
                {view === 'campaigns' && <CampaignsView />}
                {view === 'leads' && <EntitiesView showToast={showToast} />}
                {view === 'inbox' && <InboxView />} {/* Render InboxView */}
                {view === 'insights' && <InsightsView onAction={handleAction} />} {/* Render InsightsView with onAction */}
                {view === 'settings' && <SettingsView />} {/* Render SettingsView */}
            </main>
            <Dock activeTab={activeTab} onTabChange={handleTabChange} onDataClick={() => setIsDataPanelOpen(true)} />
            <DataIngestionPanel
                isOpen={isDataPanelOpen}
                onClose={() => setIsDataPanelOpen(false)}
                showToast={showToast}
                onToggleWidget={setShowWhatsApp}
            />
            <ProfilePanel
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                onViewChange={(newView) => { setView(newView); setActiveTab(newView); }}
            />
            <Toast message={toastMessage} visible={!!toastMessage} />
            {showWhatsApp && (
                <div data-testid="whatsapp-float" className="whatsapp-float bg-green-500 w-12 h-12 rounded-full flex items-center justify-center shadow-lg text-white cursor-pointer hover:bg-green-600 transition-colors">
                    <IconComponent name="message-circle" size={24} />
                </div>
            )}
            {/* Profile Button */}
            <button onClick={() => setIsProfileOpen(true)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center overflow-hidden hover:scale-105 transition-transform z-50">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" className="w-full h-full object-cover" />
            </button>
        </div>
    );
};

export default App;
