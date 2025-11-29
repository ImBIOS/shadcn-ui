# Data Model: shadcn-Style Better Auth UI Library

**Date**: 2025-11-26
**Branch**: `001-shadcn-auth-ui`
**Status**: Complete

## Overview

This document defines the core entities, their relationships, state transitions, and validation rules for the ImBIOS UI library. The model is derived from the feature specification and research findings.

---

## Core Entities

### 1. RegistryItem

Represents a single authentication block in the registry system following shadcn's schema.

#### Fields

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `name` | string | Yes | Unique identifier (kebab-case) | `/^[a-z0-9]+(-[a-z0-9]+)*$/` |
| `type` | enum | Yes | Registry item type | `"registry:block"` \| `"registry:component"` \| `"registry:page"` \| `"registry:lib"` |
| `title` | string | No | Display title | Max 100 chars |
| `description` | string | Yes | Short description for search | Max 200 chars |
| `dependencies` | string[] | No | NPM package dependencies | Valid package names with optional @version |
| `devDependencies` | string[] | No | Dev-only NPM packages | Valid package names with optional @version |
| `registryDependencies` | string[] | No | Other registry items required | Valid registry item names |
| `files` | RegistryFile[] | Yes | Component source files | At least 1 file required |
| `categories` | string[] | No | Classification tags | e.g., `["authentication", "login"]` |
| `meta` | object | No | Additional metadata | `{ iframeHeight?: string }` |

#### Relationships

- **HAS MANY** `RegistryFile` (composition: files are part of the registry item)
- **REFERENCES** Other `RegistryItem` via `registryDependencies` (composition: blocks depend on other blocks/components)

#### Example

```json
{
  "name": "credential-login",
  "type": "registry:block",
  "title": "Credential Login",
  "description": "A credential-based login form with email/username/phone support",
  "dependencies": ["zod@^4.0.0", "react-hook-form@^7.0.0", "@hookform/resolvers@^3.0.0"],
  "registryDependencies": ["button", "input", "form", "card", "label", "checkbox"],
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
  "categories": ["authentication", "login", "credentials"]
}
```

---

### 2. RegistryFile

Represents a single file within a registry item.

#### Fields

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `path` | string | Yes | Source path in registry | Valid file path (e.g., `blocks/login/page.tsx`) |
| `type` | enum | Yes | File classification | `"registry:component"` \| `"registry:page"` \| `"registry:lib"` \| `"registry:file"` |
| `target` | string | No | Suggested installation path | Valid file path in user's project |
| `content` | string | No | File source code | Valid TypeScript/JSX/JSON |

#### Relationships

- **BELONGS TO** `RegistryItem` (each file is part of exactly one registry item)

#### Example

```json
{
  "path": "blocks/credential-login/components/credential-login-form.tsx",
  "type": "registry:component",
  "target": "components/auth/credential-login-form.tsx",
  "content": "import { Button } from '@/components/ui/button'\n// ... rest of component code"
}
```

---

### 3. BuilderConfiguration

Represents the state of the builder UI for credential login block.

#### Fields

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `id` | string | Yes | Unique configuration ID | UUID v4 |
| `blockName` | string | Yes | Associated block name | Must be valid registry item name |
| `authMethod` | enum | Yes | Primary authentication method | `"email"` \| `"username"` \| `"phone"` |
| `showRememberMe` | boolean | Yes | Include remember me checkbox | Default: `false` |
| `showForgotPassword` | boolean | Yes | Include forgot password link | Default: `false` |
| `enableValidation` | boolean | Yes | Enable client-side validation | Default: `true` |
| `passwordValidation` | PasswordValidation | No | Password validation rules | See PasswordValidation entity |
| `createdAt` | timestamp | Yes | Configuration creation time | ISO 8601 |
| `updatedAt` | timestamp | Yes | Last modification time | ISO 8601 |

#### Relationships

- **REFERENCES** `RegistryItem` via `blockName` (configuration for a specific block)
- **HAS ONE** `PasswordValidation` (optional password rules)

#### State Transitions

```
[Initial State]
    ↓
[User Configures] → authMethod selected
    ↓
[User Toggles Features] → showRememberMe, showForgotPassword updated
    ↓
[User Adjusts Validation] → passwordValidation rules updated
    ↓
[Final State: Preview Ready]
```

#### Validation Rules

- `authMethod` cannot be empty
- If `showForgotPassword` is true, must have `forgotPasswordUrl` in implementation
- `passwordValidation` only applies when `enableValidation` is true

#### Example

```json
{
  "id": "a1b2c3d4-e5f6-7890-ab12-3456789abcdef",
  "blockName": "credential-login",
  "authMethod": "email",
  "showRememberMe": true,
  "showForgotPassword": true,
  "enableValidation": true,
  "passwordValidation": {
    "minLength": 8,
    "requireUppercase": true,
    "requireNumbers": true,
    "requireSymbols": false
  },
  "createdAt": "2025-11-26T10:00:00Z",
  "updatedAt": "2025-11-26T10:05:00Z"
}
```

