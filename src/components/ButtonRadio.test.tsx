import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ButtonRadio from './ButtonRadio';
import { describe, it, vi, expect } from 'vitest';

// A simple fake icon component for testing
function FakeIcon({ color }: { color: string }) {
  return <svg data-testid={`icon-${color}`} />;
}

describe('ButtonRadio', () => {
  it('calls onChange with the correct index when clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    const icons = [
      { Icon: FakeIcon, id: 1 },
      { Icon: FakeIcon, id: 2 },
      { Icon: FakeIcon, id: 3 },
    ];

    render(
      <ButtonRadio icons={icons} selectedIndex={0} onChange={handleChange} />
    );

    await user.click(screen.getAllByTestId(/icon/)[1]);

    expect(handleChange).toHaveBeenCalledWith(1);
  });

  it('applies green color to the selected icon and grey to others', () => {
    const icons = [
      { Icon: FakeIcon, id: 1 },
      { Icon: FakeIcon, id: 2 },
    ];

    render(<ButtonRadio icons={icons} selectedIndex={1} onChange={() => {}} />);

    // Selected icon should be green
    expect(screen.getByTestId('icon-#166534')).toBeInTheDocument();

    // Non-selected icon should be grey
    expect(screen.getByTestId('icon-#9CA3AF')).toBeInTheDocument();
  });

  it('adds border classes to the selected icon container', () => {
    const icons = [
      { Icon: FakeIcon, id: 1 },
      { Icon: FakeIcon, id: 2 },
    ];

    render(<ButtonRadio icons={icons} selectedIndex={1} onChange={() => {}} />);

    const containers = screen.getAllByRole('button', { hidden: true });

    expect(containers[1].className).toContain('border-green-800');
    expect(containers[0].className).not.toContain('border-green-800');
  });
});
