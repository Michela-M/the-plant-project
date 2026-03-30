import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import ComboBox, { type ComboBoxOption } from './ComboBox';
import { useState } from 'react';

const options: ComboBoxOption[] = [
  { id: '1', name: 'Option One' },
  { id: '2', name: 'Option Two' },
  { id: '3', name: 'Something Else' },
];

describe('ComboBox', () => {
  it('renders label and placeholder', () => {
    render(
      <ComboBox
        label="Test Label"
        options={options}
        placeholder="Select an option"
      />
    );

    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Select an option')).toBeInTheDocument();
  });

  it('filters options based on input value', async () => {
    function Wrapper() {
      const [value, setValue] = useState('');
      return <ComboBox options={options} value={value} onChange={setValue} />;
    }
    render(<Wrapper />);

    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'Option');

    expect(screen.getByText('Option One')).toBeInTheDocument();
    expect(screen.getByText('Option Two')).toBeInTheDocument();
    expect(screen.queryByText('Something Else')).not.toBeInTheDocument();
  });

  it('calls onChange and onSelectionChange when an option is selected', async () => {
    const handleChange = vi.fn();
    const handleSelectionChange = vi.fn();

    render(
      <ComboBox
        options={options}
        onChange={handleChange}
        onSelectionChange={handleSelectionChange}
      />
    );

    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'Option One');
    await userEvent.click(screen.getByText('Option One'));

    expect(handleChange).toHaveBeenCalledWith('Option One');
    expect(handleSelectionChange).toHaveBeenCalledWith({
      id: '1',
      name: 'Option One',
    });
  });

  it('calls onChange and onSelectionChange with empty values when cleared', async () => {
    const handleChange = vi.fn();
    const handleSelectionChange = vi.fn();

    render(
      <ComboBox
        options={options}
        onChange={handleChange}
        onSelectionChange={handleSelectionChange}
        value="Option One"
      />
    );

    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'Option One');
    const clearButton = screen.getByLabelText('Clear selection');
    await userEvent.click(clearButton);

    expect(handleChange).toHaveBeenCalledWith('');
    expect(handleSelectionChange).toHaveBeenCalledWith({
      id: null,
      name: '',
    });
  });

  it('closes the dropdown when an option is selected', async () => {
    render(<ComboBox options={options} />);

    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'Option One');
    await userEvent.click(screen.getByText('Option One'));

    expect(screen.queryByText('Option One')).not.toBeInTheDocument();
  });

  it('closes the dropdown when cleared', async () => {
    render(<ComboBox options={options} value="Option One" />);

    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'Option One');
    await userEvent.click(screen.getByLabelText('Clear selection'));

    expect(screen.queryByText('Option One')).not.toBeInTheDocument();
  });

  it('handles case-insensitive filtering', async () => {
    function Wrapper() {
      const [value, setValue] = useState('');
      return <ComboBox options={options} value={value} onChange={setValue} />;
    }
    render(<Wrapper />);

    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'option');

    expect(screen.getByText('Option One')).toBeInTheDocument();
    expect(screen.getByText('Option Two')).toBeInTheDocument();
    expect(screen.queryByText('Something Else')).not.toBeInTheDocument();
  });

  it('renders options with descriptions and images', async () => {
    const optionsWithDetails: ComboBoxOption[] = [
      {
        id: '1',
        name: 'Option One',
        description: 'This is the first option',
        image: 'https://via.placeholder.com/40',
      },
    ];

    render(<ComboBox options={optionsWithDetails} />);

    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'Option One');

    expect(screen.getByText('This is the first option')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Option One' })).toHaveAttribute(
      'src',
      'https://via.placeholder.com/40'
    );
  });

  it('does not allow interaction when readOnly is true', async () => {
    const handleChange = vi.fn();
    const handleSelectionChange = vi.fn();

    render(
      <ComboBox
        options={options}
        onChange={handleChange}
        onSelectionChange={handleSelectionChange}
        readOnly
      />
    );

    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'Option One');

    expect(handleChange).not.toHaveBeenCalled();
    expect(handleSelectionChange).not.toHaveBeenCalled();
  });
});
