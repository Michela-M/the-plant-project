import { useRef, useEffect } from 'react';
import Button from './Button';
import { useState } from 'react';

export default function ImagePicker({
  previewUrl,
  onSelect,
}: {
  previewUrl: string | null;
  onSelect: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const focusListenerRef = useRef<(() => void) | null>(null);

  const isSafeImageUrl = (url: string | null): string | null => {
    if (!url) return null;
    try {
      const parsed = new URL(url, window.location.origin);
      const allowedSchemes = ['http:', 'https:', 'blob:'];
      if (!allowedSchemes.includes(parsed.protocol)) {
        return null;
      }
      return url;
    } catch {
      return null;
    }
  };

  const clearFocusListener = () => {
    if (focusListenerRef.current) {
      window.removeEventListener('focus', focusListenerRef.current);
      focusListenerRef.current = null;
    }
  };

  const safeUrl = isSafeImageUrl(previewUrl);

  useEffect(() => {
    return clearFocusListener;
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div className="aspect-square overflow-hidden object-cover w-full">
        <img
          className="aspect-square object-cover w-full"
          src={
            safeUrl ||
            'https://larchcottage.co.uk/wp-content/uploads/2024/05/placeholder.jpg'
          }
          alt="Plant preview"
        />
      </div>

      <Button
        label="Change picture"
        variant="outlined"
        size="sm"
        onClick={() => {
          setLoading(true);
          
          // Clear any existing focus listener before adding a new one
          clearFocusListener();
          
          // Add focus listener to detect when file picker closes
          const handleFocus = () => {
            setLoading(false);
            focusListenerRef.current = null;
          };
          
          focusListenerRef.current = handleFocus;
          window.addEventListener('focus', handleFocus, { once: true });
          
          inputRef.current?.click();
        }}
        loading={loading}
      />

      <input
        ref={inputRef}
        data-testid="file-input"
        type="file"
        accept="image/png, image/jpeg"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onSelect(file);
          setLoading(false);
        }}
      />
    </div>
  );
}
