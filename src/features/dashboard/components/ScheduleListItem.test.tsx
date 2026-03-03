import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ScheduleListItem from './ScheduleListItem';

describe('ScheduleListItem', () => {
  it('renders correctly', () => {
    render(
      <ScheduleListItem
        name="My Monstera"
        species="Monstera Deliciosa"
        wateringFrequency={7}
        inferredWateringFrequency={8}
        imageUrl="https://example.com/monstera.jpg"
      />
    );

    expect(screen.getByText('My Monstera')).toBeInTheDocument();
    expect(screen.getByText('Monstera Deliciosa')).toBeInTheDocument();
    expect(screen.getByTestId('watering-frequency')).toHaveTextContent(
      'Watering frequency: 7 days'
    );

    const img = screen.getByAltText('My Monstera image') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toBe('https://example.com/monstera.jpg');
  });

  it('shows estimated watering frequency when watering frequency is 0', () => {
    render(
      <ScheduleListItem
        name="My Monstera"
        species="Monstera Deliciosa"
        wateringFrequency={0}
        inferredWateringFrequency={8}
        imageUrl="https://example.com/monstera.jpg"
      />
    );

    expect(
      screen.getByTestId('estimated-watering-frequency')
    ).toHaveTextContent('Estimated watering frequency: 8 days');
  });

  it("shows 'N/A' when estimated watering frequency is missing", () => {
    render(
      <ScheduleListItem
        name="My Monstera"
        species="Monstera Deliciosa"
        wateringFrequency={0}
        inferredWateringFrequency={null}
        imageUrl="https://example.com/monstera.jpg"
      />
    );

    expect(
      screen.getByTestId('estimated-watering-frequency')
    ).toHaveTextContent('Estimated watering frequency: N/A');
    expect(
      screen.getByTestId('estimated-watering-frequency')
    ).not.toHaveTextContent('null days');
  });

  it('uses placeholder image when imageUrl is not provided', () => {
    render(
      <ScheduleListItem
        name="My Monstera"
        species="Monstera Deliciosa"
        wateringFrequency={7}
        inferredWateringFrequency={8}
        imageUrl={null}
      />
    );

    const img = screen.getByAltText('My Monstera image') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toBe(
      'https://larchcottage.co.uk/wp-content/uploads/2024/05/placeholder.jpg'
    );
  });
});
