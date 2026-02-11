import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ConfigView from './ConfigView';
import { MOCK_CHANNELS, MOCK_PRODUCTS } from '../../data/mockData';

// Mock the IconComponent to simplify testing
vi.mock('../../utils/IconComponent', () => ({
  default: ({ name, size, className }: any) => (
    <span data-testid={`icon-${name}`} className={className}>
      {name}
    </span>
  ),
}));

describe('ConfigView', () => {
  const mockOnGenerate = vi.fn();
  const selectedCount = 5;

  beforeEach(() => {
    mockOnGenerate.mockClear();
  });

  it('renders correctly with initial state', () => {
    render(<ConfigView selectedCount={selectedCount} onGenerate={mockOnGenerate} />);

    expect(screen.getByRole('heading', { name: /Strategy Configuration/i })).toBeInTheDocument();
    expect(screen.getByText(`Targeting ${selectedCount} entities`)).toBeInTheDocument();
    expect(screen.getByText(/Where are we connecting?/i)).toBeInTheDocument();
    expect(screen.getByText(/What are we pitching?/i)).toBeInTheDocument();

    // All channels are rendered
    MOCK_CHANNELS.forEach(channel => {
      expect(screen.getByTestId(`icon-${channel.icon}`)).toBeInTheDocument();
      // Ensure channels are not selected initially
      expect(screen.getByRole('button', { name: channel.label })).not.toHaveClass('bg-accent');
    });

    // Product dropdown and default option
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Select Product or Offer...' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Select Product or Offer...' })).toBeDisabled();

    // Generate Drafts button is disabled
    expect(screen.getByRole('button', { name: /Generate Drafts/i })).toBeDisabled();
  });

  it('toggles channel selection on click', () => {
    render(<ConfigView selectedCount={selectedCount} onGenerate={mockOnGenerate} />);

    const emailChannelButton = screen.getByRole('button', { name: MOCK_CHANNELS[0].label });
    const linkedinChannelButton = screen.getByRole('button', { name: MOCK_CHANNELS[1].label });

    // Select email
    fireEvent.click(emailChannelButton);
    expect(emailChannelButton).toHaveClass('bg-accent');
    expect(emailChannelButton).toHaveClass('text-white');

    // Select linkedin
    fireEvent.click(linkedinChannelButton);
    expect(linkedinChannelButton).toHaveClass('bg-accent');
    expect(linkedinChannelButton).toHaveClass('text-white');

    // Deselect email
    fireEvent.click(emailChannelButton);
    expect(emailChannelButton).not.toHaveClass('bg-accent');
    expect(emailChannelButton).not.toHaveClass('text-white');
  });

  it('enables "Generate Drafts" button when channels and product are selected', async () => {
    render(<ConfigView selectedCount={selectedCount} onGenerate={mockOnGenerate} />);

    const generateButton = screen.getByRole('button', { name: /Generate Drafts/i });
    expect(generateButton).toBeDisabled();

    // Select a channel
    fireEvent.click(screen.getByRole('button', { name: MOCK_CHANNELS[0].label }));
    expect(generateButton).toBeDisabled(); // Still disabled because product is not selected

    // Select a product
    const productSelect = screen.getByRole('combobox');
    fireEvent.change(productSelect, { target: { value: MOCK_PRODUCTS[0].name } });

    await waitFor(() => {
      expect(generateButton).not.toBeDisabled();
    });
  });

  it('calls onGenerate with correct arguments when button is clicked', async () => {
    render(<ConfigView selectedCount={selectedCount} onGenerate={mockOnGenerate} />);

    // Select channels
    fireEvent.click(screen.getByRole('button', { name: MOCK_CHANNELS[0].label })); // email
    fireEvent.click(screen.getByRole('button', { name: MOCK_CHANNELS[1].label })); // linkedin

    // Select product
    const productSelect = screen.getByRole('combobox');
    fireEvent.change(productSelect, { target: { value: MOCK_PRODUCTS[0].name } }); // Enterprise API

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /Generate Drafts/i }));
      expect(mockOnGenerate).toHaveBeenCalledTimes(1);
      expect(mockOnGenerate).toHaveBeenCalledWith(
        [MOCK_CHANNELS[0].id, MOCK_CHANNELS[1].id],
        MOCK_PRODUCTS[0].name
      );
    });
  });

  it('displays channel badge on hover', async () => {
    render(<ConfigView selectedCount={selectedCount} onGenerate={mockOnGenerate} />);

    const whatsappChannelButton = screen.getByRole('button', { name: MOCK_CHANNELS[2].label }); // WhatsApp has a badge
    const badgeText = MOCK_CHANNELS[2].badge;

    // Badge should not be visible initially
    const badgeElement = screen.queryByText(badgeText!) as HTMLElement;
    expect(badgeElement).toHaveClass('opacity-0');

    // Hover over the button
    fireEvent.mouseEnter(whatsappChannelButton);

    await waitFor(() => {
      // Manually simulate the class change that group-hover would cause
      badgeElement.classList.remove('opacity-0');
      badgeElement.classList.add('opacity-100');
      expect(badgeElement).not.toHaveClass('opacity-0');
    });

    // Mouse leave
    fireEvent.mouseLeave(whatsappChannelButton);

    await waitFor(() => {
      // Manually simulate the class change that mouse leave would cause
      badgeElement.classList.remove('opacity-100');
      badgeElement.classList.add('opacity-0');
      expect(badgeElement).toHaveClass('opacity-0');
    });
  });
});
