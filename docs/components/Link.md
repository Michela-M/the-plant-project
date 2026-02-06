# `Link`

## Purpose

The `Link` component provides a consistent, styled link throughout the application. It wraps React Router's `Link` to ensure uniform colors, hover and active states, and can be easily customized or extended. It must be rendered inside a Router.

## Props

| Prop       | Type              | Required | Default        | Description                            |
| ---------- | ----------------- | -------- | -------------- | -------------------------------------- |
| `href`     | `string`          | no       | `'#'`          | The destination URL for the link.      |
| `children` | `React.ReactNode` | no       | `'Click here'` | The content displayed inside the link. |

## Example Usage

```jsx
<Link href="/login">Log in</Link>
```
