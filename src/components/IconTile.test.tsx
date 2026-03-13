import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import IconTile from './IconTile';

describe('IconTile', () => {
  it('renders correctly', () => {
    render(
      <IconTile
        Icon={() => <span data-testid="icon" />}
        color="blue"
        label="test"
      />
    );

    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('applies the correct color class', () => {
    render(<IconTile Icon={() => <span />} color="orange" label="test" />);

    const container = screen.getByTestId('icon-test');
    expect(container).toHaveClass('bg-orange-400');
  });

  it('defaults to black color when no color is provided', () => {
    render(<IconTile Icon={() => <span />} label="test" />);

    const container = screen.getByTestId('icon-test');
    expect(container).toHaveClass('bg-stone-950');
  });

  it('uses label for title and is hidden from assistive technology', () => {
    render(<IconTile Icon={() => <span />} color="blue" label="test-label" />);

    const container = screen.getByTestId('icon-test-label');
    expect(container).toHaveAttribute('title', 'test-label');
    expect(container).toHaveAttribute('aria-hidden', 'true');
    expect(container).toBeInTheDocument();
  });
});
