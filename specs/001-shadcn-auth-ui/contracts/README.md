# API Contracts

**Feature**: shadcn-Style Better Auth UI Library
**Date**: 2025-11-26
**Status**: Complete

## Overview

This directory contains API contracts and type definitions for the ImBIOS UI library. These contracts define the interfaces between:

1. **Registry System** ↔ **shadcn CLI** (JSON Schema)
2. **NPM Package Components** ↔ **Application Code** (TypeScript Interfaces)
3. **UI Components** ↔ **better-auth SDK** (TypeScript SDK methods, not REST API)

All contracts follow strict typing and validation rules per the Constitution's code quality requirements.

---

## Files

### 1. `registry-item.schema.json`

We copied it from `https://ui.shadcn.com/schema/registry-item.json` at Wed Nov 26 11:31:38 AM WIB 2025.

**Purpose**: JSON Schema for authentication block registry items compatible with shadcn CLI

**Usage**:

- Validates registry JSON files in `apps/v0/src/registry/`
- Ensures compatibility with `npx shadcn@latest add "URL"` command
- Used by documentation site to generate registry index

**Key Sections**:

- Registry item metadata (name, type, description)
- Dependency management (npm packages, registry dependencies)
- File definitions (source paths, types, targets)
- Categories and metadata

**Validation**:

```bash
# Validate a registry file
pnpm dlx ajv-cli validate -s registry-item.schema.json -d ../apps/v0/src/registry/credential-login.json
```

**Example Registry Item**:

```json
{
  "name": "credential-login",
  "type": "registry:block",
  "description": "A credential-based login form with email/username/phone support",
  "dependencies": ["zod@^4.0.0", "react-hook-form@^7.0.0"],
  "registryDependencies": ["button", "input", "form", "card"],
  "files": [
    {
      "path": "blocks/credential-login/page.tsx",
      "type": "registry:page",
      "target": "app/auth/sign-in/page.tsx"
    }
  ],
  "categories": ["authentication", "login"]
}
```

---

### 2. `component-props.ts`

**Purpose**: TypeScript interfaces for `@imbios/ui` NPM package

**Usage**:

- Public API contract for all exported components
- Type definitions for component props, callbacks, and state
- Type guards and utility types for runtime validation

**Key Exports**:

#### Component Props

```typescript
import type { CredentialLoginFormProps } from '@imbios/ui'

// Main component props interface
<CredentialLoginForm
  authMethod="email"
  authClient={authClient}
  showRememberMe={true}
  onSuccess={() => router.push('/dashboard')}
/>
```

#### Error Handling

```typescript
import type { AuthError, AuthErrorCode } from '@imbios/ui'

// Handle authentication errors
onError={(error: AuthError) => {
  console.error(`[${error.code}] ${error.message}`)
}}
```

#### Validation

```typescript
import type { PasswordValidation } from '@imbios/ui'

// Configure password validation
passwordValidation={{
  minLength: 12,
  requireUppercase: true,
  requireNumbers: true,
  requireSymbols: true
}}
```

#### Registry Types

```typescript
import type { RegistryItem, RegistryFile } from '@imbios/ui'

// Used internally by docs site and CLI integration
```

**Integration Points**:

- Consumed by application code using the NPM package
- Referenced by documentation site for prop tables
- Used by TanStack Start routes for type safety

---

## Contract Validation

### JSON Schema Validation

Validate registry JSON files against the schema:

```bash
# Install AJV CLI
pnpm add -D ajv-cli

# Validate single file
pnpm dlx ajv-cli validate \
  -s contracts/registry-item.schema.json \
  -d apps/v0/src/registry/credential-login.json

# Validate all registry files
pnpm dlx ajv-cli validate \
  -s contracts/registry-item.schema.json \
  -d "apps/v0/src/registry/*.json"
```

### TypeScript Type Checking

Ensure TypeScript interfaces are used correctly:

```bash
# Type-check packages/ui (NPM package)
cd packages/ui
pnpm tsc --noEmit

# Type-check apps/v0 (docs site)
cd apps/v0
pnpm check-types
```

---

## Integration Testing

### Registry Schema Tests

```typescript
// Test registry item validation
import Ajv from 'ajv'
import registrySchema from './registry-item.schema.json'
import credentialLoginRegistry from '../apps/v0/src/registry/credential-login.json'

const ajv = new Ajv()
const validate = ajv.compile(registrySchema)

test('credential-login registry is valid', () => {
  const valid = validate(credentialLoginRegistry)
  expect(valid).toBe(true)
  expect(validate.errors).toBeNull()
})
```

### Component Props Tests

