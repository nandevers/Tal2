import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CampaignsView from './CampaignsView';
import { MOCK_CAMPAIGNS, MOCK_CHANNELS } from '../../data/mockData';

// Mock the IconComponent to simplify testing
vi.mock('../../utils/IconComponent', () => ({
  default: ({ name, size, className }: any) => (
    <span data-testid={`icon-${name}`} className={className}>
      {name}
    </span>
  ),
}));

describe('CampaignsView', () => {
  it('renders the header and all campaigns initially', () => {
    render(<CampaignsView />);

    expect(screen.getByRole('heading', { name: /Active Operations/i })).toBeInTheDocument();

    MOCK_CAMPAIGNS.forEach(campaign => {
      const campaignRow = screen.getByText(campaign.name).closest('.grid') as HTMLElement;
      expect(campaignRow).toBeInTheDocument();

      // Check for leads count
      expect(within(campaignRow).getByText(`${campaign.leads} leads`)).toBeInTheDocument();
      
      // Check for presence of each channel icon associated with the campaign
      campaign.channels.forEach(channelId => {
        const channel = MOCK_CHANNELS.find(c => c.id === channelId);
        if (channel) {
          expect(within(campaignRow).getByTestId(`icon-${channel.icon}`)).toBeInTheDocument();
        }
      });
      // New assertions for the updated progress bar
      expect(within(campaignRow).getByText(/Progress/i)).toBeInTheDocument();
      expect(within(campaignRow).getByText(`${campaign.sent}/${campaign.leads} Sent`)).toBeInTheDocument();
      if (campaign.replies && campaign.replies > 0) {
        expect(within(campaignRow).getByText(`${campaign.replies} Replies`)).toBeInTheDocument();
      }
    });

    // Ensure no expanded drawers are visible initially
    MOCK_CAMPAIGNS.forEach(campaign => {
      expect(screen.queryByText(/Config/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/BUDGET/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/VOLUME THROTTLE/i)).not.toBeInTheDocument();
    });
  });

  it('expands and collapses a campaign row on click', async () => {
    render(<CampaignsView />);

    const firstCampaign = MOCK_CAMPAIGNS[0];
    const firstCampaignRow = screen.getByText(firstCampaign.name).closest('.grid') as HTMLElement;

    fireEvent.click(firstCampaignRow);
    await waitFor(() => {
      expect(screen.getByText(new RegExp(`${firstCampaign.channels[0]} Config`, 'i'), { selector: 'span' })).toBeInTheDocument();
    });

    fireEvent.click(firstCampaignRow);
    await waitFor(() => {
      expect(screen.queryByText(new RegExp(`${firstCampaign.channels[0]} Config`, 'i'), { selector: 'span' })).not.toBeInTheDocument();
    });
  });

  it('displays correct content in expanded mini-drawer for different channel types', async () => {
    render(<CampaignsView />);

    const campaignToTest = MOCK_CAMPAIGNS.find(c =>
      c.channels.includes('facebook') && c.channels.includes('email')
    ) || MOCK_CAMPAIGNS[0]; 

    const campaignRow = screen.getByText(campaignToTest.name).closest('.grid') as HTMLElement;

    fireEvent.click(campaignRow); 

    await waitFor(() => {
      const socialChannels = campaignToTest.channels.filter(c => c === 'facebook' || c === 'instagram');
      socialChannels.forEach(channelId => {
        const channel = MOCK_CHANNELS.find(c => c.id === channelId);
        if (channel) {
          // Use a function matcher for finding the channel config section text within a span
          const channelConfigTextElement = screen.getByText(new RegExp(`${channel.label} Config`, 'i'), { selector: 'span' });
          const channelConfigSection = channelConfigTextElement.closest('.bg-white'); // Find the closest parent with .bg-white
          expect(channelConfigSection).toBeInTheDocument();
          expect(within(channelConfigSection!).getByText('BUDGET')).toBeInTheDocument();
          expect(within(channelConfigSection!).getByText('$50.00 / day')).toBeInTheDocument();
        }
      });

      const nonSocialChannels = campaignToTest.channels.filter(c => c !== 'facebook' && c !== 'instagram');
      nonSocialChannels.forEach(channelId => {
        const channel = MOCK_CHANNELS.find(c => c.id === channelId);
        if (channel) {
          // Use a function matcher for finding the channel config section text within a span
          const channelConfigTextElement = screen.getByText(new RegExp(`${channel.label} Config`, 'i'), { selector: 'span' });
          const channelConfigSection = channelConfigTextElement.closest('.bg-white'); // Find the closest parent with .bg-white
          expect(channelConfigSection).toBeInTheDocument();
          expect(within(channelConfigSection!).getByText('VOLUME THROTTLE')).toBeInTheDocument();
          expect(within(channelConfigSection!).getByRole('slider')).toBeInTheDocument();
        }
      });
    });
  });
});
