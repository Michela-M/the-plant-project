# `Link`

## Purpose

The `Link` component provides a consistent, styled hyperlink throughout the application. It ensures uniform colors, hover and active states, and can be easily customized or extended.

## Props

| Prop       | Type              | Required | Default        | Description                            |
| ---------- | ----------------- | -------- | -------------- | -------------------------------------- |
| `href`     | `string`          | no       | `'#'`          | The destination URL for the link.      |
| `children` | `React.ReactNode` | no       | `'Click here'` | The content displayed inside the link. |

## Example Usage

```jsx
<Link href="/login">Log in</Link>
```
