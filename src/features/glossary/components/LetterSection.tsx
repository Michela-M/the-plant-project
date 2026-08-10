import { H2 } from '@components/Typography';

export default function LetterSection({
  letter,
  terms,
}: Readonly<{
  letter: string;
  terms: {
    id: string;
    term: string;
    definition: string;
    images: { url: string; caption: string; shape: '1:1' | '2:3' | '1:2' }[];
  }[];
}>) {
  return (
    <div className="flex flex-col gap-2" id={letter}>
      <div className="flex items-center gap-2">
        <H2 className="text-2xl font-semibold">{letter}</H2>
        <div className="flex-1 h-0.5 bg-green-800"></div>
      </div>
      <div className="flex flex-col gap-2">
        {terms.map((term) => (
          <TermSection key={term.id} term={term} />
        ))}
      </div>
    </div>
  );
}

function TermSection({
  term,
}: Readonly<{
  term: {
    id: string;
    term: string;
    definition: string;
    images: { url: string; caption: string; shape: '1:1' | '2:3' | '1:2' }[];
  };
}>) {
  const ratioClasses = {
    '1:1': 'aspect-square',
    '2:3': 'aspect-3/2',
    '1:2': 'aspect-2/1',
  };

  return (
    <div key={term.id} id={term.term[0].toUpperCase()}>
      <p className="font-semibold">{term.term}</p>
      <p className="text-stone-500">{term.definition}</p>

      <div className="flex flex-wrap gap-4 justify-center mt-2">
        {term.images.map((image, index) => (
          <div key={index} className="flex flex-col items-center gap-1">
            <img
              src={image.url}
              alt={image.caption}
              className={`${ratioClasses[image.shape]} object-cover rounded-md h-48`}
            />
            <p className="text-sm text-stone-500 text-center w-fit">
              {image.caption}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
