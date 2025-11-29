# Quickstart Guide: ImBIOS UI

**Target Audience**: Developers integrating authentication UI into their applications
**Time to Complete**: ~15-30 minutes
**Date**: 2025-11-26

## Overview

This guide walks you through adding the credential login block to your application using either:
1. **shadcn CLI** (copy source code, full customization)
2. **NPM Package** (managed component, auto-updates)

Choose the method that fits your workflow best.

---

## Prerequisites

Before starting, ensure you have:

✅ **Node.js 18+** installed
✅ **pnpm, npm, or yarn** package manager
✅ **React 18+ or 19+** application
✅ **Tailwind CSS** configured
✅ **better-auth 1.4+** installed and configured

---

## Quick Start (5-Minute Path)

### 1. Install better-auth (if not already installed)

```bash
pnpm add better-auth@^1.4.0
```

### 2. Configure better-auth Client

```typescript
// lib/auth-client.ts
import { createAuthClient } from 'better-auth/client'

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
})
```

### 3. Choose Installation Method

#### Option A: shadcn CLI (Recommended for customization)

```bash
npx shadcn@latest add "https://ui.imbios.dev/r/credential-login"
```

This copies the component source code into your project. You can customize it freely.

#### Option B: NPM Package (Recommended for managed updates)

```bash
pnpm add @imbios/ui
```

This installs a pre-built component that updates automatically with your dependencies.

### 4. Use the Component

**With shadcn CLI:**

```tsx
// app/auth/sign-in/page.tsx
import { CredentialLoginForm } from '@/components/auth/credential-login-form'
import { authClient } from '@/lib/auth-client'

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <CredentialLoginForm authClient={authClient} />
      </div>
    </div>
  )
}
```

**With NPM Package:**

```tsx
// app/auth/sign-in/page.tsx
import { CredentialLoginForm } from '@imbios/ui'
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
          redirectTo="/dashboard"
        />
      </div>
    </div>
  )
}
```

### 5. Test the Integration

```bash
pnpm dev
```

Navigate to `/auth/sign-in` and test the login form.

---

## Detailed Setup

### Prerequisites Setup

#### 1. Install Tailwind CSS (if not already installed)

```bash
pnpm add -D tailwindcss postcss autoprefixer
pnpm dlx tailwindcss init -p
```

**tailwind.config.js:**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**app/globals.css:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### 2. Install and Configure better-auth

```bash
pnpm add better-auth@^1.4.0
```

**Server-side configuration** (e.g., `lib/auth.ts`):

```typescript
import { betterAuth } from 'better-auth'

export const auth = betterAuth({
  database: {
    // Your database configuration
    provider: 'postgres', // or 'mysql', 'sqlite'
    url: process.env.DATABASE_URL,
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true in production
  },
})
```

**Client-side configuration** (`lib/auth-client.ts`):

```typescript
import { createAuthClient } from 'better-auth/client'

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
})
```

**API Route** (`app/api/auth/[...all]/route.ts` for Next.js App Router):

```typescript
import { auth } from '@/lib/auth'

export const { GET, POST } = auth.handler
```

---

## Installation Method Comparison

| Feature | shadcn CLI | NPM Package |
|---------|------------|-------------|
| **Installation** | `npx shadcn add "URL"` | `pnpm add @imbios/ui` |
| **Source Code** | Copied to your project | Installed as dependency |
| **Customization** | ✅ Full control | ⚠️ Limited to props |
| **Updates** | Manual (re-run CLI) | ✅ Automatic (pnpm update) |
| **Bundle Size** | Smaller (unused code removed) | Slightly larger |
| **Type Safety** | ✅ Full TypeScript | ✅ Full TypeScript |
| **Best For** | Custom designs | Standard implementations |

---

## Method 1: shadcn CLI Installation

### Step 1: Install shadcn UI

```bash
npx shadcn@latest init
```

Follow the prompts to configure your project.

### Step 2: Add Credential Login Block

```bash
npx shadcn@latest add "https://ui.imbios.dev/r/credential-login"
```