---

### 4. PasswordValidation

Defines password validation rules for credential-based authentication.

#### Fields

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `minLength` | number | No | Minimum password length | Min: 4, Max: 128, Default: 8 |
| `maxLength` | number | No | Maximum password length | Min: 8, Max: 256, Default: 256 |
| `requireUppercase` | boolean | No | Require uppercase letters | Default: `false` |
| `requireLowercase` | boolean | No | Require lowercase letters | Default: `false` |
| `requireNumbers` | boolean | No | Require numeric digits | Default: `false` |
| `requireSymbols` | boolean | No | Require special characters | Default: `false` |

#### Relationships

- **BELONGS TO** `BuilderConfiguration` (optional validation rules for builder)
- **USED BY** NPM package component props

#### Validation Rules

- `minLength` must be less than `maxLength`
- At least one requirement must be enabled if validation is active

#### Example

```json
{
  "minLength": 12,
  "maxLength": 256,
  "requireUppercase": true,
  "requireLowercase": true,
  "requireNumbers": true,
  "requireSymbols": true
}
```

---

### 5. AuthenticationCredentials

Represents user input for credential-based authentication.

#### Fields

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `identifier` | string | Yes | Email, username, or phone | Format depends on `authMethod` |
| `password` | string | Yes | User password | Must meet `PasswordValidation` rules |
| `rememberMe` | boolean | No | Remember session | Default: `false` |

#### Relationships

- **VALIDATED AGAINST** `PasswordValidation` (password must pass validation rules)

#### Validation Rules

##### Email Method
```typescript
z.string().email({ message: "Invalid email address" })
```

##### Username Method
```typescript
z.string()
  .min(3, { message: "Username must be at least 3 characters" })
  .max(30, { message: "Username must not exceed 30 characters" })
  .regex(/^[a-zA-Z0-9_-]+$/, { message: "Username can only contain letters, numbers, hyphens, and underscores" })
```

##### Phone Method
```typescript
z.string()
  .regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number format (E.164)" })
```

##### Password (with PasswordValidation)
```typescript
const passwordSchema = z.string()
  .min(passwordValidation.minLength, { message: `Password must be at least ${passwordValidation.minLength} characters` })
  .max(passwordValidation.maxLength, { message: `Password must not exceed ${passwordValidation.maxLength} characters` })

if (passwordValidation.requireUppercase) {
  passwordSchema.regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
}

if (passwordValidation.requireNumbers) {
  passwordSchema.regex(/[0-9]/, { message: "Password must contain at least one number" })
}

if (passwordValidation.requireSymbols) {
  passwordSchema.regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" })
}
```

#### State Transitions

```
[Empty Form]
    ↓
[User Enters Identifier] → Validate format (email/username/phone)
    ↓
[User Enters Password] → Validate against PasswordValidation rules
    ↓
[Optional: User Toggles Remember Me]
    ↓
[User Submits] → Send to better-auth API
    ↓
    ├─ [Success] → Redirect to dashboard
    ├─ [Two-Factor Required] → Redirect to 2FA flow
    └─ [Error] → Display error message, clear password field
```

#### Example

```json
{
  "identifier": "user@example.com",
  "password": "SecureP@ssw0rd",
  "rememberMe": true
}
```

---

### 6. AuthenticationResponse

Represents the response from better-auth API after authentication attempt.

#### Fields

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `success` | boolean | Yes | Authentication result | `true` or `false` |
| `user` | User | Conditional | User object (on success) | Present if `success: true` |
| `session` | Session | Conditional | Session object (on success) | Present if `success: true` |
| `twoFactorRedirect` | boolean | No | Requires 2FA verification | Default: `false` |
| `error` | AuthError | Conditional | Error details (on failure) | Present if `success: false` |

#### Relationships

- **CONTAINS** `User` (on successful authentication)
- **CONTAINS** `Session` (on successful authentication)
- **CONTAINS** `AuthError` (on authentication failure)

#### State Transitions

```
[API Call Initiated]
    ↓
[Waiting for Response]
    ↓
    ├─ [200 OK, twoFactorRedirect: true] → Navigate to /auth/two-factor
    ├─ [200 OK, twoFactorRedirect: false] → Navigate to success page
    ├─ [401 Unauthorized] → Display "Invalid credentials"
    ├─ [429 Too Many Requests] → Display "Too many attempts. Try again later."
    └─ [500 Server Error] → Display "Server error. Please try again."
```

#### Example (Success)

```json
{
  "success": true,
  "user": {
    "id": "user_abc123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "session": {
    "token": "session_xyz789",
    "expiresAt": "2025-12-26T10:00:00Z"
  },
  "twoFactorRedirect": false
}
```

