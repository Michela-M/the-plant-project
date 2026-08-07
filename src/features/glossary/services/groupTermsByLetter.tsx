export const groupTermsByLetter = (
  terms: {
    id: string;
    term: string;
    definition: string;
    images: { url: string; caption: string; shape: '1:1' | '2:3' | '1:2' }[];
  }[]
) => {
  const groupedTerms: Record<
    string,
    {
      id: string;
      term: string;
      definition: string;
      images: { url: string; caption: string; shape: '1:1' | '2:3' | '1:2' }[];
    }[]
  > = {};

  terms.forEach((term) => {
    const firstLetter = term.id.charAt(0).toUpperCase();

    if (!groupedTerms[firstLetter]) {
      groupedTerms[firstLetter] = [];
    }

    groupedTerms[firstLetter].push(term);
  });

  return groupedTerms;
};
