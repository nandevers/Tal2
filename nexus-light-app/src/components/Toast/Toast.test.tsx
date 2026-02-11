// src/components/Toast/Toast.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Toast from './Toast';

describe('Toast', () => {
  it('does not render when visible is false', () => {
    const { container } = render(<Toast message="Test Message" visible={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders correctly when visible is true', () => {
    render(<Toast message="Test Message" visible={true} />);
    expect(screen.getByText('Test Message')).toBeInTheDocument();
    expect(screen.getByText('Test Message').closest('div')).toHaveClass('toast-enter');

  });

  it('displays the correct message', () => {
    render(<Toast message="Another Message" visible={true} />);
    expect(screen.getByText('Another Message')).toBeInTheDocument();
  });
});
