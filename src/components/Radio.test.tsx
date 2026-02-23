import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import RadioGroup, { RadioButton } from './Radio';

describe('Radio', () => {
  it('renders RadioGroup and RadioButton components', () => {
    // Test implementation will go here
    render(
      <RadioGroup label="Test Group">
        <RadioButton
          label="Option 1"
          value="option1"
          checked={false}
          onChange={() => {}}
        />
      </RadioGroup>
    );

    expect(screen.getByLabelText('Test Group radio group')).toBeInTheDocument();
    expect(screen.getByLabelText('Option 1')).toBeInTheDocument();
  });

  it('handles onChange events correctly', () => {
    const handleChange = vi.fn();
    render(
      <RadioGroup label="Test Group">
        <RadioButton
          label="Option 1"
          value="option1"
          checked={true}
          onChange={() => {
            handleChange('option1');
          }}
        />
        <RadioButton
          label="Option 2"
          value="option2"
          checked={false}
          onChange={() => {
            handleChange('option2');
          }}
        />
      </RadioGroup>
    );

    const option2 = screen.getByLabelText('Option 2');
    option2.click();
    expect(handleChange).toHaveBeenCalledWith('option2');
  });

  it('applies disabled styles correctly', () => {
    render(
      <RadioGroup label="Test Group">
        <RadioButton
          label="Option 1"
          value="option1"
          checked={false}
          onChange={() => {}}
          disabled
        />
      </RadioGroup>
    );

    const option1 = screen.getByLabelText('Option 1');
    expect(option1).toBeDisabled();
    expect(option1).toHaveClass('cursor-not-allowed');
  });

  it('applies checked styles correctly', () => {
    render(
      <RadioGroup label="Test Group">
        <RadioButton
          label="Option 1"
          value="option1"
          checked={true}
          onChange={() => {}}
        />
      </RadioGroup>
    );

    const option1 = screen.getByLabelText('Option 1');
    expect(option1).toBeChecked();
  });

  it('renders RadioGroup without a label', () => {
    render(
      <RadioGroup>
        <RadioButton
          label="Option 1"
          value="option1"
          checked={false}
          onChange={() => {}}
        />
      </RadioGroup>
    );

    const radioGroup = screen.getByLabelText('Radio group');
    expect(radioGroup).toBeInTheDocument();
  });

  it('renders RadioGroup with horizontal layout', () => {
    render(
      <RadioGroup label="Test Group" layout="horizontal">
        <RadioButton
          label="Option 1"
          value="option1"
          checked={false}
          onChange={() => {}}
        />
      </RadioGroup>
    );

    const radioGroup = screen.getByLabelText('Test Group radio group');
    const layoutContainer = radioGroup.children.item(1);

    expect(layoutContainer).not.toBeNull();
    expect(layoutContainer).toHaveClass('flex', 'flex-row');
  });

  it('renders RadioGroup with vertical layout', () => {
    render(
      <RadioGroup label="Test Group" layout="vertical">
        <RadioButton
          label="Option 1"
          value="option1"
          checked={false}
          onChange={() => {}}
        />
      </RadioGroup>
    );

    const radioGroup = screen.getByLabelText('Test Group radio group');
    const layoutContainer = radioGroup.children.item(1);

    expect(layoutContainer).not.toBeNull();
    expect(layoutContainer).toHaveClass('flex', 'flex-col');
  });
});
