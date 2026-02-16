import { useRef } from 'react';
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

  return (
    <div className="flex flex-col gap-2">
      <div className="aspect-square overflow-hidden object-cover w-full">
        <img
          className="aspect-square object-cover w-full"
          src={
            previewUrl ||
            'https://larchcottage.co.uk/wp-content/uploads/2024/05/placeholder.jpg'
          }
          alt="Plant"
        />
      </div>

      <Button
        label="Change picture"
        variant="outlined"
        size="sm"
        onClick={() => {
          setLoading(true);
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