This installs:
- `components/auth/credential-login-form.tsx` - Main form component
- `components/ui/button.tsx` - Button primitive (if not already installed)
- `components/ui/input.tsx` - Input primitive (if not already installed)
- `components/ui/form.tsx` - Form primitives (if not already installed)
- `components/ui/card.tsx` - Card primitives (if not already installed)
- `components/ui/label.tsx` - Label primitive (if not already installed)
- `components/ui/checkbox.tsx` - Checkbox primitive (if not already installed)

### Step 3: Import and Use

```tsx
import { CredentialLoginForm } from '@/components/auth/credential-login-form'
import { authClient } from '@/lib/auth-client'

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <CredentialLoginForm authClient={authClient} />
      </div>
    </div>
  )
}
```

### Step 4: Customize (Optional)

The component source code is now in your project. Customize freely:

```tsx
// components/auth/credential-login-form.tsx
export function CredentialLoginForm({ authClient }: CredentialLoginFormProps) {
  // Customize logic, styling, labels, etc.
  return (
    <Card className="custom-class">
      {/* Your customizations */}
    </Card>
  )
}
```

---

## Method 2: NPM Package Installation

### Step 1: Install Package

```bash
pnpm add @imbios/ui
```

### Step 2: Install Peer Dependencies (if not already installed)

```bash
pnpm add better-auth@^1.4.0 react@^19.0.0 react-dom@^19.0.0
```

### Step 3: Import and Use with Props

```tsx
import { CredentialLoginForm } from '@imbios/ui'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <CredentialLoginForm
          authMethod="email"
          authClient={authClient}
          showRememberMe={true}
          showForgotPassword={true}
          forgotPasswordUrl="/auth/forgot-password"
          passwordValidation={{
            minLength: 12,
            requireUppercase: true,
            requireNumbers: true,
            requireSymbols: true,
          }}
          onSuccess={() => {
            console.log('Login successful!')
            router.push('/dashboard')
          }}
          onError={(error) => {
            console.error('Login failed:', error.message)
          }}
          className="custom-form-class"
          classNames={{
            button: 'custom-button-class',
            input: 'custom-input-class',
          }}
        />
      </div>
    </div>
  )
}
```

### Step 4: Configure Props

