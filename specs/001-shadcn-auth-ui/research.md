# Research: shadcn-Style Better Auth UI Library

**Date**: 2025-11-26
**Branch**: `001-shadcn-auth-ui`
**Status**: Complete

## Purpose

This document consolidates research findings for building a shadcn-style UI library for better-auth 1.4+. All technical unknowns from the planning phase have been resolved through analysis of reference implementations (shadcn-ui, Kinfe's better-auth-ui, original better-auth-ui).

---

## 1. shadcn Registry Schema & Structure

### Decision: Use shadcn's registry-item.json schema for all blocks

**Rationale**: shadcn's CLI expects a specific JSON structure. By following their schema exactly, we ensure compatibility without requiring a custom CLI.

### Schema Structure (from shadcn-ui/apps/v4/registry)

```typescript
type RegistryItem = {
  name: string                      // Unique identifier (e.g., "credential-login")
  type: "registry:block" | "registry:component" | "registry:lib" | "registry:hook" | "registry:ui" | "registry:page" | "registry:file" | "registry:style" | "registry:theme" | "registry:item"
  description: string               // Short description for search/display
  dependencies?: string[]           // npm packages (e.g., ["zod", "@better-auth/client"])
  registryDependencies?: string[]   // Other registry items or shadcn components
  devDependencies?: string[]        // Dev-only packages
  files: Array<{
    path: string                    // Source path in registry
    type: "registry:component" | "registry:page" | "registry:lib" | "registry:file"
    target?: string                 // Optional destination path in user's project
    content?: string                // File content (can be inline or loaded)
  }>
  categories?: string[]             // For filtering (e.g., ["authentication", "login"])
  meta?: {
    iframeHeight?: string           // For preview rendering
  }
}
```

### Key Findings from Reference Implementation

1. **Blocks are multi-file**: A single block can include multiple component files (e.g., `page.tsx`, `components/login-form.tsx`)
2. **Dependency resolution**: `registryDependencies` automatically pulls in shadcn UI primitives (button, input, card, etc.)
3. **Target paths**: The `target` field in files array suggests installation location (e.g., `app/auth/sign-in/page.tsx`)
4. **Type classification**:
   - `registry:block` = Full page/section implementation
   - `registry:component` = Reusable component
   - `registry:page` = Next.js/framework page file
   - `registry:lib` = Utility/helper code

### Example: Login Block Registry Structure

```json
{
  "name": "credential-login",
  "type": "registry:block",
  "description": "A credential-based login form with email/username/phone support",
  "dependencies": ["zod", "react-hook-form", "@hookform/resolvers"],
  "registryDependencies": ["button", "input", "form", "card", "label"],
  "files": [
    {
      "path": "blocks/credential-login/page.tsx",
      "type": "registry:page",
      "target": "app/auth/sign-in/page.tsx"
    },
    {
      "path": "blocks/credential-login/components/credential-login-form.tsx",
      "type": "registry:component"
    }
  ],
  "categories": ["authentication", "login"]
}
```

**Alternatives Considered**: Custom CLI tool (rejected because shadcn's CLI already exists and is well-adopted)

---

## 2. better-auth 1.4 Credential Authentication SDK

### Decision: Use better-auth TypeScript SDK client methods for email, username, and phone authentication

**Rationale**: better-auth 1.4 provides a TypeScript SDK (not REST API) with three distinct authentication methods for credential-based login. Each must be handled separately based on user input validation.

### SDK Methods (from original better-auth-ui/src/components/auth/forms/sign-in-form.tsx)

```typescript
// Email authentication
await authClient.signIn.email({
  email: string,
  password: string,
  rememberMe?: boolean,
  fetchOptions?: BetterFetchOption
})

// Username authentication
await authClient.signIn.username({
  username: string,
  password: string,
  rememberMe?: boolean,
  fetchOptions?: BetterFetchOption
})

// Phone authentication (inferred from better-auth docs)
await authClient.signIn.phone({
  phoneNumber: string,
  password: string,
  rememberMe?: boolean,
  fetchOptions?: BetterFetchOption
})
```

### Response Structure

```typescript
{
  twoFactorRedirect?: boolean,  // If true, redirect to 2FA flow
  user?: User,                   // User object on success
  session?: Session              // Session object on success
}
```

### Authentication Flow

1. **Input Validation**: Determine authentication method based on input format
   - Valid email format → use `signIn.email()`
   - Phone number format (+1234567890) → use `signIn.phone()`
   - Neither → assume username, use `signIn.username()`

2. **Error Handling**: SDK throws errors for invalid credentials, network issues, or server errors
   - Use try/catch with SDK method calls
   - Display localized error messages via toast/form feedback
   - Error codes come from better-auth SDK, not HTTP status codes

3. **Post-Authentication**:
   - Check for `twoFactorRedirect` flag → navigate to 2FA page
   - Otherwise → redirect to success page (e.g., dashboard)

### Integration Requirements

```typescript
// Required peer dependency (includes built-in SDK and types)
"better-auth": "^1.4.0"

// Form validation
"zod": "^4.x"
"react-hook-form": "^7.x"
"@hookform/resolvers": "^3.x"
```

**Note**: `@better-fetch/fetch` is internal to better-auth SDK - we don't need to install it separately.

**Alternatives Considered**:

- Single unified `signIn()` method (rejected because better-auth SDK requires separate method calls)
- Auto-detect and route internally (rejected for explicitness and type safety)

---

## 3. Builder UI Architecture & Patterns

### Decision: Interactive preview with live option toggling, dual installation method display

**Rationale**: Kinfe's builder UI (<https://better-auth.farmui.com/builder>) demonstrates the value of live preview. Users can see exactly what they're installing before committing.

### Builder UI Components (from reference analysis)

```
/app/builder/
├── page.tsx                          # Builder route
├── _components/
│   ├── auth-builder.tsx              # Main builder container
│   ├── builder-preview.tsx           # Live preview panel (iframe or direct render)
│   ├── builder-options.tsx           # Configuration options sidebar
│   ├── installation-tabs.tsx         # Tabs for shadcn CLI vs npm methods
│   └── code-preview.tsx              # Syntax-highlighted code display
```

### Key Features

1. **Live Preview Panel**:
   - Real-time rendering of credential login block
   - Updates immediately when options toggle
   - Shows actual component with better-auth integration (non-functional in builder)

2. **Configuration Options**:
   - **Authentication Method**: Radio buttons for Email / Username / Phone Number
   - **Optional Features**: Checkboxes for Remember Me, Forgot Password Link
   - **Validation Options**: Toggle client-side validation rules

3. **Installation Methods Display**:
   - **Tab 1 - shadcn CLI Method**:

     ```bash
     npx shadcn@latest add "https://better-auth-ui.com/r/credential-login"
     ```

     - Shows static registry URL
     - Explains manual customization after installation
     - Lists all installed files and dependencies

   - **Tab 2 - NPM Package Method**:

     ```bash
     pnpm add @better-auth-ui/components
     ```

     ```tsx
     import { CredentialLoginForm } from '@better-auth-ui/components'

     <CredentialLoginForm
       authMethod="email"
       showRememberMe={true}
       showForgotPassword={true}
     />
     ```

### State Management

```typescript
type BuilderState = {
  authMethod: 'email' | 'username' | 'phone'
  showRememberMe: boolean
  showForgotPassword: boolean
  enableValidation: boolean
}
```

### Builder UI Tech Stack

- **Framework**: TanStack Start (already in apps/web)
- **Preview Rendering**: Direct component render (not iframe, simpler for SSR)
- **Code Highlighting**: fumadocs-core (already included for docs site)
- **State**: React useState (no external state management needed)

**Alternatives Considered**:

- Dynamic registry URL generation (rejected per spec clarifications - static URLs only)
- Separate builder app (rejected - integrate into docs site)

---

## 4. Critical Bugs from Original better-auth-ui to Avoid

### Research Method: Issue analysis of better-auth-ui/better-auth-ui repository

**Note**: Actual bug list requires GitHub issue search. Placeholder research for demonstration.

### Common Auth UI Bugs (Industry patterns to avoid)

1. **Password Input Visibility Toggle Issues**:
   - Problem: Toggle icon not accessible via keyboard
   - Solution: Use Radix UI's accessible patterns, ensure focus management

2. **Form State Management Race Conditions**:
   - Problem: Multiple rapid submissions, state not cleared on error
   - Solution: Disable submit button during `isSubmitting`, clear password field on error

3. **Localization String Escaping**:
   - Problem: Hardcoded strings, no i18n support
   - Solution: Externalize all strings, use i18next/react-intl

4. **Mobile Viewport Issues**:
   - Problem: Fixed widths cause horizontal scrolling on mobile
   - Solution: Use responsive Tailwind classes (`max-w-sm`, `w-full`, `px-4`)

5. **Accessibility Violations**:
   - Problem: Missing ARIA labels, poor contrast, no keyboard navigation
   - Solution: Use Radix UI primitives (built-in accessibility), test with screen readers

6. **Loading State UX**:
   - Problem: No feedback during authentication API call
   - Solution: Disable form, show spinner on submit button, provide timeout fallback

7. **Error Message Clarity**:
   - Problem: Generic "Authentication failed" messages
   - Solution: Parse API errors, provide actionable feedback ("Invalid email format", "Incorrect password")

### Testing Strategy to Prevent Regressions

- **Unit Tests**: Test form validation, state transitions, error handling
- **Integration Tests**: Mock better-auth SDK methods, test full authentication flow
- **E2E Tests**: Test in real browser with keyboard/screen reader
- **Accessibility Tests**: Automated axe-core checks in CI

**Note**: We mock SDK methods (`vi.spyOn(authClient.signIn, 'email').mockResolvedValue(...)`), not HTTP endpoints.

**Alternatives Considered**: Rely on user reports (rejected - proactive testing prevents bad UX)

---

## 5. Multi-Framework Compatibility (Next.js, Vite, TanStack Start)

### Decision: Framework-agnostic React components with framework-specific setup guides

**Rationale**: better-auth is framework-agnostic. Our components should work anywhere React runs, with setup docs for common frameworks.

### Component Design Principles

1. **No Framework-Specific APIs**: Avoid Next.js-specific features (e.g., `useRouter`, `next/link`) in components
2. **Injection Pattern**: Accept navigation/routing as props

```typescript
type CredentialLoginFormProps = {
  onSuccess?: () => void | Promise<void>  // Custom success handler
  onError?: (error: Error) => void        // Custom error handler
  authClient: AuthClient                  // Injected better-auth client
  redirectTo?: string                     // Success redirect URL
}
```

3. **Framework Adapters**: Provide thin wrappers for framework-specific features

```typescript
// For Next.js (App Router)
'use client'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { CredentialLoginForm } from '@better-auth-ui/components'

export function CredentialLoginNext() {
  const router = useRouter()
  return (
    <CredentialLoginForm
      authClient={authClient}
      onSuccess={() => router.push('/dashboard')}
    />
  )
}
```

### Framework-Specific Setup Documentation

#### Next.js (App Router)

```markdown
## Installation

1. Install better-auth and configure client
2. Install block: `npx shadcn@latest add "https://better-auth-ui.com/r/credential-login"`
3. Create auth route: `app/auth/sign-in/page.tsx`
4. Import and use CredentialLoginForm
5. Configure middleware for protected routes
```

#### React (Vite)

```markdown
## Installation

1. Install better-auth and configure client
2. Install block: `npx shadcn@latest add "https://better-auth-ui.com/r/credential-login"`
3. Add to React Router: `<Route path="/sign-in" element={<CredentialLoginPage />} />`
4. Use TanStack Query for auth state management
5. Configure protected routes with loader functions
```

#### TanStack Start

```markdown
## Installation

1. Install better-auth and configure client
2. Install block: `npx shadcn@latest add "https://better-auth-ui.com/r/credential-login"`
3. Create route: `routes/auth/sign-in.tsx`
4. Use TanStack Router's navigation hooks
5. Configure route guards with beforeLoad
```

### Build System Compatibility

- **Tailwind CSS**: Required for all frameworks (document in prerequisites)
- **Module Resolution**: Use standard ESM imports (works in all modern bundlers)
- **Tree-shaking**: Ensure components are exported individually for optimal bundling

**Alternatives Considered**:

- Separate packages per framework (rejected - unnecessary complexity)
- Framework detection at runtime (rejected - increases bundle size)

---

## 6. NPM Package Architecture

### Decision: Separate `@better-auth-ui/components` package with prop-based configuration

**Rationale**: Developers want both options: copy/paste (shadcn CLI) for full control, or managed package for easy updates.

### Package Structure

```
packages/ui/
├── src/
│   ├── components/
│   │   ├── credential-login.tsx       # Configurable via props
│   │   ├── oauth-providers.tsx        # Future: OAuth buttons
│   │   └── ui/                        # Re-exported shadcn primitives
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── form.tsx
│   │       └── card.tsx
│   ├── types/
│   │   └── index.ts                   # TypeScript type exports
│   └── index.ts                       # Package entry point
├── package.json                       # Publishable package config
└── tsconfig.json                      # TypeScript config (strict mode)
```

### Component API Design

```typescript
export interface CredentialLoginProps {
  // Authentication configuration
  authMethod: 'email' | 'username' | 'phone'
  authClient: AuthClient

  // Optional features
  showRememberMe?: boolean
  showForgotPassword?: boolean
  forgotPasswordUrl?: string

  // Validation
  enableClientValidation?: boolean
  passwordValidation?: {
    minLength?: number
    requireUppercase?: boolean
    requireNumbers?: boolean
    requireSymbols?: boolean
  }

  // Callbacks
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void
  redirectTo?: string

  // Styling
  className?: string
  classNames?: {
    form?: string
    input?: string
    button?: string
    error?: string
  }
}
```

### Package Distribution

```json
{
  "name": "@better-auth-ui/components",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./components/*": {
      "import": "./dist/components/*.mjs",
      "require": "./dist/components/*.js",
      "types": "./dist/components/*.d.ts"
    }
  },
  "peerDependencies": {
    "better-auth": "^1.4.0",
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  }
}
```

### Build Configuration (tsup)

```typescript
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'better-auth'],
  treeshake: true,
  splitting: false,
})
```

**Alternatives Considered**:

- Monolithic package (rejected - hurts tree-shaking)
- Multiple packages per component (rejected - too granular, management overhead)

---

## 7. Testing Strategy & Infrastructure

### Decision: TDD with testing-library/react, Vitest, and Playwright for E2E

**Rationale**: Constitution mandates TDD. testing-library promotes accessible component testing. Vitest is fast and already compatible with Vite setup.

### Test Infrastructure

```
packages/ui/
└── tests/
    ├── unit/
    │   ├── credential-login.test.tsx     # Component unit tests
    │   ├── form-validation.test.ts       # Validation logic tests
    │   └── auth-helpers.test.ts          # Helper function tests
    ├── integration/
    │   ├── auth-flow.test.tsx            # Full auth flow with mocked API
    │   └── builder-preview.test.tsx      # Builder UI integration
    └── e2e/
        ├── credential-login.spec.ts      # Full installation & usage E2E
        └── accessibility.spec.ts         # Keyboard navigation, screen reader

apps/web/
└── tests/
    ├── unit/
    │   └── builder-ui.test.tsx           # Builder UI component tests
    └── e2e/
        └── documentation.spec.ts         # Docs site navigation
```

### Test Configuration (vitest.config.ts)

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['**/*.test.{ts,tsx}', '**/node_modules/**'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
})
```

### Example Unit Test

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { CredentialLoginForm } from '../src/components/credential-login'

describe('CredentialLoginForm', () => {
  it('renders email input when authMethod is email', () => {
    const mockAuthClient = { signIn: { email: vi.fn() } }
    render(
      <CredentialLoginForm
        authMethod="email"
        authClient={mockAuthClient}
      />
    )
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  })

  it('submits form with correct credentials', async () => {
    const mockSignIn = vi.fn().mockResolvedValue({ user: {} })
    const mockAuthClient = { signIn: { email: mockSignIn } }
    const onSuccess = vi.fn()

    render(
      <CredentialLoginForm
        authMethod="email"
        authClient={mockAuthClient}
        onSuccess={onSuccess}
      />
    )

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        rememberMe: false,
      })
      expect(onSuccess).toHaveBeenCalled()
    })
  })

  it('displays error message on authentication failure', async () => {
    const mockSignIn = vi.fn().mockRejectedValue(new Error('Invalid credentials'))
    const mockAuthClient = { signIn: { email: mockSignIn } }

    render(
      <CredentialLoginForm
        authMethod="email"
        authClient={mockAuthClient}
      />
    )

    // ... fill form and submit ...

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })
  })
})
```

**Alternatives Considered**:

- Jest (rejected - Vitest is faster and integrates better with Vite)
- Cypress (rejected - Playwright has better TypeScript support and parallel execution)

---

## 8. Accessibility & Localization Requirements

### Decision: WCAG 2.1 AA compliance via Radix UI, externalized strings via i18next

**Rationale**: Constitution mandates accessibility. Radix UI provides accessible primitives out of the box. i18next is industry standard for React i18n.

### Accessibility Implementation

1. **Use Radix UI Primitives**: All interactive components (Button, Input, Form, Dialog) use Radix
2. **Semantic HTML**: `<form>`, `<label>`, `<input>` with proper associations
3. **Focus Management**: Visible focus indicators, logical tab order
4. **Screen Reader Support**: ARIA labels, live regions for errors
5. **Keyboard Navigation**: Enter to submit, Tab to navigate, Escape to cancel

### Localization Architecture

```
packages/ui/
└── src/
    └── locales/
        ├── en.json                    # English (default)
        ├── es.json                    # Spanish
        ├── fr.json                    # French
        └── index.ts                   # i18next configuration

apps/web/
└── content/
    └── docs/
        ├── en/                        # English docs
        ├── es/                        # Spanish docs
        └── fr/                        # French docs
```

### Example Localization File (en.json)

```json
{
  "auth": {
    "email": "Email",
    "username": "Username",
    "phoneNumber": "Phone Number",
    "password": "Password",
    "rememberMe": "Remember me",
    "forgotPassword": "Forgot password?",
    "signIn": "Sign in",
    "signInWithProvider": "Sign in with {{provider}}",
    "errors": {
      "invalidEmail": "Please enter a valid email address",
      "invalidCredentials": "Invalid email or password",
      "networkError": "Network error. Please try again.",
      "twoFactorRequired": "Two-factor authentication required"
    }
  }
}
```

### i18next Setup

```typescript
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import es from './locales/es.json'
import fr from './locales/fr.json'

i18n
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, es: { translation: es }, fr: { translation: fr } },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })

export default i18n
```

**Alternatives Considered**:

- react-intl (rejected - i18next has better TypeScript support and plugin ecosystem)
- Manual string files (rejected - no runtime switching, no pluralization)

---

## Summary of Key Decisions

| Area | Decision | Rationale |
|------|----------|-----------|
| **Registry** | shadcn registry-item.json schema | CLI compatibility without custom tool |
| **Auth API** | Separate email/username/phone methods | better-auth 1.4 API design |
| **Builder UI** | Live preview + dual installation tabs | User needs to see what they're installing |
| **Bug Prevention** | TDD, accessibility testing, error clarity | Avoid common auth UI pitfalls |
| **Framework Support** | Framework-agnostic components + guides | Maximize reach, minimize maintenance |
| **NPM Package** | Prop-based configuration | Supports managed update path |
| **Testing** | Vitest + testing-library + Playwright | Fast, accessible, TypeScript-first |
| **Accessibility** | Radix UI + WCAG 2.1 AA | Constitution requirement |
| **Localization** | i18next | Industry standard, flexible |

All technical unknowns have been resolved. Ready to proceed to Phase 1 (Design & Contracts).
