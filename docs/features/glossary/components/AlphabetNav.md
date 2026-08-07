 # `AlphabetNav`

## Purpose

`AlphabetNav` renders an alphabetical navigation bar that lets users jump to glossary sections by letter. It highlights only the letters that currently have glossary entries and disables letters that do not.

## Props

| Prop | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `termsByLetter` | `Record<string, { id: string; term: string; definition: string }[]>` | yes | — | A mapping of each letter to the glossary terms that belong to it. |

## Example Usage

```tsx
<AlphabetNav
	termsByLetter={{
		A: [{ id: 'air-purifying', term: 'Air Purifying', definition: 'Plants that improve indoor air quality.' }],
		B: [{ id: 'bonsai', term: 'Bonsai', definition: 'A small tree grown in a container.' }],
	}}
/>
```

## Notes

- Letters without matching entries are shown as disabled and are not clickable.
- Each link points to the corresponding section anchor, such as `#A` or `#B`.