All configuration is done via props. See [Component Props Reference](#component-props-reference) for full API.

---

## Configuration Options

### Authentication Methods

The credential login block supports three authentication methods:

#### Email Authentication (Default)

```tsx
<CredentialLoginForm
  authMethod="email"
  authClient={authClient}
/>
```

Users enter: `user@example.com` + password

#### Username Authentication

```tsx
<CredentialLoginForm
  authMethod="username"
  authClient={authClient}
/>
```

Users enter: `johndoe` + password

#### Phone Number Authentication

```tsx
<CredentialLoginForm
  authMethod="phone"
  authClient={authClient}
/>
```

Users enter: `+12025551234` + password (E.164 format)

---

### Optional Features

#### Remember Me Checkbox

```tsx
<CredentialLoginForm
  authMethod="email"
  authClient={authClient}
  showRememberMe={true}
/>
```

Extends session duration when enabled.

#### Forgot Password Link

```tsx
<CredentialLoginForm
  authMethod="email"
  authClient={authClient}
  showForgotPassword={true}
  forgotPasswordUrl="/auth/forgot-password"
/>
```

Displays a "Forgot password?" link above the password field.

---

### Password Validation

Configure client-side password validation rules:

```tsx
<CredentialLoginForm
  authMethod="email"
  authClient={authClient}
  enableClientValidation={true}
  passwordValidation={{
    minLength: 12,
    maxLength: 256,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: true,
  }}
/>
```

Validation messages are displayed in real-time as the user types.

---

### Callbacks

#### onSuccess

Called after successful authentication, before redirect:

```tsx
<CredentialLoginForm
  authMethod="email"
  authClient={authClient}
  onSuccess={async () => {
    // Track analytics
    analytics.track('User Signed In')

    // Update global state
    await queryClient.invalidateQueries(['user'])

    // Custom navigation
    router.push('/dashboard')
  }}
/>
```

#### onError

Called when authentication fails:

```tsx
<CredentialLoginForm
  authMethod="email"
  authClient={authClient}
  onError={(error) => {
    // Custom error handling
    if (error.code === 'RATE_LIMIT_EXCEEDED') {
      toast.error('Too many attempts. Please try again in 5 minutes.')
    } else {
      toast.error(error.message)
    }

    // Log to error tracking
    Sentry.captureException(error)
  }}
/>
```

---

### Styling

#### Global className

```tsx
<CredentialLoginForm
  authMethod="email"
  authClient={authClient}
  className="bg-gray-100 p-8 rounded-lg shadow-xl"
/>
```

#### Granular classNames

```tsx
<CredentialLoginForm
  authMethod="email"
  authClient={authClient}
  classNames={{
    form: 'space-y-6',
    input: 'border-2 border-gray-300 focus:border-blue-500',
    button: 'bg-blue-600 hover:bg-blue-700',
    label: 'text-sm font-semibold text-gray-700',
    error: 'text-red-600 text-sm mt-1',
    checkbox: 'text-blue-600',
    link: 'text-blue-600 hover:underline',
  }}
/>
```

---

## Framework-Specific Guides

### Next.js (App Router)

**Directory Structure:**

```
app/
├── api/
│   └── auth/
│       └── [...all]/
│           └── route.ts          # better-auth API handler
├── auth/
│   ├── sign-in/
│   │   └── page.tsx              # Sign-in page
│   └── forgot-password/
│       └── page.tsx              # Forgot password page
└── dashboard/
    └── page.tsx                  # Protected page
```

**Sign-in Page:**

```tsx
// app/auth/sign-in/page.tsx
'use client'

import { CredentialLoginForm } from '@imbios/ui'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <CredentialLoginForm
          authMethod="email"
          authClient={authClient}
          showRememberMe={true}
          showForgotPassword={true}
          onSuccess={() => router.push('/dashboard')}
        />
      </div>
    </div>
  )
}
```

**Protecting Routes with Middleware:**

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { authClient } from '@/lib/auth-client'

export async function middleware(request: NextRequest) {
  const session = await authClient.session.get()

  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
```

---

### React (Vite)

**Directory Structure:**

```
src/
├── components/
│   └── auth/
│       └── credential-login-form.tsx
├── routes/
│   ├── auth/
│   │   └── sign-in.tsx
│   └── dashboard.tsx
├── lib/
│   └── auth-client.ts
└── main.tsx
```

**Sign-in Route:**

```tsx
// src/routes/auth/sign-in.tsx
import { CredentialLoginForm } from '@imbios/ui'
import { authClient } from '@/lib/auth-client'
import { useNavigate } from 'react-router-dom'

export default function SignInPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <CredentialLoginForm
          authMethod="email"
          authClient={authClient}
          showRememberMe={true}
          showForgotPassword={true}
          onSuccess={() => navigate('/dashboard')}
        />
      </div>
    </div>
  )
}
```

**React Router Configuration:**

```tsx
// src/main.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import SignInPage from './routes/auth/sign-in'
import DashboardPage from './routes/dashboard'

const router = createBrowserRouter([
  {
    path: '/auth/sign-in',
    element: <SignInPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
    loader: async () => {
      const session = await authClient.session.get()
      if (!session) throw redirect('/auth/sign-in')
      return null
    },
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
```

---

### TanStack Start

**Directory Structure:**

```
app/
├── routes/
│   ├── __root.tsx
│   ├── auth/
│   │   └── sign-in.tsx
│   └── dashboard/
│       └── index.tsx
└── lib/
    └── auth-client.ts
```

**Sign-in Route:**

```tsx
// app/routes/auth/sign-in.tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { CredentialLoginForm } from '@imbios/ui'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/auth/sign-in')({
  component: SignInPage,
})

function SignInPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <CredentialLoginForm
          authMethod="email"
          authClient={authClient}
          showRememberMe={true}
          showForgotPassword={true}
          onSuccess={() => navigate({ to: '/dashboard' })}
        />
      </div>
    </div>
  )
}
```

**Protected Route:**

```tsx
// app/routes/dashboard/index.tsx
import { createFileRoute, redirect } from '@tanstack/react-router'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/dashboard/')({
  beforeLoad: async () => {
    const session = await authClient.session.get()
    if (!session) {
      throw redirect({ to: '/auth/sign-in' })
    }
  },
  component: DashboardPage,
})

