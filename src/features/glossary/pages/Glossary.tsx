import TextField from '@components/TextField';
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

  const [searchQuery, setSearchQuery] = useState('');
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredTerms = terms.filter((term) => {
    const matchesTerm = term.term.toLowerCase().includes(normalizedQuery);
    return matchesTerm;
  });
  const filteredTermsByLetter = groupTermsByLetter(filteredTerms);
  const hasSearch = normalizedQuery.length > 0;

  useEffect(() => {
    const fetchTerms = async () => {
      const data = await getTerms();
      setTerms(data);
    };

    fetchTerms();
  }, []);

  return (
    <div className="w-1/2 mx-auto py-8 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <H1>Glossary</H1>
        <TextField
          placeholder="Search terms..."
          ariaLabel="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth={false}
        />
      </div>

      <p className="text-stone-500">
        This glossary defines key plant‑related terms used on the site. Use it
        as a reference whenever you need clarification.
      </p>
      <AlphabetNav termsByLetter={filteredTermsByLetter} />
      <div className="flex flex-col gap-4">
        {Object.entries(filteredTermsByLetter).map(([letter, letterTerms]) => (
          <div key={letter}>
            <LetterSection letter={letter} terms={letterTerms} />
          </div>
        ))}
      </div>
      <AlphabetNav termsByLetter={filteredTermsByLetter} />
    </div>
  );
}
