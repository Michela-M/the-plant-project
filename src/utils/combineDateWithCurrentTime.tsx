export default function combineDateWithCurrentTime(dateInput: string) {
  if (!dateInput) {
    return new Date();
  }

  const [yearString, monthString, dayString] = dateInput.split('-');
  const year = Number(yearString);
  const month = Number(monthString);
  const day = Number(dayString);

  if (!year || !month || !day) {
    return new Date();
  }

  const now = new Date();
  return new Date(
    year,
    month - 1,
    day,
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
    now.getMilliseconds()
  );
}
