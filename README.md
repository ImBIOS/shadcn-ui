# better-auth UI

Beautiful, accessible authentication components for [better-auth](https://better-auth.com). Install via shadcn CLI or npm package.

[![npm version](https://img.shields.io/npm/v/@better-auth-ui/components.svg)](https://www.npmjs.com/package/@better-auth-ui/components)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Features

- 🎨 **shadcn/ui Compatible** - Same patterns and styling you know
- ♿ **Accessible** - WCAG 2.1 AA compliant out of the box
- 🌍 **Internationalized** - Built-in i18n support with extensible locales
- 📱 **Responsive** - Mobile-first design
- 🔒 **Secure** - Built for better-auth 1.4+
- ⚡ **Fast** - Optimized bundle size, tree-shakeable

## Installation

Choose your preferred installation method:

### Option A: shadcn CLI (Recommended for customization)

```bash
npx shadcn@latest add "https://better-auth-ui.com/r/credential-login"
```

This copies the component source code into your project for full customization.

### Option B: npm Package (Recommended for managed updates)

```bash
pnpm add @better-auth-ui/components
```

This installs a pre-built component that updates automatically.

## Quick Start

### 1. Create your auth client

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
'use client'

import { CredentialLoginForm } from '@better-auth-ui/components'
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
          showRememberMe
          showForgotPassword
          onSuccess={() => router.push('/dashboard')}
        />
      </div>
    </div>
  )
}
```

## Available Components

| Component | Description | Status |
|-----------|-------------|--------|
| `CredentialLoginForm` | Email/username/phone login | ✅ Ready |
| `SignUpForm` | Registration form | 🔜 Coming |
| `ForgotPasswordForm` | Password reset | 🔜 Coming |
| `TwoFactorForm` | 2FA verification | 🔜 Coming |
| `OAuthButtons` | Social login buttons | 🔜 Coming |

## Framework Support

- **Next.js** - App Router & Pages Router
- **React (Vite)** - With React Router
- **TanStack Start** - Full-stack React framework

See [framework-specific guides](https://better-auth-ui.com/docs/installation) for detailed setup instructions.

## Documentation

📚 **[Full Documentation](https://better-auth-ui.com/docs)**

- [Getting Started](https://better-auth-ui.com/docs/getting-started)
- [Installation Guides](https://better-auth-ui.com/docs/installation)
- [API Reference](https://better-auth-ui.com/docs/components/credential-login)
- [Configuration](https://better-auth-ui.com/docs/configuration/authentication)
- [Troubleshooting](https://better-auth-ui.com/docs/troubleshooting)

## Project Structure

```
better-auth-ui/
├── apps/
│   └── web/                  # Documentation site + builder UI
│       ├── content/docs/     # MDX documentation
│       ├── src/
│       │   ├── components/   # Site components
│       │   ├── routes/       # TanStack Start routes
│       │   └── registry/     # Static registry JSON files
│       └── tests/            # E2E and integration tests
├── packages/
│   ├── ui/                   # NPM package (@better-auth-ui/components)
│   │   ├── src/
│   │   │   ├── components/   # Auth components
│   │   │   ├── lib/          # Validation utilities
│   │   │   └── locales/      # i18n translations
│   │   └── tests/            # Unit and integration tests
│   ├── api/                  # API utilities
│   └── config/               # Shared configuration
└── specs/                    # Feature specifications
```

## Development

### Prerequisites

- Node.js 18+
- pnpm 8+

### Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Open the documentation site
open http://localhost:3001
```

### Scripts

| Command | Description |
|---------|-------------|
| `pnpm run dev` | Start all apps in development mode |
| `pnpm run build` | Build all packages |
| `pnpm run test` | Run all tests |
| `pnpm run check` | Run Biome formatting and linting |
| `pnpm run check-types` | TypeScript type checking |

### Nx Commands

```bash
# View interactive project graph
pnpm nx graph

# Run specific target
pnpm nx run @better-auth-ui/components:build

# Build affected projects
pnpm nx affected -t build

# Run tests for a package
pnpm nx run @better-auth-ui/components:test
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](https://better-auth-ui.com/docs/contributing) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`pnpm run test`)
5. Run linting (`pnpm run check`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## License

MIT © [better-auth-ui](https://github.com/better-auth-ui)

## Related Projects

- [better-auth](https://better-auth.com) - Authentication framework
- [shadcn/ui](https://ui.shadcn.com) - UI component library
- [TanStack Start](https://tanstack.com/start) - Full-stack framework
