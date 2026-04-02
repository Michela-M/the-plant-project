export type ComboBoxSelection = Readonly<{
  id: string | null;
  name: string;
}>;

export type ComboBoxOption = Readonly<{
  id: string;
  name: string;
  description?: string;
  image?: string;
}>;
