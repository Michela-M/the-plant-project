export function imageValidation(file: File) {
  if (!file.type.startsWith('image/')) {
    return 'Invalid file type';
  }
  if (file.size > 5 * 1024 * 1024) {
    return 'File too large (max 5MB)';
  }
  return null;
}
