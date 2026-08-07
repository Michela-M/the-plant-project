import { H1 } from '@components/Typography';
import { useEffect, useState } from 'react';
import AlphabetNav from '../components/AlphabetNav';
import LetterSection from '../components/LetterSection';
import { getTerms } from '../services/getTerms';
import { groupTermsByLetter } from '../services/groupTermsByLetter';

export default function Glossary() {
  const [terms, setTerms] = useState<
    {
      id: string;
      term: string;
      definition: string;
      images: { url: string; caption: string; shape: '1:1' | '2:3' | '1:2' }[];
    }[]
  >([]);
  const [termsByLetter, setTermsByLetter] = useState<
    Record<
      string,
      {
        id: string;
        term: string;
        definition: string;
        images: {
          url: string;
          caption: string;
          shape: '1:1' | '2:3' | '1:2';
        }[];
      }[]
    >
  >({});

  useEffect(() => {
    const fetchTerms = async () => {
      const data = await getTerms();
      setTerms(data);
      setTermsByLetter(groupTermsByLetter(data));
    };

    fetchTerms();
  }, []);

  return (
    <div className="w-1/2 mx-auto py-8 flex flex-col gap-4">
      <H1>Glossary</H1>
      <p className="text-stone-500">
        This glossary defines key plant‑related terms used on the site. Use it
        as a reference whenever you need clarification.
      </p>
      <AlphabetNav termsByLetter={termsByLetter} />
      <div className="flex flex-col gap-4">
        {Object.entries(termsByLetter).map(([letter, letterTerms]) => (
          <div key={letter}>
            <LetterSection letter={letter} terms={letterTerms} />
          </div>
        ))}
      </div>
      <AlphabetNav termsByLetter={termsByLetter} />
    </div>
  );
}