function DashboardPage() {
  return <div>Protected Dashboard</div>
}
```

---

## Component Props Reference

### CredentialLoginFormProps

```typescript
interface CredentialLoginFormProps {
  // Required
  authMethod: 'email' | 'username' | 'phone'
  authClient: AuthClient

  // Optional Features
  showRememberMe?: boolean                    // default: false
  showForgotPassword?: boolean                // default: false
  forgotPasswordUrl?: string                  // default: "/auth/forgot-password"

  // Validation
  enableClientValidation?: boolean            // default: true
  passwordValidation?: {
    minLength?: number                        // default: 8
    maxLength?: number                        // default: 256
    requireUppercase?: boolean                // default: false
    requireLowercase?: boolean                // default: false
    requireNumbers?: boolean                  // default: false
    requireSymbols?: boolean                  // default: false
  }

  // Callbacks
  onSuccess?: () => void | Promise<void>
  onError?: (error: AuthError) => void
  redirectTo?: string

  // Styling
  className?: string
  classNames?: {
    form?: string
    input?: string
    label?: string
    button?: string
    error?: string
    checkbox?: string
    link?: string
  }

  // Advanced
  loadingComponent?: React.ComponentType
  disabled?: boolean
  errorRenderer?: (error: AuthError) => React.ReactNode
}
```

---

## Troubleshooting

### Common Issues

#### 1. "Module not found: Can't resolve '@imbios/ui'"

**Solution**: Install the package:

```bash
pnpm add @imbios/ui
```

#### 2. "authClient is undefined"

**Solution**: Ensure you've created and exported the auth client:

```typescript
// lib/auth-client.ts
import { createAuthClient } from 'better-auth/client'

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
})
```

#### 3. "Network error" when submitting form

**Solution**: Check that:
- better-auth server handler is configured (`/api/auth/[...all]` for Next.js)
- `baseURL` in auth client matches your server URL
- Server is running and better-auth is properly initialized

#### 4. Styling doesn't match Tailwind theme

**Solution**: Ensure Tailwind CSS is installed and configured correctly. Check `tailwind.config.js` includes your component paths:

```javascript
content: [
  './app/**/*.{js,ts,jsx,tsx}',
  './components/**/*.{js,ts,jsx,tsx}',
  './node_modules/@imbios/ui/**/*.{js,ts,jsx,tsx}', // For NPM package
],
```

#### 5. TypeScript errors about missing types

**Solution**: Ensure `@types/react` and `@types/react-dom` are installed:

```bash
pnpm add -D @types/react @types/react-dom
```

---

## Next Steps

After completing this quickstart:

1. **Add OAuth Providers**: Install OAuth provider buttons for social login
2. **Implement Password Reset**: Add forgot password flow
3. **Add Two-Factor Authentication**: Enhance security with 2FA
4. **Customize Styling**: Match your brand identity
5. **Add Analytics**: Track authentication events
6. **Set Up Error Monitoring**: Integrate Sentry or similar

---

## Additional Resources

- [better-auth Documentation](https://better-auth.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Hook Form Documentation](https://react-hook-form.com)
- [Zod Documentation](https://zod.dev)

---

## Support

- **GitHub Issues**: [ImBIOS/ui/issues](https://github.com/ImBIOS/ui/issues)
- **Discord Community**: [Join Discord](https://discord.gg/better-auth)
- **Email**: support@ui.imbios.dev

---

**Estimated Time to Complete**: 15-30 minutes
**Success Criteria**: User can sign in successfully and navigate to protected route

