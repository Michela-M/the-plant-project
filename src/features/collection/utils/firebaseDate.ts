type TimestampLike = {
  toDate: () => Date;
};

const isValidDate = (value: unknown): value is Date => {
  return value instanceof Date && !Number.isNaN(value.getTime());
};

export const firebaseTimestampToDate = (value: unknown): Date | null => {
  if (isValidDate(value)) {
    return value;
  }

  if (
    value &&
    typeof value === 'object' &&
    'toDate' in value &&
    typeof (value as TimestampLike).toDate === 'function'
  ) {
    const convertedDate = (value as TimestampLike).toDate();
    return isValidDate(convertedDate) ? convertedDate : null;
  }

  return null;
};
