import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import IconComponent from './IconComponent';

describe('IconComponent', () => {
  // Mock console.warn to check if it's called
  const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

  afterEach(() => {
    consoleWarnSpy.mockClear();
  });

  it('renders the correct Lucide icon', () => {
    const { container } = render(<IconComponent name="mail" />);
    const mailIcon = container.querySelector('svg'); // Query by tag name
    expect(mailIcon).toBeInTheDocument();
    expect(mailIcon).toHaveClass('lucide');
    expect(mailIcon).toHaveClass('lucide-mail');

    // Test another icon
    const { container: container2 } = render(<IconComponent name="search" />);
    const searchIcon = container2.querySelector('svg');
    expect(searchIcon).toBeInTheDocument();
    expect(searchIcon).toHaveClass('lucide-search');
  });

  it('passes size and className props to the icon', () => {
    const { container } = render(<IconComponent name="users" size={24} className="test-class" />);
    const usersIcon = container.querySelector('svg');
    expect(usersIcon).toHaveAttribute('width', '24');
    expect(usersIcon).toHaveAttribute('height', '24');
    expect(usersIcon).toHaveClass('test-class');
  });

  it('handles unknown icon names gracefully', () => {
    const { container } = render(<IconComponent name="unknown-icon" />);
    expect(container).toBeEmptyDOMElement(); // Expect nothing to be rendered
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    expect(consoleWarnSpy).toHaveBeenCalledWith('Icon "unknown-icon" not found in iconMap.');
  });

  it('uses default size if not provided', () => {
    const { container } = render(<IconComponent name="plus" />);
    const plusIcon = container.querySelector('svg');
    expect(plusIcon).toHaveAttribute('width', '18'); // Default size is 18
    expect(plusIcon).toHaveAttribute('height', '18');
  });
});
