// This code will take the list of terms and group them by the first letter of the term, which can be taken from the id which is structure like this example: C-chlorophyll. The result will be a map where the key is the first letter and the value is an array of terms that start with that letter.

export const groupTermsByLetter = (
  terms: { id: string; term: string; definition: string }[]
) => {
  const groupedTerms: Record<
    string,
    { id: string; term: string; definition: string }[]
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
