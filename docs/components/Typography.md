# `Typography`

## Purpose

The **Typography** components provide a consistent set of text styles for headings and supporting text across the app.

## Components

| Component  | Renders | Class names         | Description                                 |
| ---------- | ------- | ------------------- | ------------------------------------------- |
| `H1`       | `h1`    | `text-3xl`          | Primary page heading.                       |
| `H2`       | `h2`    | `text-2xl`          | Section heading under the page title.       |
| `H3`       | `h3`    | `text-xl`           | Subsection heading.                         |
| `Headline` | `p`     | `text-lg font-bold` | Prominent supporting statement.             |
| `Callout`  | `p`     | `text-sm`           | Secondary body text for helper information. |
| `Caption`  | `p`     | `text-xs`           | Small metadata or timestamp text.           |

## Props

All typography components accept:

| Prop       | Type                                         | Required | Description                                     |
| ---------- | -------------------------------------------- | -------- | ----------------------------------------------- |
| `children` | `ReactNode`                                  | yes      | The text or inline content to render.           |
| `...props` | `React.HTMLAttributes<HTMLParagraphElement>` | no       | Standard HTML attributes passed to the element. |

## Example Usage

```jsx
<H1>My Plant Collection</H1>
<H2>Scheduled Watering</H2>
<H3>Today</H3>

<Headline>3 plants need attention today</Headline>
<Callout>Rotate your plants weekly for even growth.</Callout>
<Caption>Last synced 5 minutes ago</Caption>
```
