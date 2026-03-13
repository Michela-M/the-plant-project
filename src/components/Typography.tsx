import clsx from 'clsx';

type H1Props = React.ComponentPropsWithoutRef<'h1'>;
type H2Props = React.ComponentPropsWithoutRef<'h2'>;
type H3Props = React.ComponentPropsWithoutRef<'h3'>;
type ParagraphProps = React.ComponentPropsWithoutRef<'p'>;

export function H1({ className, children, ...props }: Readonly<H1Props>) {
  return (
    <h1
      className={clsx('text-3xl font-bold text-green-900', className)}
      {...props}
    >
      {children}
    </h1>
  );
}

export function H2({ className, children, ...props }: Readonly<H2Props>) {
  return (
    <h2 className={clsx('text-2xl text-green-900', className)} {...props}>
      {children}
    </h2>
  );
}

export function H3({ className, children, ...props }: Readonly<H3Props>) {
  return (
    <h3 className={clsx('text-xl', className)} {...props}>
      {children}
    </h3>
  );
}

export function Headline({ className, ...props }: Readonly<ParagraphProps>) {
  return <p className={clsx('text-lg font-bold', className)} {...props} />;
}

export function Callout({ className, ...props }: Readonly<ParagraphProps>) {
  return <p className={clsx('text-sm', className)} {...props} />;
}

export function Caption({ className, ...props }: Readonly<ParagraphProps>) {
  return <p className={clsx('text-xs', className)} {...props} />;
}