#### Example (Error)

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "The email or password you entered is incorrect.",
    "timestamp": "2025-11-26T10:00:00Z"
  }
}
```

---

### 7. AuthError

Represents authentication error details.

#### Fields

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `code` | enum | Yes | Error classification | See Error Codes below |
| `message` | string | Yes | User-friendly error message | Localized string |
| `field` | string | No | Field that caused error | `"identifier"` \| `"password"` |
| `timestamp` | timestamp | Yes | Error occurrence time | ISO 8601 |

#### Error Codes

| Code | HTTP Status | Description | User Action |
|------|-------------|-------------|-------------|
| `INVALID_CREDENTIALS` | 401 | Email/username/phone or password incorrect | Re-enter credentials |
| `USER_NOT_FOUND` | 404 | No account with provided identifier | Check spelling or sign up |
| `ACCOUNT_LOCKED` | 423 | Account temporarily locked | Wait or contact support |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many login attempts | Wait before retrying |
| `SERVER_ERROR` | 500 | Internal server error | Try again later |
| `NETWORK_ERROR` | 0 | Network connectivity issue | Check connection |
| `VALIDATION_ERROR` | 400 | Input validation failed | Fix validation errors |
| `TWO_FACTOR_REQUIRED` | 200 | 2FA verification needed | Navigate to 2FA page |

#### Localization Keys

```json
{
  "errors.INVALID_CREDENTIALS": "The email or password you entered is incorrect.",
  "errors.USER_NOT_FOUND": "No account found with that email address.",
  "errors.ACCOUNT_LOCKED": "Your account has been temporarily locked. Please try again later or contact support.",
  "errors.RATE_LIMIT_EXCEEDED": "Too many login attempts. Please wait a few minutes before trying again.",
  "errors.SERVER_ERROR": "An unexpected error occurred. Please try again later.",
  "errors.NETWORK_ERROR": "Unable to connect. Please check your internet connection.",
  "errors.VALIDATION_ERROR": "Please correct the errors in the form.",
  "errors.TWO_FACTOR_REQUIRED": "Two-factor authentication required. Redirecting..."
}
```

#### Example

```json
{
  "code": "INVALID_CREDENTIALS",
  "message": "The email or password you entered is incorrect.",
  "field": "password",
  "timestamp": "2025-11-26T10:00:00Z"
}
```

---

### 8. ComponentProps (NPM Package)

Represents the props interface for the NPM package's `CredentialLoginForm` component.

#### Fields

| Field | Type | Required | Description | Default |
|-------|------|----------|-------------|---------|
| `authMethod` | enum | Yes | Authentication method | - |
| `authClient` | AuthClient | Yes | better-auth client instance | - |
| `showRememberMe` | boolean | No | Show remember me checkbox | `false` |
| `showForgotPassword` | boolean | No | Show forgot password link | `false` |
| `forgotPasswordUrl` | string | No | Forgot password page URL | `/auth/forgot-password` |
| `enableClientValidation` | boolean | No | Enable client-side validation | `true` |
| `passwordValidation` | PasswordValidation | No | Password validation rules | See PasswordValidation defaults |
| `onSuccess` | function | No | Success callback | `() => void` |
| `onError` | function | No | Error callback | `(error: AuthError) => void` |
| `redirectTo` | string | No | Success redirect URL | `/dashboard` |
| `className` | string | No | Custom CSS class | - |
| `classNames` | object | No | CSS classes for sub-elements | `{ form?, input?, button?, error? }` |

#### Validation Rules

- `authClient` must be a valid better-auth client instance
- If `showForgotPassword` is true, `forgotPasswordUrl` must be a valid URL path
- `onSuccess` and `onError` must be functions if provided

#### TypeScript Interface

```typescript
import type { AuthClient } from 'better-auth/client'

export interface CredentialLoginFormProps {
  // Required
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
    maxLength?: number
    requireUppercase?: boolean
    requireLowercase?: boolean
    requireNumbers?: boolean
    requireSymbols?: boolean
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
    button?: string
    error?: string
    label?: string
  }
}
```

---

## Entity Relationship Diagram

```
┌─────────────────────┐
│   RegistryItem      │
│─────────────────────│
│ name (PK)           │
│ type                │
│ description         │
│ dependencies[]      │
│ registryDeps[]      │───┐
│ files[]             │   │
│ categories[]        │   │
└─────────────────────┘   │
          │               │ (self-reference)
          │ 1             │
          │               │
          │ *             │
          ▼               │
┌─────────────────────┐   │
│   RegistryFile      │   │
│─────────────────────│   │
│ path                │   │
│ type                │   │
│ target              │   │
│ content             │   │
└─────────────────────┘   │
                          │
                          │
