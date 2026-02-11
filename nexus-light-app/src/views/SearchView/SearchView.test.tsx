import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SearchView from './SearchView';
import { MOCK_ENTITIES } from '../../data/mockData';

// Mock the EntityCard component to simplify testing SearchView
vi.mock('./EntityCard', () => ({
  default: ({ entity, selected, toggleSelect }: any) => (
    <div
      data-testid={`entity-card-${entity.id}`}
      onClick={() => toggleSelect(entity.id)}
      data-selected={selected.includes(entity.id)}
    >
      {entity.name}
    </div>
  ),
}));

// Mock MapView component
vi.mock('../../components/MapView/MapView', () => ({
  default: ({ entities, selected, onToggleSelect, showPeople, showCompanies }: any) => (
    <div data-testid="mock-map-view">
      {/* Simulate rendering entities */}
      {entities.map((entity: any) => (
        <span key={entity.id} data-testid={`map-entity-${entity.id}`} data-selected={selected.includes(entity.id)}>
          {entity.name}
        </span>
      ))}
      <button onClick={() => showPeople(false)} data-testid="toggle-people">Toggle People</button>
      <button onClick={() => showCompanies(false)} data-testid="toggle-companies">Toggle Companies</button>
    </div>
  ),
}));


describe('SearchView', () => {
  const mockOnAction = vi.fn();

  beforeEach(() => {
    mockOnAction.mockClear();
  });

  it('renders the search input and hides results initially', () => {
    render(<SearchView onAction={mockOnAction} />);

    expect(screen.getByPlaceholderText('Describe your ideal lead...')).toBeInTheDocument(); // Updated placeholder
    expect(screen.queryByText('Search Results')).not.toBeInTheDocument(); // Updated text
    expect(screen.queryByText('People')).not.toBeInTheDocument();
    expect(screen.queryByText('Companies')).not.toBeInTheDocument();
    expect(screen.queryByText('Build Campaign')).not.toBeInTheDocument();
    
    // Check for suggested queries
    expect(screen.getByRole('button', { name: 'Find SaaS CEOs in Brazil' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Companies around me' })).toBeInTheDocument();
  });

  it('displays search results and view mode toggle after typing and pressing Enter', async () => {
    render(<SearchView onAction={mockOnAction} />);

    const searchInput = screen.getByPlaceholderText('Describe your ideal lead...'); // Updated placeholder
    fireEvent.change(searchInput, { target: { value: 'test' } });
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(screen.getByText('Search Results')).toBeInTheDocument(); // Updated text
      expect(screen.getByText(`${MOCK_ENTITIES.length} matches found`)).toBeInTheDocument(); // Updated text
      
      // Get the view mode toggle buttons more specifically
      // The parent div for toggle buttons is generic, so directly query buttons by aria-label
      expect(screen.getByRole('button', { name: 'List view' })).toBeInTheDocument(); // View mode toggle
      expect(screen.getByRole('button', { name: 'Map view' })).toBeInTheDocument(); // View mode toggle
      
      expect(screen.getByText(/People \(/i)).toBeInTheDocument(); // People section header
      expect(screen.getByText(/Companies \(/i)).toBeInTheDocument(); // Companies section header
    });

    MOCK_ENTITIES.filter(e => e.type === 'person').forEach(entity => {
      expect(screen.getByText(entity.name)).toBeInTheDocument();
    });
    MOCK_ENTITIES.filter(e => e.type === 'business').forEach(entity => {
      expect(screen.getByText(entity.name)).toBeInTheDocument();
    });
  });

  it('switches between list and map view modes', async () => {
    render(<SearchView onAction={mockOnAction} />);

    const searchInput = screen.getByPlaceholderText('Describe your ideal lead...');
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
        expect(screen.getByText('Search Results')).toBeInTheDocument();
        expect(screen.queryByTestId('mock-map-view')).not.toBeInTheDocument(); // Initially in list view
    });

    // Switch to map view
    fireEvent.click(screen.getByRole('button', { name: 'Map view' }));
    await waitFor(() => {
        expect(screen.getByTestId('mock-map-view')).toBeInTheDocument();
        expect(screen.queryByText(/People \(/i)).not.toBeInTheDocument(); // List view elements should be gone
    });

    // Switch back to list view
    fireEvent.click(screen.getByRole('button', { name: 'List view' }));
    await waitFor(() => {
        expect(screen.queryByTestId('mock-map-view')).not.toBeInTheDocument();
        expect(screen.getByText(/People \(/i)).toBeInTheDocument(); // List view elements should be back
    });
  });

  it('selects and deselects entities', async () => {
    render(<SearchView onAction={mockOnAction} />);

    const searchInput = screen.getByPlaceholderText('Describe your ideal lead...');
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' }); // Trigger search to show entities

    await waitFor(() => {
      expect(screen.getByText('Search Results')).toBeInTheDocument();
    });

    const elenaCard = screen.getByTestId(`entity-card-${MOCK_ENTITIES[0].id}`);
    const techflowCard = screen.getByTestId(`entity-card-${MOCK_ENTITIES[3].id}`);

    fireEvent.click(elenaCard);
    await waitFor(() => {
      expect(elenaCard).toHaveAttribute('data-selected', 'true');
      expect(screen.getByText('1 selected')).toBeInTheDocument();
      expect(screen.getByText('Build Campaign')).toBeInTheDocument();
    });

    fireEvent.click(techflowCard);
    await waitFor(() => {
      expect(techflowCard).toHaveAttribute('data-selected', 'true');
      expect(screen.getByText('2 selected')).toBeInTheDocument();
    });

    fireEvent.click(elenaCard);
    await waitFor(() => {
      expect(elenaCard).toHaveAttribute('data-selected', 'false');
      expect(screen.getByText('1 selected')).toBeInTheDocument();
    });
  });

  it('calls onAction with correct payload when Build Campaign is clicked', async () => {
    render(<SearchView onAction={mockOnAction} />);

    const searchInput = screen.getByPlaceholderText('Describe your ideal lead...');
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' }); // Trigger search

    await waitFor(() => {
      expect(screen.getByText('Search Results')).toBeInTheDocument();
    });

    const elenaCard = screen.getByTestId(`entity-card-${MOCK_ENTITIES[0].id}`);
    fireEvent.click(elenaCard); // Select an entity

    await waitFor(() => {
      expect(screen.getByText('Build Campaign')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Build Campaign'));
    expect(mockOnAction).toHaveBeenCalledTimes(1);
    expect(mockOnAction).toHaveBeenCalledWith('config', [MOCK_ENTITIES[0].id]);
  });
});
