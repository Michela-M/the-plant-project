import { describe, it, expect } from 'vitest';
import { imageValidation } from './imageValidation';

describe('imageValidation', () => {
  it('should return null for valid image files', () => {
    const file = new File(['x'.repeat(1024 * 1024)], 'example.png', {
      type: 'image/png',
    });
    expect(imageValidation(file)).toBeNull();
  });

  it('should return an error message for non-image files', () => {
    const file = new File(['dummy content'], 'example.txt', {
      type: 'text/plain',
    });
    expect(imageValidation(file)).toBe('Invalid file type');
  });

  it('should return an error message for files larger than 5MB', () => {
    const file = new File(['x'.repeat(6 * 1024 * 1024)], 'example.png', {
      type: 'image/png',
    });
    expect(imageValidation(file)).toBe('File too large (max 5MB)');
  });
});
