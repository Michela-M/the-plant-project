import { render, screen } from '@testing-library/react';
import Tag from './Tag';
import { describe, it, expect } from 'vitest';

describe('Tag component', () => {
  it('renders the label', () => {
    render(<Tag label="Low Maintenance" />);
    expect(screen.getByText('Low Maintenance')).toBeInTheDocument();
  });

  it('applies the correct color classes for the given color', () => {
    render(<Tag label="Air Purifying" color="blue" />);

    const tag = screen.getByText('Air Purifying');

    expect(tag.className).toContain('bg-blue-100');
    expect(tag.className).toContain('text-blue-700');
  });

  it('falls back to grey when no color is provided', () => {
    render(<Tag label="Drought Tolerant" />);

    const tag = screen.getByText('Drought Tolerant');

    expect(tag.className).toContain('bg-stone-200');
    expect(tag.className).toContain('text-stone-700');
  });
});
