export default function formatRelativeDate({ date }: { date: Date }) {
  return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
    Math.round((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
    'day'
  );
}
