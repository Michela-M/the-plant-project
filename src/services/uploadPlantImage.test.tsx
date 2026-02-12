import { describe, it, expect, vi } from 'vitest';
import { uploadPlantImage } from './uploadPlantImage';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
    (ref as any).mockReturnValue(mockRef);
    (uploadBytes as any).mockResolvedValue({ ref: mockRef });
    (getDownloadURL as any).mockResolvedValue('mocked-url');

    const result = await uploadPlantImage(file, id);

    expect(result).toBe('mocked-url');
  });
});
