import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CharacteristicBadge from './CharacteristicBadge';

describe('CharacteristicBadge', () => {
  it.each([
    {
      label: 'difficulty' as const,
      value: 1,
      text: 'Beginner-friendly',
      colorClass: 'bg-lime-400',
    },
    {
      label: 'maintenance' as const,
      value: 2,
      text: 'Moderate maintenance',
      colorClass: 'bg-yellow-400',
    },
    {
      label: 'light' as const,
      value: 3,
      text: 'Bright direct light',
      colorClass: 'bg-yellow-400',
    },
    {
      label: 'pruning' as const,
      value: 2,
      text: 'Occasional pruning recommended',
      colorClass: 'bg-yellow-400',
    },
    {
      label: 'propagation' as const,
      value: 1,
      text: 'Propagates easily',
      colorClass: 'bg-lime-400',
    },
    {
      label: 'toxicity' as const,
      value: 3,
      text: 'Toxic to pets & humans',
      colorClass: 'bg-red-400',
    },
  ])(
    'renders mapped badge for $label (value: $value)',
    ({ label, value, text, colorClass }) => {
      render(<CharacteristicBadge label={label} value={value} />);

      const iconTile = screen.getByTestId(`icon-${label}`);
      expect(screen.getByText(text)).toBeInTheDocument();
      expect(iconTile).toHaveClass(colorClass);
      expect(iconTile).toHaveAttribute('title', label);
      expect(iconTile).toHaveAttribute('aria-hidden', 'true');
    }
  );

  it('renders toxicity badge when value is 0', () => {
    render(<CharacteristicBadge label="toxicity" value={0} />);

    expect(screen.getByText('Non-toxic')).toBeInTheDocument();
    expect(screen.getByTestId('icon-toxicity')).toHaveClass('bg-lime-400');
  });

  it('does not render non-toxicity badges when value is 0', () => {
    const { container } = render(
      <CharacteristicBadge label="difficulty" value={0} />
    );

    expect(container.firstChild).toBeNull();
    expect(screen.queryByTestId('icon-difficulty')).not.toBeInTheDocument();
  });

  it('normalizes out-of-range positive values to 0', () => {
    const { container } = render(
      <CharacteristicBadge label="maintenance" value={99} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('normalizes negative values to 0', () => {
    render(<CharacteristicBadge label="toxicity" value={-5} />);

    expect(screen.getByText('Non-toxic')).toBeInTheDocument();
    expect(screen.getByTestId('icon-toxicity')).toHaveClass('bg-lime-400');
  });
});
