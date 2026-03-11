import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ImagePicker from './ImagePicker';
import userEvent from '@testing-library/user-event';

describe('ImagePicker', () => {
  it('renders correctly', () => {
    render(<ImagePicker previewUrl={null} onSelect={() => {}} />);

    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /change picture/i })
    ).toBeInTheDocument();
    expect(img.alt).toBe('No image selected, showing placeholder');
  });

  it('displays the preview image when provided', () => {
    const previewUrl = 'blob:https://example.com/preview.jpg';
    render(<ImagePicker previewUrl={previewUrl} onSelect={() => {}} />);

    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img.src).toBe(previewUrl);
    expect(img.alt).toBe('Selected image preview');
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
    expect(img.src).toContain('/public/images/placeholder.jpg');
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

  it('returns null for unsafe URLs', () => {
    const { rerender } = render(
      <ImagePicker previewUrl="javascript:alert('XSS')" onSelect={() => {}} />
    );

    let img = screen.getByRole('img') as HTMLImageElement;
    expect(img.src).toContain('/public/images/placeholder.jpg');

    // Test another unsafe URL
    rerender(
      <ImagePicker
        previewUrl="data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K"
        onSelect={() => {}}
      />
    );
    img = screen.getByRole('img') as HTMLImageElement;
    expect(img.src).toContain('/public/images/placeholder.jpg');
  });
});
