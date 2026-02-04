import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import TextField from './TextField';

describe('TextField', () => {
  it('renders correctly with given props', () => {
    render(
      <TextField
        label="Name"
        placeholder="Enter your name"
        helperText="Please enter your full name."
      />
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
    expect(
      screen.getByText('Please enter your full name.')
    ).toBeInTheDocument();
  });

  it('applies disabled styles when disable is true', () => {
    render(
      <TextField
        label="Name"
        placeholder="Enter your name"
        helperText="Please enter your full name."
        disabled
      />
    );

    const input = screen.getByPlaceholderText('Enter your name');
    expect(input).toBeDisabled();
    expect(screen.getByText('Name')).toHaveClass('text-stone-400');
    expect(screen.getByText('Please enter your full name.')).toHaveClass(
      'text-stone-400'
    );
  });

  it('shows icon when provided', () => {
    render(
      <TextField
        label="Name"
        placeholder="Enter your name"
        helperText="Please enter your full name."
        icon={<span data-testid="test-icon">Icon</span>}
      />
    );

    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('uses label as placeholder when placeholder is not provided', () => {
    render(
      <TextField label="Name" helperText="Please enter your full name." />
    );

    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
  });
});
