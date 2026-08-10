import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import AlphabetNav from './AlphabetNav';

const mockTermsByLetter = {
  A: [
    {
      id: '1',
      term: 'Aerial roots',
      definition: 'Roots that grow above the ground.',
    },
  ],
  C: [
    { id: '2', term: 'Chlorophyll', definition: 'Green pigment in plants.' },
    { id: '3', term: 'Coco coir', definition: 'A natural growing medium.' },
  ],
};

describe('AlphabetNav', () => {
  it('renders letters based on provided termsByLetter prop', () => {
    render(<AlphabetNav termsByLetter={mockTermsByLetter} />);

    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
  });

  it('calls onClick with the correct letter when a letter is clicked', async () => {
    const user = userEvent.setup();
    render(<AlphabetNav termsByLetter={mockTermsByLetter} />);

    const letterA = screen.getByText('A');
    await user.click(letterA);

    expect(letterA).toHaveAttribute('href', '#A');
  });

  it('disables letters without terms', () => {
    render(<AlphabetNav termsByLetter={mockTermsByLetter} />);

    const letterB = screen.getByText('B');
    expect(letterB).toHaveClass('text-gray-400 cursor-not-allowed');
  });
});
