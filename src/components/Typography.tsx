type TypographyProps = React.HTMLAttributes<HTMLParagraphElement> & {
  children: React.ReactNode;
};

function mergeClassNames(defaultClassName: string, className?: string) {
  return [defaultClassName, className].filter(Boolean).join(' ');
}

export function H1({ className, ...props }: TypographyProps) {
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

export function H2({ className, ...props }: TypographyProps) {
  return (
    <h2
      className={mergeClassNames('text-2xl text-green-900', className)}
      {...props}
    />
  );
}

export function H3({ className, ...props }: TypographyProps) {
  return <h3 className={mergeClassNames('text-xl', className)} {...props} />;
}

export function Headline({ className, ...props }: TypographyProps) {
  return (
    <p className={mergeClassNames('text-lg font-bold', className)} {...props} />
  );
}

export function Callout({ className, ...props }: TypographyProps) {
  return <p className={mergeClassNames('text-sm', className)} {...props} />;
}

export function Caption({ className, ...props }: TypographyProps) {
  return <p className={mergeClassNames('text-xs', className)} {...props} />;
}
