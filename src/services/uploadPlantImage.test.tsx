import { describe, it, expect, vi } from 'vitest';
import { uploadPlantImage } from './uploadPlantImage';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { Mock } from 'vitest';

// --- Mock Firebase Storage ---
vi.mock('firebase/storage', () => ({
  ref: vi.fn(),
  uploadBytes: vi.fn(),
  getDownloadURL: vi.fn(),
}));

vi.mock('../firebase', () => ({
  storage: {},
}));

describe('uploadPlantImage', () => {
  it('should upload an image and return the URL', async () => {
    const file = new File(['dummy content'], 'example.png', {
      type: 'image/png',
    });
    const id = '123';

    const mockRef = {};
    (ref as Mock).mockReturnValue(mockRef);
    (uploadBytes as Mock).mockResolvedValue({ ref: mockRef });
    (getDownloadURL as Mock).mockResolvedValue('mocked-url');

    const result = await uploadPlantImage(file, id);

    expect(result).toBe('mocked-url');
  });

  it('should throw an error for invalid image', async () => {
    const file = new File(['dummy content'], 'example.txt', {
      type: 'text/plain',
    });
    const id = '123';

    await expect(uploadPlantImage(file, id)).rejects.toThrow(
      'Invalid file type'
    );
  });

  it('should throw an error for oversized image', async () => {
    const largeContent = new Array(6 * 1024 * 1024).fill('a').join('');
    const file = new File([largeContent], 'large.png', {
      type: 'image/png',
    });
    const id = '123';

    await expect(uploadPlantImage(file, id)).rejects.toThrow(
      'File too large (max 5MB)'
    );
  });
});
