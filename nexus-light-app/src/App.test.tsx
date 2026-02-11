import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock child components to isolate App's rendering and state management
vi.mock('./components/Dock/Dock', () => ({
  default: ({ activeTab, onTabChange, onDataClick }: any) => (
    <div data-testid="mock-dock">
      <button onClick={() => onTabChange('search')} data-testid="dock-search-btn">Search</button>
      <button onClick={() => onTabChange('leads')} data-testid="dock-leads-btn">Leads</button>
      <button onClick={() => onTabChange('inbox')} data-testid="dock-inbox-btn">Inbox</button>
      <button onClick={() => onTabChange('settings')} data-testid="dock-settings-btn">Settings</button>
      <button onClick={onDataClick} data-testid="dock-data-btn">Data</button>
      <span>Active Tab: {activeTab}</span>
    </div>
  ),
}));

vi.mock('./views/SearchView/SearchView', () => ({ default: ({ onAction }: any) => <div data-testid="mock-search-view"><button onClick={() => onAction('config', [1])}>Action</button></div> }));
vi.mock('./views/ConfigView/ConfigView', () => ({ default: ({ selectedCount, onGenerate }: any) => <div data-testid="mock-config-view"><button onClick={() => onGenerate(['email'], 'Product A')}>Generate</button></div> }));
vi.mock('./views/FlowView/FlowView', () => ({ default: ({ config, onPublish }: any) => <div data-testid="mock-flow-view"><button onClick={onPublish}>Publish</button></div> }));
vi.mock('./views/CampaignsView/CampaignsView', () => ({ default: () => <div data-testid="mock-campaigns-view"></div> }));
vi.mock('./views/EntitiesView/EntitiesView', () => ({ default: ({ showToast }: any) => <div data-testid="mock-entities-view"><button onClick={() => showToast('Entity Toast')}>Show Entity Toast</button></div> }));
vi.mock('./views/InboxView/InboxView', () => ({ default: () => <div data-testid="mock-inbox-view"></div> }));
vi.mock('./views/SettingsView/SettingsView', () => ({ default: () => <div data-testid="mock-settings-view"></div> }));
vi.mock('./views/InsightsView/InsightsView', () => ({ default: () => <div data-testid="mock-insights-view"></div> })); // Added InsightsView mock
vi.mock('./components/Toast/Toast', () => ({ default: ({ message, visible }: any) => (visible ? <div data-testid="mock-toast">{message}</div> : null) }));
vi.mock('./components/DataIngestionPanel/DataIngestionPanel', () => ({ default: ({ isOpen, onClose, showToast, onToggleWidget }: any) => (isOpen ? <div data-testid="mock-data-panel"><button onClick={onClose}>Close</button><button onClick={() => showToast('Panel Toast')}>Show Panel Toast</button><button onClick={() => onToggleWidget(true)} data-testid="toggle-widget-on">Toggle Widget On</button><button onClick={() => onToggleWidget(false)} data-testid="toggle-widget-off">Toggle Widget Off</button></div> : null) }));