┌──────────────────────┐  │
│ BuilderConfiguration │  │
│──────────────────────│  │
│ id (PK)              │  │
│ blockName (FK)       │──┘
│ authMethod           │
│ showRememberMe       │
│ showForgotPassword   │
│ enableValidation     │
│ passwordValidation   │───┐
│ createdAt            │   │
│ updatedAt            │   │
└──────────────────────┘   │
                           │ 1
                           │
                           │ 1
                           ▼
┌──────────────────────┐
│ PasswordValidation   │
│──────────────────────│
│ minLength            │
│ maxLength            │
│ requireUppercase     │
│ requireLowercase     │
│ requireNumbers       │
│ requireSymbols       │
└──────────────────────┘


┌────────────────────────┐
│ AuthenticationCreds    │
│────────────────────────│
│ identifier             │
│ password               │
│ rememberMe             │
└────────────────────────┘
          │
          │ validates against
          │
          ▼
┌──────────────────────┐
│ PasswordValidation   │
└──────────────────────┘


┌────────────────────────┐         ┌──────────────────┐
│ AuthenticationResponse │─────────│ AuthError        │
│────────────────────────│ *     1 │──────────────────│
│ success                │         │ code             │
│ user                   │         │ message          │
│ session                │         │ field            │
│ twoFactorRedirect      │         │ timestamp        │
│ error                  │         └──────────────────┘
└────────────────────────┘


┌────────────────────────┐
│ ComponentProps (NPM)   │
│────────────────────────│
│ authMethod             │
│ authClient             │
│ showRememberMe         │
│ showForgotPassword     │
│ passwordValidation     │───┐
│ onSuccess              │   │
│ onError                │   │
│ className              │   │
│ classNames             │   │
└────────────────────────┘   │
                             │ 1
                             │
                             │ 1
                             ▼
┌──────────────────────┐
│ PasswordValidation   │
└──────────────────────┘
```

---

## Data Storage

### Registry Files (Static JSON)

**Location**: `apps/web/src/registry/`

**Structure**:
```
registry/
├── index.json                     # Central registry index
└── credential-login.json          # Credential login block registry
```

**index.json** (aggregates all blocks):
```json
{
  "name": "@imbios/ui-registry",
  "version": "0.1.0",
  "items": [
    {
      "name": "credential-login",
      "type": "registry:block",
      "description": "A credential-based login form with email/username/phone support",
      "url": "https://ui.imbios.dev/r/credential-login.json"
    }
  ]
}
```

### Builder State (Client-side)

**Storage**: React state (useState) - no persistence required for MVP

**Rationale**: Builder configuration is transient. Users configure once and install. No need for saved configurations in this iteration.

---

## Validation Summary

### Client-Side Validation (Zod schemas)

```typescript
// Email authentication
const emailSchema = z.object({
  identifier: z.string().email({ message: "Invalid email address" }),
  password: getPasswordSchema(passwordValidation),
  rememberMe: z.boolean().optional(),
})

// Username authentication
const usernameSchema = z.object({
  identifier: z.string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(30, { message: "Username must not exceed 30 characters" })
    .regex(/^[a-zA-Z0-9_-]+$/, { message: "Username can only contain letters, numbers, hyphens, and underscores" }),
  password: getPasswordSchema(passwordValidation),
  rememberMe: z.boolean().optional(),
})

// Phone authentication
const phoneSchema = z.object({
  identifier: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number format (E.164)" }),
  password: getPasswordSchema(passwordValidation),
  rememberMe: z.boolean().optional(),
})

// Password validation helper
function getPasswordSchema(validation: PasswordValidation) {
  let schema = z.string()
    .min(validation.minLength || 8, { message: `Password must be at least ${validation.minLength || 8} characters` })
    .max(validation.maxLength || 256, { message: `Password must not exceed ${validation.maxLength || 256} characters` })

  if (validation.requireUppercase) {
    schema = schema.regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  }

  if (validation.requireLowercase) {
    schema = schema.regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
  }

  if (validation.requireNumbers) {
    schema = schema.regex(/[0-9]/, { message: "Password must contain at least one number" })
  }

  if (validation.requireSymbols) {
    schema = schema.regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" })
  }

  return schema
}
```

---

## Summary

This data model defines 8 core entities with clear relationships, validation rules, and state transitions. All entities are derived from the feature specification and research findings. The model supports:

1. ✅ **Registry System**: Static JSON files following shadcn schema
2. ✅ **Builder Configuration**: Transient state for credential login options
3. ✅ **Authentication Flow**: Credentials → API → Response with error handling
4. ✅ **NPM Package**: Prop-based component configuration
5. ✅ **Validation**: Client-side Zod schemas for email/username/phone + password
6. ✅ **Error Handling**: Comprehensive error codes with localized messages

Ready to proceed to contract generation (API contracts, TypeScript interfaces).

