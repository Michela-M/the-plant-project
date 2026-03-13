import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ButtonRadio from './ButtonRadio';
import { describe, it, vi, expect } from 'vitest';

const FakeIcon = () => <span data-testid="fake-icon">Icon</span>;

describe('ButtonRadio', () => {
  it('renders radios with provided icons', () => {
    const icons = [
      { Icon: FakeIcon, id: 1, label: 'Option 1' },
      { Icon: FakeIcon, id: 2, label: 'Option 2' },
      { Icon: FakeIcon, id: 3, label: 'Option 3' },
    ];

    render(
      <ButtonRadio
        icons={icons}
        selectedIndex={0}
        onChange={() => {}}
        groupLabel="Icon options"
      />
    );

    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(3);
    expect(screen.getAllByTestId('fake-icon')).toHaveLength(3);
    expect(screen.getByRole('radio', { name: 'Option 1' })).toBeInTheDocument();

    const radioNames = radios.map((radio) => radio.getAttribute('name'));
    expect(new Set(radioNames).size).toBe(1);
    expect(radioNames[0]).toMatch(/^button-radio-/);
  });

  it("renders radios with provided labels when icons aren't given", () => {
    const labels = ['Option 1', 'Option 2', 'Option 3'];

    render(
      <ButtonRadio
        labels={labels}
        selectedIndex={0}
        onChange={() => {}}
        groupLabel="Label options"
      />
    );

    labels.forEach((label) => {
      expect(screen.getByRole('radio', { name: label })).toBeInTheDocument();
    });
  });

  it('calls onChange with correct index when a button is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const labels = ['Option 1', 'Option 2', 'Option 3'];

    render(
      <ButtonRadio
        labels={labels}
        selectedIndex={0}
        onChange={onChange}
        groupLabel="Clickable options"
      />
    );

    const secondRadio = screen.getByRole('radio', { name: 'Option 2' });
    await user.click(secondRadio);

    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('calls onChange with correct index when an icon button is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const icons = [
      { Icon: FakeIcon, id: 1, label: 'Option 1' },
      { Icon: FakeIcon, id: 2, label: 'Option 2' },
      { Icon: FakeIcon, id: 3, label: 'Option 3' },
    ];

    render(
      <ButtonRadio
        icons={icons}
        selectedIndex={0}
        onChange={onChange}
        groupLabel="Clickable icon options"
      />
    );

    const secondRadio = screen.getByRole('radio', { name: 'Option 2' });
    await user.click(secondRadio);

    expect(onChange).toHaveBeenCalledWith(1);

    const radioNames = screen
      .getAllByRole('radio')
      .map((radio) => radio.getAttribute('name'));
    expect(new Set(radioNames).size).toBe(1);
    expect(radioNames[0]).toMatch(/^button-radio-/);
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
        groupLabel="Disabled options"
        disabled
      />
    );

    const radios = screen.getAllByRole('radio');
    radios.forEach((radio) => {
      expect(radio).toBeDisabled();

      const label = radio.closest('label');
      expect(label).toHaveClass('cursor-not-allowed');
    });

    await user.click(radios[1]);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('applies selected styles to the selected option', () => {
    const labels = ['Option 1', 'Option 2'];

    render(
      <ButtonRadio
        labels={labels}
        selectedIndex={1}
        onChange={() => {}}
        groupLabel="Selected options"
      />
    );

    const firstRadio = screen.getByRole('radio', { name: 'Option 1' });
    const secondRadio = screen.getByRole('radio', { name: 'Option 2' });

    const firstOption = firstRadio.closest('label');
    const secondOption = secondRadio.closest('label');

    expect(firstOption).toHaveClass('text-green-800');
    expect(secondOption).toHaveClass('bg-green-800', 'text-stone-50');
  });
});
