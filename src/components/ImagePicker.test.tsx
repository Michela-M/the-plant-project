import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ImagePicker from './ImagePicker';
import userEvent from '@testing-library/user-event';

describe('ImagePicker', () => {
  const pickerLabel = 'Plant image';

  it('renders correctly', () => {
    render(
      <ImagePicker previewUrl={null} onSelect={() => {}} label={pickerLabel} />
    );

    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: `Upload ${pickerLabel}` })
    ).toBeInTheDocument();
    expect(img).toHaveAttribute('alt', 'No image selected');
    expect(screen.getByText(pickerLabel, { selector: 'legend' })).toHaveClass(
      'sr-only'
    );
    expect(screen.getByText('Upload image')).toBeInTheDocument();
  });

  it('displays the preview image when provided', () => {
    const previewUrl = 'blob:https://example.com/preview.jpg';
    render(
      <ImagePicker
        previewUrl={previewUrl}
        onSelect={() => {}}
        label={pickerLabel}
      />
    );

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', previewUrl);
    expect(img).toHaveAttribute('alt', 'Selected image preview');
  });

  it('calls onSelect when a file is selected', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(
      <ImagePicker
        previewUrl={null}
        onSelect={handleSelect}
        label={pickerLabel}
      />
    );

    const input = screen.getByTestId('file-input');

    const file = new File(['hello'], 'test.png', { type: 'image/png' });

    await user.upload(input, file);

    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith(file);
  });

  it('displays placeholder image when no previewUrl is provided', () => {
    render(
      <ImagePicker previewUrl={null} onSelect={() => {}} label={pickerLabel} />
    );

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute(
      'src',
      expect.stringContaining('/public/images/placeholder.jpg')
    );
  });

  it('triggers file input click when button is clicked', () => {
    render(
      <ImagePicker previewUrl={null} onSelect={() => {}} label={pickerLabel} />
    );

    const button = screen.getByRole('button', {
      name: `Upload ${pickerLabel}`,
    });
    const input = screen.getByTestId('file-input');

    // Spy on the click event of the input
    const clickSpy = vi.spyOn(input, 'click');
    button.click();

    expect(clickSpy).toHaveBeenCalled();
    expect(button).toHaveAttribute('aria-controls', input.id);
  });

  it('accepts only image files', () => {
    render(
      <ImagePicker previewUrl={null} onSelect={() => {}} label={pickerLabel} />
    );

    const input = screen.getByTestId('file-input');
    expect(input).toHaveAttribute('accept', 'image/png, image/jpeg');
  });

  it('returns null for unsafe URLs', () => {
    const { rerender } = render(
      <ImagePicker
        previewUrl="javascript:alert('XSS')"
        onSelect={() => {}}
        label={pickerLabel}
      />
    );

    let img = screen.getByRole('img');
    expect(img).toHaveAttribute(
      'src',
      expect.stringContaining('/public/images/placeholder.jpg')
    );

    // Test another unsafe URL
    rerender(
      <ImagePicker
        previewUrl="data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K"
        onSelect={() => {}}
        label={pickerLabel}
      />
    );
    img = screen.getByRole('img');
    expect(img).toHaveAttribute(
      'src',
      expect.stringContaining('/public/images/placeholder.jpg')
    );
  });
});
