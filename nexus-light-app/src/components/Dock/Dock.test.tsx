import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Dock from './Dock';

describe('Dock', () => {
  const mockOnTabChange = vi.fn();

  beforeEach(() => {
    mockOnTabChange.mockClear();
  });

  it('renders all tabs correctly', () => {
    render(<Dock activeTab="search" onTabChange={mockOnTabChange} />);

    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Entities')).toBeInTheDocument();
    expect(screen.getByText('Campaigns')).toBeInTheDocument();
    expect(screen.getByText('Inbox')).toBeInTheDocument();
    expect(screen.getByText('Insights')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('highlights the active tab', () => {
    render(<Dock activeTab="campaigns" onTabChange={mockOnTabChange} />);

    const campaignTabButton = screen.getByRole('button', { name: /Campaigns/i });
    expect(campaignTabButton).toHaveClass('bg-gray-100');
    expect(campaignTabButton).toHaveClass('scale-105');

    const searchTabButton = screen.getByRole('button', { name: /Search/i });
    expect(searchTabButton).not.toHaveClass('bg-gray-100');
  });

  it('calls onTabChange with the correct id when a tab is clicked', () => {
    render(<Dock activeTab="search" onTabChange={mockOnTabChange} />);

    fireEvent.click(screen.getByText('Entities'));
    expect(mockOnTabChange).toHaveBeenCalledTimes(1);
    expect(mockOnTabChange).toHaveBeenCalledWith('leads');

    fireEvent.click(screen.getByText('Insights'));
    expect(mockOnTabChange).toHaveBeenCalledTimes(2);
    expect(mockOnTabChange).toHaveBeenCalledWith('insights');
  });

  it('renders a badge when provided', () => {
    render(<Dock activeTab="search" onTabChange={mockOnTabChange} />);

    const inboxTabButton = screen.getByRole('button', { name: /Inbox/i });
    const badge = inboxTabButton.querySelector('.bg-red-500');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('3');
  });
});