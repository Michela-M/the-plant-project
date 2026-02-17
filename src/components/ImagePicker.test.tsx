import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ImagePicker from './ImagePicker';
import userEvent from '@testing-library/user-event';

describe('ImagePicker', () => {
  it('renders correctly', () => {
    render(<ImagePicker previewUrl={null} onSelect={() => {}} />);

    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /change picture/i })
    ).toBeInTheDocument();
  });

  it('displays the preview image when provided', () => {
    const previewUrl = 'blob:https://example.com/preview.jpg';
    render(<ImagePicker previewUrl={previewUrl} onSelect={() => {}} />);

    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img.src).toBe(previewUrl);
  });

  it('calls onSelect when a file is selected', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(<ImagePicker previewUrl={null} onSelect={handleSelect} />);

    const input = screen.getByTestId('file-input') as HTMLInputElement;

    const file = new File(['hello'], 'test.png', { type: 'image/png' });

    await user.upload(input, file);

    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith(file);
  });

  it('displays placeholder image when no previewUrl is provided', () => {
    render(<ImagePicker previewUrl={null} onSelect={() => {}} />);

    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img.src).toBe(
      'https://larchcottage.co.uk/wp-content/uploads/2024/05/placeholder.jpg'
    );
  });

  it('triggers file input click when button is clicked', () => {
    render(<ImagePicker previewUrl={null} onSelect={() => {}} />);

    const button = screen.getByRole('button', { name: /change picture/i });
    const input = screen.getByTestId('file-input') as HTMLInputElement;

    // Spy on the click event of the input
    const clickSpy = vi.spyOn(input, 'click');
    button.click();

    expect(clickSpy).toHaveBeenCalled();
  });

  it('accepts only image files', () => {
    render(<ImagePicker previewUrl={null} onSelect={() => {}} />);

    const input = screen.getByTestId('file-input') as HTMLInputElement;
    expect(input.accept).toBe('image/png, image/jpeg');
  });
});
