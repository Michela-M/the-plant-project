import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Link from './Link';

describe('Link component', () => {
  it('renders an internal link without external attributes', () => {
    render(
      <MemoryRouter>
        <Link href="/test">Test Link</Link>
      </MemoryRouter>
    );

    const linkElement = screen.getByRole('link', { name: 'Test Link' });
    expect(linkElement).toHaveAttribute('href', '/test');
    expect(linkElement).not.toHaveAttribute('target');
    expect(linkElement).not.toHaveAttribute('rel');
  });

  it('renders external links with security attributes and sr-only hint', () => {
    render(
      <MemoryRouter>
        <Link href="https://example.com">External Docs</Link>
      </MemoryRouter>
    );

    const linkElement = screen.getByRole('link', {
      name: /external docs/i,
    });

    expect(linkElement).toHaveAttribute('href', 'https://example.com');
    expect(linkElement).toHaveAttribute('target', '_blank');
    expect(linkElement).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByText('(opens in new tab)')).toHaveClass('sr-only');
  });
});
