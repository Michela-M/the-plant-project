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
