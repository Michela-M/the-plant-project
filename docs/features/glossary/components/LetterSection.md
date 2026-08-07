 # `LetterSection`

## Purpose

`LetterSection` groups glossary terms under a single letter heading and renders each term with its definition and supporting images. It is used to create a structured, alphabetized glossary view with anchor-friendly section IDs.

## Props

| Prop | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `letter` | `string` | yes | — | The letter used as the section heading and anchor ID. |
| `terms` | `{ id: string; term: string; definition: string; images: { url: string; caption: string; shape: '1:1' \| '2:3' \| '1:2' }[] }[]` | yes | — | The list of glossary entries that belong to this letter. |

## Example Usage

```tsx
<LetterSection
	letter="A"
	terms={[
		{
			id: 'air-purifying',
			term: 'Air Purifying',
			definition: 'Plants that help improve indoor air quality.',
			images: [
				{
					url: '/images/air-purifying.jpg',
					caption: 'Peace lily in a bright room',
					shape: '1:1',
				},
			],
		},
	]}
/>
```

## Notes

- Each section uses the letter as its anchor target, so navigation links can jump directly to that part of the glossary.
- Image cards use the provided aspect ratio to keep layout consistent across different media.
