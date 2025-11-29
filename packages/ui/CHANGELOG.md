# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Nothing yet

### Changed

- Nothing yet

### Fixed

- Nothing yet

## [0.1.1] - 2025-11-28

### Fixed

- Fixed package exports configuration for better compatibility

## [0.1.0] - 2025-11-27

### Added

- Initial release of @better-auth-ui/components
- `CredentialLoginForm` component with support for:
  - Email authentication
  - Username authentication
  - Phone number authentication (E.164 format)
- Optional features:
  - "Remember me" checkbox (`showRememberMe` prop)
  - "Forgot password?" link (`showForgotPassword` prop)
- Password validation with customizable rules:
  - Minimum/maximum length
  - Uppercase requirement
  - Lowercase requirement
  - Number requirement
  - Symbol requirement
- Full TypeScript support with exported types:
  - `CredentialLoginFormProps`
  - `PasswordValidation`
  - `AuthError`
  - `AuthMethod`
  - `CredentialLoginClassNames`
  - `AuthenticationResponse`
- Type guards:
  - `isAuthError()`
  - `isAuthenticationResponse()`
- i18n support via i18next with English locale included
- Accessible components built on Radix UI primitives (WCAG 2.1 AA)
- Styling customization via `className` and `classNames` props
- Callbacks: `onSuccess`, `onError`
- Custom `loadingComponent` and `errorRenderer` props

### Dependencies

- React 18+ or 19+ (peer dependency)
- better-auth ^1.4.0 (peer dependency)
- react-hook-form ^7.x
- zod ^4.x
- @hookform/resolvers ^5.x
- @radix-ui/react-checkbox ^1.x
- @radix-ui/react-label ^2.x
- i18next ^25.x
- react-i18next ^16.x

[Unreleased]: https://github.com/better-auth-ui/better-auth-ui/compare/v0.1.1...HEAD
[0.1.1]: https://github.com/better-auth-ui/better-auth-ui/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/better-auth-ui/better-auth-ui/releases/tag/v0.1.0
