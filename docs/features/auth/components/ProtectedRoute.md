# `ProtectedRoute`

## Purpose

`ProtectedRoute` guards private routes by waiting for auth state to resolve, redirecting unauthenticated users to login, and rendering protected content only for authenticated users.

## Props

| Prop       | Type              | Required | Description                             |
| ---------- | ----------------- | -------- | --------------------------------------- |
| `children` | `React.ReactNode` | yes      | The protected page/component to render. |

## Behavior

1. Reads `user` and `loading` from `useAuth()`.
2. While `loading === true`, renders `<Spinner />`.
3. If loading is complete and `user` is null, returns `<Navigate to="/login" replace />`.
4. If `user` exists, renders `children`.

## Example Usage

```tsx
<Route
  path="/collection"
  element={
    <ProtectedRoute>
      <MyCollection />
    </ProtectedRoute>
  }
/>
```
