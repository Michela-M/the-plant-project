import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Spinner, { InlineSpinner } from './Spinner';

describe('Spinner', () => {
  it('renders the loading text and spinner classes', () => {
    const { container } = render(<Spinner />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute('class')).toContain('animate-spin');
    expect(svg?.getAttribute('class')).toContain('text-green-800');
  });
});

describe('InlineSpinner', () => {
  it('renders with the default color', () => {
    const { container } = render(<InlineSpinner />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute('class')).toContain('text-green-800');
  });

  it('renders with a custom color', () => {
    const { container } = render(<InlineSpinner color="red-800" />);

    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute('class')).toContain('text-red-800');
  });
});
