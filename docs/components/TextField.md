# `TextField`

A reusable, accessible input component that supports labels, helper text, error messaging, disabled state, multiple input types (including textarea), and optional trailing icons.

The component is designed to provide consistent styling and behavior across forms while remaining flexible for a wide range of use cases.

## Purpose

`TextField` provides:

- A labeled input or textarea with proper accessibility attributes
- Visual states for normal, error, and disabled modes
- Optional helper text or error messaging
- Optional trailing icon support
- Controlled input behavior via value, onChange, and onBlur
- Automatic placeholder fallback logic

It is intended as a foundational form component for your UI.

## Props

## Props

| Prop          | Type                                                                      | Required | Default  | Description                                                                          |
| ------------- | ------------------------------------------------------------------------- | -------- | -------- | ------------------------------------------------------------------------------------ |
| `label`       | `string`                                                                  | No       | —        | Label displayed above the input                                                      |
| `placeholder` | `string`                                                                  | No       | —        | Placeholder text; falls back to `label` or `"Enter text"`                            |
| `helperText`  | `string`                                                                  | No       | —        | Helper text displayed below the input when no error is present                       |
| `disabled`    | `boolean`                                                                 | No       | `false`  | Disables the input and applies disabled styles                                       |
| `icon`        | `React.ReactNode`                                                         | No       | —        | Icon displayed inside the input on the right                                         |
| `type`        | `'text' \| 'password' \| 'email' \| 'number' \| 'textarea' \| 'date'`     | No       | `'text'` | Input type; when set to `'textarea'`, renders a `<textarea>` instead of an `<input>` |
| `value`       | `string`                                                                  | No       | —        | Controlled input value                                                               |
| `onChange`    | `(e: React.ChangeEvent<HTMLInputElement \| HTMLTextAreaElement>) => void` | No       | —        | Change event handler                                                                 |
| `onBlur`      | `(e: React.FocusEvent<HTMLInputElement \| HTMLTextAreaElement>) => void`  | No       | —        | Blur event handler                                                                   |
| `error`       | `string`                                                                  | No       | —        | Error message; when provided, the input is marked invalid and styled accordingly     |
| `name`        | `string`                                                                  | No       | —        | Input name and `id`, used to associate the label                                     |
| `required`    | `boolean`                                                                 | No       | —        | Displays a red asterisk next to the label when `true`                                |

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

### Textarea

```jsx
<TextField
  label="Description"
  name="description"
  type="textarea"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
/>
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
