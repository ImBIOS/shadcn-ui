# Feature Specification: shadcn-Style Better Auth UI Library

**Feature Branch**: `001-shadcn-auth-ui`
**Created**: 2025-11-26
**Status**: Draft
**Input**: User description: "Create shadcn-style UI library for better-auth with blocks architecture supporting all better-auth 1.4 features"

## Clarifications

### Session 2025-11-26

- Q: Registry Structure & Format → A: Each block is a registry-item.json file following shadcn's schema (<https://ui.shadcn.com/schema/registry-item.json>) with metadata (id, name, type, title, description), registryDependencies array, dependencies array, and files array containing path/type/target/content for each file. Central index aggregates references to all blocks.
- Q: CLI Tool Implementation Approach → A: Use shadcn's existing CLI directly (npx shadcn add "URL"). Blocks are installed via registry URL rather than creating a custom CLI tool.
- Q: Block Installation Error Handling Strategy → A: Fail installation with clear error messages and remediation steps. Inherited from shadcn CLI's existing validation behavior - CLI validates dependencies before install. Registry provides version constraints in dependencies array.
- Q: Credential Login Block Form Fields & Delivery → A: System provides a builder UI (similar to <https://better-auth.farmui.com/builder>) where users preview credential login options (email/username/phone number, forgot password link, remember me checkbox, validation). TWO delivery methods: (1) shadcn add URL - copies static block code to user's project, user able to manually customizes afterward (full ownership, fully customizable), (2) npm package component - pre-built component configured via props shown in builder UI (auto-updates with library, configured not customized).
- Q: Builder UI Registry Generation Strategy → A: Static registry JSON files for shadcn CLI method. Builder UI demonstrates available configuration options and shows how they work in the live preview. For npm package method, builder UI shows prop-based configuration examples. No dynamic URL generation needed - one static registry JSON per block.

## User Scenarios & Testing

### User Story 1 - Developer Installs and Uses Credential Login Block (Priority: P1)

A developer building a new application needs to quickly add authentication to their project. They want to use a credential-based (email/password) login form that follows modern UI/UX best practices and is compatible with better-auth 1.4.

**Why this priority**: This is the foundational use case and the minimum viable deliverable for this iteration. A working credential login block proves the entire architecture (CLI tool, registry, component installation) works end-to-end.

**Independent Test**: Can be fully tested by running the CLI installation command, copying the generated component code into a test project, and verifying the login form renders and integrates with better-auth client.

**Acceptance Scenarios**:

1. **Given** a developer has better-auth installed in their project, **When** they run the CLI command to add the credential login block, **Then** the component files are copied into their project with proper dependencies listed
2. **Given** the credential login block is installed, **When** the developer imports and renders the component, **Then** they see a functional login form with email and password fields
3. **Given** a user enters valid credentials in the login form, **When** they submit the form, **Then** the better-auth client properly handles the authentication request
4. **Given** a user enters invalid credentials, **When** they submit the form, **Then** appropriate error messages are displayed

---

### User Story 2 - Developer Explores Options via Builder UI (Priority: P2)

A developer wants to understand what configuration options are available for the credential login block before deciding which installation method to use. They use the builder UI to preview different options (email/username/phone, remember me, forgot password) and see how they work.

**Why this priority**: Demonstrating available options is critical for adoption. Developers need to see what authentication flows are possible (email-only, username, phone number) and the builder UI provides an interactive preview to explore these options.

**Independent Test**: Can be tested by visiting the builder page, toggling various credential options, viewing the live preview update in real-time, and verifying both installation methods provide correct instructions for achieving those configurations.

**Acceptance Scenarios**:

1. **Given** a developer visits the builder UI, **When** they toggle credential options (email/username/phone number), **Then** the live preview updates to show how the component looks with those options
2. **Given** a developer wants to use shadcn CLI method, **When** they click the installation button, **Then** they receive a static registry URL and instructions to manually customize the code after installation
3. **Given** a developer wants to use npm package method, **When** they view the installation tab, **Then** they see the npm install command and example code showing the props that correspond to their toggled options
4. **Given** a developer toggles "remember me" or "forgot password", **Then** the preview shows these elements and the npm method shows the corresponding boolean props

---

### User Story 3 - Developer Chooses Installation Method (Priority: P2)

A developer has configured their credential login block in the builder and needs to decide between two installation methods: copying source code via shadcn CLI (full ownership, manual updates) or installing as an npm package (auto-updates, less customization).

**Why this priority**: Offering both installation methods serves different developer preferences and project requirements. This validates that both delivery mechanisms work correctly.

**Independent Test**: Can be tested by installing the same configured block via both methods in separate test projects and verifying functionality is equivalent.

**Acceptance Scenarios**:

1. **Given** a developer chooses "shadcn add URL" method, **When** they run the command, **Then** the component source code is copied to their project with their configuration baked in
2. **Given** a developer chooses npm package method, **When** they install the package, **Then** they can import the component and pass configuration props to achieve the same result
3. **Given** the library releases an update, **When** developers using npm package update their dependencies, **Then** they automatically get the latest version without code changes
4. **Given** the library releases an update, **When** developers using shadcn method want to update, **Then** they must manually re-run the CLI command or modify their local code

---

### User Story 4 - Developer Integrates Into Different Frameworks (Priority: P3)

A developer working with Next.js, React (Vite), or TanStack Start wants to add authentication UI blocks to their project regardless of their chosen framework.

**Why this priority**: Multi-framework support is essential for broader adoption but can be validated after proving the core installation mechanism works with one framework.

**Independent Test**: Can be tested by creating sample projects in each supported framework (Next.js, React with Vite, TanStack Start) and verifying the credential login block installs and works correctly in each.

**Acceptance Scenarios**:

1. **Given** a Next.js project with better-auth configured, **When** a developer installs a block, **Then** the component code is compatible with Next.js conventions
2. **Given** a React project using Vite, **When** a developer installs a block, **Then** the component imports and build configuration work correctly
3. **Given** a TanStack Start project, **When** a developer installs a block, **Then** the component integrates with TanStack router and conventions
4. **Given** installation documentation exists, **When** a developer follows framework-specific setup instructions, **Then** they can successfully configure better-auth for their chosen framework

---

### Edge Cases

- **Missing better-auth**: Installation fails with error message directing developer to install better-auth first (handled by shadcn CLI dependency validation)
- **Version mismatches**: Installation fails if installed better-auth version doesn't satisfy the version constraint specified in the block's dependencies array, with clear message showing required vs. installed version
- **Reinstalling same block**: shadcn CLI prompts for overwrite confirmation, allowing developers to update or skip
- **Network unavailable/unreachable registry**: Installation fails with network error message from shadcn CLI
- **Non-Tailwind styling**: Installation may proceed but blocks require Tailwind CSS to function correctly - documentation must clearly state this requirement
- **Better-auth breaking changes**: Block registry must be updated with new blocks or versions that support new better-auth versions, with dependency constraints preventing incompatible installations

## Requirements

### Functional Requirements

- **FR-001**: System MUST provide TWO installation methods: (a) shadcn CLI using registry URLs for source code copy, (b) npm package installation for pre-built components
- **FR-002**: Documentation website MUST include an interactive Builder UI where developers can preview credential login options (email/username/phone number, remember me, forgot password) with live updates
- **FR-003**: Builder UI MUST display installation instructions for both methods: (a) static registry URL for shadcn CLI method with manual customization notes, (b) npm install command with prop-based configuration examples
- **FR-004**: Credential login block MUST support configurable field options: email (default), username, phone number as authentication identifiers
- **FR-005**: Credential login block MUST support optional features: remember me checkbox, forgot password link, client-side validation
- **FR-006**: System MUST include documentation covering installation steps for Next.js, React (Vite), and TanStack Start frameworks
- **FR-007**: [Consolidated into FR-002]
- **FR-008**: Blocks MUST support all authentication features available in better-auth 1.4 credential authentication
- **FR-009**: System MUST implement comprehensive error handling for better-auth 1.4 failure scenarios (network, validation, server errors) to prevent unhandled UI states
- **FR-010**: Each block MUST include its required dependencies (shadcn method) or proper peer dependencies (npm method)
- **FR-011**: Blocks MUST follow modern accessibility standards (WCAG 2.1 AA minimum)
- **FR-012**: Documentation MUST include a getting started guide that takes a developer from zero to working authentication in under 30 minutes
- **FR-013**: Registry metadata MUST include version constraints for better-auth in the dependencies array (e.g., "better-auth@^1.4.0") to prevent incompatible installations

### Key Entities

- **Authentication Block**: A reusable UI component for a specific authentication pattern (e.g., credential login, OAuth provider buttons, magic link). Available in two forms: (1) source code via shadcn CLI, (2) pre-built npm package component. Contains component source code, styling, dependencies, configuration options, and integration instructions.

- **Builder UI**: Interactive web interface where developers preview authentication block options by toggling features (email/username/phone, remember me, forgot password) and see live preview. Demonstrates available configuration possibilities for both installation methods: shows static registry URL for shadcn CLI (with notes on manual customization), and displays prop-based configuration examples for npm package. Similar to <https://better-auth.farmui.com/builder>.

- **Block Registry**: A system that stores metadata and source code for available blocks using shadcn's registry-item.json schema. Each block has ONE static registry JSON file containing: block ID (unique identifier), name (kebab-case), type (registry:block or registry:component), title, description, registryDependencies array (references to other registry items or shadcn components), dependencies array (npm packages with optional @version), files array (each with path, type, target, and content fields). The static file contains the base/complete version of each block. A central index.json aggregates all available blocks.

- **CLI Tool**: Uses shadcn's existing CLI directly (npx shadcn add "URL") for source code installation method. No custom CLI development required - developers install blocks by providing the registry URL to shadcn's CLI tool.

- **NPM Package**: Published npm package containing pre-built authentication components. Developers install via package manager (npm/pnpm/yarn) and configure via props. Auto-updates with library releases.

- **Documentation Site**: Web interface hosting the builder UI, displaying available blocks with live previews, installation instructions for both methods, usage examples, and framework-specific integration guides.

## Success Criteria

### Measurable Outcomes

- **SC-001**: A developer can explore available credential login options in the builder UI and see live preview updates in under 2 minutes
- **SC-002**: A developer with better-auth configured can install the credential login block via either method (shadcn CLI with static JSON or npm package) and render it in under 5 minutes
- **SC-003**: The credential login block successfully authenticates users using better-auth 1.4 client methods without errors for all configured options (email/username/phone)
- **SC-004**: Zero critical bugs from the original better-auth-ui bug tracker are present in the credential login block implementation
- **SC-005**: Builder UI loads and displays the interactive preview in under 3 seconds, with preview updates occurring in under 500ms after option changes
- **SC-006**: Both installation methods (shadcn CLI and npm) succeed on all three supported frameworks (Next.js, React with Vite, TanStack Start)
- **SC-007**: 100% of better-auth 1.4 credential authentication features are supported by the credential login block
- **SC-008**: Installed components pass automated accessibility checks (WCAG 2.1 AA level) for all configuration combinations
- **SC-009**: A developer can complete the getting started guide (including builder configuration) and have working authentication in under 30 minutes
- **SC-010**: NPM package components automatically receive updates when dependencies are updated, with stable prop-based configuration API (no breaking prop changes without major version bump)

## Scope & Boundaries

### In Scope for This Iteration

- Repository structure setup following shadcn-ui architecture
- Builder UI for previewing credential login block options (email/username/phone, remember me, forgot password) with live interactive demo
- Static registry JSON files compatible with shadcn CLI (no custom CLI development, no dynamic generation)
- NPM package with pre-built credential login component supporting prop-based configuration
- Single credential login block - static complete version for shadcn method, configurable via props for npm method
- Documentation site hosting builder UI with live preview and dual installation instructions
- Installation guides for both methods (shadcn CLI with manual customization notes, npm with prop examples) across Next.js, React, and TanStack Start

### Out of Scope for This Iteration

- Additional authentication blocks (OAuth, magic link, 2FA, etc.) - these will be added in future iterations
- User account management blocks (profile, settings, password reset)
- Advanced customization options or themes
- Automated migration scripts or CLI commands (manual migration documentation is in scope)
- Backend/API components (focus is on UI blocks only)

### Assumptions

- Developers using this library already have better-auth 1.4+ installed and configured in their projects
- Projects use Tailwind CSS for styling (consistent with shadcn-ui philosophy)
- Developers are familiar with their chosen framework's conventions (Next.js, React, or TanStack Start)
- Developers have access to shadcn's CLI tool (npx shadcn@latest)
- All blocks will be React-based components
- Better-auth 1.4 API is stable and documented

### Dependencies

- better-auth version 1.4 or higher must be installed in the user's project
- shadcn CLI tool (npx shadcn@latest) for source code installation method
- Tailwind CSS for styling components
- React for component implementation
- NPM registry for publishing the package-based components
- Build tooling for creating distributable npm package (e.g., tsup, rollup, or similar)

## Quality Standards

- All code follows industry-standard accessibility practices (ARIA labels, keyboard navigation, screen reader support)
- Component code is well-documented with JSDoc comments explaining props and usage
- Error states and loading states are handled gracefully with user-friendly messages
- Form validation provides clear, actionable feedback to users
- Code follows modern React best practices (hooks, proper state management, error boundaries)

## Risk Assessment

### High Risk

- **Dependency on shadcn CLI**: Direct dependency on shadcn's CLI tool means breaking changes in their CLI could affect block installation. Mitigation: Pin to specific shadcn CLI version in documentation, monitor shadcn releases, and ensure registry JSON follows stable schema specifications.
- **better-auth API changes**: If better-auth introduces breaking changes in future 1.x versions. Mitigation: Pin compatibility to specific versions and test against new releases.

### Medium Risk

- **Framework compatibility**: Different frameworks may have conflicting conventions. Mitigation: Provide clear framework-specific setup docs and test in all three environments.
- **Critical bugs from original library**: Without access to the original codebase's bug reports, we might miss addressing specific issues. Mitigation: Research known issues before implementation.

### Low Risk

- **Styling conflicts**: Users may have existing CSS that conflicts with blocks. Mitigation: Use scoped styles and document customization options.
