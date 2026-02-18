export default function formatRelativeDate({ date }: { date: Date }) {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfTarget = new Date(date);
  startOfTarget.setHours(0, 0, 0, 0);

  const diffInDays = Math.trunc(
    (startOfTarget.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24)
  );

  return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
    diffInDays,
    'day'
  );
}
