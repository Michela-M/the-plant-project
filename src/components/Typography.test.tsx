import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { H1, H2, H3, Headline, Callout, Caption } from './Typography';

describe('Typography components', () => {
  it('renders H1 as an h1 element with the correct class', () => {
    render(<H1>Plant Collection</H1>);

    const heading = screen.getByRole('heading', {
      level: 1,
      name: 'Plant Collection',
    });

    expect(heading).toBeInTheDocument();
    expect(heading.className).toContain('text-3xl');
  });

  it('renders H2 as an h2 element with the correct class', () => {
    render(<H2>Overview</H2>);

    const heading = screen.getByRole('heading', {
      level: 2,
      name: 'Overview',
    });

    expect(heading).toBeInTheDocument();
    expect(heading.className).toContain('text-2xl');
  });

  it('renders H3 as an h3 element with the correct class', () => {
    render(<H3>Care Tips</H3>);

    const heading = screen.getByRole('heading', {
      level: 3,
      name: 'Care Tips',
    });

    expect(heading).toBeInTheDocument();
    expect(heading.className).toContain('text-xl');
  });

  it('renders Headline as a paragraph with bold large text', () => {
    render(<Headline>Water your monstera weekly.</Headline>);

    const text = screen.getByText('Water your monstera weekly.');

    expect(text.tagName).toBe('P');
    expect(text.className).toContain('text-lg');
    expect(text.className).toContain('font-bold');
  });

  it('renders Callout as a paragraph with small text', () => {
    render(<Callout>Place in bright indirect light.</Callout>);

    const text = screen.getByText('Place in bright indirect light.');

    expect(text.tagName).toBe('P');
    expect(text.className).toContain('text-sm');
  });

  it('renders Caption as a paragraph with extra-small text', () => {
    render(<Caption>Updated 2 days ago</Caption>);

    const text = screen.getByText('Updated 2 days ago');

    expect(text.tagName).toBe('P');
    expect(text.className).toContain('text-xs');
  });

  it('forwards additional html attributes to the rendered element', () => {
    render(
      <Callout id="watering-note" data-testid="watering-note">
        Keep soil slightly moist.
      </Callout>
    );

    const text = screen.getByTestId('watering-note');

    expect(text).toHaveAttribute('id', 'watering-note');
  });

  it('merges default and custom className for Callout', () => {
    render(
      <Callout className="text-stone-600" data-testid="callout">
        Snake Plant
      </Callout>
    );

    const text = screen.getByTestId('callout');

    expect(text.className).toContain('text-sm');
    expect(text.className).toContain('text-stone-600');
  });
});
