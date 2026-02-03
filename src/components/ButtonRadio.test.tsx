import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ButtonRadio from './ButtonRadio';
import { describe, it, vi, expect } from 'vitest';

const FakeIcon = () => <span data-testid="fake-icon">Icon</span>;

describe('ButtonRadio', () => {
  it('renders buttons with provided icons', () => {
    const icons = [
      { Icon: FakeIcon, id: 1 },
      { Icon: FakeIcon, id: 2 },
      { Icon: FakeIcon, id: 3 },
    ];

    render(<ButtonRadio icons={icons} selectedIndex={0} onChange={() => {}} />);

    const buttons = screen.getAllByRole('tab');
    expect(buttons).toHaveLength(3);
    buttons.forEach((button) => {
      expect(
        button.querySelector('[data-testid="fake-icon"]')
      ).toBeInTheDocument();
    });
  });

  it("renders buttons with provided labels when icons aren't given", () => {
    const labels = ['Option 1', 'Option 2', 'Option 3'];

    render(
      <ButtonRadio labels={labels} selectedIndex={0} onChange={() => {}} />
    );

    labels.forEach((label) => {
      expect(screen.getByRole('tab', { name: label })).toBeInTheDocument();
    });
  });

  it('calls onChange with correct index when a button is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const labels = ['Option 1', 'Option 2', 'Option 3'];

    render(
      <ButtonRadio labels={labels} selectedIndex={0} onChange={onChange} />
    );

    const secondButton = screen.getByRole('tab', { name: 'Option 2' });
    await user.click(secondButton);

    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('applies disabled styles and prevents interaction when disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const labels = ['Option 1', 'Option 2'];

    render(
      <ButtonRadio
        labels={labels}
        selectedIndex={0}
        onChange={onChange}
        disabled
      />
    );

    const buttons = screen.getAllByRole('tab');
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
      expect(button).toHaveClass('cursor-not-allowed');
    });

    await user.click(buttons[1]);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('applies selected styles to the selected button', () => {
    const labels = ['Option 1', 'Option 2'];

    render(
      <ButtonRadio labels={labels} selectedIndex={1} onChange={() => {}} />
    );

    const firstButton = screen.getByRole('tab', { name: 'Option 1' });
    const secondButton = screen.getByRole('tab', { name: 'Option 2' });

    expect(firstButton).toHaveClass('text-green-800');
    expect(secondButton).toHaveClass('bg-green-800', 'text-stone-50');
  });
});