describe('App', () => {
  beforeEach(() => {
    vi.useFakeTimers(); // Use fake timers for tests involving setTimeout
  });

  afterEach(() => {
    vi.useRealTimers(); // Restore real timers
  });

  it('renders SearchView initially and handles tab changes', { timeout: 20000 }, async () => {
    render(<App />);

    // Initial state: SearchView is rendered
    expect(screen.getByTestId('mock-search-view')).toBeInTheDocument();
    expect(screen.getByText('Active Tab: search')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-inbox-view')).not.toBeInTheDocument();

    // Change tab to Inbox
    await act(async () => {
      fireEvent.click(screen.getByTestId('dock-inbox-btn'));
      vi.runAllTimers(); // Force timers to advance
    });
    await waitFor(() => {
      expect(screen.getByTestId('mock-inbox-view')).toBeInTheDocument();
      expect(screen.queryByTestId('mock-search-view')).not.toBeInTheDocument();
      expect(screen.getByText('Active Tab: inbox')).toBeInTheDocument();
    });

    // Change tab to Settings
    await act(async () => {
      fireEvent.click(screen.getByTestId('dock-settings-btn'));
      vi.runAllTimers(); // Force timers to advance
    });
    await waitFor(() => {
      expect(screen.getByTestId('mock-settings-view')).toBeInTheDocument();
      expect(screen.queryByTestId('mock-inbox-view')).not.toBeInTheDocument();
      expect(screen.getByText('Active Tab: settings')).toBeInTheDocument();
    });

    // Change tab back to Search
    await act(async () => {
      fireEvent.click(screen.getByTestId('dock-search-btn'));
      vi.runAllTimers(); // Force timers to advance
    });
    await waitFor(() => {
      expect(screen.getByTestId('mock-search-view')).toBeInTheDocument();
      expect(screen.getByText('Active Tab: search')).toBeInTheDocument();
    });
  });

  it('opens and closes DataIngestionPanel', { timeout: 20000 }, async () => {
    render(<App />);

    // Panel is initially closed
    expect(screen.queryByTestId('mock-data-panel')).not.toBeInTheDocument();

    // Open panel
    fireEvent.click(screen.getByTestId('dock-data-btn'));
    vi.runAllTimers();
    await waitFor(() => {
      expect(screen.getByTestId('mock-data-panel')).toBeInTheDocument();
    });

    // Close panel
    fireEvent.click(screen.getByText('Close'));
    vi.runAllTimers();
    await waitFor(() => {
      expect(screen.queryByTestId('mock-data-panel')).not.toBeInTheDocument();
    });
  });

  it('displays Toast messages', { timeout: 20000 }, async () => {
    render(<App />);

    // No toast initially
    expect(screen.queryByTestId('mock-toast')).not.toBeInTheDocument();

    // First, navigate to EntitiesView
    await act(async () => {
        fireEvent.click(screen.getByTestId('dock-leads-btn'));
        vi.runAllTimers();
    });
    await waitFor(() => {
      expect(screen.getByTestId('mock-entities-view')).toBeInTheDocument();
    });

    // Trigger toast from EntitiesView (simulated)
    await act(async () => {
        fireEvent.click(screen.getByTestId('mock-entities-view').querySelector('button') as HTMLElement); // Click the 'Show Entity Toast' button
        vi.runAllTimers();
    });
    await waitFor(() => {
      expect(screen.getByTestId('mock-toast')).toBeInTheDocument();
      expect(screen.getByText('Entity Toast')).toBeInTheDocument();
    });

    // Wait for toast to disappear (simulated by setTimeout in showToast)
    vi.advanceTimersByTime(3000);
    vi.runAllTimers(); // Ensure all timers are advanced
    await waitFor(() => {
      expect(screen.queryByTestId('mock-toast')).not.toBeInTheDocument();
    });
  });

  it('handles the full campaign flow (Search -> Config -> Flow -> Campaigns)', { timeout: 20000 }, async () => {
    render(<App />);

    // 1. Search View -> Config View
    await act(async () => {
        fireEvent.click(screen.getByTestId('mock-search-view').querySelector('button') as HTMLElement); // Simulate selecting leads and clicking action
        vi.runAllTimers();
    });
    await waitFor(() => {
      expect(screen.getByTestId('mock-config-view')).toBeInTheDocument();
      expect(screen.queryByTestId('mock-search-view')).not.toBeInTheDocument();
    });

    // 2. Config View -> Flow View
    await act(async () => {
        fireEvent.click(screen.getByTestId('mock-config-view').querySelector('button') as HTMLElement); // Simulate generating draft
        vi.runAllTimers();
    });
    await waitFor(() => {
      expect(screen.getByTestId('mock-flow-view')).toBeInTheDocument();
      expect(screen.queryByTestId('mock-config-view')).not.toBeInTheDocument();
    });

    // 3. Flow View -> Campaigns View (onPublish)
    await act(async () => {
        fireEvent.click(screen.getByTestId('mock-flow-view').querySelector('button') as HTMLElement); // Simulate publishing
        vi.runAllTimers();
    });
    await waitFor(() => {
      expect(screen.getByTestId('mock-campaigns-view')).toBeInTheDocument();
      expect(screen.queryByTestId('mock-flow-view')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Active Tab: campaigns')).toBeInTheDocument(); // Active tab should be campaigns
  });

  it('toggles WhatsApp widget visibility', { timeout: 20000 }, async () => {
    render(<App />);
    
    // WhatsApp widget is initially hidden
    expect(screen.queryByTestId('whatsapp-float')).not.toBeInTheDocument();

    // Open Data Panel
    await act(async () => {
        fireEvent.click(screen.getByTestId('dock-data-btn'));
        vi.runAllTimers();
    });
    await waitFor(() => {
        expect(screen.getByTestId('mock-data-panel')).toBeInTheDocument();
    });

    // Toggle WhatsApp widget on
    await act(async () => {
        fireEvent.click(screen.getByTestId('mock-data-panel').querySelector('button[data-testid="toggle-widget-on"]') as HTMLElement); // Click the 'Toggle Widget On' button
        vi.runAllTimers();
    });
    await waitFor(() => {
        expect(screen.getByTestId('whatsapp-float')).toBeInTheDocument();
    });

    // Toggle WhatsApp widget off (simulated from Data Panel logic)
    await act(async () => {
        fireEvent.click(screen.getByTestId('mock-data-panel').querySelector('button[data-testid="toggle-widget-off"]') as HTMLElement);
        vi.runAllTimers();
    });
    await waitFor(() => {
        expect(screen.queryByTestId('whatsapp-float')).not.toBeInTheDocument();
    });
  });
});