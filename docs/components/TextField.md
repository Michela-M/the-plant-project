# `TextField`

A reusable, accessible text input component with built-in support for labels, helper text, error states, disabled state, and optional trailing icons.

The component is designed to be flexible enough for common form use cases while keeping styling and state handling consistent across the application.

## Purpose

`TextField` provides:

- A labeled text input with proper accessibility attributes
- Visual states for normal, error, and disabled inputs
- Optional helper text or error messaging
- Optional trailing icon support
- Controlled input behavior via `value` and `onChange`

It is intended to be used as a building block for forms and form-like UI.

## Props

| Prop          | Type                                               | Required | Default  | Description                                                                      |
| ------------- | -------------------------------------------------- | -------- | -------- | -------------------------------------------------------------------------------- |
| `label`       | `string`                                           | No       | —        | Label displayed above the input                                                  |
| `placeholder` | `string`                                           | No       | —        | Placeholder text for the input. Falls back to `label` or `"Enter text"`          |
| `helperText`  | `string`                                           | No       | —        | Helper text displayed below the input when there is no error                     |
| `disabled`    | `boolean`                                          | No       | `false`  | Disables the input and applies disabled styles                                   |
| `icon`        | `React.ReactNode`                                  | No       | —        | Icon displayed inside the input on the right                                     |
| `type`        | `'text' \| 'password' \| 'email'`                  | No       | `'text'` | HTML input type                                                                  |
| `value`       | `string`                                           | No       | —        | Controlled input value                                                           |
| `onChange`    | `(e: React.ChangeEvent<HTMLInputElement>) => void` | No       | —        | Change event handler                                                             |
| `onBlur`      | `(e: React.FocusEvent<HTMLInputElement>) => void`  | No       | —        | Blur event handler                                                               |
| `error`       | `string`                                           | No       | —        | Error message; when provided, the input is marked invalid and styled accordingly |
| `name`        | `string`                                           | No       | —        | Input name and `id`, used to associate the label                                 |

## Example Usage

### Basic text field

```tsx
<TextField
  label="Username"
  name="username"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
/>
```

### With helper text

```jsx
<TextField
  label="Email"
  name="email"
  type="email"
  helperText="We'll never share your email."
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

### Error state

```jsx
<TextField
  label="Password"
  name="password"
  type="password"
  error="Password must be at least 8 characters"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>
```

### Disabled input

```jsx
<TextField label="Referral Code" name="referral" disabled value="INVITE-2024" />
```

### With trailing icon

```jsx
import { Search } from 'lucide-react';

<TextField
  label="Search"
  name="search"
  placeholder="Search items"
  icon={<Search size={16} />}
  value={query}
  onChange={(e) => setQuery(e.target.value)}
/>;
```
