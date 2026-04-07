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
      iconTitle: 'star-1',
    },
    {
      label: 'difficulty' as const,
      value: 2,
      text: 'Intermediate care',
      colorClass: 'bg-blue-400',
      iconTitle: 'star-2',
    },
    {
      label: 'difficulty' as const,
      value: 3,
      text: 'Expert level recommended',
      colorClass: 'bg-red-400',
      iconTitle: 'star-3',
    },
    {
      label: 'maintenance' as const,
      value: 2,
      text: 'Moderate maintenance',
      colorClass: 'bg-yellow-400',
      iconTitle: 'wrench',
    },
    {
      label: 'light' as const,
      value: 1,
      text: 'Low light',
      colorClass: 'bg-blue-400',
      iconTitle: 'sun-dim',
    },
    {
      label: 'light' as const,
      value: 2,
      text: 'Bright indirect light',
      colorClass: 'bg-orange-400',
      iconTitle: 'sun-medium',
    },
    {
      label: 'light' as const,
      value: 3,
      text: 'Bright direct light',
      colorClass: 'bg-yellow-400',
      iconTitle: 'sun',
    },
    {
      label: 'pruning' as const,
      value: 2,
      text: 'Occasional pruning recommended',
      colorClass: 'bg-yellow-400',
      iconTitle: 'secateurs',
    },
    {
      label: 'propagation' as const,
      value: 1,
      text: 'Propagates easily',
      colorClass: 'bg-lime-400',
      iconTitle: 'plant-flask',
    },
    {
      label: 'toxicity' as const,
      value: 0,
      text: 'Non-toxic',
      colorClass: 'bg-lime-400',
      iconTitle: 'cat',
    },
    {
      label: 'toxicity' as const,
      value: 1,
      text: 'Toxic to pets',
      colorClass: 'bg-stone-950',
      iconTitle: 'skull',
    },
    {
      label: 'toxicity' as const,
      value: 2,
      text: 'Toxic to humans',
      colorClass: 'bg-stone-950',
      iconTitle: 'skull',
    },
    {
      label: 'toxicity' as const,
      value: 3,
      text: 'Toxic to pets & humans',
      colorClass: 'bg-red-400',
      iconTitle: 'skull',
    },
  ])(
    'renders mapped badge for $label (value: $value)',
    ({ label, value, text, colorClass, iconTitle }) => {
      render(<CharacteristicBadge label={label} value={value} />);
      const iconTile = screen.getByTestId(`icon-${label}`);
      expect(screen.getByText(text)).toBeInTheDocument();
      expect(iconTile).toHaveClass(colorClass);
      expect(iconTile).toHaveAttribute('title', label);
      expect(iconTile).toHaveAttribute('aria-hidden', 'true');

      const svg = iconTile.querySelector('svg');
      if (svg) {
        // Try to match <title> if present
        const title = svg.querySelector('title');
        if (title) {
          expect(title.textContent?.toLowerCase()).toContain(iconTitle);
        } else {
          // Fallback: check SVG className or outerHTML for iconTitle
          expect(svg.outerHTML.toLowerCase()).toContain(iconTitle);
        }
      } else {
        throw new Error('No SVG icon rendered in IconTile');
      }
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
