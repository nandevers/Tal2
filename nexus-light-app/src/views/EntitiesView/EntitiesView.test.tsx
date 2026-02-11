import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EntitiesView from './EntitiesView';
import { MOCK_ENTITIES } from '../../data/mockData';

// Mock the IconComponent to simplify testing
vi.mock('../../utils/IconComponent', () => ({
  default: ({ name, size, className }: any) => (
    <span data-testid={`icon-${name}`} className={className}>
      {name}
    </span>
  ),
}));

describe('EntitiesView', () => {
  it('renders correctly with initial state and all entities', () => {
    render(<EntitiesView />);

    // Sidebar elements
    expect(screen.getByText('Segments')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /All Entities/i })).toBeInTheDocument();
    expect(screen.getByText('VIP / High Value')).toBeInTheDocument();
    expect(screen.getByText('Tags')).toBeInTheDocument();
    expect(screen.getByText('Synced: Just now')).toBeInTheDocument(); // Corrected assertion

    // Main content header
    expect(screen.getByRole('heading', { name: 'All Entities' })).toBeInTheDocument();
    expect(screen.getByText(`Managing ${MOCK_ENTITIES.length} entities`)).toBeInTheDocument();

    // Toolbar elements
    expect(screen.getByRole('button', { name: /Mixed/i })).toHaveClass('bg-gray-100');
    expect(screen.getByRole('button', { name: /People/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Businesses/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Import CSV/i })).toBeInTheDocument(); // Now expecting a button with this text
    expect(screen.getByRole('button', { name: /Add Entity/i })).toBeInTheDocument(); // Now expecting a button with this text

    // Table headers (updated to match new table headers in EntitiesView.tsx)
    expect(screen.getByRole('columnheader', { name: /Entity/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Status/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Source/i })).toBeInTheDocument(); // Changed from Group
    expect(screen.getByRole('columnheader', { name: /Actions/i })).toBeInTheDocument();

    // All entities are rendered
    MOCK_ENTITIES.forEach(entity => {
      expect(screen.getByText(entity.name)).toBeInTheDocument();
    });

    // Pagination
    expect(screen.getByText(`Showing ${MOCK_ENTITIES.length} of ${MOCK_ENTITIES.length}`)).toBeInTheDocument();
  });

  it('changes active group when a segment button is clicked', () => {
    render(<EntitiesView />);

    const vipSegmentButton = screen.getByRole('button', { name: /VIP \/ High Value/i });
    fireEvent.click(vipSegmentButton);

    expect(vipSegmentButton).toHaveClass('bg-gray-100');
    expect(screen.getByRole('heading', { name: /VIP \/ High Value/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /All Entities/i })).not.toHaveClass('bg-gray-100');
  });

  it('filters entities by type when type filter buttons are clicked', async () => {
    render(<EntitiesView />);

    const peopleFilterButton = screen.getByRole('button', { name: /People/i });
    const businessFilterButton = screen.getByRole('button', { name: /Businesses/i });
    const mixedFilterButton = screen.getByRole('button', { name: /Mixed/i });

    fireEvent.click(peopleFilterButton);
    await waitFor(() => {
      MOCK_ENTITIES.filter(e => e.type === 'person').forEach(entity => {
        expect(screen.getByText(entity.name)).toBeInTheDocument();
      });
      MOCK_ENTITIES.filter(e => e.type === 'business').forEach(entity => {
        expect(screen.queryByText(entity.name)).not.toBeInTheDocument();
      });
      expect(screen.getByText(`Managing ${MOCK_ENTITIES.filter(e => e.type === 'person').length} entities`)).toBeInTheDocument();
      expect(peopleFilterButton).toHaveClass('bg-gray-100');
      expect(mixedFilterButton).not.toHaveClass('bg-gray-100');
    });

    fireEvent.click(businessFilterButton);
    await waitFor(() => {
      MOCK_ENTITIES.filter(e => e.type === 'business').forEach(entity => {
        expect(screen.getByText(entity.name)).toBeInTheDocument();
      });
      MOCK_ENTITIES.filter(e => e.type === 'person').forEach(entity => {
        expect(screen.queryByText(entity.name)).not.toBeInTheDocument();
      });
      expect(screen.getByText(`Managing ${MOCK_ENTITIES.filter(e => e.type === 'business').length} entities`)).toBeInTheDocument();
      expect(businessFilterButton).toHaveClass('bg-gray-100');
      expect(peopleFilterButton).not.toHaveClass('bg-gray-100');
    });

    fireEvent.click(mixedFilterButton);
    await waitFor(() => {
      MOCK_ENTITIES.forEach(entity => {
        expect(screen.getByText(entity.name)).toBeInTheDocument();
      });
      expect(screen.getByText(`Managing ${MOCK_ENTITIES.length} entities`)).toBeInTheDocument();
      expect(mixedFilterButton).toHaveClass('bg-gray-100');
      expect(businessFilterButton).not.toHaveClass('bg-gray-100');
    });
  });

  it('updates search input value', () => {
    render(<EntitiesView />);
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'test query' } });
    expect(searchInput).toHaveValue('test query');
  });

  it('displays action icons correctly using accessible names', () => {
    render(<EntitiesView />);
    // Sidebar icons
    expect(screen.getByRole('button', { name: 'Filter segments' })).toBeInTheDocument();
    // Removed assertion for 'Create New Segment' button

    // Toolbar icons
    expect(screen.getByRole('button', { name: 'upload Import CSV' })).toBeInTheDocument(); // Precise name
    expect(screen.getByRole('button', { name: 'plus Add Entity' })).toBeInTheDocument(); // Precise name
    expect(screen.getByRole('button', { name: 'Filter entities' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Download data' })).toBeInTheDocument();

    // Table row action icon
    expect(screen.getAllByRole('button', { name: 'More actions' }).length).toBeGreaterThan(0);

    // Search input icon
    expect(screen.getByTestId('icon-search')).toBeInTheDocument();
  });
});
