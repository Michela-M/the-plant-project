import { H1 } from '@components/Typography';

export default function Glossary() {
  return (
    <div className="w-1/2 mx-auto py-8 flex flex-col gap-4">
      <H1>Glossary</H1>
      <p className="text-stone-500">
        This glossary defines key plant‑related terms used on the site. Use it
        as a reference whenever you need clarification.
      </p>
    </div>
  );
}
