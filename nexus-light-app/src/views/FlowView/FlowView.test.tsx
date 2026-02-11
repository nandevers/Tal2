import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FlowView from './FlowView';
import { MOCK_ENTITIES, MOCK_CHANNELS } from '../../data/mockData';

// Mock the IconComponent to simplify testing
vi.mock('../../utils/IconComponent', () => ({
  default: ({ name, size, className }: any) => (
    <span data-testid={`icon-${name}`} className={className}>
      {name}
    </span>
  ),
}));

describe('FlowView', () => {
  const mockOnPublish = vi.fn();
  const mockConfig = {
    leads: [MOCK_ENTITIES[0].id, MOCK_ENTITIES[1].id], // Elena Silva, Marcus Chen
    channels: [MOCK_CHANNELS[0].id, MOCK_CHANNELS[2].id, MOCK_CHANNELS[3].id], // email, whatsapp, facebook
    product: 'Enterprise API',
  };

  beforeEach(() => {
    mockOnPublish.mockClear();
  });

  it('renders correctly with initial state and context', () => {
    render(<FlowView config={mockConfig} onPublish={mockOnPublish} />);

    // Campaign Context
    expect(screen.getByText('Campaign Context')).toBeInTheDocument();
    expect(screen.getByText('Product')).toBeInTheDocument();
    
    // Specifically check for the product in the sidebar context
    const productContext = screen.getByText('Product').closest('.bg-blue-50');
    expect(within(productContext!).getByText(mockConfig.product)).toBeInTheDocument();

    // Selected Entities in sidebar
    mockConfig.leads.forEach(leadId => {
      const entity = MOCK_ENTITIES.find(e => e.id === leadId);
      if (entity) {
        expect(screen.getByText(entity.name)).toBeInTheDocument();
      }
    });

    // Channel tabs
    mockConfig.channels.forEach(channelId => {
      const channel = MOCK_CHANNELS.find(c => c.id === channelId);
      if (channel) {
        // Use regex to match button name because it might include icon name from mock
        expect(screen.getByRole('button', { name: new RegExp(channel.label, 'i') })).toBeInTheDocument();
      }
    });
    // First channel in mockConfig.channels should be active ('email')
    expect(screen.getByRole('button', { name: new RegExp(MOCK_CHANNELS[0].label, 'i') })).toHaveClass('bg-white');

    // Publish Campaign button
    expect(screen.getByRole('button', { name: /Publish Campaign/i })).toBeInTheDocument();

    // Initial content (email content for 'email' tab)
    expect(screen.getByDisplayValue(`Opportunity: {{Company}} x ${mockConfig.product}`)).toBeInTheDocument();
    expect(screen.getByText(/I've been following/i)).toBeInTheDocument(); // Changed assertion here
  });

  it('switches tabs and displays corresponding content on click', async () => {
    render(<FlowView config={mockConfig} onPublish={mockOnPublish} />);

    // Click WhatsApp tab
    const whatsappTab = screen.getByRole('button', { name: new RegExp(MOCK_CHANNELS[2].label, 'i') });
    fireEvent.click(whatsappTab);

    await waitFor(() => {
      expect(whatsappTab).toHaveClass('bg-white'); // WhatsApp tab is active
      // Check for a distinct part of the WhatsApp content that is not broken by elements
      expect(screen.getByText(/Want me to send the PDF?/i)).toBeInTheDocument(); 
      // Ensure email content is gone
      expect(screen.queryByDisplayValue(`Opportunity: {{Company}} x ${mockConfig.product}`)).not.toBeInTheDocument(); 
    });

    // Click Facebook tab
    const facebookTab = screen.getByRole('button', { name: new RegExp(MOCK_CHANNELS[3].label, 'i') });
    fireEvent.click(facebookTab);

    await waitFor(() => {
      expect(facebookTab).toHaveClass('bg-white'); // Facebook tab is active
      expect(screen.getByText(/Sponsored/i)).toBeInTheDocument(); // Facebook content
      expect(screen.getByText(`Scale with ${mockConfig.product}`)).toBeInTheDocument();
      // Ensure WhatsApp content is gone
      expect(screen.queryByText(/Want me to send the PDF?/i)).not.toBeInTheDocument(); 
    });
  });

  it('calls onPublish when "Publish Campaign" button is clicked', () => {
    render(<FlowView config={mockConfig} onPublish={mockOnPublish} />);

    fireEvent.click(screen.getByRole('button', { name: /Publish Campaign/i }));
    expect(mockOnPublish).toHaveBeenCalledTimes(1);
  });

  it('displays correct icon for each channel tab', () => {
    render(<FlowView config={mockConfig} onPublish={mockOnPublish} />);

    mockConfig.channels.forEach(channelId => {
      const channel = MOCK_CHANNELS.find(c => c.id === channelId);
      if (channel) {
        expect(screen.getByTestId(`icon-${channel.icon}`)).toBeInTheDocument();
      }
    });
  });
});