```typescript
// Test component prop types
import { describe, it, expect } from 'vitest'
import type { CredentialLoginFormProps } from './component-props'

describe('CredentialLoginFormProps', () => {
  it('accepts valid props', () => {
    const props: CredentialLoginFormProps = {
      authMethod: 'email',
      authClient: mockAuthClient,
      showRememberMe: true,
      onSuccess: () => {},
    }
    expect(props.authMethod).toBe('email')
  })

  it('rejects invalid authMethod', () => {
    // @ts-expect-error - invalid authMethod should not compile
    const props: CredentialLoginFormProps = {
      authMethod: 'invalid',
      authClient: mockAuthClient,
    }
  })
})
```

### better-auth SDK Integration Tests

Since better-auth uses a TypeScript SDK (not REST API), we mock the SDK methods directly:

```typescript
// Test better-auth SDK integration with mocked SDK methods
import { describe, it, expect, vi } from 'vitest'
import { authClient } from '@/lib/auth-client'

describe('better-auth SDK integration', () => {
  it('handles successful email authentication', async () => {
    // Mock the SDK method (not HTTP fetch)
    const mockResponse = {
      user: { id: 'user_abc123', email: 'test@example.com' },
      session: { token: 'session_xyz789', expiresAt: '2025-12-26T10:00:00Z' },
      twoFactorRedirect: false,
    }

    vi.spyOn(authClient.signIn, 'email').mockResolvedValue(mockResponse)

    const result = await authClient.signIn.email({
      email: 'test@example.com',
      password: 'password123',
      rememberMe: false,
    })

    expect(result.user?.email).toBe('test@example.com')
    expect(result.twoFactorRedirect).toBe(false)
  })

  it('handles authentication errors', async () => {
    const mockError = new Error('INVALID_CREDENTIALS')
    vi.spyOn(authClient.signIn, 'email').mockRejectedValue(mockError)

    await expect(
      authClient.signIn.email({
        email: 'test@example.com',
        password: 'wrong_password',
      })
    ).rejects.toThrow('INVALID_CREDENTIALS')
  })

  it('handles username authentication', async () => {
    const mockResponse = {
      user: { id: 'user_xyz', username: 'johndoe' },
      session: { token: 'session_123', expiresAt: '2025-12-26T10:00:00Z' },
    }

    vi.spyOn(authClient.signIn, 'username').mockResolvedValue(mockResponse)

    const result = await authClient.signIn.username({
      username: 'johndoe',
      password: 'password123',
    })

    expect(result.user?.username).toBe('johndoe')
  })

  it('handles two-factor redirect', async () => {
    const mockResponse = {
      twoFactorRedirect: true,
    }

    vi.spyOn(authClient.signIn, 'email').mockResolvedValue(mockResponse)

    const result = await authClient.signIn.email({
      email: 'test@example.com',
      password: 'password123',
    })

    expect(result.twoFactorRedirect).toBe(true)
  })
})
```

---

## Maintenance

### Updating Contracts

When updating contracts, follow this process:

1. **Update the Contract**:
   - Edit JSON schema or TypeScript interfaces
   - Document changes in commit message

2. **Validate Changes**:

   ```bash
   # Validate all contracts
   pnpm run validate:contracts
   ```

3. **Update Implementations**:
   - Update component implementations to match new contracts
   - Update tests to cover new contract features
   - Update SDK method mocks if better-auth types change

4. **Version Bump**:
   - Increment version in package.json (semantic versioning)
   - Document breaking changes in CHANGELOG.md

### Contract Versioning

Contracts follow semantic versioning:

- **MAJOR**: Breaking changes to interfaces or schemas
- **MINOR**: Backward-compatible additions
- **PATCH**: Clarifications, documentation, or non-functional changes

---

## References

- [JSON Schema Specification](https://json-schema.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [shadcn CLI Documentation](https://ui.shadcn.com/docs/cli)
- [better-auth SDK Documentation](https://better-auth.com/docs/api/client)
- [better-auth TypeScript Types](https://better-auth.com/docs/concepts/typescript)
- [Constitution: Code Quality Standards](../../.specify/memory/constitution.md)

---

## Contract Status

| Contract | Status | Last Updated | Version |
|----------|--------|--------------|---------|
| `registry-item.schema.json` | ✅ Complete | 2025-11-26 | 1.0.0 |
| `component-props.ts` | ✅ Complete | 2025-11-26 | 1.0.0 |

**Note**: We don't maintain a separate API contract for better-auth since it provides a TypeScript SDK with built-in types. We mock the SDK methods directly in tests rather than mocking HTTP endpoints.

All contracts are ready for implementation.
