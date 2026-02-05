import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Link from './Link';

describe('Link component', () => {
  it('should render correctly', () => {
    render(<Link href="https://example.com">Example</Link>);

    const linkElement = document.querySelector('a');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', 'https://example.com');
    expect(linkElement).toHaveTextContent('Example');
  });
});
