export default function AlphabetNav({
  termsByLetter,
}: Readonly<{
  termsByLetter: Record<
    string,
    { id: string; term: string; definition: string }[]
  >;
}>) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  return (
    <div className="flex flex-wrap gap-2 justify-center px-4">
      {letters.map((letter) => {
        const hasTerms =
          termsByLetter[letter] && termsByLetter[letter].length > 0;
        return (
          <a
            key={letter}
            href={`#${letter}`}
            className={`${hasTerms ? 'hover:underline' : 'text-gray-400 cursor-not-allowed'}`}
            aria-disabled={!hasTerms}
          >
            {letter}
          </a>
        );
      })}
    </div>
  );
}
