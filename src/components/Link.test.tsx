import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Link from './Link';

describe('Link component', () => {
  it('should render correctly', () => {
    render(
      <MemoryRouter>
        <Link href="/test">Test Link</Link>
      </MemoryRouter>
    );

    const linkElement = document.querySelector('a');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', '/test');
    expect(linkElement).toHaveTextContent('Test Link');
  });
});
