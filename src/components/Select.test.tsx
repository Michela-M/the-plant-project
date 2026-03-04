import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import Select from './Select';

describe('Select', () => {
  it('renders label and default placeholder option', () => {
    render(
      <Select
        id="plant"
        label="Plant"
        name="plant"
        options={['Monstera', 'Ficus']}
        onSelect={() => {}}
      />
    );

    expect(screen.getByLabelText('Plant')).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'Select an option' })
    ).toBeInTheDocument();
  });

  it('renders provided options', () => {
    render(
      <Select
        id="plant"
        label="Plant"
        options={['Monstera', 'Ficus']}
        onSelect={() => {}}
      />
    );

    expect(
      screen.getByRole('option', { name: 'Monstera' })
    ).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Ficus' })).toBeInTheDocument();
  });

  it('calls onSelect when a new option is selected', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <Select
        id="plant"
        label="Plant"
        options={['Monstera', 'Ficus']}
        onSelect={onSelect}
      />
    );

    await user.selectOptions(screen.getByLabelText('Plant'), 'Ficus');

    expect(onSelect).toHaveBeenCalledWith('Ficus');
  });

  it('uses value for controlled selection', () => {
    render(
      <Select
        id="plant"
        label="Plant"
        options={['Monstera', 'Ficus']}
        value="Monstera"
        onSelect={() => {}}
      />
    );

    expect(screen.getByLabelText('Plant')).toHaveValue('Monstera');
  });

  it('calls onBlur when the select loses focus', async () => {
    const user = userEvent.setup();
    const onBlur = vi.fn();

    render(
      <>
        <Select
          id="plant"
          label="Plant"
          options={['Monstera', 'Ficus']}
          onSelect={() => {}}
          onBlur={onBlur}
        />
        <button type="button">Next</button>
      </>
    );

    await user.click(screen.getByLabelText('Plant'));
    await user.click(screen.getByRole('button', { name: 'Next' }));

    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('displays error message when error prop is provided', () => {
    render(
      <Select
        id="plant"
        label="Plant"
        options={['Monstera', 'Ficus']}
        onSelect={() => {}}
        error="Plant is required"
      />
    );

    expect(screen.getByText('Plant is required')).toBeInTheDocument();
  });

  it('uses id for htmlFor/id association', () => {
    render(
      <Select
        id="plant-id"
        label="Plant"
        name="plant-name"
        options={['Monstera']}
        onSelect={() => {}}
      />
    );

    const select = screen.getByLabelText('Plant');
    expect(select).toHaveAttribute('id', 'plant-id');
    expect(select).toHaveAttribute('name', 'plant-name');
  });
});
