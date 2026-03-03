type H1Props = React.ComponentPropsWithoutRef<'h1'>;
type H2Props = React.ComponentPropsWithoutRef<'h2'>;
type H3Props = React.ComponentPropsWithoutRef<'h3'>;
type ParagraphProps = React.ComponentPropsWithoutRef<'p'>;

function mergeClassNames(defaultClassName: string, className?: string) {
  return [defaultClassName, className].filter(Boolean).join(' ');
}

export function H1({ className, ...props }: H1Props) {
  return (
    <h1
      className={mergeClassNames(
        'text-3xl font-bold text-green-900',
        className
      )}
      {...props}
    />
  );
}

export function H2({ className, ...props }: H2Props) {
  return (
    <h2
      className={mergeClassNames('text-2xl text-green-900', className)}
      {...props}
    />
  );
}

export function H3({ className, ...props }: H3Props) {
  return <h3 className={mergeClassNames('text-xl', className)} {...props} />;
}

export function Headline({ className, ...props }: ParagraphProps) {
  return (
    <p className={mergeClassNames('text-lg font-bold', className)} {...props} />
  );
}

export function Callout({ className, ...props }: ParagraphProps) {
  return <p className={mergeClassNames('text-sm', className)} {...props} />;
}

export function Caption({ className, ...props }: ParagraphProps) {
  return <p className={mergeClassNames('text-xs', className)} {...props} />;
}
