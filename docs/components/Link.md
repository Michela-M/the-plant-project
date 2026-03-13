# `Link`

## Purpose

The `Link` component provides a consistent, styled link throughout the application.
It wraps React Router's `Link` to ensure uniform colors and focus states.
It must be rendered inside a Router.

When `href` starts with `http`, the component treats the link as external and automatically sets:

- `target="_blank"`
- `rel="noopener noreferrer"`
- an `sr-only` hint: `(opens in new tab)`

## Props

| Prop       | Type              | Required | Description                            |
| ---------- | ----------------- | -------- | -------------------------------------- |
| `href`     | `string`          | yes      | The destination URL for the link.      |
| `children` | `React.ReactNode` | yes      | The content displayed inside the link. |

## Example Usage

```jsx
<Link href="/login">Log in</Link>

<Link href="https://reactrouter.com">React Router docs</Link>
```
