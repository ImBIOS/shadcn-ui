# @better-auth-ui/components

[![npm version](https://img.shields.io/npm/v/@better-auth-ui/components.svg)](https://www.npmjs.com/package/@better-auth-ui/components)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Beautifully designed authentication UI components for [better-auth](https://better-auth.com). Built with React, Radix UI, and Tailwind CSS.

## Features

- 🔐 **Multiple Auth Methods** - Email, username, and phone number authentication
- 🎨 **Fully Customizable** - Style with Tailwind CSS or custom classNames
- ♿ **Accessible** - Built on Radix UI primitives, WCAG 2.1 AA compliant
- 🌍 **i18n Ready** - Internationalization support via i18next
- 📱 **Mobile First** - Responsive design out of the box
- 🔒 **Type Safe** - Full TypeScript support with comprehensive types
- ✅ **Validation** - Built-in Zod validation with customizable rules

## Installation

```bash
# npm
npm install @better-auth-ui/components

# pnpm
pnpm add @better-auth-ui/components

# yarn
yarn add @better-auth-ui/components
```

### Peer Dependencies

Make sure you have the following peer dependencies installed:

```bash
pnpm add better-auth@^1.4.0 react@^18.0.0 react-dom@^18.0.0
```

## Quick Start

### 1. Configure better-auth client

```typescript
// lib/auth-client.ts
import { createAuthClient } from 'better-auth/client'

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
})
```

### 2. Use the component

```tsx
// app/auth/sign-in/page.tsx
import { CredentialLoginForm } from '@better-auth-ui/components'
import { authClient } from '@/lib/auth-client'

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <CredentialLoginForm
          authMethod="email"
          authClient={authClient}
          showRememberMe={true}
          showForgotPassword={true}
          onSuccess={() => console.log('Logged in!')}
        />
      </div>
    </div>
  )
}
```

## Props Reference

### CredentialLoginFormProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `authMethod` | `'email' \| 'username' \| 'phone'` | **Required** | Authentication method |
| `authClient` | `AuthClient` | **Required** | better-auth client instance |
| `showRememberMe` | `boolean` | `false` | Show "Remember me" checkbox |
| `showForgotPassword` | `boolean` | `false` | Show "Forgot password?" link |
| `forgotPasswordUrl` | `string` | `'/auth/forgot-password'` | URL for forgot password |
| `enableClientValidation` | `boolean` | `true` | Enable client-side validation |
| `passwordValidation` | `PasswordValidation` | `{ minLength: 8 }` | Password validation rules |
| `onSuccess` | `() => void \| Promise<void>` | - | Success callback |
| `onError` | `(error: AuthError) => void` | - | Error callback |
| `redirectTo` | `string` | - | Redirect URL after success |
| `className` | `string` | - | Root container class |
| `classNames` | `CredentialLoginClassNames` | - | Sub-element classes |
| `disabled` | `boolean` | `false` | Disable the form |
| `loadingComponent` | `React.ComponentType` | - | Custom loading spinner |
| `errorRenderer` | `(error: AuthError) => ReactNode` | - | Custom error renderer |

### PasswordValidation

```typescript
interface PasswordValidation {
  minLength?: number      // Minimum length (default: 8)
  maxLength?: number      // Maximum length (default: 256)
  requireUppercase?: boolean
  requireLowercase?: boolean
  requireNumbers?: boolean
  requireSymbols?: boolean
}
```

### CredentialLoginClassNames

```typescript
interface CredentialLoginClassNames {
  form?: string
  input?: string
  label?: string
  button?: string
  error?: string
  card?: string
  checkbox?: string
  link?: string
}
```

## Examples

### Email Authentication

```tsx
<CredentialLoginForm
  authMethod="email"
  authClient={authClient}
/>
```

### Username with Remember Me

```tsx
<CredentialLoginForm
  authMethod="username"
  authClient={authClient}
  showRememberMe={true}
/>
```

### Phone with Custom Validation

```tsx
<CredentialLoginForm
  authMethod="phone"
  authClient={authClient}
  passwordValidation={{
    minLength: 12,
    requireUppercase: true,
    requireNumbers: true,
    requireSymbols: true,
  }}
/>
```

### Custom Styling

```tsx
<CredentialLoginForm
  authMethod="email"
  authClient={authClient}
  className="bg-gray-100 p-8 rounded-lg"
  classNames={{
    button: 'bg-blue-600 hover:bg-blue-700',
    input: 'border-2 border-gray-300',
    error: 'text-red-600 font-semibold',
  }}
/>
```

### With Callbacks

```tsx
<CredentialLoginForm
  authMethod="email"
  authClient={authClient}
  onSuccess={async () => {
    await queryClient.invalidateQueries(['user'])
    router.push('/dashboard')
  }}
  onError={(error) => {
    toast.error(error.message)
    Sentry.captureException(error)
  }}
/>
```

## Framework Integration

### Next.js (App Router)

```tsx
// app/auth/sign-in/page.tsx
'use client'

import { CredentialLoginForm } from '@better-auth-ui/components'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
  const router = useRouter()

  return (
    <CredentialLoginForm
      authMethod="email"
      authClient={authClient}
      onSuccess={() => router.push('/dashboard')}
    />
  )
}
```

### React Router (Vite)

```tsx
import { CredentialLoginForm } from '@better-auth-ui/components'
import { authClient } from '@/lib/auth-client'
import { useNavigate } from 'react-router-dom'

export default function SignInPage() {
  const navigate = useNavigate()

  return (
    <CredentialLoginForm
      authMethod="email"
      authClient={authClient}
      onSuccess={() => navigate('/dashboard')}
    />
  )
}
```

### TanStack Start

```tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { CredentialLoginForm } from '@better-auth-ui/components'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/auth/sign-in')({
  component: SignInPage,
})

function SignInPage() {
  const navigate = useNavigate()

  return (
    <CredentialLoginForm
      authMethod="email"
      authClient={authClient}
      onSuccess={() => navigate({ to: '/dashboard' })}
    />
  )
}
```

## Tailwind CSS Configuration

Ensure your Tailwind CSS configuration includes this package:

```javascript
// tailwind.config.js
module.exports = {
  content: [
    // ... your paths
    './node_modules/@better-auth-ui/**/*.{js,ts,jsx,tsx}',
  ],
}
```

## Internationalization

The component supports i18n via i18next. To customize translations:

```typescript
import { i18n } from '@better-auth-ui/components'

i18n.addResourceBundle('es', 'translation', {
  auth: {
    email: 'Correo electrónico',
    password: 'Contraseña',
    signIn: 'Iniciar sesión',
    // ... more translations
  },
})

i18n.changeLanguage('es')
```

## TypeScript

Full TypeScript support with exported types:

```typescript
import type {
  CredentialLoginFormProps,
  PasswordValidation,
  AuthError,
  AuthMethod,
  CredentialLoginClassNames,
} from '@better-auth-ui/components'

// Type guards
import {
  isAuthError,
  isAuthenticationResponse,
} from '@better-auth-ui/components'
```

## Alternative Installation: shadcn CLI

If you prefer to copy the source code into your project for full customization:

```bash
npx shadcn@latest add "https://better-auth-ui.com/r/credential-login"
```

This installs the component source code directly, allowing you to modify it freely.

## Contributing

Contributions are welcome! Please read our [contributing guide](https://github.com/better-auth-ui/better-auth-ui/blob/main/CONTRIBUTING.md) for details.

## License

MIT © [better-auth-ui](https://github.com/better-auth-ui)

## Links

- [Documentation](https://better-auth-ui.com/docs)
- [GitHub](https://github.com/better-auth-ui/better-auth-ui)
- [better-auth](https://better-auth.com)
- [shadcn/ui](https://ui.shadcn.com)
